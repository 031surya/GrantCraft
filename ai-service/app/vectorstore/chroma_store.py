from pathlib import Path

from langchain_chroma import Chroma

from embeddings.embedder import get_embedding_model


VECTOR_DB_DIR = Path(__file__).resolve().parents[2] / "vector_db"

COLLECTION_NAME = "grantcraft_documents"


def create_vector_store(documents):
    embedding_model = get_embedding_model()

    vector_store = Chroma.from_documents(
        documents=documents,
        embedding=embedding_model,
        collection_name=COLLECTION_NAME,
        persist_directory=str(VECTOR_DB_DIR)
    )

    return vector_store