from pydantic import BaseModel, Field


class FactualityAudit(BaseModel):
    passed: bool = Field(
        description="True only if all factual claims are supported by the source documents."
    )

    issues: list[str] = Field(
        description="List of unsupported or questionable factual claims."
    )

    summary: str = Field(
        description="Short summary of the factual accuracy of the proposal."
    )