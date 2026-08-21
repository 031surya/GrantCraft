from pydantic import BaseModel, Field
from typing import Literal


class VerifiedMetric(BaseModel):
    metric: str
    value: str | int | float
    proposal_value: str | None = None
    source_value: str | None = None
    status: Literal[
        "verified",
        "mismatch",
        "not_found",
    ] = "verified"
    explanation: str | None = None


class UnsupportedClaim(BaseModel):
    claim: str
    reason: str = ""


class JudgeAuditReport(BaseModel):
    overall_pass: bool

    accuracy_score: int = Field(
        ge=0,
        le=100,
    )

    verified_metrics: list[VerifiedMetric] = []

    unsupported_claims: list[UnsupportedClaim] = []

    summary: str