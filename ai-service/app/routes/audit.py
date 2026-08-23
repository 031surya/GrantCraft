from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.judge.checker import run_judge
from app.judge.report import build_audit_report


router = APIRouter(
    prefix="/audit",
    tags=["AI Audit"],
)


# =====================================================
# REQUEST SCHEMAS
# =====================================================


class AuditRequest(BaseModel):
    program: dict = Field(
        description="Source NGO program information"
    )

    grant: dict = Field(
        description="Source grant information"
    )

    proposal: dict = Field(
        description="Proposal to audit"
    )


# =====================================================
# AUDIT ENDPOINT
# =====================================================


@router.post("")
def audit_proposal(request: AuditRequest):

    try:
        audit = run_judge(
            proposal=request.proposal,
            program=request.program,
            grant=request.grant,
        )

        report = build_audit_report(audit)

        return {
            "success": True,
            "data": report,
        }

    except Exception as error:

        print(
            "AI audit error:",
            error,
        )

        raise HTTPException(
            status_code=500,
            detail="AI audit service failed",
        )