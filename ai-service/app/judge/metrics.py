import re


NUMBER_PATTERN = re.compile(
    r"""
    (?<!\w)
    \$?\d[\d,]*(?:\.\d+)?
    (?:\s*(?:USD|dollars))?
    (?!\w)
    """,
    re.IGNORECASE | re.VERBOSE,
)


def extract_numbers(text: str) -> list[str]:
    """
    Extract meaningful numeric values while ignoring
    numbered-list markers.

    Ignored examples:
        1.
        2.
        3)
        4)

    Valid examples:
        1,840
        12
        18
        36
        USD 72,000
        $72,000
    """

    # Remove numbered-list markers anywhere in the text.
    cleaned_text = re.sub(
        r"(?<!\w)\d+\s*[\.\)](?=\s)",
        "",
        text,
    )

    return NUMBER_PATTERN.findall(
        cleaned_text
    )


def normalize_number(value: str) -> str:
    """
    Normalize a numeric value for comparison.

    Examples:
        '1,840' -> '1840'
        '$72,000' -> '72000'
        '72,000 USD' -> '72000'
    """

    value = value.strip()

    value = re.sub(
        r"(USD|dollars)",
        "",
        value,
        flags=re.IGNORECASE,
    )

    value = value.replace("$", "")
    value = value.replace(",", "")
    value = value.strip()

    return value


def verify_metric(
    proposal_value: str,
    source_text: str,
) -> str:
    """
    Determine whether a proposal metric exists
    in the source text.

    Returns:
        verified
        mismatch
        not_found
    """

    normalized_proposal = normalize_number(
        proposal_value
    )

    source_numbers = extract_numbers(
        source_text
    )

    normalized_source_numbers = {
        normalize_number(number)
        for number in source_numbers
    }

    if normalized_proposal in normalized_source_numbers:
        return "verified"

    if normalized_source_numbers:
        return "mismatch"

    return "not_found"