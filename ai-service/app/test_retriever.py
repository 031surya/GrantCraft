from rag.retriever import get_grant_retriever


def main():
    retriever = get_grant_retriever()

    query = "funding opportunities for rural clean water programs"

    results = retriever.invoke(query)

    print(f"\nQuery: {query}")
    print(f"Retrieved chunks: {len(results)}")

    for index, document in enumerate(results, start=1):
        print("\n" + "-" * 60)
        print(f"Result {index}")
        print(f"Source: {document.metadata.get('source')}")
        print(f"Type: {document.metadata.get('document_type')}")
        print(f"Content:\n{document.page_content[:400]}")


if __name__ == "__main__":
    main()