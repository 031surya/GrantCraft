from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough

from app.rag.retriever import (
    get_grant_retriever,
    get_evidence_retriever,
)
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


def format_evidence(documents):
    formatted = []

    for document in documents:
        formatted.append(
            f"""
Source: {document.metadata.get('source')}
Document type: {document.metadata.get('document_type')}

NGO evidence:
{document.page_content}
"""
        )

    return "\n".join(formatted)


def get_grant_matching_chain():
    grant_retriever = get_grant_retriever()
    evidence_retriever = get_evidence_retriever()

    llm = get_llm()

    structured_llm = llm.with_structured_output(
        GrantMatchReport
    )

    prompt = ChatPromptTemplate.from_template(
        """
You are GrantCraft, an expert nonprofit grant-matching assistant.

Evaluate the NGO program against the retrieved grant opportunities
using the retrieved NGO evidence as supporting evidence.

IMPORTANT EVIDENCE RULES:

1. Use ONLY the information provided in:
   - the NGO program,
   - retrieved NGO evidence,
   - and retrieved grant information.

2. Never invent facts.

3. Never assume eligibility.

4. If an eligibility requirement cannot be verified from
   the available NGO information or evidence, mark it as
   "Needs verification".

5. Do not exaggerate project impact or alignment.

6. Score alignment from 0 to 100.

7. Every score must be supported by available evidence.

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

15. "evidence" must contain the NGO source documents that
    directly support the match.

16. For every evidence item:
    - use the actual source name,
    - provide a relevance score from 0 to 1,
    - provide a short excerpt from the retrieved NGO evidence.

17. Do not create evidence that was not retrieved.

18. If no retrieved NGO evidence supports a claim, do not
    present that claim as confirmed evidence.

19. If evidence is insufficient, keep the match conservative.

20. Return the most relevant grants first.

NGO PROGRAM:

{program}

RETRIEVED NGO EVIDENCE:

{evidence}

RETRIEVED GRANTS:

{grants}
"""
    )

    chain = (
        {
            "grants": RunnablePassthrough()
            | grant_retriever
            | format_grants,

            "evidence": RunnablePassthrough()
            | evidence_retriever
            | format_evidence,

            "program": RunnablePassthrough(),
        }
        | prompt
        | structured_llm
    )

    return chain