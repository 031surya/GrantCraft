from pathlib import Path
import json

from app.proposal.writer import get_proposal_writer
from app.judge.checker import run_judge
from app.judge.report import print_audit_report
from app.rag.retriever import get_evidence_retriever


NGO_FILE = (
    Path(__file__).resolve().parents[1]
    / "data"
    / "ngo"
    / "rural_clean_water_initiative.json"
)

GRANT_FILE = (
    Path(__file__).resolve().parents[1]
    / "data"
    / "grants"
    / "clean_water_community_fund.json"
)


def load_json(path):
    with open(
        path,
        "r",
        encoding="utf-8",
    ) as file:
        return json.load(file)


def main():
    program = load_json(NGO_FILE)
    grant = load_json(GRANT_FILE)

    # ---------------------------------------------------------
    # Retrieve NGO evidence
    # ---------------------------------------------------------

    evidence_retriever = get_evidence_retriever()

    evidence_documents = evidence_retriever.invoke(
        program["program_description"]
    )

    evidence_text = "\n\n".join(
        document.page_content
        for document in evidence_documents
    )

    # ---------------------------------------------------------
    # Generate evidence-aware proposal
    # ---------------------------------------------------------

    writer = get_proposal_writer()

    proposal = writer.invoke(
        {
            "program": json.dumps(
                program,
                indent=2,
                ensure_ascii=False,
            ),
            "grant": json.dumps(
                grant,
                indent=2,
                ensure_ascii=False,
            ),
            "requirements": json.dumps(
                grant.get(
                    "application_requirements",
                    {},
                ),
                indent=2,
                ensure_ascii=False,
            ),
            "evidence": evidence_text,
        }
    )

    proposal_data = proposal.model_dump()

    # ---------------------------------------------------------
    # TEST: deliberately introduce an incorrect metric
    # ---------------------------------------------------------
    #
    # The source contains 1,840 households.
    # We intentionally change it to 2,840.
    #
    # This should be detected by the Phase 11 auditor.
    # ---------------------------------------------------------


    print("\n" + "=" * 70)
    print("PROPOSAL BEING AUDITED")
    print("=" * 70)

    print(
        json.dumps(
            proposal_data,
            indent=2,
            ensure_ascii=False,
        )
    )

    # ---------------------------------------------------------
    # Run Phase 11 Evidence-Aware Auditor
    # ---------------------------------------------------------

    audit = run_judge(
        proposal=proposal_data,
        program=program,
        grant=grant,
    )

    # ---------------------------------------------------------
    # Print audit report
    # ---------------------------------------------------------

    print_audit_report(audit)


if __name__ == "__main__":
    main()