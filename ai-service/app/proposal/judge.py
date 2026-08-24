from langchain_core.prompts import ChatPromptTemplate

from app.rag.llm import get_llm
from app.proposal.judge_schemas import FactualityAudit


JUDGE_PROMPT = ChatPromptTemplate.from_template(
    """
You are GrantCraft's factual accuracy auditor.

Your job is to compare the GENERATED PROPOSAL against ONLY:

1. SOURCE NGO PROGRAM
2. SOURCE GRANT

Do NOT use general knowledge.

Do NOT assume information that is missing.

Do NOT invent facts.

====================================================
SOURCE NGO PROGRAM
====================================================

{program}


====================================================
SOURCE GRANT
====================================================

{grant}


====================================================
GENERATED PROPOSAL
====================================================

{proposal}


====================================================
AUDIT RULES
====================================================

Check every factual claim in the generated proposal.

A claim is supported only when it can be directly verified
from the SOURCE NGO PROGRAM or SOURCE GRANT.

Mark unsupported claims when the proposal contains:

- invented statistics
- invented beneficiaries
- invented outcomes
- invented partnerships
- invented timelines
- invented evaluation procedures
- invented activities
- invented workshops
- invented training schedules
- invented equipment
- invented staff
- invented volunteers
- invented funding history
- invented organizational history
- unsupported geographic details
- unsupported social impact
- unsupported educational outcomes
- unsupported career outcomes

IMPORTANT:

Do NOT treat a grant focus area as evidence that the NGO
already performs that activity.

For example:

If the grant mentions "technology skills", that does NOT prove
that the NGO already provides technology workshops, laptops,
internet access, mentoring, or career training.

====================================================
PROPOSED ACTIVITIES
====================================================

Future activities are acceptable when they are clearly labelled
as proposed or planned activities.

For example:

"Proposed implementation activities would focus on..."

This is acceptable because it does not claim the activity
has already happened.

However, proposed activities must NOT contain invented
completed outcomes, statistics, beneficiaries, partnerships,
or historical facts.

====================================================
ACCURACY SCORE
====================================================

Return an accuracy_score from 0 to 100.

Use these guidelines:

100:
All factual claims are directly supported.

90-99:
Very minor wording concerns but no meaningful unsupported facts.

75-89:
Some questionable or weakly supported factual claims.

50-74:
Multiple unsupported factual claims.

1-49:
Major unsupported factual content.

0:
The proposal cannot be considered factually reliable.

If there is ANY material unsupported factual claim,
overall_pass MUST be false.

If all factual claims are supported,
overall_pass MUST be true.

For verified_metrics:

Include ONLY metric names or numerical facts that are
directly supported by the source.

For unsupported_claims:

Include the actual unsupported claims, briefly and clearly.

If there are no unsupported claims, return an empty list.

For summary:

Provide a short explanation of the audit result.

====================================================
IMPORTANT
====================================================

Return ONLY the structured audit result.

Do not return:

PASS:
ISSUES:
SUMMARY:

Do not return Markdown.

Do not return explanatory text outside the structured result.
"""
)


def get_factuality_judge():
    llm = get_llm()

    structured_llm = llm.with_structured_output(
        FactualityAudit,
        method="json_schema",
        strict=True,
    )

    return JUDGE_PROMPT | structured_llm