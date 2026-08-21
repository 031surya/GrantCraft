from rag.chain import get_rag_chain


def main():
    chain = get_rag_chain()

    question = "Which grants could support rural communities that need safe drinking water?"

    response = chain.invoke(question)

    print("\n" + "=" * 70)
    print("QUESTION")
    print("=" * 70)
    print(question)

    print("\n" + "=" * 70)
    print("RAG ANSWER")
    print("=" * 70)
    print(response)


if __name__ == "__main__":
    main()