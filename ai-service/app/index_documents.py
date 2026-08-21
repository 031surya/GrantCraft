from ingestion.loader import load_json_documents
from ingestion.chunker import split_documents
from vectorstore.chroma_store import create_vector_store


def main():
    print("Loading documents...")
    documents = load_json_documents()
    print(f"Loaded {len(documents)} documents.")

    print("Splitting documents into chunks...")
    chunks = split_documents(documents)
    print(f"Created {len(chunks)} chunks.")

    print("Creating Chroma vector store...")
    create_vector_store(chunks)

    print("Vector store created successfully.")


if __name__ == "__main__":
    main()