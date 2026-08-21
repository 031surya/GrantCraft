from pathlib import Path
import json

from proposal.writer import get_proposal_writer
from proposal.judge import get_factuality_judge


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

    proposal = writer.invoke(
        {
            "program": json.dumps(
                program,
                indent=2,
                ensure_ascii=False
            ),
            "grant": json.dumps(
                grant,
                indent=2,
                ensure_ascii=False
            ),
            "requirements": json.dumps(
                grant["application_requirements"],
                indent=2,
                ensure_ascii=False
            )
        }
    )

    proposal_json = proposal.model_dump_json(indent=2)

    judge = get_factuality_judge()

    audit = judge.invoke(
        {
            "program": json.dumps(
                program,
                indent=2,
                ensure_ascii=False
            ),
            "grant": json.dumps(
                grant,
                indent=2,
                ensure_ascii=False
            ),
            "proposal": proposal_json
        }
    )

    print("\n" + "=" * 70)
    print("GENERATED PROPOSAL")
    print("=" * 70)
    print(proposal_json)

    print("\n" + "=" * 70)
    print("FACTUAL ACCURACY AUDIT")
    print("=" * 70)
    print(audit.content)


if __name__ == "__main__":
    main()