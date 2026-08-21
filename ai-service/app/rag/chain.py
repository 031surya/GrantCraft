from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

from rag.retriever import get_grant_retriever
from rag.llm import get_llm


def format_documents(documents):
    return "\n\n".join(
        f"Source: {doc.metadata.get('source')}\n"
        f"Type: {doc.metadata.get('document_type')}\n"
        f"Content:\n{doc.page_content}"
        for doc in documents
    )


def get_rag_chain():
    retriever = get_grant_retriever()
    llm = get_llm()

    prompt = ChatPromptTemplate.from_template(
        """
You are GrantCraft, an AI grant research assistant.

Use ONLY the information provided in the retrieved context.

If the context does not contain enough information to answer the question,
say that the available documents do not provide enough information.

Retrieved context:
{context}

User question:
{question}

Provide a clear and concise answer.
"""
    )

    chain = (
        {
            "context": retriever | format_documents,
            "question": RunnablePassthrough(),
        }
        | prompt
        | llm
        | StrOutputParser()
    )

    return chain