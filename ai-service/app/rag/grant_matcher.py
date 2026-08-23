from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough

from app.rag.retriever import get_grant_retriever
from app.rag.llm import get_llm
from app.rag.schemas import GrantMatchReport


def format_grants(documents):
    seen = set()
    formatted = []

    for document in documents:
        grant_id = document.metadata.get("grant_id")

        if grant_id in seen:
            continue

        seen.add(grant_id)

        formatted.append(
            f"""
Grant ID: {grant_id}
Funder: {document.metadata.get('funder_name')}
Source: {document.metadata.get('source')}

Grant information:
{document.page_content}
"""
        )

    return "\n".join(formatted)


def get_grant_matching_chain():
    retriever = get_grant_retriever()
    llm = get_llm()

    structured_llm = llm.with_structured_output(
        GrantMatchReport
    )

    prompt = ChatPromptTemplate.from_template(
        """
You are GrantCraft, an expert nonprofit grant-matching assistant.

Evaluate the NGO program against the retrieved grant opportunities.

IMPORTANT EVIDENCE RULES:

1. Use ONLY the information provided in the NGO program
   and retrieved grant information.

2. Never invent facts.

3. Never assume eligibility.

4. If an eligibility requirement cannot be verified from
   the NGO information, mark it as "Needs verification".

5. Do not exaggerate project impact or alignment.

6. Score alignment from 0 to 100.

7. Every score must be supported by the retrieved evidence.

8. Use the grant's actual funding_amount values when
   determining the funding range.

9. Use the NGO's requested funding amount when determining
   whether the requested amount fits the grant range.

10. Use the grant's actual deadline.

11. Use the grant's actual eligibility requirements.

12. Use the grant's actual application or project requirements
    when relevant.

13. Do not invent requirements that are not present in the
    retrieved grant information.

14. "why_it_matches" must contain specific evidence-based
    reasons for alignment.

15. "potential_mismatches" must contain:
    - requirements that clearly conflict with the NGO/project,
    - requirements that are missing,
    - or requirements that cannot be verified.

16. If there are no confirmed mismatches, return an empty list.

17. "eligibility.status" should use one of these values:

    - "Eligible"
    - "Needs verification"
    - "Not eligible"

18. Only use "Eligible" when the available evidence supports
    all important eligibility requirements.

19. Only use "Not eligible" when the available evidence shows
    that the NGO/project does not satisfy an important
    eligibility requirement.

20. Otherwise use "Needs verification".

21. Return the most relevant grants first.

NGO PROGRAM:

{program}

RETRIEVED GRANTS:

{grants}
"""
    )

    chain = (
        {
            "grants": RunnablePassthrough()
            | retriever
            | format_grants,
            "program": RunnablePassthrough(),
        }
        | prompt
        | structured_llm
    )

    return chain