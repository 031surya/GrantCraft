from ingestion.loader import load_json_documents
from ingestion.chunker import split_documents
from vectorstore.chroma_store import create_vector_store


def main():
    documents = load_json_documents()
    chunks = split_documents(documents)

    vector_store = create_vector_store(chunks)

    queries = [
        "funding for rural communities that need safe drinking water",
        "programs that teach girls digital skills",
        "community health and preventive care",
        "women entrepreneurship and financial empowerment"
    ]

    for query in queries:
        print("\n" + "=" * 70)
        print(f"QUERY: {query}")
        print("=" * 70)

        results = vector_store.similarity_search(query, k=3)

        for index, document in enumerate(results, start=1):
            print(f"\nResult {index}")
            print(f"Source: {document.metadata.get('source')}")
            print(f"Type: {document.metadata.get('document_type')}")
            print(f"Content:\n{document.page_content[:500]}")


if __name__ == "__main__":
    main()