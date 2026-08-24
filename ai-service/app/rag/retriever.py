from langchain_chroma import Chroma

from app.embeddings.embedder import get_embedding_model
from app.vectorstore.chroma_store import (
    VECTOR_DB_DIR,
    COLLECTION_NAME,
)


def get_vector_store():
    embedding_model = get_embedding_model()

    return Chroma(
        collection_name=COLLECTION_NAME,
        embedding_function=embedding_model,
        persist_directory=str(VECTOR_DB_DIR),
    )


def get_grant_retriever():
    vector_store = get_vector_store()

    return vector_store.as_retriever(
        search_type="similarity",
        search_kwargs={
            "k": 5,
            "filter": {
                "document_type": "grant"
            },
        },
    )


def get_evidence_retriever():
    vector_store = get_vector_store()

    return vector_store.as_retriever(
        search_type="similarity",
        search_kwargs={
            "k": 5,
            "filter": {
                "document_type": "ngo"
            },
        },
    )