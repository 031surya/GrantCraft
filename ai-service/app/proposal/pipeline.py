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


# =========================================================
# PARSE FACTUALITY AUDIT
# =========================================================

def parse_audit_result(audit_text: str):
    try:
        cleaned = (audit_text or "").strip()

        # Remove markdown JSON fences if the model returns them
        if cleaned.startswith("```json"):
            cleaned = cleaned[len("```json"):].strip()

        elif cleaned.startswith("```"):
            cleaned = cleaned[len("```"):].strip()

        if cleaned.endswith("```"):
            cleaned = cleaned[:-3].strip()

        data = json.loads(cleaned)

        return {
            "overall_pass": bool(
                data.get("overall_pass", False)
            ),
            "accuracy_score": int(
                data.get("accuracy_score", 0)
            ),
            "summary": data.get(
                "summary",
                "",
            ),
        }

    except (
        json.JSONDecodeError,
        TypeError,
        ValueError,
    ):
        return {
            "overall_pass": False,
            "accuracy_score": 0,
            "summary": "Unable to parse factuality audit.",
        }


# =========================================================
# GENERATE PROPOSAL
# =========================================================

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

    # -----------------------------------------------------
    # Convert input data to text
    # -----------------------------------------------------

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

    # -----------------------------------------------------
    # Retrieve NGO evidence
    # -----------------------------------------------------

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

    # -----------------------------------------------------
    # 1. Generate initial proposal
    # -----------------------------------------------------

    proposal = writer.invoke(
        {
            "program": program_text,
            "grant": grant_text,
            "requirements": requirements_text,
            "evidence": evidence_text,
        }
    )

    revision_count = 0

    # =====================================================
    # REVISION LOOP
    # =====================================================

    while True:

        proposal_data = proposal.model_dump()

        # -------------------------------------------------
        # 2. Validate constraints
        # -------------------------------------------------

        constraint_result = validate_proposal(
            proposal=proposal_data,
            word_limit=word_limit,
            required_sections=REQUIRED_SECTIONS,
        )

        # -------------------------------------------------
        # 3. Run factuality judge
        # -------------------------------------------------

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

        # -------------------------------------------------
# 4. Read structured factuality audit
# -------------------------------------------------

        audit_result = audit.model_dump()

        accuracy_score = int(
            audit_result.get(
                "accuracy_score",
                0,
        )
    )

        factuality_passed = bool(
            audit_result.get(
                "overall_pass",
                False,
            )
        )

        audit_summary = audit_result.get(
            "summary",
            "",
        )

        unsupported_claims = audit_result.get(
            "unsupported_claims",
            [],
        )

        verified_metrics = audit_result.get(
            "verified_metrics",
            [],
        )

# Keep a readable audit string for the frontend/history.
        audit_text = (
            f"PASS: {str(factuality_passed).lower()}\n\n"
            f"ISSUES:\n"
        )

        if unsupported_claims:
            audit_text += "\n".join(
                f"- {claim}"
                for claim in unsupported_claims
            )
        else:
            audit_text += "- None"

            audit_text += (
                "\n\nSUMMARY:\n"
                + audit_summary
            )

        # -------------------------------------------------
        # 5. Check whether proposal passed
        # -------------------------------------------------

        if (
            constraint_result.valid
            and factuality_passed
        ):

            return {
                "proposal": proposal_data,

                "constraint_validation": (
                    constraint_result.model_dump()
                ),

                "factuality_audit": audit_text,

                # Used by dashboard/history
                "accuracy_score": accuracy_score,

                # Used by frontend if expected
                "factuality_audit_score": (
                    accuracy_score
                ),

                "factuality_audit_summary": (
                    audit_summary
                ),

                "revision_count": revision_count,

                "status": "accepted",
            }

        # -------------------------------------------------
        # 6. Maximum revisions reached
        # -------------------------------------------------

        if revision_count >= max_revisions:

            return {
                "proposal": proposal_data,

                "constraint_validation": (
                    constraint_result.model_dump()
                ),

                "factuality_audit": audit_text,

                # Used by dashboard/history
                "accuracy_score": accuracy_score,

                # Used by frontend if expected
                "factuality_audit_score": (
                    accuracy_score
                ),

                "factuality_audit_summary": (
                    audit_summary
                ),

                "revision_count": revision_count,

                "status": "needs_review",
            }

        # -------------------------------------------------
        # 7. Prepare revision feedback
        # -------------------------------------------------

        issues = audit_text

        if not constraint_result.valid:

            issues += (
                "\n\nCONSTRAINT VIOLATIONS:\n"
            )

            issues += "\n".join(
                constraint_result.errors
            )

        # -------------------------------------------------
        # 8. Revise proposal
        # -------------------------------------------------

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