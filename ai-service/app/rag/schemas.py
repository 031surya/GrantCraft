from pydantic import BaseModel, Field


class GrantMatch(BaseModel):
    grant_id: str = Field(
        description="Unique identifier of the grant opportunity"
    )

    funder_name: str = Field(
        description="Name of the grant funder"
    )

    grant_title: str = Field(
        description="Title of the grant opportunity"
    )

    alignment_score: int = Field(
        description="Alignment score from 0 to 100",
        ge=0,
        le=100
    )

    why_it_matches: list[str] = Field(
        description="Short evidence-based reasons why the project matches the grant"
    )

    eligibility_notes: str = Field(
        description="Evidence-based eligibility notes and missing information"
    )


class GrantMatchReport(BaseModel):
    matches: list[GrantMatch]