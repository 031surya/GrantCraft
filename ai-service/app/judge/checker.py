import json

from langchain_core.prompts import ChatPromptTemplate

from app.rag.llm import get_llm
from app.judge.schemas import (
    JudgeAuditReport,
    UnsupportedClaim,
)
from app.judge.metrics import (
    extract_numbers,
    normalize_number,
)


JUDGE_PROMPT = ChatPromptTemplate.from_template(
    """
You are GrantCraft's factual accuracy auditor.

Compare the proposal ONLY against the supplied NGO PROGRAM and GRANT.

NGO PROGRAM:
{program}

GRANT:
{grant}

PROPOSAL:
{proposal}

Your job is to detect unsupported factual claims.

Check especially:

- organization claims
- beneficiary claims
- program activities
- outcomes
- implementation claims
- evaluation claims
- funding claims
- important impact metrics

STRICT FACTUALITY RULES:

- Use ONLY the supplied NGO PROGRAM and GRANT as factual sources.
- Never invent evidence.
- Never infer missing facts.
- Never treat assumptions as existing facts.
- Flag unsupported factual claims.
- Flag unsupported metrics.
- Flag invented beneficiaries, activities, outcomes, partnerships,
  timelines, evaluation procedures, funding information, or
  organizational facts.
- overall_pass must be false if material unsupported factual claims exist.
- accuracy_score must be an integer from 0 to 100.

PROPOSED ACTIVITIES:

Clearly labelled future or proposed activities are NOT factual claims
about what the organization has already done.

For example:

"Proposed implementation activities would focus on..."

"Future evaluation could assess..."

These statements may PASS when they are clearly framed as proposed
activities and do not claim that the activity has already occurred.

However, proposed activities must NOT contain invented completed
outcomes, statistics, beneficiaries, partnerships, or historical facts.

EXPECTED OUTCOMES:

Do not accept invented outcomes merely because they are phrased
positively.

Claims such as:
- improved confidence
- increased employment
- improved academic performance
- increased income
- measurable skill improvement

must be supported by the source or clearly framed as a future objective
rather than an achieved result.

SOURCE VS GRANT PRIORITIES:

A grant's focus area does not prove that the NGO already performs that
activity.

For example, if the grant focuses on "digital literacy", that does not
prove that the NGO conducts workshops, mentoring, laptop distribution,
or internet training unless the NGO source says so.

IMPORTANT:
Keep the response SHORT.

Return ONLY one JSON object.

The JSON MUST contain exactly these five fields:

{{
  "overall_pass": false,
  "accuracy_score": 0,
  "verified_metrics": [],
  "unsupported_claims": [],
  "summary": "Short audit summary."
}}

For verified_metrics, include ONLY the metric names.

Example:

"verified_metrics": [
  "households_reached",
  "communities_served",
  "water_points_rehabilitated"
]

For unsupported_claims, include ONLY short strings.

Example:

"unsupported_claims": [
  "Registered nonprofit status is not supported.",
  "Improved public health is not supported."
]

Do NOT include detailed explanations.
Do NOT include source fields.
Do NOT include proposal_value.
Do NOT include source_value.

Return the JSON now.
"""
)


def get_judge():
    llm = get_llm()

    return JUDGE_PROMPT | llm


def build_source_text(
    program: dict,
    grant: dict,
) -> str:

    return (
        "NGO PROGRAM:\n"
        + json.dumps(
            program,
            indent=2,
            ensure_ascii=False,
        )
        + "\n\nGRANT:\n"
        + json.dumps(
            grant,
            indent=2,
            ensure_ascii=False,
        )
    )


def extract_proposal_numbers(
    proposal: dict,
) -> list[str]:

    proposal_text = json.dumps(
        proposal,
        indent=2,
        ensure_ascii=False,
    )

    return extract_numbers(proposal_text)


def deterministic_metric_check(
    proposal: dict,
    program: dict,
    grant: dict,
) -> dict:

    source_text = build_source_text(
        program,
        grant,
    )

    proposal_numbers = extract_proposal_numbers(
        proposal
    )

    source_numbers = {
        normalize_number(number)
        for number in extract_numbers(source_text)
    }

    verified = []
    not_found = []

    for number in proposal_numbers:

        normalized = normalize_number(number)

        if normalized in source_numbers:
            verified.append(number)
        else:
            not_found.append(number)

    return {
        "verified_numbers": verified,
        "unmatched_numbers": not_found,
    }


