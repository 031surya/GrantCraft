from pathlib import Path
import json

from proposal.writer import get_proposal_writer
from judge.checker import run_judge
from judge.report import print_audit_report


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
        }
    )

    proposal_data = proposal.model_dump()

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

    audit = run_judge(
        proposal=proposal_data,
        program=program,
        grant=grant,
    )

    print_audit_report(audit)


if __name__ == "__main__":
    main()