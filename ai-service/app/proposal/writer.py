from proposal.schemas import ProposalDraft
from langchain_core.prompts import (
    ChatPromptTemplate,
    FewShotChatMessagePromptTemplate,
)

from rag.llm import get_llm


EXAMPLES = [
    {
        "input": """
Program: Rural Clean Water Initiative
Focus: Safe drinking water for rural communities
Verified impact: 1,840 households reached
Grant focus: Clean water and rural development
""",
        "output": """
The Rural Clean Water Initiative improves access to safe drinking water
for underserved rural households through community water-point
rehabilitation, water-quality monitoring, and volunteer training.
The program has documented reaching 1,840 households.
"""
    },
    {
        "input": """
Program: Girls Digital Literacy Program
Focus: Digital literacy for girls aged 13-18
Verified impact: 368 girls completed training
Grant focus: Digital inclusion and technology skills
""",
        "output": """
The Girls Digital Literacy Program provides girls from underserved
communities with foundational computer skills, internet safety education,
and practical digital literacy training. The program has documented
368 participants completing training.
"""
    }
]


example_prompt = ChatPromptTemplate.from_messages(
    [
        ("human", "{input}"),
        ("ai", "{output}")
    ]
)


few_shot_prompt = FewShotChatMessagePromptTemplate(
    examples=EXAMPLES,
    example_prompt=example_prompt
)


def get_proposal_writer():
    llm = get_llm()

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                """
You are GrantCraft, a professional nonprofit grant writer.

Your job is to draft accurate, persuasive, evidence-based grant
proposal narratives using ONLY the information provided by the user
and retrieved grant documents.

WRITING PRINCIPLES:
- Write clearly and professionally.
- Focus on the funder's stated priorities.
- Connect the NGO program to the grant requirements.
- Use verified program evidence where available.
- Prioritize accuracy over persuasive exaggeration.

NEGATIVE CONSTRAINTS — STRICT:
- Never invent statistics.
- Never invent beneficiaries.
- Never invent outcomes.
- Never invent partnerships.
- Never invent funding history.
- Never claim eligibility unless the provided evidence supports it.
- Never convert an unsupported assumption into a fact.
- Never exaggerate program impact.
- Never fabricate testimonials or quotes.
- Never introduce facts from outside the provided context.

If information is missing, write around the missing information rather
than inventing it.

The proposal must reflect the NGO's actual documented activities and
verified impact metrics.

- Return all required proposal fields exactly as defined by the
  ProposalDraft schema.
- Use the field name "budget_summary" for the budget section.
"""
            ),
            few_shot_prompt,
            (
                "human",
                """
NGO PROGRAM:
{program}

GRANT OPPORTUNITY:
{grant}

FUNDER REQUIREMENTS:
{requirements}

Write a draft proposal narrative that aligns the NGO program with the
grant opportunity while following all factual and safety constraints.
"""
            )
        ]
    )

    structured_llm = llm.with_structured_output(
        ProposalDraft
    )

    return prompt | structured_llm


def get_proposal_revision_prompt():
    return ChatPromptTemplate.from_messages(
        [
            (
                "system",
                """
You are GrantCraft, a professional nonprofit grant writer.

Revise the proposal using ONLY the provided NGO and grant evidence.

STRICT RULES:
- Remove unsupported factual claims.
- Never invent statistics.
- Never invent beneficiaries.
- Never invent outcomes.
- Never invent partnerships.
- Never invent organizational status.
- Never invent evaluation procedures.
- Never invent grant requirements.
- Never invent timelines.
- Do not turn assumptions into facts.
- Preserve verified facts from the source documents.
- Keep proposed future activities clearly framed as proposed activities.
- Return all fields exactly according to the ProposalDraft schema.
- Use the field name "budget_summary" for the budget section.
"""
            ),
            (
                "human",
                """
NGO PROGRAM:
{program}

GRANT:
{grant}

CURRENT PROPOSAL:
{proposal}

FACTUALITY ISSUES:
{issues}

Revise the proposal to remove or correct every unsupported claim.
Do not add new unsupported information.
"""
            )
        ]
    )
    
def get_proposal_revision_chain():
    llm = get_llm()

    revision_prompt = get_proposal_revision_prompt()

    structured_llm = llm.with_structured_output(
        ProposalDraft
    )

    return revision_prompt | structured_llm