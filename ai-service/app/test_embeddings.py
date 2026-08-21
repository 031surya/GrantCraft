from ingestion.loader import load_json_documents
from ingestion.chunker import split_documents
from embeddings.embedder import get_embedding_model


def main():
    documents = load_json_documents()
    chunks = split_documents(documents)

    print(f"Documents: {len(documents)}")
    print(f"Chunks: {len(chunks)}")

    embedding_model = get_embedding_model()

    vector = embedding_model.embed_query(
        chunks[0].page_content
    )

    print(f"Embedding dimensions: {len(vector)}")
    print(f"First 10 values: {vector[:10]}")


if __name__ == "__main__":
    main()