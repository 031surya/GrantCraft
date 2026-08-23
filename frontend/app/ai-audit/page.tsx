"use client";

import { FormEvent, useEffect, useState } from "react";
import CustomCursor from "../components/CustomCursor";

type AuditResult = {
  audit_status: "PASS" | "FAIL";
  accuracy_score: number;
  metrics: {
    total_checked: number;
    verified: number;
    mismatches: number;
    not_found: number;
  };
  unsupported_claims_count: number;
  verified_metrics: {
    metric: string;
    value: string | number;
    proposal_value?: string | null;
    source_value?: string | null;
    status: string;
    explanation?: string | null;
  }[];
  unsupported_claims: {
    claim: string;
    reason: string;
  }[];
  summary: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function AIAuditPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [auditing, setAuditing] = useState(false);

  const [user, setUser] = useState<User | null>(null);

  const [error, setError] = useState("");
  const [result, setResult] =
    useState<AuditResult | null>(null);

  // =====================================================
  // SOURCE PROGRAM
  // =====================================================

  const [organizationName, setOrganizationName] =
    useState("Rural Digital Empowerment NGO");

  const [organizationType, setOrganizationType] =
    useState("registered nonprofit");

  const [location, setLocation] =
    useState("rural community");

  const [projectDescription, setProjectDescription] =
    useState(
      "We provide digital literacy and computer education to rural girls and young women."
    );

  const [focusAreas, setFocusAreas] =
    useState(
      "digital literacy, technology skills, education"
    );

  const [beneficiaries, setBeneficiaries] =
    useState("rural girls and young women");

  const [requestedAmount, setRequestedAmount] =
    useState("50000");

  const [currency, setCurrency] =
    useState("USD");

  // =====================================================
  // GRANT
  // =====================================================

  const [grantId, setGrantId] =
    useState("G003");

  const [funderName, setFunderName] =
    useState(
      "Youth Education Innovation Foundation"
    );

  const [grantTitle, setGrantTitle] =
    useState(
      "Digital Learning and Youth Innovation Grant"
    );

  const [fundingRange, setFundingRange] =
    useState("USD 20,000-120,000");

  const [grantFocusAreas, setGrantFocusAreas] =
    useState(
      "digital literacy, technology skills, youth education, innovative learning"
    );

  // =====================================================
  // PROPOSAL
  // =====================================================

  const [organizationBackground, setOrganizationBackground] =
    useState(
      "Rural Digital Empowerment NGO provides digital literacy and computer education to rural girls and young women."
    );

  const [programDescription, setProgramDescription] =
    useState(
      "The program provides digital literacy and computer education to rural girls and young women."
    );

  const [proposalBeneficiaries, setProposalBeneficiaries] =
    useState(
      "Rural girls and young women."
    );

  const [expectedOutcomes, setExpectedOutcomes] =
    useState(
      "The program supports digital literacy and computer education objectives."
    );

  const [implementationPlan, setImplementationPlan] =
    useState(
      "Proposed implementation activities would focus on delivering the program's stated digital literacy and computer education objectives."
    );

  const [evaluationPlan, setEvaluationPlan] =
    useState(
      "Future evaluation could assess progress against the program's stated objectives."
    );

  const [budgetSummary, setBudgetSummary] =
    useState(
      "The requested amount is USD 50,000."
    );

  // =====================================================
  // THEME
  // =====================================================

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      darkMode
    );
  }, [darkMode]);

  // =====================================================
  // AUTHENTICATION
  // =====================================================

  useEffect(() => {
    const verifySession = async () => {
      const token =
        localStorage.getItem("grantcraft_token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/me",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          localStorage.removeItem(
            "grantcraft_token"
          );

          localStorage.removeItem(
            "grantcraft_user"
          );

          window.location.href = "/login";
          return;
        }

        setUser(data.user);

        localStorage.setItem(
          "grantcraft_user",
          JSON.stringify(data.user)
        );

        setCheckingAuth(false);
      } catch (authError) {
        console.error(
          "AI Audit authentication error:",
          authError
        );

        localStorage.removeItem(
          "grantcraft_token"
        );

        localStorage.removeItem(
          "grantcraft_user"
        );

        window.location.href = "/login";
      }
    };

    verifySession();
  }, []);

  // =====================================================
  // INPUT STYLE
  // =====================================================

  const inputClass = `
    w-full rounded-xl border px-4 py-3 text-sm outline-none
    transition duration-200
    ${
      darkMode
        ? "border-white/[0.08] bg-white/[0.025] text-white placeholder:text-white/20 focus:border-cyan-400/40 focus:bg-white/[0.04]"
        : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-500/[0.06]"
    }
  `;

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("grantcraft_token");
    localStorage.removeItem("grantcraft_user");

    window.location.href = "/login";
  };

  // =====================================================
  // AUDIT
  // =====================================================

  const handleAudit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setResult(null);

    const token =
      localStorage.getItem("grantcraft_token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (!organizationName.trim()) {
      setError(
        "Please enter the organization name."
      );
      return;
    }

    if (!projectDescription.trim()) {
      setError(
        "Please enter the source project description."
      );
      return;
    }

    if (!proposalBeneficiaries.trim()) {
      setError(
        "Please enter the proposal beneficiaries."
      );
      return;
    }

    setAuditing(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/audit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            program: {
              organization_name:
                organizationName.trim(),

              organization_type:
                organizationType.trim(),

              location:
                location.trim(),

              project_description:
                projectDescription.trim(),

              focus_areas: focusAreas
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),

              beneficiaries:
                beneficiaries.trim(),

              requested_amount:
                Number(requestedAmount),

              currency:
                currency
                  .trim()
                  .toUpperCase(),
            },

            grant: {
              grant_id:
                grantId.trim(),

              funder_name:
                funderName.trim(),

              grant_title:
                grantTitle.trim(),

              funding_range:
                fundingRange.trim(),

              focus_areas:
                grantFocusAreas
                  .split(",")
                  .map((item) =>
                    item.trim()
                  )
                  .filter(Boolean),
            },

            proposal: {
              organization_background:
                organizationBackground.trim(),

              program_description:
                programDescription.trim(),

              target_beneficiaries:
                proposalBeneficiaries.trim(),

              expected_outcomes:
                expectedOutcomes.trim(),

              implementation_plan:
                implementationPlan.trim(),

              evaluation_plan:
                evaluationPlan.trim(),

              budget_summary:
                budgetSummary.trim(),
            },
          }),
        }
      );

      const data = await response.json();

      if (
        !response.ok ||
        !data.success ||
        !data.data
      ) {
        throw new Error(
          data.message ||
            "Unable to audit the proposal."
        );
      }

      setResult(data.data);
    } catch (auditError) {
      console.error(
        "AI audit error:",
        auditError
      );

      setError(
        auditError instanceof Error
          ? auditError.message
          : "Unable to audit the proposal."
      );
    } finally {
      setAuditing(false);
    }
  };

  // =====================================================
  // CLEAR
  // =====================================================

  const handleClear = () => {
    setResult(null);
    setError("");

    setOrganizationName(
      "Rural Digital Empowerment NGO"
    );

    setOrganizationType(
      "registered nonprofit"
    );

    setLocation(
      "rural community"
    );

    setProjectDescription(
      "We provide digital literacy and computer education to rural girls and young women."
    );

    setFocusAreas(
      "digital literacy, technology skills, education"
    );

    setBeneficiaries(
      "rural girls and young women"
    );

    setRequestedAmount("50000");
    setCurrency("USD");

    setGrantId("G003");

    setFunderName(
      "Youth Education Innovation Foundation"
    );

    setGrantTitle(
      "Digital Learning and Youth Innovation Grant"
    );

    setFundingRange(
      "USD 20,000-120,000"
    );

    setGrantFocusAreas(
      "digital literacy, technology skills, youth education, innovative learning"
    );

    setOrganizationBackground(
      "Rural Digital Empowerment NGO provides digital literacy and computer education to rural girls and young women."
    );

    setProgramDescription(
      "The program provides digital literacy and computer education to rural girls and young women."
    );

    setProposalBeneficiaries(
      "Rural girls and young women."
    );

    setExpectedOutcomes(
      "The program supports digital literacy and computer education objectives."
    );

    setImplementationPlan(
      "Proposed implementation activities would focus on delivering the program's stated digital literacy and computer education objectives."
    );

    setEvaluationPlan(
      "Future evaluation could assess progress against the program's stated objectives."
    );

    setBudgetSummary(
      "The requested amount is USD 50,000."
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (checkingAuth) {
    return (
      <main
        className={`flex min-h-screen items-center justify-center ${
          darkMode
            ? "bg-[#020617] text-white"
            : "bg-[#f8fafc] text-slate-950"
        }`}
      >
        <CustomCursor />

        <div className="text-center">
          <div
            className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border ${
              darkMode
                ? "border-cyan-400/20 bg-cyan-400/5"
                : "border-cyan-300 bg-white shadow-lg shadow-cyan-500/10"
            }`}
          >
            <div
              className={`h-6 w-6 animate-spin rounded-full border-2 ${
                darkMode
                  ? "border-white/10 border-t-cyan-300"
                  : "border-slate-200 border-t-cyan-500"
              }`}
            />
          </div>

          <p
            className={`mt-5 text-sm ${
              darkMode
                ? "text-white/50"
                : "text-slate-500"
            }`}
          >
            Loading AI Audit...
          </p>
        </div>
      </main>
    );
  }

  const initial =
    user?.name?.charAt(0).toUpperCase() ||
    "U";

  return (
    <main
      className={`min-h-screen transition-colors duration-500 ${
        darkMode
          ? "bg-[#020617] text-white"
          : "bg-[#f8fafc] text-slate-950"
      }`}
    >
      <CustomCursor />

      {/* =================================================
          BACKGROUND
          ================================================= */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className={`absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full blur-[150px] ${
            darkMode
              ? "bg-cyan-500/[0.08]"
              : "bg-cyan-300/[0.18]"
          }`}
        />

        <div
          className={`absolute -right-40 top-40 h-[600px] w-[600px] rounded-full blur-[170px] ${
            darkMode
              ? "bg-violet-600/[0.08]"
              : "bg-violet-300/[0.16]"
          }`}
        />
      </div>

      {/* =================================================
          HEADER
          ================================================= */}

      <header
        className={`sticky top-0 z-30 border-b backdrop-blur-2xl ${
          darkMode
            ? "border-white/[0.06] bg-[#020617]/80"
            : "border-slate-200/80 bg-white/80"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a
            href="/dashboard"
            className="flex items-center gap-3"
          >
            <div
              className={`relative flex h-10 w-10 items-center justify-center rounded-xl border ${
                darkMode
                  ? "border-cyan-400/25 bg-cyan-400/[0.07]"
                  : "border-cyan-300 bg-white shadow-sm"
              }`}
            >
              <span className="text-lg font-black text-cyan-500">
                G
              </span>

              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]" />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight">
                Grant
                <span className="text-cyan-500">
                  Craft
                </span>
              </h1>

              <p
                className={`text-[8px] font-semibold uppercase tracking-[0.25em] ${
                  darkMode
                    ? "text-white/25"
                    : "text-slate-400"
                }`}
              >
                AI Grant Intelligence
              </p>
            </div>
          </a>

          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href="/dashboard"
              className={`hidden rounded-full border px-4 py-2 text-xs font-medium transition sm:block ${
                darkMode
                  ? "border-white/[0.07] text-white/50 hover:border-cyan-400/20 hover:text-cyan-300"
                  : "border-slate-200 bg-white text-slate-500 hover:border-cyan-200 hover:text-cyan-600"
              }`}
            >
              Dashboard
            </a>

            <a
              href="/grant-matches"
              className={`hidden rounded-full border px-4 py-2 text-xs font-medium transition md:block ${
                darkMode
                  ? "border-white/[0.07] text-white/50 hover:border-cyan-400/20 hover:text-cyan-300"
                  : "border-slate-200 bg-white text-slate-500 hover:border-cyan-200 hover:text-cyan-600"
              }`}
            >
              Grant Matches
            </a>

            <a
              href="/proposal-generator"
              className={`hidden rounded-full border px-4 py-2 text-xs font-medium transition lg:block ${
                darkMode
                  ? "border-white/[0.07] text-white/50 hover:border-cyan-400/20 hover:text-cyan-300"
                  : "border-slate-200 bg-white text-slate-500 hover:border-cyan-200 hover:text-cyan-600"
              }`}
            >
              Proposal Generator
            </a>

            <button
              type="button"
              onClick={() =>
                setDarkMode(!darkMode)
              }
              className={`flex h-10 w-10 items-center justify-center rounded-full border text-lg transition ${
                darkMode
                  ? "border-white/10 bg-white/5 text-slate-200 hover:border-cyan-400/40"
                  : "border-slate-200 bg-white text-slate-700 hover:border-cyan-300"
              }`}
            >
              {darkMode ? "☀" : "☾"}
            </button>

            <div className="hidden text-right sm:block">
              <p className="text-xs font-medium">
                {user?.name}
              </p>

              <p
                className={`text-[9px] ${
                  darkMode
                    ? "text-white/30"
                    : "text-slate-400"
                }`}
              >
                {user?.email}
              </p>
            </div>

            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold ${
                darkMode
                  ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-200"
                  : "border-cyan-200 bg-cyan-50 text-cyan-600"
              }`}
            >
              {initial}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className={`rounded-full border px-3.5 py-2 text-[10px] font-medium transition ${
                darkMode
                  ? "border-white/[0.07] bg-white/[0.025] text-white/45 hover:border-red-400/20 hover:text-red-300"
                  : "border-slate-200 bg-white text-slate-500 hover:border-red-200 hover:text-red-500"
              }`}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* =================================================
          CONTENT
          ================================================= */}

      <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="mb-8">
          <div
            className={`mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] ${
              darkMode
                ? "border-cyan-400/15 bg-cyan-400/[0.05] text-cyan-300"
                : "border-cyan-200 bg-cyan-50 text-cyan-600"
            }`}
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
            AI Audit Engine
          </div>

          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Verify every{" "}
            <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 bg-clip-text text-transparent">
              claim.
            </span>
          </h2>

          <p
            className={`mt-3 max-w-2xl text-sm leading-6 ${
              darkMode
                ? "text-white/35"
                : "text-slate-500"
            }`}
          >
            Compare a proposal against its source NGO
            program and grant information. GrantCraft checks
            factual claims, metrics, and unsupported statements.
          </p>
        </div>

        {/* =================================================
            FORM
            ================================================= */}

        <form
          onSubmit={handleAudit}
          className="grid gap-6 xl:grid-cols-2"
        >
          {/* SOURCE */}

          <section
            className={`rounded-[28px] border p-6 backdrop-blur-2xl sm:p-8 ${
              darkMode
                ? "border-white/[0.08] bg-white/[0.025]"
                : "border-slate-200 bg-white/85 shadow-[0_25px_80px_rgba(15,23,42,0.06)]"
            }`}
          >
            <div className="mb-7">
              <p
                className={`text-[9px] font-bold uppercase tracking-[0.22em] ${
                  darkMode
                    ? "text-cyan-300/60"
                    : "text-cyan-600"
                }`}
              >
                Source 01
              </p>

              <h3 className="mt-1 text-xl font-semibold">
                NGO program
              </h3>

              <p
                className={`mt-1 text-xs ${
                  darkMode
                    ? "text-white/25"
                    : "text-slate-400"
                }`}
              >
                The factual source the proposal will be checked against.
              </p>
            </div>

            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em]">
                    Organization
                  </label>

                  <input
                    value={organizationName}
                    onChange={(e) =>
                      setOrganizationName(
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em]">
                    Organization Type
                  </label>

                  <input
                    value={organizationType}
                    onChange={(e) =>
                      setOrganizationType(
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em]">
                    Location
                  </label>

                  <input
                    value={location}
                    onChange={(e) =>
                      setLocation(e.target.value)
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em]">
                    Beneficiaries
                  </label>

                  <input
                    value={beneficiaries}
                    onChange={(e) =>
                      setBeneficiaries(
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em]">
                  Project Description
                </label>

                <textarea
                  value={projectDescription}
                  onChange={(e) =>
                    setProjectDescription(
                      e.target.value
                    )
                  }
                  rows={5}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em]">
                  Focus Areas
                </label>

                <input
                  value={focusAreas}
                  onChange={(e) =>
                    setFocusAreas(
                      e.target.value
                    )
                  }
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-[1fr_100px] gap-3">
                <div>
                  <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em]">
                    Requested Amount
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={requestedAmount}
                    onChange={(e) =>
                      setRequestedAmount(
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em]">
                    Currency
                  </label>

                  <input
                    value={currency}
                    onChange={(e) =>
                      setCurrency(
                        e.target.value.toUpperCase()
                      )
                    }
                    maxLength={3}
                    className={`${inputClass} uppercase`}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* GRANT + PROPOSAL */}

          <div className="space-y-6">
            {/* GRANT */}

            <section
              className={`rounded-[28px] border p-6 backdrop-blur-2xl sm:p-8 ${
                darkMode
                  ? "border-white/[0.08] bg-white/[0.025]"
                  : "border-slate-200 bg-white/85 shadow-[0_25px_80px_rgba(15,23,42,0.06)]"
              }`}
            >
              <div className="mb-6">
                <p
                  className={`text-[9px] font-bold uppercase tracking-[0.22em] ${
                    darkMode
                      ? "text-violet-300/60"
                      : "text-violet-600"
                  }`}
                >
                  Source 02
                </p>

                <h3 className="mt-1 text-xl font-semibold">
                  Grant opportunity
                </h3>
              </div>

              <div className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em]">
                      Grant ID
                    </label>

                    <input
                      value={grantId}
                      onChange={(e) =>
                        setGrantId(
                          e.target.value
                        )
                      }
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em]">
                      Funding Range
                    </label>

                    <input
                      value={fundingRange}
                      onChange={(e) =>
                        setFundingRange(
                          e.target.value
                        )
                      }
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em]">
                    Funder
                  </label>

                  <input
                    value={funderName}
                    onChange={(e) =>
                      setFunderName(
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em]">
                    Grant Title
                  </label>

                  <input
                    value={grantTitle}
                    onChange={(e) =>
                      setGrantTitle(
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em]">
                    Grant Focus Areas
                  </label>

                  <input
                    value={grantFocusAreas}
                    onChange={(e) =>
                      setGrantFocusAreas(
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            {/* PROPOSAL */}

            <section
              className={`rounded-[28px] border p-6 backdrop-blur-2xl sm:p-8 ${
                darkMode
                  ? "border-white/[0.08] bg-white/[0.025]"
                  : "border-slate-200 bg-white/85 shadow-[0_25px_80px_rgba(15,23,42,0.06)]"
              }`}
            >
              <div className="mb-6">
                <p
                  className={`text-[9px] font-bold uppercase tracking-[0.22em] ${
                    darkMode
                      ? "text-amber-300/60"
                      : "text-amber-600"
                  }`}
                >
                  Audit Target
                </p>

                <h3 className="mt-1 text-xl font-semibold">
                  Proposal
                </h3>

                <p
                  className={`mt-1 text-xs ${
                    darkMode
                      ? "text-white/25"
                      : "text-slate-400"
                  }`}
                >
                  Paste or edit the proposal you want to verify.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em]">
                    Organization Background
                  </label>

                  <textarea
                    value={
                      organizationBackground
                    }
                    onChange={(e) =>
                      setOrganizationBackground(
                        e.target.value
                      )
                    }
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em]">
                    Program Description
                  </label>

                  <textarea
                    value={
                      programDescription
                    }
                    onChange={(e) =>
                      setProgramDescription(
                        e.target.value
                      )
                    }
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em]">
                    Target Beneficiaries
                  </label>

                  <textarea
                    value={
                      proposalBeneficiaries
                    }
                    onChange={(e) =>
                      setProposalBeneficiaries(
                        e.target.value
                      )
                    }
                    rows={2}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em]">
                    Expected Outcomes
                  </label>

                  <textarea
                    value={expectedOutcomes}
                    onChange={(e) =>
                      setExpectedOutcomes(
                        e.target.value
                      )
                    }
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em]">
                    Implementation Plan
                  </label>

                  <textarea
                    value={implementationPlan}
                    onChange={(e) =>
                      setImplementationPlan(
                        e.target.value
                      )
                    }
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em]">
                    Evaluation Plan
                  </label>

                  <textarea
                    value={evaluationPlan}
                    onChange={(e) =>
                      setEvaluationPlan(
                        e.target.value
                      )
                    }
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em]">
                    Budget Summary
                  </label>

                  <textarea
                    value={budgetSummary}
                    onChange={(e) =>
                      setBudgetSummary(
                        e.target.value
                      )
                    }
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>

              {error && (
                <div
                  className={`mt-5 rounded-xl border px-4 py-3 text-xs leading-5 ${
                    darkMode
                      ? "border-red-400/15 bg-red-400/[0.05] text-red-300"
                      : "border-red-200 bg-red-50 text-red-600"
                  }`}
                >
                  {error}
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={auditing}
                  className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-[0_12px_35px_rgba(34,211,238,0.12)] transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-300 hover:shadow-[0_0_35px_rgba(34,211,238,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {auditing
                    ? "Auditing proposal..."
                    : "Run AI Audit →"}
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  className={`rounded-xl border px-6 py-3 text-sm font-medium transition ${
                    darkMode
                      ? "border-white/[0.08] bg-white/[0.025] text-white/50 hover:bg-white/[0.06] hover:text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-cyan-200 hover:bg-cyan-50"
                  }`}
                >
                  Reset
                </button>
              </div>
            </section>
          </div>
        </form>

        {/* =================================================
            AUDIT RESULT
            ================================================= */}

        <section className="mt-10">
          <div className="mb-5">
            <p
              className={`text-[9px] font-bold uppercase tracking-[0.22em] ${
                darkMode
                  ? "text-cyan-300/60"
                  : "text-cyan-600"
              }`}
            >
              Audit Report
            </p>

            <h3 className="mt-1 text-2xl font-semibold">
              Verification results
            </h3>
          </div>

          {auditing && (
            <div
              className={`rounded-[28px] border p-8 ${
                darkMode
                  ? "border-white/[0.07] bg-white/[0.025]"
                  : "border-slate-200 bg-white shadow-sm"
              }`}
            >
              <div className="flex items-center gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.04]">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-400/15 border-t-cyan-400" />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    AI Audit is checking the proposal
                  </p>

                  <p
                    className={`mt-1 text-xs ${
                      darkMode
                        ? "text-white/30"
                        : "text-slate-400"
                    }`}
                  >
                    Comparing claims, metrics, and proposal
                    content against the supplied sources.
                  </p>
                </div>
              </div>
            </div>
          )}

          {!auditing && !result && (
            <div
              className={`rounded-[28px] border border-dashed p-12 text-center sm:p-16 ${
                darkMode
                  ? "border-white/[0.08] bg-white/[0.015]"
                  : "border-slate-200 bg-white/60"
              }`}
            >
              <div
                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border text-2xl ${
                  darkMode
                    ? "border-cyan-400/10 bg-cyan-400/[0.04] text-cyan-300"
                    : "border-cyan-200 bg-cyan-50 text-cyan-600"
                }`}
              >
                ◈
              </div>

              <h4 className="mt-5 text-base font-semibold">
                Ready for verification
              </h4>

              <p
                className={`mx-auto mt-2 max-w-md text-xs leading-6 ${
                  darkMode
                    ? "text-white/25"
                    : "text-slate-400"
                }`}
              >
                Run the audit to check your proposal against
                the source program and grant.
              </p>
            </div>
          )}

          {!auditing && result && (
            <div className="space-y-5">
              {/* SCORE */}

              <div
                className={`rounded-[28px] border p-6 sm:p-8 ${
                  darkMode
                    ? "border-white/[0.07] bg-white/[0.025]"
                    : "border-slate-200 bg-white shadow-sm"
                }`}
              >
                <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
                  <div
                    className={`flex flex-col items-center justify-center rounded-2xl border p-6 text-center ${
                      result.audit_status ===
                      "PASS"
                        ? darkMode
                          ? "border-emerald-400/15 bg-emerald-400/[0.04]"
                          : "border-emerald-200 bg-emerald-50"
                        : darkMode
                          ? "border-red-400/15 bg-red-400/[0.04]"
                          : "border-red-200 bg-red-50"
                    }`}
                  >
                    <span
                      className={`text-[9px] font-bold uppercase tracking-[0.2em] ${
                        result.audit_status ===
                        "PASS"
                          ? "text-emerald-500"
                          : "text-red-500"
                      }`}
                    >
                      Audit Status
                    </span>

                    <span
                      className={`mt-3 text-3xl font-black ${
                        result.audit_status ===
                        "PASS"
                          ? "text-emerald-500"
                          : "text-red-500"
                      }`}
                    >
                      {result.audit_status}
                    </span>
                  </div>

                  <div className="flex flex-col justify-center">
                    <div className="flex items-end justify-between">
                      <div>
                        <p
                          className={`text-[9px] font-bold uppercase tracking-[0.18em] ${
                            darkMode
                              ? "text-white/25"
                              : "text-slate-400"
                          }`}
                        >
                          Accuracy Score
                        </p>

                        <p className="mt-1 text-3xl font-semibold">
                          {result.accuracy_score}
                          <span
                            className={`ml-1 text-sm ${
                              darkMode
                                ? "text-white/20"
                                : "text-slate-400"
                            }`}
                          >
                            / 100
                          </span>
                        </p>
                      </div>
                    </div>

                    <div
                      className={`mt-5 h-3 overflow-hidden rounded-full ${
                        darkMode
                          ? "bg-white/[0.06]"
                          : "bg-slate-100"
                      }`}
                    >
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          result.accuracy_score >= 80
                            ? "bg-emerald-400"
                            : result.accuracy_score >=
                                60
                              ? "bg-amber-400"
                              : "bg-red-400"
                        }`}
                        style={{
                          width: `${Math.max(
                            0,
                            Math.min(
                              100,
                              result.accuracy_score
                            )
                          )}%`,
                        }}
                      />
                    </div>

                    <p
                      className={`mt-3 text-xs leading-5 ${
                        darkMode
                          ? "text-white/35"
                          : "text-slate-500"
                      }`}
                    >
                      {result.summary}
                    </p>
                  </div>
                </div>
              </div>

              {/* METRICS */}

              <div
                className={`rounded-[28px] border p-6 sm:p-8 ${
                  darkMode
                    ? "border-white/[0.07] bg-white/[0.025]"
                    : "border-slate-200 bg-white shadow-sm"
                }`}
              >
                <div className="mb-5">
                  <p
                    className={`text-[9px] font-bold uppercase tracking-[0.18em] ${
                      darkMode
                        ? "text-white/25"
                        : "text-slate-400"
                    }`}
                  >
                    Metric Verification
                  </p>

                  <h4 className="mt-1 text-lg font-semibold">
                    Evidence checks
                  </h4>
                </div>

                <div className="grid gap-3 sm:grid-cols-4">
                  <div
                    className={`rounded-2xl border p-4 ${
                      darkMode
                        ? "border-white/[0.06] bg-white/[0.02]"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <p
                      className={`text-[9px] uppercase tracking-[0.15em] ${
                        darkMode
                          ? "text-white/25"
                          : "text-slate-400"
                      }`}
                    >
                      Total Checked
                    </p>

                    <p className="mt-2 text-xl font-bold">
                      {
                        result.metrics
                          .total_checked
                      }
                    </p>
                  </div>

                  <div
                    className={`rounded-2xl border p-4 ${
                      darkMode
                        ? "border-emerald-400/10 bg-emerald-400/[0.025]"
                        : "border-emerald-200 bg-emerald-50"
                    }`}
                  >
                    <p className="text-[9px] uppercase tracking-[0.15em] text-emerald-500">
                      Verified
                    </p>

                    <p className="mt-2 text-xl font-bold text-emerald-500">
                      {
                        result.metrics
                          .verified
                      }
                    </p>
                  </div>

                  <div
                    className={`rounded-2xl border p-4 ${
                      darkMode
                        ? "border-amber-400/10 bg-amber-400/[0.025]"
                        : "border-amber-200 bg-amber-50"
                    }`}
                  >
                    <p className="text-[9px] uppercase tracking-[0.15em] text-amber-500">
                      Mismatches
                    </p>

                    <p className="mt-2 text-xl font-bold text-amber-500">
                      {
                        result.metrics
                          .mismatches
                      }
                    </p>
                  </div>

                  <div
                    className={`rounded-2xl border p-4 ${
                      darkMode
                        ? "border-red-400/10 bg-red-400/[0.025]"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <p className="text-[9px] uppercase tracking-[0.15em] text-red-500">
                      Not Found
                    </p>

                    <p className="mt-2 text-xl font-bold text-red-500">
                      {
                        result.metrics
                          .not_found
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* VERIFIED METRICS */}

              {result.verified_metrics.length >
                0 && (
                <div
                  className={`rounded-[28px] border p-6 sm:p-8 ${
                    darkMode
                      ? "border-white/[0.07] bg-white/[0.025]"
                      : "border-slate-200 bg-white shadow-sm"
                  }`}
                >
                  <h4 className="text-lg font-semibold">
                    Verified metrics
                  </h4>

                  <div className="mt-5 space-y-3">
                    {result.verified_metrics.map(
                      (metric, index) => (
                        <div
                          key={`${metric.metric}-${index}`}
                          className={`rounded-2xl border p-4 ${
                            darkMode
                              ? "border-white/[0.06] bg-white/[0.02]"
                              : "border-slate-200 bg-slate-50"
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="text-sm font-semibold">
                              {metric.metric}
                            </p>

                            <span
                              className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase ${
                                metric.status ===
                                "verified"
                                  ? "bg-emerald-400/10 text-emerald-500"
                                  : metric.status ===
                                      "mismatch"
                                    ? "bg-amber-400/10 text-amber-500"
                                    : "bg-red-400/10 text-red-500"
                              }`}
                            >
                              {metric.status}
                            </span>
                          </div>

                          <p
                            className={`mt-2 text-xs ${
                              darkMode
                                ? "text-white/35"
                                : "text-slate-500"
                            }`}
                          >
                            {metric.explanation}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* UNSUPPORTED CLAIMS */}

              <div
                className={`rounded-[28px] border p-6 sm:p-8 ${
                  result.unsupported_claims_count >
                  0
                    ? darkMode
                      ? "border-red-400/10 bg-red-400/[0.025]"
                      : "border-red-200 bg-red-50"
                    : darkMode
                      ? "border-emerald-400/10 bg-emerald-400/[0.025]"
                      : "border-emerald-200 bg-emerald-50"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p
                      className={`text-[9px] font-bold uppercase tracking-[0.18em] ${
                        result.unsupported_claims_count >
                        0
                          ? "text-red-500"
                          : "text-emerald-500"
                      }`}
                    >
                      Unsupported Claims
                    </p>

                    <h4 className="mt-1 text-lg font-semibold">
                      {
                        result.unsupported_claims_count
                      }{" "}
                      detected
                    </h4>
                  </div>

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border text-lg ${
                      result.unsupported_claims_count >
                      0
                        ? "border-red-400/15 bg-red-400/[0.06] text-red-500"
                        : "border-emerald-400/15 bg-emerald-400/[0.06] text-emerald-500"
                    }`}
                  >
                    {result.unsupported_claims_count >
                    0
                      ? "!"
                      : "✓"}
                  </div>
                </div>

                {result.unsupported_claims.length >
                  0 ? (
                  <div className="mt-5 space-y-3">
                    {result.unsupported_claims.map(
                      (claim, index) => (
                        <div
                          key={`${claim.claim}-${index}`}
                          className={`rounded-2xl border p-4 ${
                            darkMode
                              ? "border-red-400/10 bg-black/10"
                              : "border-red-200 bg-white"
                          }`}
                        >
                          <div className="flex gap-3">
                            <span className="text-xs font-bold text-red-500">
                              {String(
                                index + 1
                              ).padStart(
                                2,
                                "0"
                              )}
                            </span>

                            <div>
                              <p className="text-sm font-medium">
                                {claim.claim}
                              </p>

                              <p
                                className={`mt-1 text-xs leading-5 ${
                                  darkMode
                                    ? "text-white/30"
                                    : "text-slate-500"
                                }`}
                              >
                                {claim.reason}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p
                    className={`mt-4 text-xs leading-6 ${
                      darkMode
                        ? "text-emerald-200/45"
                        : "text-emerald-700"
                    }`}
                  >
                    No unsupported claims were detected
                    against the supplied source documents.
                  </p>
                )}
              </div>
            </div>
          )}
        </section>

        {/* =================================================
            FOOTER
            ================================================= */}

        <footer
          className={`mt-12 flex flex-col items-center justify-between gap-2 border-t py-6 text-[9px] sm:flex-row ${
            darkMode
              ? "border-white/[0.05] text-white/15"
              : "border-slate-200 text-slate-400"
          }`}
        >
          <span>
            GrantCraft AI Grant Intelligence
          </span>

          <span>
            Evidence first • Claims verified • Metrics checked
          </span>
        </footer>
      </div>
    </main>
  );
}