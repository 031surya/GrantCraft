from proposal.constraints import validate_proposal


def main():
    proposal = {
        "organization_background": "Community Water Access Network.",
        "program_description": "Rural clean water program.",
        "target_beneficiaries": "Rural households.",
        "expected_outcomes": "Improved access to safe drinking water.",
        "implementation_plan": "Rehabilitate community water points.",
        "evaluation_plan": "Track documented program indicators.",
        "budget_summary": "USD 72,000."
    }

    required_sections = [
        "organization_background",
        "program_description",
        "target_beneficiaries",
        "expected_outcomes",
        "implementation_plan",
        "evaluation_plan",
        "budget_summary"
    ]

    result = validate_proposal(
        proposal=proposal,
        word_limit=1500,
        required_sections=required_sections
    )

    print("\n" + "=" * 70)
    print("CONSTRAINT VALIDATION")
    print("=" * 70)
    print(result.model_dump_json(indent=2))


if __name__ == "__main__":
    main()