"use client";

import { FormEvent, useEffect, useState } from "react";
import CustomCursor from "../components/CustomCursor";

type Proposal = {
  organization_background: string;
  program_description: string;
  target_beneficiaries: string;
  expected_outcomes: string;
  implementation_plan: string;
  evaluation_plan: string;
  budget_summary: string;
};

type ProposalData = {
  proposal: Proposal;
  constraint_validation: {
    valid: boolean;
    word_count: number;
    word_limit: number;
    missing_sections: string[];
    errors: string[];
  };
  factuality_audit: string;
  factuality_audit_score: number;
factuality_audit_summary: string;
  revision_count: number;
  status: string;
};

type ApiResponse = {
  success: boolean;
  data?: ProposalData;
  message?: string;
};

const proposalSections: {
  key: keyof Proposal;
  label: string;
}[] = [
  {
    key: "organization_background",
    label: "Organization Background",
  },
  {
    key: "program_description",
    label: "Program Description",
  },
  {
    key: "target_beneficiaries",
    label: "Target Beneficiaries",
  },
  {
    key: "expected_outcomes",
    label: "Expected Outcomes",
  },
  {
    key: "implementation_plan",
    label: "Implementation Plan",
  },
  {
    key: "evaluation_plan",
    label: "Evaluation Plan",
  },
  {
    key: "budget_summary",
    label: "Budget Summary",
  },
];

