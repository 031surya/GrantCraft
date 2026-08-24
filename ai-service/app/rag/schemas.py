from pydantic import BaseModel, Field


class GrantEvidence(BaseModel):
    source: str = Field(
        description="Source document supporting the grant match"
    )

    relevance: float = Field(
        description="Relevance score of the evidence",
        ge=0,
        le=1
    )

    excerpt: str = Field(
        description="Short excerpt from the source document supporting the match"
    )


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

    eligibility_notes: list[str] = Field(
        description="Evidence-based eligibility notes and missing information"
    )

    evidence: list[GrantEvidence] = Field(
        default=[],
        description="NGO evidence supporting the grant match"
    )


class GrantMatchReport(BaseModel):
    matches: list[GrantMatch]