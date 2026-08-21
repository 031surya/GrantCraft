import re

from pydantic import BaseModel


class ConstraintResult(BaseModel):
    valid: bool
    word_count: int
    word_limit: int
    missing_sections: list[str]
    errors: list[str]


def count_words(text: str) -> int:
    return len(re.findall(r"\b[\w'-]+\b", text))


def validate_word_limit(text: str, word_limit: int) -> tuple[bool, int]:
    word_count = count_words(text)

    return word_count <= word_limit, word_count


def validate_required_sections(
    proposal: dict,
    required_sections: list[str]
) -> list[str]:
    missing_sections = []

    for section in required_sections:
        normalized = section.lower().replace(" ", "_")

        if not proposal.get(normalized):
            missing_sections.append(section)

    return missing_sections


def validate_proposal(
    proposal: dict,
    word_limit: int,
    required_sections: list[str]
) -> ConstraintResult:

    combined_text = "\n".join(
        str(value)
        for value in proposal.values()
        if value
    )

    word_count = count_words(combined_text)

    missing_sections = validate_required_sections(
        proposal,
        required_sections
    )

    errors = []

    if word_count > word_limit:
        errors.append(
            f"Proposal exceeds the {word_limit}-word limit "
            f"with {word_count} words."
        )

    if missing_sections:
        errors.append(
            "Missing required sections: "
            + ", ".join(missing_sections)
        )

    return ConstraintResult(
        valid=len(errors) == 0,
        word_count=word_count,
        word_limit=word_limit,
        missing_sections=missing_sections,
        errors=errors
    )