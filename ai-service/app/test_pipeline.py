from pathlib import Path
import json

from proposal.pipeline import generate_proposal


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

    result = generate_proposal(
        program=program,
        grant=grant,
        word_limit=1500
    )

    print("\n" + "=" * 70)
    print("FINAL PROPOSAL PIPELINE")
    print("=" * 70)

    print("\nPROPOSAL:")
    print(json.dumps(
        result["proposal"],
        indent=2,
        ensure_ascii=False
    ))

    print("\nCONSTRAINT VALIDATION:")
    print(json.dumps(
        result["constraint_validation"],
        indent=2,
        ensure_ascii=False
    ))

    print("\nFACTUALITY AUDIT:")
    print(result["factuality_audit"])


if __name__ == "__main__":
    main()