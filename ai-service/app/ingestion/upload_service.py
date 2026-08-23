import json
from pathlib import Path

from langchain_core.documents import Document
from langchain_chroma import Chroma
from pypdf import PdfReader

from app.ingestion.chunker import split_documents
from app.embeddings.embedder import get_embedding_model
from app.vectorstore.chroma_store import (
    VECTOR_DB_DIR,
    COLLECTION_NAME,
)


SUPPORTED_EXTENSIONS = {
    ".pdf",
    ".txt",
    ".json",
}


def load_uploaded_file(
    file_path: str,
    document_type: str = "uploaded",
):
    """
    Load a user-uploaded document into LangChain Documents.
    """

    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(
            f"File not found: {path}"
        )

    extension = path.suffix.lower()

    if extension not in SUPPORTED_EXTENSIONS:
        raise ValueError(
            f"Unsupported file type: {extension}"
        )

    metadata = {
        "source": path.name,
        "document_type": document_type,
        "file_path": str(path),
        "file_type": extension.replace(".", ""),
    }

    # -----------------------------------------------------
    # PDF
    # -----------------------------------------------------

    if extension == ".pdf":
        reader = PdfReader(str(path))

        documents = []

        for page_number, page in enumerate(
            reader.pages,
            start=1,
        ):
            text = page.extract_text() or ""

            if text.strip():
                page_metadata = {
                    **metadata,
                    "page": page_number,
                }

                documents.append(
                    Document(
                        page_content=text,
                        metadata=page_metadata,
                    )
                )

        return documents

    # -----------------------------------------------------
    # JSON
    # -----------------------------------------------------

    if extension == ".json":
        with open(
            path,
            "r",
            encoding="utf-8",
        ) as file:
            data = json.load(file)

        return [
            Document(
                page_content=json.dumps(
                    data,
                    indent=2,
                    ensure_ascii=False,
                ),
                metadata=metadata,
            )
        ]

    # -----------------------------------------------------
    # TXT
    # -----------------------------------------------------

    with open(
        path,
        "r",
        encoding="utf-8",
    ) as file:
        text = file.read()

    return [
        Document(
            page_content=text,
            metadata=metadata,
        )
    ]


def index_uploaded_file(
    file_path: str,
    document_type: str = "uploaded",
):
    """
    Load, chunk, embed, and store an uploaded document
    in the existing GrantCraft Chroma collection.
    """

    documents = load_uploaded_file(
        file_path=file_path,
        document_type=document_type,
    )

    if not documents:
        raise ValueError(
            "No readable content was found in the uploaded file"
        )

    chunks = split_documents(documents)

    if not chunks:
        raise ValueError(
            "Document produced no searchable chunks"
        )

    embedding_model = get_embedding_model()

    vector_store = Chroma(
        collection_name=COLLECTION_NAME,
        embedding_function=embedding_model,
        persist_directory=str(VECTOR_DB_DIR),
    )

    vector_store.add_documents(chunks)

    return {
        "source": Path(file_path).name,
        "document_type": document_type,
        "file_type": Path(file_path).suffix
        .lower()
        .replace(".", ""),
        "documents_loaded": len(documents),
        "chunks_created": len(chunks),
        "status": "indexed",
    }