def parse_json_response(
    raw_content: str,
) -> dict:

    raw_content = raw_content.strip()

    if not raw_content:
        raise ValueError(
            "Judge returned an empty response."
        )

    if "```json" in raw_content:
        raw_content = raw_content.replace(
            "```json",
            "",
        )

    if "```" in raw_content:
        raw_content = raw_content.replace(
            "```",
            "",
        )

    raw_content = raw_content.strip()

    start = raw_content.find("{")
    end = raw_content.rfind("}")

    if start == -1 or end == -1:

        raise ValueError(
            "Judge did not return a JSON object.\n\n"
            f"Raw response:\n{raw_content}"
        )

    json_text = raw_content[
        start:end + 1
    ]

    try:

        return json.loads(
            json_text
        )

    except json.JSONDecodeError as exc:

        raise ValueError(
            "Judge returned incomplete or invalid JSON.\n\n"
            f"Raw response:\n{raw_content}"
        ) from exc


def normalize_audit_data(
    audit_data: dict,
) -> dict:

    metrics = []

    for metric in audit_data.get(
        "verified_metrics",
        [],
    ):

        if isinstance(metric, str):

            metrics.append(
                {
                    "metric": metric,
                    "value": "",
                    "proposal_value": None,
                    "source_value": None,
                    "status": "verified",
                    "explanation": (
                        "Verified by the factuality judge."
                    ),
                }
            )

        else:

            metrics.append(
                {
                    "metric": metric.get(
                        "metric",
                        "unknown",
                    ),
                    "value": metric.get(
                        "value",
                        "",
                    ),
                    "proposal_value": str(
                        metric.get(
                            "proposal_value",
                            metric.get(
                                "value",
                                "",
                            ),
                        )
                    ),
                    "source_value": str(
                        metric.get(
                            "source_value",
                            metric.get(
                                "value",
                                "",
                            ),
                        )
                    ),
                    "status": metric.get(
                        "status",
                        "verified",
                    ),
                    "explanation": metric.get(
                        "explanation",
                        "Verified by the factuality judge.",
                    ),
                }
            )

    claims = []

    for claim in audit_data.get(
        "unsupported_claims",
        [],
    ):

        if isinstance(claim, str):

            claims.append(
                {
                    "claim": claim,
                    "reason": (
                        "The claim is not supported "
                        "by the supplied sources."
                    ),
                }
            )

        else:

            claims.append(
                {
                    "claim": claim.get(
                        "claim",
                        "",
                    ),
                    "reason": claim.get(
                        "reason",
                        "",
                    ),
                }
            )

    return {
        "overall_pass": bool(
            audit_data.get(
                "overall_pass",
                False,
            )
        ),
        "accuracy_score": int(
            audit_data.get(
                "accuracy_score",
                0,
            )
        ),
        "verified_metrics": metrics,
        "unsupported_claims": claims,
        "summary": audit_data.get(
            "summary",
            "",
        ),
    }


def run_judge(
    proposal: dict,
    program: dict,
    grant: dict,
) -> JudgeAuditReport:

    judge = get_judge()

    metric_check = deterministic_metric_check(
        proposal=proposal,
        program=program,
        grant=grant,
    )

    proposal_text = json.dumps(
        proposal,
        indent=2,
        ensure_ascii=False,
    )

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

    # ---------------------------------------------------------
    # Run LLM factuality judge
    # ---------------------------------------------------------

    response = judge.invoke(
        {
            "program": program_text,
            "grant": grant_text,
            "proposal": proposal_text,
        }
    )

    raw_content = response.content

    audit_data = parse_json_response(
        raw_content
    )

    audit_data = normalize_audit_data(
        audit_data
    )

    audit = JudgeAuditReport.model_validate(
        audit_data
    )

    # ---------------------------------------------------------
    # Deterministic numeric verification
    # ---------------------------------------------------------

    unmatched_numbers = metric_check[
        "unmatched_numbers"
    ]

    if unmatched_numbers:

        existing_claims = {
            claim.claim
            for claim in audit.unsupported_claims
        }

        for number in unmatched_numbers:

            claim_text = (
                f"Proposal contains numeric value "
                f"'{number}' that was not found "
                f"in the source documents."
            )

            if claim_text not in existing_claims:

                audit.unsupported_claims.append(
                    UnsupportedClaim(
                        claim=claim_text,
                        reason=(
                            "The numeric value could "
                            "not be matched to the "
                            "supplied source documents."
                        ),
                    )
                )

        audit.overall_pass = False

    return audit