from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.proposal.pipeline import generate_proposal


router = APIRouter(
    prefix="/proposals",
    tags=["Proposals"],
)


# =====================================================
# REQUEST SCHEMAS
# =====================================================

class ProposalGenerateRequest(BaseModel):
    program: dict = Field(
        description="NGO and project information used to generate the proposal"
    )

    grant: dict = Field(
        description="Full selected grant information including requirements"
    )

    word_limit: int = Field(
        default=1500,
        gt=0,
        le=10000,
        description="Maximum proposal word limit",
    )

    max_revisions: int = Field(
        default=2,
        ge=0,
        le=5,
        description="Maximum number of AI revision attempts",
    )


# =====================================================
# PROPOSAL GENERATION
# =====================================================

@router.post("/generate")
def generate_grant_proposal(
    request: ProposalGenerateRequest,
):
    try:
        result = generate_proposal(
            program=request.program,
            grant=request.grant,
            word_limit=request.word_limit,
            max_revisions=request.max_revisions,
        )

        return {
            "success": True,
            "data": result,
        }

    except Exception as error:
        print(f"Proposal generation error: {error}")

        raise HTTPException(
            status_code=500,
            detail="Proposal generation service failed",
        )