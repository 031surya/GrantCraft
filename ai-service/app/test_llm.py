from rag.llm import get_llm


def main():
    llm = get_llm()

    response = llm.invoke(
        "Say 'GrantCraft LLM connection successful' and nothing else."
    )

    print(response.content)


if __name__ == "__main__":
    main()