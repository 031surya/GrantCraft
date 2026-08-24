import json

from app.proposal.writer import (
    get_proposal_writer,
    get_proposal_revision_chain,
)
from app.proposal.judge import get_factuality_judge
from app.proposal.constraints import validate_proposal
from app.rag.retriever import get_evidence_retriever


REQUIRED_SECTIONS = [
    "organization_background",
    "program_description",
    "target_beneficiaries",
    "expected_outcomes",
    "implementation_plan",
    "evaluation_plan",
    "budget_summary",
]


def generate_proposal(
    program: dict,
    grant: dict,
    word_limit: int = 1500,
    max_revisions: int = 2,
):
    writer = get_proposal_writer()
    judge = get_factuality_judge()
    revision_chain = get_proposal_revision_chain()
    evidence_retriever = get_evidence_retriever()

    program_text = json.dumps(
        program,
        indent=2,
        ensure_ascii=False,
    )

    grant_text = json.dumps(
        grant,
        indent=2,
        ensure_ascii=False,
    )

    requirements = grant.get(
        "application_requirements",
        {},
    )

    requirements_text = json.dumps(
        requirements,
        indent=2,
        ensure_ascii=False,
    )

    # ---------------------------------------------------------
    # Retrieve NGO evidence
    # ---------------------------------------------------------

    evidence_documents = evidence_retriever.invoke(
        program_text
    )

    evidence_text = "\n\n".join(
        [
            f"""
Source: {document.metadata.get("source")}

Evidence:
{document.page_content}
"""
            for document in evidence_documents
        ]
    )

    # ---------------------------------------------------------
    # 1. Generate initial proposal
    # ---------------------------------------------------------

    proposal = writer.invoke(
        {
            "program": program_text,
            "grant": grant_text,
            "requirements": requirements_text,
            "evidence": evidence_text,
        }
    )

    revision_count = 0

    while True:

        proposal_data = proposal.model_dump()

        # -----------------------------------------------------
        # 2. Validate word limit and required sections
        # -----------------------------------------------------

        constraint_result = validate_proposal(
            proposal=proposal_data,
            word_limit=word_limit,
            required_sections=REQUIRED_SECTIONS,
        )

        # -----------------------------------------------------
        # 3. Run factual accuracy judge
        # -----------------------------------------------------

        audit = judge.invoke(
            {
                "program": program_text,
                "grant": grant_text,
                "proposal": json.dumps(
                    proposal_data,
                    indent=2,
                    ensure_ascii=False,
                ),
            }
        )

        audit_text = (
            audit.content.strip()
            if audit.content
            else "PASS: false\n\nISSUES:\n- Judge returned an empty audit.\n\nSUMMARY:\nFactuality review failed."
        )

        # -----------------------------------------------------
        # 4. Check whether proposal passed
        # -----------------------------------------------------

        factuality_passed = (
            "pass: true" in audit_text.lower()
        )

        if constraint_result.valid and factuality_passed:
            return {
                "proposal": proposal_data,
                "constraint_validation": (
                    constraint_result.model_dump()
                ),
                "factuality_audit": audit_text,
                "revision_count": revision_count,
                "status": "accepted",
            }

        # -----------------------------------------------------
        # 5. Stop after maximum revisions
        # -----------------------------------------------------

        if revision_count >= max_revisions:
            return {
                "proposal": proposal_data,
                "constraint_validation": (
                    constraint_result.model_dump()
                ),
                "factuality_audit": audit_text,
                "revision_count": revision_count,
                "status": "needs_review",
            }

        # -----------------------------------------------------
        # 6. Prepare revision feedback
        # -----------------------------------------------------

        issues = audit_text

        if not constraint_result.valid:
            issues += "\n\nCONSTRAINT VIOLATIONS:\n"
            issues += "\n".join(
                constraint_result.errors
            )

        # -----------------------------------------------------
        # 7. Ask the writer to revise
        # -----------------------------------------------------

        proposal = revision_chain.invoke(
            {
                "program": program_text,
                "grant": grant_text,
                "proposal": json.dumps(
                    proposal_data,
                    indent=2,
                    ensure_ascii=False,
                ),
                "issues": issues,
            }
        )

        revision_count += 1