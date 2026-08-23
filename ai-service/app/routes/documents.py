from pathlib import Path
import shutil
import tempfile

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.ingestion.upload_service import index_uploaded_file


router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)


SUPPORTED_EXTENSIONS = {
    ".pdf",
    ".txt",
    ".json",
}


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    document_type: str = Form("uploaded"),
):
    """
    Upload a document, ingest it, and index it
    into the GrantCraft Chroma vector store.
    """

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="A file is required",
        )

    extension = Path(file.filename).suffix.lower()

    if extension not in SUPPORTED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported file type. "
                "Supported types: PDF, TXT, JSON"
            ),
        )

    if not document_type.strip():
        raise HTTPException(
            status_code=400,
            detail="Document type is required",
        )

    temporary_path = None

    try:
        # -------------------------------------------------
        # Create temporary file
        # -------------------------------------------------

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=extension,
        ) as temporary_file:

            temporary_path = Path(
                temporary_file.name
            )

            shutil.copyfileobj(
                file.file,
                temporary_file,
            )

        # -------------------------------------------------
        # Index document
        # -------------------------------------------------

        result = index_uploaded_file(
            file_path=str(temporary_path),
            document_type=document_type.strip(),
        )

        # Preserve the original uploaded filename
        result["source"] = file.filename

        return {
            "success": True,
            "data": result,
        }

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

    except FileNotFoundError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error),
        )

    except Exception as error:
        print(
            "Document ingestion error:",
            error,
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to process uploaded document",
        )

    finally:
        # -------------------------------------------------
        # Clean temporary file
        # -------------------------------------------------

        if temporary_path and temporary_path.exists():
            temporary_path.unlink(missing_ok=True)

        await file.close()  