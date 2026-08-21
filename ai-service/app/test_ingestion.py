from ingestion.loader import load_json_documents
from ingestion.chunker import split_documents


def main():
    documents = load_json_documents()
    chunks = split_documents(documents)

    print(f"\nOriginal documents: {len(documents)}")
    print(f"Generated chunks: {len(chunks)}")

    for index, chunk in enumerate(chunks[:5], start=1):
        print("\n------------------------------")
        print(f"Chunk {index}")
        print(f"Source: {chunk.metadata.get('source')}")
        print(f"Type: {chunk.metadata.get('document_type')}")
        print(f"Characters: {len(chunk.page_content)}")
        print(chunk.page_content[:300])


if __name__ == "__main__":
    main()