export default function ProposalGeneratorPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
  } | null>(null);

  const [error, setError] = useState("");
  const [result, setResult] = useState<ProposalData | null>(null);

  // =====================================================
  // PROGRAM DATA
  // =====================================================

  const [organizationName, setOrganizationName] =
    useState("");

  const [organizationType, setOrganizationType] =
    useState("registered nonprofit");

  const [location, setLocation] = useState("");

  const [projectDescription, setProjectDescription] =
    useState("");

  const [focusAreas, setFocusAreas] = useState(
    "digital literacy, technology skills, education"
  );

  const [beneficiaries, setBeneficiaries] =
    useState("");

  const [requestedAmount, setRequestedAmount] =
    useState("50000");

  const [currency, setCurrency] = useState("USD");

  // =====================================================
  // GRANT DATA
  // =====================================================

  const [grantId, setGrantId] = useState("G003");

  const [funderName, setFunderName] = useState(
    "Youth Education Innovation Foundation"
  );

  const [grantTitle, setGrantTitle] = useState(
    "Digital Learning and Youth Innovation Grant"
  );

  const [fundingRange, setFundingRange] =
    useState("USD 20,000-120,000");

  const [grantFocusAreas, setGrantFocusAreas] =
    useState(
      "digital literacy, technology skills, youth education, innovative learning"
    );

  const [proposalFormat, setProposalFormat] =
    useState("Narrative proposal");

  const [wordLimit, setWordLimit] = useState("1500");

  const [maxRevisions, setMaxRevisions] =
    useState("2");

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
          "Proposal Generator authentication error:",
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
  // GENERATE PROPOSAL
  // =====================================================

  const handleGenerateProposal = async (
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
      setError("Please enter your organization name.");
      return;
    }

    if (!location.trim()) {
      setError("Please enter the organization location.");
      return;
    }

    if (!beneficiaries.trim()) {
      setError(
        "Please describe the target beneficiaries."
      );
      return;
    }

    if (projectDescription.trim().length < 20) {
      setError(
        "Project description must be at least 20 characters long."
      );
      return;
    }

    const amount = Number(requestedAmount);
    const limit = Number(wordLimit);
    const revisions = Number(maxRevisions);

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Please enter a valid funding amount.");
      return;
    }

    if (
      !Number.isInteger(limit) ||
      limit <= 0 ||
      limit > 10000
    ) {
      setError(
        "Word limit must be between 1 and 10000."
      );
      return;
    }

    if (
      !Number.isInteger(revisions) ||
      revisions < 0 ||
      revisions > 5
    ) {
      setError(
        "Maximum revisions must be between 0 and 5."
      );
      return;
    }

    setGenerating(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/proposals/generate",
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

              location: location.trim(),

              project_description:
                projectDescription.trim(),

              focus_areas: focusAreas
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),

              beneficiaries:
                beneficiaries.trim(),

              requested_amount: amount,

              currency:
                currency.trim().toUpperCase(),
            },

            grant: {
              grant_id: grantId.trim(),

              funder_name:
                funderName.trim(),

              grant_title:
                grantTitle.trim(),

              funding_range:
                fundingRange.trim(),

              focus_areas: grantFocusAreas
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),

              application_requirements: {
                proposal_format:
                  proposalFormat.trim(),

                maximum_word_count:
                  limit,

                required_sections:
                  proposalSections.map(
                    (section) => section.key
                  ),
              },
            },

            word_limit: limit,

            max_revisions: revisions,
          }),
        }
      );

      const data: ApiResponse =
        await response.json();

      if (
        !response.ok ||
        !data.success ||
        !data.data
      ) {
        throw new Error(
          data.message ||
            "Unable to generate the proposal."
        );
      }

      setResult(data.data);

      // Save generated proposal to history
      try {
        await saveProposalHistory(data.data);
      } catch (historyError) {
        console.error("History save error:", historyError);
        // Proposal generation succeeded even if history saving failed.
      }
    } catch (generationError) {
      console.error(
        "Proposal generation error:",
        generationError
      );

      setError(
        generationError instanceof Error
          ? generationError.message
          : "Unable to generate the proposal."
      );
    } finally {
      setGenerating(false);
    }
  };

  // =====================================================
  // SAVE PROPOSAL TO HISTORY
  // =====================================================

  const saveProposalHistory = async (
    proposalData: ProposalData
  ) => {
    const token = localStorage.getItem("grantcraft_token");

    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const proposal = proposalData.proposal;

    const response = await fetch(
      "http://localhost:5000/api/history",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          grant: {
            grantId: grantId.trim(),
            funderName: funderName.trim(),
            grantTitle: grantTitle.trim(),
            funding: {
              min: null,
              max: null,
              currency: currency.trim().toUpperCase(),
              requestedAmount: Number(requestedAmount),
              fitsRange: false,
            },
            deadline: null,
          },

          proposal: {
            organizationBackground:
              proposal.organization_background || "",
            programDescription:
              proposal.program_description || "",
            targetBeneficiaries:
              proposal.target_beneficiaries || "",
            expectedOutcomes:
              proposal.expected_outcomes || "",
            implementationPlan:
              proposal.implementation_plan || "",
            evaluationPlan:
              proposal.evaluation_plan || "",
            budgetSummary:
              proposal.budget_summary || "",
          },

          audit: {
  status: proposalData.factuality_audit
    .toLowerCase()
    .includes("pass: true")
    ? "PASS"
    : "FAIL",

  accuracyScore:
    typeof proposalData.factuality_audit_score === "number"
      ? proposalData.factuality_audit_score
      : 0,

  totalChecked: 0,
            verified: 0,
            mismatches: 0,
            notFound: 0,
            unsupportedClaimsCount: 0,
            summary: proposalData.factuality_audit || "",
          },

          revisionCount: proposalData.revision_count || 0,
          wordCount:
            proposalData.constraint_validation.word_count || 0,
          wordLimit:
            proposalData.constraint_validation.word_limit ||
            Number(wordLimit) ||
            1500,
          status:
  proposalData.status === "accepted"
    ? "accepted"
    : "audited",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Unable to save proposal history."
      );
    }

    console.log(
      "Proposal history saved successfully:",
      data.data
    );

    return data.data;
  };

  // =====================================================
  // CLEAR FORM
  // =====================================================

  const handleClear = () => {
    setOrganizationName("");
    setOrganizationType(
      "registered nonprofit"
    );
    setLocation("");
    setProjectDescription("");

    setFocusAreas(
      "digital literacy, technology skills, education"
    );

    setBeneficiaries("");
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

    setProposalFormat(
      "Narrative proposal"
    );

    setWordLimit("1500");
    setMaxRevisions("2");

    setError("");
    setResult(null);
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
            Loading Proposal Generator...
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
            Proposal Agent
          </div>

          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Build a stronger{" "}
            <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 bg-clip-text text-transparent">
              proposal.
            </span>
          </h2>

          <p
            className={`mt-3 max-w-2xl text-sm leading-6 ${
              darkMode
                ? "text-white/35"
                : "text-slate-500"
            }`}
          >
            Provide verified organization, project, and
            grant information. GrantCraft will draft,
            validate, fact-check, and revise the proposal.
          </p>
        </div>

        {/* =================================================
            INPUT FORM
            ================================================= */}

        <form
          onSubmit={handleGenerateProposal}
          className="grid gap-6 xl:grid-cols-2"
        >
          {/* PROGRAM */}

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
                Step 01
              </p>

              <h3 className="mt-1 text-xl font-semibold">
                Program context
              </h3>

              <p
                className={`mt-1 text-xs ${
                  darkMode
                    ? "text-white/25"
                    : "text-slate-400"
                }`}
              >
                Tell the agent what your organization is
                actually doing.
              </p>
            </div>

            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em]">
                    Organization Name
                  </label>

                  <input
                    value={organizationName}
                    onChange={(e) =>
                      setOrganizationName(
                        e.target.value
                      )
                    }
                    placeholder="Rural Digital Empowerment NGO"
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
                    placeholder="rural community"
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
                    placeholder="rural girls and young women"
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
                  rows={6}
                  placeholder="Describe the project, activities, goals, and the problem it addresses..."
                  className={`${inputClass} resize-none`}
                />

                <p
                  className={`mt-1.5 text-[9px] ${
                    darkMode
                      ? "text-white/20"
                      : "text-slate-400"
                  }`}
                >
                  Minimum 20 characters.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em]">
                  Focus Areas
                </label>

                <input
                  value={focusAreas}
                  onChange={(e) =>
                    setFocusAreas(e.target.value)
                  }
                  placeholder="digital literacy, education"
                  className={inputClass}
                />

                <p
                  className={`mt-1.5 text-[9px] ${
                    darkMode
                      ? "text-white/20"
                      : "text-slate-400"
                  }`}
                >
                  Separate multiple areas with commas.
                </p>
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

          {/* GRANT */}

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
                    ? "text-violet-300/60"
                    : "text-violet-600"
                }`}
              >
                Step 02
              </p>

              <h3 className="mt-1 text-xl font-semibold">
                Grant opportunity
              </h3>

              <p
                className={`mt-1 text-xs ${
                  darkMode
                    ? "text-white/25"
                    : "text-slate-400"
                }`}
              >
                Provide the funder's verified requirements.
              </p>
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
                      setGrantId(e.target.value)
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em]">
                    Proposal Format
                  </label>

                  <input
                    value={proposalFormat}
                    onChange={(e) =>
                      setProposalFormat(
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
                    setFunderName(e.target.value)
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
                    setGrantTitle(e.target.value)
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
                    setFundingRange(e.target.value)
                  }
                  placeholder="USD 20,000-120,000"
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

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em]">
                    Word Limit
                  </label>

                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={wordLimit}
                    onChange={(e) =>
                      setWordLimit(e.target.value)
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em]">
                    Max Revisions
                  </label>

                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={maxRevisions}
                    onChange={(e) =>
                      setMaxRevisions(
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              {/* AGENT PIPELINE */}

              <div
                className={`rounded-2xl border p-4 ${
                  darkMode
                    ? "border-violet-400/10 bg-violet-400/[0.035]"
                    : "border-violet-200 bg-violet-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-violet-500">
                    Proposal Agent
                  </p>

                  <span className="flex items-center gap-1.5 text-[9px] text-emerald-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                    Ready
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[
                    "Draft",
                    "Validate",
                    "Fact-check",
                  ].map((step, index) => (
                    <div
                      key={step}
                      className={`rounded-lg border px-2 py-2 text-center text-[9px] ${
                        darkMode
                          ? "border-white/[0.06] bg-white/[0.025] text-white/40"
                          : "border-violet-100 bg-white text-violet-600"
                      }`}
                    >
                      <span className="mr-1 opacity-50">
                        0{index + 1}
                      </span>
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ERROR */}

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

            {/* ACTIONS */}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={generating}
                className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-[0_12px_35px_rgba(34,211,238,0.12)] transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-300 hover:shadow-[0_0_35px_rgba(34,211,238,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {generating
                  ? "Generating proposal..."
                  : "Generate Proposal →"}
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
                Clear
              </button>
            </div>
          </section>
        </form>

        {/* =================================================
            GENERATED RESULT
            ================================================= */}

        <section className="mt-10">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p
                className={`text-[9px] font-bold uppercase tracking-[0.22em] ${
                  darkMode
                    ? "text-cyan-300/60"
                    : "text-cyan-600"
                }`}
              >
                Step 03
              </p>

              <h3 className="mt-1 text-2xl font-semibold">
                Generated proposal
              </h3>

              <p
                className={`mt-1 text-xs ${
                  darkMode
                    ? "text-white/25"
                    : "text-slate-400"
                }`}
              >
                Your AI-generated proposal will appear here.
              </p>
            </div>

            {result && (
              <div className="flex flex-wrap gap-2">
                <span
                  className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase ${
                    result.status === "accepted"
                      ? "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-500"
                      : "border-amber-400/20 bg-amber-400/[0.06] text-amber-500"
                  }`}
                >
                  {result.status}
                </span>

                <span
                  className={`rounded-full border px-3 py-1.5 text-[10px] ${
                    darkMode
                      ? "border-white/[0.07] bg-white/[0.025] text-white/40"
                      : "border-slate-200 bg-white text-slate-500"
                  }`}
                >
                  {result.constraint_validation.word_count}{" "}
                  /{" "}
                  {result.constraint_validation.word_limit}{" "}
                  words
                </span>
              </div>
            )}
          </div>

          {/* GENERATING */}

          {generating && (
            <div
              className={`rounded-[28px] border p-8 sm:p-10 ${
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
                    Proposal Agent is working
                  </p>

                  <p
                    className={`mt-1 text-xs leading-5 ${
                      darkMode
                        ? "text-white/30"
                        : "text-slate-400"
                    }`}
                  >
                    Drafting → validating → fact-checking →
                    revising if necessary.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* EMPTY */}

          {!generating && !result && (
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
                ✎
              </div>

              <h4 className="mt-5 text-base font-semibold">
                Ready to generate
              </h4>

              <p
                className={`mx-auto mt-2 max-w-md text-xs leading-6 ${
                  darkMode
                    ? "text-white/25"
                    : "text-slate-400"
                }`}
              >
                Complete the program and grant information
                above. GrantCraft will generate and audit your
                proposal using the connected AI pipeline.
              </p>
            </div>
          )}

          {/* RESULT */}

          {!generating && result && (
            <div className="space-y-5">
              {/* SUMMARY */}

              <div
                className={`rounded-[28px] border p-5 sm:p-6 ${
                  darkMode
                    ? "border-white/[0.07] bg-white/[0.025]"
                    : "border-slate-200 bg-white shadow-sm"
                }`}
              >
                <div className="grid gap-4 sm:grid-cols-3">
                  <div
                    className={`rounded-2xl border p-4 ${
                      darkMode
                        ? "border-white/[0.06] bg-white/[0.02]"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <p
                      className={`text-[8px] font-bold uppercase tracking-[0.18em] ${
                        darkMode
                          ? "text-white/20"
                          : "text-slate-400"
                      }`}
                    >
                      Constraint Validation
                    </p>

                    <p className="mt-2 text-sm font-semibold text-emerald-500">
                      {result.constraint_validation.valid
                        ? "✓ Passed"
                        : "Needs Review"}
                    </p>
                  </div>

                  <div
                    className={`rounded-2xl border p-4 ${
                      darkMode
                        ? "border-white/[0.06] bg-white/[0.02]"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <p
                      className={`text-[8px] font-bold uppercase tracking-[0.18em] ${
                        darkMode
                          ? "text-white/20"
                          : "text-slate-400"
                      }`}
                    >
                      Factuality Audit
                    </p>

                    <p className="mt-2 text-sm font-semibold text-emerald-500">
                      {result.factuality_audit
                        .toLowerCase()
                        .includes("pass: true")
                        ? "✓ Passed"
                        : "Needs Review"}
                    </p>
                  </div>

                  <div
                    className={`rounded-2xl border p-4 ${
                      darkMode
                        ? "border-white/[0.06] bg-white/[0.02]"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <p
                      className={`text-[8px] font-bold uppercase tracking-[0.18em] ${
                        darkMode
                          ? "text-white/20"
                          : "text-slate-400"
                      }`}
                    >
                      AI Revisions
                    </p>

                    <p className="mt-2 text-sm font-semibold">
                      {result.revision_count}
                    </p>
                  </div>
                </div>
              </div>

              {/* PROPOSAL SECTIONS */}

              {proposalSections.map(
                (section, index) => (
                  <article
                    key={section.key}
                    className={`rounded-[28px] border p-5 transition duration-300 hover:-translate-y-0.5 sm:p-7 ${
                      darkMode
                        ? "border-white/[0.07] bg-white/[0.025] hover:border-cyan-400/10"
                        : "border-slate-200 bg-white shadow-sm hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-xs font-bold ${
                          darkMode
                            ? "border-cyan-400/15 bg-cyan-400/[0.05] text-cyan-300"
                            : "border-cyan-200 bg-cyan-50 text-cyan-600"
                        }`}
                      >
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-[9px] font-bold uppercase tracking-[0.18em] ${
                            darkMode
                              ? "text-cyan-300/50"
                              : "text-cyan-600"
                          }`}
                        >
                          Proposal Section
                        </p>

                        <h4 className="mt-1 text-base font-semibold">
                          {section.label}
                        </h4>

                        <p
                          className={`mt-4 whitespace-pre-line text-sm leading-7 ${
                            darkMode
                              ? "text-white/55"
                              : "text-slate-600"
                          }`}
                        >
                          {result.proposal[
                            section.key
                          ]}
                        </p>
                      </div>
                    </div>
                  </article>
                )
              )}

              {/* AUDIT */}

              <div
                className={`rounded-[28px] border p-6 ${
                  darkMode
                    ? "border-amber-400/10 bg-amber-400/[0.035]"
                    : "border-amber-200 bg-amber-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-400/15 bg-amber-400/[0.06] text-sm text-amber-500">
                    ✓
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-amber-500">
                      Factuality Audit
                    </p>

                    <h4 className="mt-0.5 text-sm font-semibold">
                      AI verification result
                    </h4>
                  </div>
                </div>

                <pre
                  className={`mt-5 whitespace-pre-wrap font-sans text-xs leading-6 ${
                    darkMode
                      ? "text-white/45"
                      : "text-slate-600"
                  }`}
                >
                  {result.factuality_audit}
                </pre>
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
            Evidence first • Fact checked • Revision aware
          </span>
        </footer>
      </div>
    </main>
  );
} 