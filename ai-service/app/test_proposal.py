from pathlib import Path
import json

from app.proposal.writer import get_proposal_writer
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
    with open(path, "r", encoding="utf-8") as file:
        return json.load(file)


def main():
    program = load_json(NGO_FILE)
    grant = load_json(GRANT_FILE)

    writer = get_proposal_writer()
    evidence_retriever = get_evidence_retriever()

    program_text = json.dumps(
        program,
        indent=2,
        ensure_ascii=False
    )

    grant_text = json.dumps(
        grant,
        indent=2,
        ensure_ascii=False
    )

    requirements_text = json.dumps(
        grant["application_requirements"],
        indent=2,
        ensure_ascii=False
    )

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

    result = writer.invoke(
        {
            "program": program_text,
            "grant": grant_text,
            "requirements": requirements_text,
            "evidence": evidence_text,
        }
    )

    print("\n" + "=" * 70)
    print("EVIDENCE-AWARE PROPOSAL GENERATED")
    print("=" * 70)

    print(result.model_dump_json(indent=2))


if __name__ == "__main__":
    main()