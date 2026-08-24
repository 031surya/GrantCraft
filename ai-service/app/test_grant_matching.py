from pathlib import Path
import json

from app.rag.grant_matcher import get_grant_matching_chain


DATA_FILE = (
    Path(__file__).resolve().parents[1]
    / "data"
    / "ngo"
    / "rural_clean_water_initiative.json"
)


def load_program():
    with open(DATA_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


def main():
    program = load_program()

    program_text = json.dumps(
        program,
        indent=2,
        ensure_ascii=False
    )

    chain = get_grant_matching_chain()

    result = chain.invoke(program_text)

    print("\n" + "=" * 70)
    print("NGO PROGRAM")
    print("=" * 70)
    print(program["program_name"])

    print("\n" + "=" * 70)
    print("STRUCTURED GRANT MATCH REPORT")
    print("=" * 70)

    print(result.model_dump_json(indent=2))


if __name__ == "__main__":
    main()