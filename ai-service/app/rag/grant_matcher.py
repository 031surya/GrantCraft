from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough

from rag.retriever import get_grant_retriever
from rag.llm import get_llm
from rag.schemas import GrantMatchReport


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

IMPORTANT RULES:

1. Use ONLY the information provided.
2. Do not invent facts.
3. Do not assume eligibility.
4. If an eligibility requirement cannot be verified from
   the NGO information, explicitly say so in eligibility_notes.
5. Do not exaggerate impact.
6. Score alignment from 0 to 100.
7. Consider:
   - program focus
   - target beneficiaries
   - geographic scope
   - grant focus areas
   - eligibility requirements
   - funding range
   - program budget
8. Every score must be supported by the retrieved evidence.

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