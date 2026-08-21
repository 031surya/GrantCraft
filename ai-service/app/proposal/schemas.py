from pydantic import BaseModel, Field


class ProposalDraft(BaseModel):
    organization_background: str = Field(
        description="Brief background of the NGO relevant to the proposal"
    )

    program_description: str = Field(
        description="Description of the proposed program"
    )

    target_beneficiaries: str = Field(
        description="Description of the intended beneficiaries"
    )

    expected_outcomes: str = Field(
        description="Evidence-based expected outcomes"
    )

    implementation_plan: str = Field(
        description="Description of how the program will be implemented"
    )

    evaluation_plan: str = Field(
        description="How program progress and outcomes will be evaluated"
    )

    budget_summary: str = Field(
        description="Summary of the program budget"
    )