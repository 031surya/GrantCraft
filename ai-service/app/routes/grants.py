from pathlib import Path
import json

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.rag.grant_matcher import get_grant_matching_chain


router = APIRouter(
    prefix="/grants",
    tags=["Grants"]
)


# =====================================================
# GRANT DATA
# =====================================================

GRANTS_DIR = Path(__file__).resolve().parents[2] / "data" / "grants"


def load_grant_metadata():
    grants = {}

    for file_path in GRANTS_DIR.glob("*.json"):
        try:
            with open(file_path, "r", encoding="utf-8") as file:
                grant = json.load(file)

            grant_id = grant.get("grant_id")

            if grant_id:
                grants[grant_id] = grant

        except (OSError, json.JSONDecodeError) as error:
            print(
                f"Could not load grant file {file_path.name}: {error}"
            )

    return grants


# =====================================================
# REQUEST SCHEMAS
# =====================================================

class NGOInfo(BaseModel):
    name: str = Field(
        min_length=2,
        description="NGO or organization name"
    )

    organization_type: str = Field(
        min_length=2,
        description="Type of organization"
    )

    location: str = Field(
        min_length=2,
        description="Primary organization/project location"
    )


class ProjectInfo(BaseModel):
    description: str = Field(
        min_length=20,
        description="Detailed project description"
    )

    focus_areas: list[str] = Field(
        default_factory=list,
        description="Project focus areas"
    )

    beneficiaries: str = Field(
        min_length=2,
        description="Primary project beneficiaries"
    )


class FundingInfo(BaseModel):
    amount: float = Field(
        gt=0,
        description="Funding amount requested"
    )

    currency: str = Field(
        default="USD",
        min_length=3,
        max_length=3,
        description="Funding currency"
    )


class GrantMatchRequest(BaseModel):
    ngo: NGOInfo
    project: ProjectInfo
    funding: FundingInfo


# =====================================================
# RESPONSE ENRICHMENT
# =====================================================

def enrich_matches(matches, requested_amount, requested_currency):
    grants = load_grant_metadata()

    enriched_matches = []

    for match in matches:
        grant = grants.get(match.grant_id)

        if not grant:
            print(
                f"Grant metadata not found for {match.grant_id}"
            )
            continue

        funding = grant.get("funding_amount", {})

        minimum = funding.get("min")
        maximum = funding.get("max")
        currency = funding.get(
            "currency",
            requested_currency
        )

        fits_range = False

        if (
            minimum is not None
            and maximum is not None
            and currency == requested_currency
        ):
            fits_range = (
                minimum <= requested_amount <= maximum
            )

        eligibility = grant.get("eligibility", {})

        enriched_matches.append(
            {
                "grant_id": match.grant_id,
                "funder_name": match.funder_name,
                "grant_title": match.grant_title,
                "alignment_score": match.alignment_score,
                "why_it_matches": match.why_it_matches,
                "eligibility_notes": match.eligibility_notes,

                "funding": {
                    "min": minimum,
                    "max": maximum,
                    "currency": currency,
                    "requested_amount": requested_amount,
                    "fits_range": fits_range,
                },

                "eligibility_requirements": {
                    "organization_types": eligibility.get(
                        "organization_types",
                        []
                    ),
                    "geographic_scope": eligibility.get(
                        "geographic_scope",
                        []
                    ),
                    "requirements": eligibility.get(
                        "requirements",
                        []
                    ),
                },

                "application_requirements": grant.get(
                    "application_requirements",
                    {}
                ),

                "deadline": grant.get(
                    "deadline"
                ),

                "data_status": grant.get(
                    "data_status"
                ),
            }
        )

    return enriched_matches


# =====================================================
# GRANT MATCHING
# =====================================================

@router.post("/match")
def match_grants(request: GrantMatchRequest):
    try:
        program_context = f"""
NGO INFORMATION

Organization Name:
{request.ngo.name}

Organization Type:
{request.ngo.organization_type}

Location:
{request.ngo.location}


PROJECT INFORMATION

Project Description:
{request.project.description}

Focus Areas:
{", ".join(request.project.focus_areas)}

Primary Beneficiaries:
{request.project.beneficiaries}


FUNDING REQUIREMENTS

Requested Amount:
{request.funding.amount}

Currency:
{request.funding.currency}
"""

        chain = get_grant_matching_chain()

        result = chain.invoke(program_context)

        enriched_matches = enrich_matches(
            result.matches,
            request.funding.amount,
            request.funding.currency,
        )

        return {
            "success": True,
            "data": {
                "matches": enriched_matches
            },
        }

    except Exception as error:
        print(
            f"Grant matching error: {error}"
        )

        raise HTTPException(
            status_code=500,
            detail="Grant matching service failed",
        )