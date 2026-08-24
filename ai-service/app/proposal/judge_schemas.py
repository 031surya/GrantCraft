from pydantic import BaseModel, Field


class FactualityAudit(BaseModel):
    overall_pass: bool = Field(
        description=(
            "True only when every factual claim in the proposal "
            "is supported by the source NGO program or source grant."
        )
    )

    accuracy_score: int = Field(
        ge=0,
        le=100,
        description=(
            "Factual accuracy score from 0 to 100. "
            "100 means all factual claims are supported."
        )
    )

    verified_metrics: list[str] = Field(
        description=(
            "Names of metrics or numerical facts in the proposal "
            "that are directly verified by the sources."
        )
    )

    unsupported_claims: list[str] = Field(
        description=(
            "Specific unsupported factual claims found in the proposal. "
            "Use an empty list when there are none."
        )
    )

    summary: str = Field(
        description=(
            "Short explanation of the factual accuracy result."
        )
    )