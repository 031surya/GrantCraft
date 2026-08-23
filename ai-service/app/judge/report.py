import json

from app.judge.schemas import JudgeAuditReport


def build_audit_report(
    audit: JudgeAuditReport,
) -> dict:
    """
    Convert the structured judge result into a clean
    GrantCraft audit report.
    """

    verified_count = sum(
        1
        for metric in audit.verified_metrics
        if metric.status == "verified"
    )

    mismatch_count = sum(
        1
        for metric in audit.verified_metrics
        if metric.status == "mismatch"
    )

    not_found_count = sum(
        1
        for metric in audit.verified_metrics
        if metric.status == "not_found"
    )

    unsupported_count = len(
        audit.unsupported_claims
    )

    return {
        "audit_status": (
            "PASS"
            if audit.overall_pass
            else "FAIL"
        ),
        "accuracy_score": audit.accuracy_score,
        "metrics": {
            "total_checked": len(
                audit.verified_metrics
            ),
            "verified": verified_count,
            "mismatches": mismatch_count,
            "not_found": not_found_count,
        },
        "unsupported_claims_count": (
            unsupported_count
        ),
        "verified_metrics": [
            metric.model_dump()
            for metric in audit.verified_metrics
        ],
        "unsupported_claims": [
            claim.model_dump()
            for claim in audit.unsupported_claims
        ],
        "summary": audit.summary,
    }


def print_audit_report(
    audit: JudgeAuditReport,
) -> None:
    """
    Print a human-readable GrantCraft audit report.
    """

    report = build_audit_report(audit)

    print("\n" + "=" * 70)
    print("GRANTCRAFT AUDIT REPORT")
    print("=" * 70)

    print(
        f"\nSTATUS: {report['audit_status']}"
    )

    print(
        f"ACCURACY SCORE: "
        f"{report['accuracy_score']}/100"
    )

    print("\nMETRIC VERIFICATION")
    print("-" * 70)

    metrics = report["metrics"]

    print(
        f"Total checked: {metrics['total_checked']}"
    )

    print(
        f"Verified: {metrics['verified']}"
    )

    print(
        f"Mismatches: {metrics['mismatches']}"
    )

    print(
        f"Not found: {metrics['not_found']}"
    )

    print("\nUNSUPPORTED CLAIMS")
    print("-" * 70)

    if not report["unsupported_claims"]:
        print("None")
    else:
        for index, claim in enumerate(
            report["unsupported_claims"],
            start=1,
        ):
            print(
                f"{index}. {claim['claim']}"
            )
            print(
                f"   Reason: {claim['reason']}"
            )

    print("\nSUMMARY")
    print("-" * 70)
    print(report["summary"])

    print("\n" + "=" * 70)


def save_audit_report(
    audit: JudgeAuditReport,
    output_path: str,
) -> None:
    """
    Save the audit report as JSON.
    """

    report = build_audit_report(audit)

    with open(
        output_path,
        "w",
        encoding="utf-8",
    ) as file:
        json.dump(
            report,
            file,
            indent=2,
            ensure_ascii=False,
        )