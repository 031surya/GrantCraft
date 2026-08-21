import json
from pathlib import Path

from langchain_core.documents import Document


DATA_DIR = Path(__file__).resolve().parents[2] / "data"


def load_json_documents():
    documents = []

    sources = {
        "grant": DATA_DIR / "grants",
        "ngo": DATA_DIR / "ngo"
    }

    for document_type, directory in sources.items():
        for file_path in sorted(directory.glob("*.json")):
            with open(file_path, "r", encoding="utf-8") as file:
                data = json.load(file)

            page_content = json.dumps(data, indent=2, ensure_ascii=False)

            metadata = {
                "source": file_path.name,
                "document_type": document_type,
                "file_path": str(file_path)
            }

            if document_type == "grant":
                metadata["grant_id"] = data.get("grant_id")
                metadata["funder_name"] = data.get("funder_name")

            elif document_type == "ngo":
                metadata["program_id"] = data.get("program_id")
                metadata["organization_name"] = data.get(
                    "organization_name"
                )

            documents.append(
                Document(
                    page_content=page_content,
                    metadata=metadata
                )
            )

    return documents