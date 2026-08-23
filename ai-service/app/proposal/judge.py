from langchain_core.prompts import ChatPromptTemplate

from app.rag.llm import get_llm


JUDGE_PROMPT = ChatPromptTemplate.from_template(
    """
You are GrantCraft's factual accuracy auditor.

Compare the GENERATED PROPOSAL against ONLY the SOURCE NGO PROGRAM
and SOURCE GRANT.

SOURCE NGO PROGRAM:
{program}

SOURCE GRANT:
{grant}

GENERATED PROPOSAL:
{proposal}

Your response MUST contain exactly these three sections:

PASS: true or false

ISSUES:
- None

SUMMARY:
Brief explanation.

Rules:
- Mark false if ANY factual claim is unsupported.
- Never assume missing information is true.
- Never infer nonprofit status.
- Never invent statistics.
- Never invent beneficiaries.
- Never invent outcomes.
- Never invent partnerships.
- Never invent timelines.
- Never invent evaluation procedures.
- Never invent completed activities.
- Flag unsupported health or social impact claims.
- Proposed activities are acceptable only when clearly presented
  as proposed activities.

Always return a response.
Never return an empty response.
"""
)


def get_factuality_judge():
    llm = get_llm()

    return JUDGE_PROMPT | llm