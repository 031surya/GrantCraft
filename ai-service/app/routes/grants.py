from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.rag.grant_matcher import get_grant_matching_chain


router = APIRouter(prefix="/grants", tags=["Grants"])


class GrantMatchRequest(BaseModel):
    program: str = Field(
        min_length=10,
        description="NGO program description"
    )


@router.post("/match")
def match_grants(request: GrantMatchRequest):
    try:
        chain = get_grant_matching_chain()

        result = chain.invoke(request.program)

        return {
            "success": True,
            "data": result.model_dump(),
        }

    except Exception as error:
        print(f"Grant matching error: {error}")

        raise HTTPException(
            status_code=500,
            detail="Grant matching service failed",
        )