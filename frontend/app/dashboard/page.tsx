"use client";

import { useEffect, useState } from "react";
import CustomCursor from "../components/CustomCursor";

type GrantMatch = {
  grant_id: string;
  funder_name: string;
  grant_title: string;
  alignment_score: number;
  why_it_matches?: string[];
  eligibility_notes?: string;
  funding_amount?: {
    min: number;
    max: number;
    currency: string;
  };
  eligibility?: {
    organization_types?: string[];
    geographic_scope?: string[];
    requirements?: string[];
  };
  application_requirements?: {
    proposal_format?: string;
    maximum_word_count?: number;
    required_sections?: string[];
  };
  deadline?: string;
};

type GrantMatchResponse = {
  success: boolean;
  data?: {
    matches: GrantMatch[];
  };
  message?: string;
};

const pipeline = [
  {
    name: "RAG Retrieval",
    description: "Grant knowledge retrieval",
  },
  {
    name: "Grant Matcher",
    description: "Opportunity alignment",
  },
  {
    name: "Proposal Agent",
    description: "Evidence-based generation",
  },
  {
    name: "Factuality Judge",
    description: "Claim verification",
  },
];

function formatMoney(value?: number, currency = "USD") {
  if (typeof value !== "number") return "Funding range unavailable";
  return `${currency} ${value.toLocaleString("en-US")}`;
}

function formatDeadline(deadline?: string) {
  if (!deadline) return "Deadline unavailable";

  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return deadline;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DashboardPage() {
  const [active, setActive] = useState("Dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
  } | null>(null);

  // =====================================================
  // REAL GRANT MATCHING STATE
  // =====================================================

  const [matches, setMatches] = useState<GrantMatch[]>([]);
  const [matching, setMatching] = useState(false);
  const [matchError, setMatchError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const [ngoName, setNgoName] = useState("");
  const [organizationType, setOrganizationType] =
    useState("registered nonprofit");
  const [location, setLocation] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [focusAreas, setFocusAreas] = useState(
    "digital literacy, technology skills, education"
  );
  const [beneficiaries, setBeneficiaries] = useState("");
  const [fundingAmount, setFundingAmount] = useState("50000");
  const [currency, setCurrency] = useState("USD");

  // =====================================================
  // THEME
  // =====================================================

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // =====================================================
  // AUTHENTICATION
  // =====================================================

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem("grantcraft_token");

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
          localStorage.removeItem("grantcraft_token");
          localStorage.removeItem("grantcraft_user");
          window.location.href = "/login";
          return;
        }

        setUser(data.user);

        localStorage.setItem(
          "grantcraft_user",
          JSON.stringify(data.user)
        );

        setCheckingAuth(false);
      } catch (error) {
        console.error("Dashboard authentication error:", error);

        localStorage.removeItem("grantcraft_token");
        localStorage.removeItem("grantcraft_user");

        window.location.href = "/login";
      }
    };

    verifySession();
  }, []);

  // =====================================================
  // GRANT MATCHING
  // =====================================================

  const handleFindGrants = async () => {
    setMatchError("");

    if (
      !ngoName.trim() ||
      !location.trim() ||
      projectDescription.trim().length < 20 ||
      !beneficiaries.trim() ||
      !fundingAmount.trim()
    ) {
      setMatchError(
        "Please complete the organization, location, project, beneficiaries, and funding fields."
      );
      return;
    }

    const amount = Number(fundingAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setMatchError("Please enter a valid funding amount.");
      return;
    }

    const token = localStorage.getItem("grantcraft_token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    setMatching(true);
    setHasSearched(true);

    try {
      const body = {
        ngo: {
          name: ngoName.trim(),
          organization_type: organizationType.trim(),
          location: location.trim(),
        },
        project: {
          description: projectDescription.trim(),
          focus_areas: focusAreas
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          beneficiaries: beneficiaries.trim(),
        },
        funding: {
          amount,
          currency: currency.trim().toUpperCase(),
        },
      };

      const response = await fetch(
        "http://localhost:5000/api/grants/match",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      const data: GrantMatchResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Grant matching service failed."
        );
      }

      setMatches(data.data?.matches || []);
    } catch (error) {
      console.error("Grant matching error:", error);

      setMatches([]);

      setMatchError(
        error instanceof Error
          ? error.message
          : "Unable to find grant matches right now."
      );
    } finally {
      setMatching(false);
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("grantcraft_token");
    localStorage.removeItem("grantcraft_user");
    window.location.href = "/login";
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (checkingAuth) {
    return (
      <main
        className={`flex min-h-screen items-center justify-center transition-colors duration-500 ${
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
            className={`mt-5 text-sm font-medium ${
              darkMode ? "text-white/60" : "text-slate-600"
            }`}
          >
            Verifying your GrantCraft session
          </p>

          <p
            className={`mt-1 text-xs ${
              darkMode ? "text-white/25" : "text-slate-400"
            }`}
          >
            Connecting to Grant Intelligence Core...
          </p>
        </div>
      </main>
    );
  }

  const firstName = user?.name?.split(" ")[0] || "there";
  const userInitial = user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <main
      className={`min-h-screen overflow-hidden transition-colors duration-500 ${
        darkMode
          ? "bg-[#020617] text-white"
          : "bg-[#f8fafc] text-slate-950"
      }`}
    >
      <CustomCursor />

      {/* =====================================================
          AMBIENT BACKGROUND
          ===================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className={`absolute left-[-10%] top-[-15%] h-[520px] w-[520px] rounded-full blur-[150px] ${
            darkMode
              ? "bg-cyan-500/[0.08]"
              : "bg-cyan-300/[0.20]"
          }`}
        />

        <div
          className={`absolute right-[-12%] top-[15%] h-[620px] w-[620px] rounded-full blur-[170px] ${
            darkMode
              ? "bg-violet-600/[0.08]"
              : "bg-violet-300/[0.20]"
          }`}
        />

        <div
          className={`absolute bottom-[-20%] left-[30%] h-[550px] w-[550px] rounded-full blur-[160px] ${
            darkMode
              ? "bg-blue-600/[0.07]"
              : "bg-blue-300/[0.15]"
          }`}
        />

        <div
          className={`absolute inset-0 opacity-[0.025] ${
            darkMode
              ? "[background-image:linear-gradient(rgba(255,255,255,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.6)_1px,transparent_1px)]"
              : "[background-image:linear-gradient(rgba(15,23,42,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,.35)_1px,transparent_1px)]"
          } [background-size:64px_64px]`}
        />
      </div>

      <div className="relative flex min-h-screen">
        {/* =================================================
            SIDEBAR
            ================================================= */}

        <aside
          className={`hidden w-72 shrink-0 border-r p-5 backdrop-blur-2xl transition-colors duration-500 lg:flex lg:flex-col ${
            darkMode
              ? "border-white/[0.07] bg-white/[0.018]"
              : "border-slate-200/80 bg-white/70"
          }`}
        >
          <div className="mb-10 flex items-center gap-3 px-2">
            <div
              className={`relative flex h-11 w-11 items-center justify-center rounded-xl border shadow-lg ${
                darkMode
                  ? "border-cyan-400/25 bg-cyan-400/[0.07] shadow-cyan-500/10"
                  : "border-cyan-300 bg-white shadow-cyan-500/15"
              }`}
            >
              <span className="text-xl font-black text-cyan-500">
                G
              </span>
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]" />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight">
                Grant<span className="text-cyan-500">Craft</span>
              </h1>

              <p
                className={`mt-0.5 text-[9px] font-semibold uppercase tracking-[0.27em] ${
                  darkMode ? "text-white/30" : "text-slate-400"
                }`}
              >
                AI Grant Intelligence
              </p>
            </div>
          </div>

          <div
            className={`mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.25em] ${
              darkMode ? "text-white/20" : "text-slate-400"
            }`}
          >
            Workspace
          </div>

          <nav className="space-y-1.5">
            {[
              ["⌂", "Dashboard"],
              ["✦", "Grant Matches"],
              ["✎", "Proposal Generator"],
              ["◈", "AI Audit"],
              ["↑", "Documents"],
            ].map(([icon, label]) => (
              <button
                key={label}
                onClick={() => setActive(label)}
                className={`group flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-all duration-200 ${
                  active === label
                    ? darkMode
                      ? "border-cyan-400/15 bg-cyan-400/[0.07] text-cyan-200"
                      : "border-cyan-200 bg-cyan-50 text-cyan-700 shadow-sm"
                    : darkMode
                      ? "border-transparent text-white/40 hover:bg-white/[0.035] hover:text-white/80"
                      : "border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-lg text-sm ${
                    active === label
                      ? darkMode
                        ? "bg-cyan-400/10 text-cyan-300"
                        : "bg-cyan-100 text-cyan-600"
                      : darkMode
                        ? "bg-white/[0.03] text-white/35"
                        : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {icon}
                </span>

                <span>{label}</span>

                {active === label && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
                )}
              </button>
            ))}
          </nav>

          <div className="mt-auto space-y-4">
            <div
              className={`rounded-2xl border p-4 ${
                darkMode
                  ? "border-white/[0.07] bg-white/[0.025]"
                  : "border-slate-200 bg-white/80 shadow-sm"
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <span
                  className={`text-[9px] font-bold uppercase tracking-[0.2em] ${
                    darkMode ? "text-white/30" : "text-slate-400"
                  }`}
                >
                  AI ENGINE
                </span>

                <span className="flex items-center gap-1.5 text-[9px] text-emerald-500">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
                  Online
                </span>
              </div>

              <p className="text-sm font-semibold">
                GrantCraft Core
              </p>

              <p
                className={`mt-1 text-[11px] ${
                  darkMode ? "text-white/30" : "text-slate-400"
                }`}
              >
                RAG + Proposal + Judge
              </p>
            </div>

            <div
              className={`px-2 text-[10px] leading-5 ${
                darkMode ? "text-white/20" : "text-slate-400"
              }`}
            >
              Grant intelligence designed for evidence, accuracy,
              and impact.
            </div>
          </div>
        </aside>

        {/* =================================================
            MAIN CONTENT
            ================================================= */}

        <section className="min-w-0 flex-1">
          <header
            className={`sticky top-0 z-20 border-b px-5 py-4 backdrop-blur-2xl transition-colors duration-500 sm:px-8 ${
              darkMode
                ? "border-white/[0.06] bg-[#020617]/75"
                : "border-slate-200/80 bg-white/75"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 lg:hidden">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                    darkMode
                      ? "border-cyan-400/20 bg-cyan-400/5"
                      : "border-cyan-300 bg-white"
                  }`}
                >
                  <span className="font-bold text-cyan-500">
                    G
                  </span>
                </div>

                <span className="font-semibold">
                  Grant<span className="text-cyan-500">Craft</span>
                </span>
              </div>

              <div className="hidden lg:block">
                <p
                  className={`text-[9px] font-bold uppercase tracking-[0.25em] ${
                    darkMode ? "text-cyan-300/50" : "text-cyan-600"
                  }`}
                >
                  {active}
                </p>

                <p
                  className={`mt-1 text-sm ${
                    darkMode ? "text-white/35" : "text-slate-500"
                  }`}
                >
                  Your intelligent funding workspace
                </p>
              </div>

              <div className="ml-auto flex items-center gap-2 sm:gap-3">
                <div
                  className={`hidden items-center gap-2 rounded-full border px-3 py-2 text-[10px] sm:flex ${
                    darkMode
                      ? "border-white/[0.07] bg-white/[0.025] text-white/40"
                      : "border-slate-200 bg-white text-slate-500 shadow-sm"
                  }`}
                >
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  AI systems online
                </div>

                <button
                  type="button"
                  onClick={() => setDarkMode(!darkMode)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border text-lg shadow-sm transition duration-300 hover:-translate-y-0.5 ${
                    darkMode
                      ? "border-white/10 bg-white/5 text-slate-200 hover:border-cyan-400/40 hover:text-cyan-400"
                      : "border-slate-200 bg-white text-slate-700 hover:border-cyan-300 hover:text-cyan-500"
                  }`}
                  aria-label="Toggle theme"
                  title={
                    darkMode
                      ? "Switch to light mode"
                      : "Switch to dark mode"
                  }
                >
                  {darkMode ? "☀" : "☾"}
                </button>

                <div className="hidden text-right sm:block">
                  <p
                    className={`text-xs font-medium ${
                      darkMode ? "text-white/80" : "text-slate-800"
                    }`}
                  >
                    {user?.name}
                  </p>

                  <p
                    className={`text-[9px] ${
                      darkMode ? "text-white/30" : "text-slate-400"
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
                  {userInitial}
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className={`rounded-full border px-3.5 py-2 text-[10px] font-medium transition ${
                    darkMode
                      ? "border-white/[0.07] bg-white/[0.025] text-white/45 hover:border-red-400/20 hover:bg-red-400/[0.06] hover:text-red-300"
                      : "border-slate-200 bg-white text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                  }`}
                >
                  Logout
                </button>
              </div>
            </div>
          </header>

          <div className="px-5 py-7 sm:px-8 sm:py-9">
            {/* Welcome */}

            <div className="mb-7">
              <p
                className={`text-xs font-medium ${
                  darkMode ? "text-cyan-300/60" : "text-cyan-600"
                }`}
              >
                Good to see you, {firstName}.
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Your grant intelligence{" "}
                <span
                  className={
                    darkMode ? "text-white/25" : "text-slate-300"
                  }
                >
                  workspace.
                </span>
              </h2>

              <p
                className={`mt-3 max-w-2xl text-sm leading-6 ${
                  darkMode ? "text-white/35" : "text-slate-500"
                }`}
              >
                Discover aligned funding opportunities, build
                evidence-based proposals, and verify every claim
                before submission.
              </p>
            </div>

            {/* =================================================
                HERO / REAL GRANT MATCHER
                ================================================= */}

            <div
              className={`relative mb-6 overflow-hidden rounded-[28px] border p-6 backdrop-blur-2xl sm:p-8 ${
                darkMode
                  ? "border-white/[0.08] bg-gradient-to-br from-white/[0.055] to-white/[0.018] shadow-[0_25px_80px_rgba(0,0,0,0.18)]"
                  : "border-slate-200 bg-white/80 shadow-[0_25px_80px_rgba(15,23,42,0.08)]"
              }`}
            >
              <div
                className={`absolute right-[-100px] top-[-150px] h-[420px] w-[420px] rounded-full blur-[100px] ${
                  darkMode
                    ? "bg-cyan-400/[0.07]"
                    : "bg-cyan-300/[0.18]"
                }`}
              />

              <div
                className={`absolute bottom-[-160px] right-[20%] h-[300px] w-[300px] rounded-full blur-[100px] ${
                  darkMode
                    ? "bg-violet-500/[0.05]"
                    : "bg-violet-300/[0.12]"
                }`}
              />

              <div className="relative z-10">
                <div
                  className={`mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] ${
                    darkMode
                      ? "border-cyan-400/15 bg-cyan-400/[0.05] text-cyan-300"
                      : "border-cyan-300 bg-cyan-50 text-cyan-700"
                  }`}
                >
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
                  Intelligent grant workspace
                </div>

                <h3 className="max-w-3xl text-3xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
                  Turn community impact into{" "}
                  <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 bg-clip-text text-transparent">
                    funded opportunity.
                  </span>
                </h3>

                <p
                  className={`mt-5 max-w-2xl text-sm leading-6 sm:text-base ${
                    darkMode ? "text-white/40" : "text-slate-500"
                  }`}
                >
                  Describe your organization, project, beneficiaries,
                  location, and funding need. GrantCraft will search
                  the grant intelligence engine and rank the strongest
                  opportunities.
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  <div>
                    <label
                      className={`mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] ${
                        darkMode ? "text-white/35" : "text-slate-500"
                      }`}
                    >
                      Organization name
                    </label>
                    <input
                      value={ngoName}
                      onChange={(event) =>
                        setNgoName(event.target.value)
                      }
                      placeholder="Rural Digital Empowerment NGO"
                      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                        darkMode
                          ? "border-white/[0.08] bg-black/20 text-white placeholder:text-white/20 focus:border-cyan-400/40"
                          : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-cyan-300"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] ${
                        darkMode ? "text-white/35" : "text-slate-500"
                      }`}
                    >
                      Organization type
                    </label>
                    <input
                      value={organizationType}
                      onChange={(event) =>
                        setOrganizationType(event.target.value)
                      }
                      placeholder="registered nonprofit"
                      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                        darkMode
                          ? "border-white/[0.08] bg-black/20 text-white placeholder:text-white/20 focus:border-cyan-400/40"
                          : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-cyan-300"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] ${
                        darkMode ? "text-white/35" : "text-slate-500"
                      }`}
                    >
                      Location
                    </label>
                    <input
                      value={location}
                      onChange={(event) =>
                        setLocation(event.target.value)
                      }
                      placeholder="rural community"
                      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                        darkMode
                          ? "border-white/[0.08] bg-black/20 text-white placeholder:text-white/20 focus:border-cyan-400/40"
                          : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-cyan-300"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] ${
                        darkMode ? "text-white/35" : "text-slate-500"
                      }`}
                    >
                      Beneficiaries
                    </label>
                    <input
                      value={beneficiaries}
                      onChange={(event) =>
                        setBeneficiaries(event.target.value)
                      }
                      placeholder="rural girls and young women"
                      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                        darkMode
                          ? "border-white/[0.08] bg-black/20 text-white placeholder:text-white/20 focus:border-cyan-400/40"
                          : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-cyan-300"
                      }`}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label
                      className={`mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] ${
                        darkMode ? "text-white/35" : "text-slate-500"
                      }`}
                    >
                      Project description
                    </label>
                    <textarea
                      value={projectDescription}
                      onChange={(event) =>
                        setProjectDescription(event.target.value)
                      }
                      rows={4}
                      placeholder="Describe the project, its goals, community need, activities, and expected impact..."
                      className={`w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition ${
                        darkMode
                          ? "border-white/[0.08] bg-black/20 text-white placeholder:text-white/20 focus:border-cyan-400/40"
                          : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-cyan-300"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] ${
                        darkMode ? "text-white/35" : "text-slate-500"
                      }`}
                    >
                      Focus areas
                    </label>
                    <input
                      value={focusAreas}
                      onChange={(event) =>
                        setFocusAreas(event.target.value)
                      }
                      placeholder="digital literacy, education"
                      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                        darkMode
                          ? "border-white/[0.08] bg-black/20 text-white placeholder:text-white/20 focus:border-cyan-400/40"
                          : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-cyan-300"
                      }`}
                    />
                    <p
                      className={`mt-1.5 text-[9px] ${
                        darkMode ? "text-white/20" : "text-slate-400"
                      }`}
                    >
                      Separate multiple areas with commas.
                    </p>
                  </div>

                  <div className="grid grid-cols-[1fr_100px] gap-3">
                    <div>
                      <label
                        className={`mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] ${
                          darkMode
                            ? "text-white/35"
                            : "text-slate-500"
                        }`}
                      >
                        Funding amount
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={fundingAmount}
                        onChange={(event) =>
                          setFundingAmount(event.target.value)
                        }
                        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                          darkMode
                            ? "border-white/[0.08] bg-black/20 text-white focus:border-cyan-400/40"
                            : "border-slate-200 bg-white text-slate-900 focus:border-cyan-300"
                        }`}
                      />
                    </div>

                    <div>
                      <label
                        className={`mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] ${
                          darkMode
                            ? "text-white/35"
                            : "text-slate-500"
                        }`}
                      >
                        Currency
                      </label>
                      <input
                        value={currency}
                        onChange={(event) =>
                          setCurrency(event.target.value)
                        }
                        maxLength={3}
                        className={`w-full rounded-xl border px-4 py-3 text-sm uppercase outline-none transition ${
                          darkMode
                            ? "border-white/[0.08] bg-black/20 text-white focus:border-cyan-400/40"
                            : "border-slate-200 bg-white text-slate-900 focus:border-cyan-300"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {matchError && (
                  <div
                    className={`mt-5 rounded-xl border px-4 py-3 text-xs ${
                      darkMode
                        ? "border-red-400/15 bg-red-400/[0.05] text-red-300"
                        : "border-red-200 bg-red-50 text-red-600"
                    }`}
                  >
                    {matchError}
                  </div>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleFindGrants}
                    disabled={matching}
                    className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-[0_12px_35px_rgba(34,211,238,0.12)] transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-300 hover:shadow-[0_0_35px_rgba(34,211,238,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {matching
                      ? "Finding grant matches..."
                      : "Find Grant Matches →"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNgoName("");
                      setLocation("");
                      setProjectDescription("");
                      setBeneficiaries("");
                      setFocusAreas(
                        "digital literacy, technology skills, education"
                      );
                      setFundingAmount("50000");
                      setMatchError("");
                      setMatches([]);
                      setHasSearched(false);
                    }}
                    className={`rounded-xl border px-5 py-3 text-sm font-medium transition duration-300 hover:-translate-y-0.5 ${
                      darkMode
                        ? "border-white/[0.08] bg-white/[0.035] text-white/65 hover:bg-white/[0.07] hover:text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                    }`}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* =================================================
                MATCH RESULTS
                ================================================= */}

            {(matching || hasSearched) && (
              <div
                className={`mb-6 rounded-[26px] border p-5 backdrop-blur-xl sm:p-6 ${
                  darkMode
                    ? "border-white/[0.07] bg-white/[0.025]"
                    : "border-slate-200 bg-white/80 shadow-sm"
                }`}
              >
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p
                      className={`text-[9px] font-bold uppercase tracking-[0.2em] ${
                        darkMode
                          ? "text-cyan-300/50"
                          : "text-cyan-600"
                      }`}
                    >
                      Grant intelligence
                    </p>

                    <h4 className="mt-1.5 text-xl font-semibold">
                      {matching
                        ? "Analyzing your project..."
                        : "Your strongest grant matches"}
                    </h4>
                  </div>

                  {!matching && (
                    <span
                      className={`rounded-full border px-3 py-1.5 text-[10px] ${
                        darkMode
                          ? "border-white/[0.07] bg-white/[0.03] text-white/40"
                          : "border-slate-200 bg-white text-slate-500"
                      }`}
                    >
                      {matches.length} match
                      {matches.length === 1 ? "" : "es"} found
                    </span>
                  )}
                </div>

                {matching && (
                  <div className="flex items-center gap-4 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.03] p-5">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/15 border-t-cyan-400" />

                    <div>
                      <p className="text-sm font-medium">
                        GrantCraft is searching the grant database
                      </p>
                      <p
                        className={`mt-1 text-xs ${
                          darkMode
                            ? "text-white/30"
                            : "text-slate-400"
                        }`}
                      >
                        Retrieving opportunities and evaluating
                        semantic alignment, eligibility, and funding
                        fit.
                      </p>
                    </div>
                  </div>
                )}

                {!matching && matches.length === 0 && (
                  <div
                    className={`rounded-2xl border border-dashed p-8 text-center ${
                      darkMode
                        ? "border-white/[0.08] text-white/35"
                        : "border-slate-200 text-slate-400"
                    }`}
                  >
                    No matching grants were returned. Try adding
                    more detail to your project description and focus
                    areas.
                  </div>
                )}

                {!matching && matches.length > 0 && (
                  <div className="space-y-4">
                    {matches.map((grant, index) => {
                      const score = Math.max(
                        0,
                        Math.min(100, grant.alignment_score)
                      );

                      const tag =
                        score >= 80
                          ? "High Match"
                          : score >= 60
                            ? "Good Match"
                            : "Potential";

                      return (
                        <div
                          key={grant.grant_id}
                          className={`rounded-2xl border p-5 transition duration-300 hover:-translate-y-0.5 ${
                            darkMode
                              ? "border-white/[0.06] bg-black/20 hover:border-cyan-300/15 hover:bg-cyan-300/[0.025]"
                              : "border-slate-200 bg-slate-50/80 hover:border-cyan-200 hover:bg-cyan-50/40"
                          }`}
                        >
                          <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                            <div className="flex min-w-0 flex-1 gap-4">
                              <div
                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-[10px] font-bold ${
                                  darkMode
                                    ? "border-cyan-300/10 bg-cyan-300/[0.04] text-cyan-300"
                                    : "border-cyan-200 bg-cyan-50 text-cyan-600"
                                }`}
                              >
                                {grant.grant_id}
                              </div>

                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span
                                    className={`rounded-full border px-2 py-0.5 text-[8px] uppercase tracking-wider ${
                                      darkMode
                                        ? "border-white/[0.06] bg-white/[0.03] text-white/30"
                                        : "border-slate-200 bg-white text-slate-400"
                                    }`}
                                  >
                                    #{index + 1}
                                  </span>

                                  <span
                                    className={`rounded-full border px-2 py-0.5 text-[8px] uppercase tracking-wider ${
                                      score >= 80
                                        ? "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-500"
                                        : score >= 60
                                          ? "border-cyan-400/20 bg-cyan-400/[0.06] text-cyan-500"
                                          : "border-amber-400/20 bg-amber-400/[0.06] text-amber-500"
                                    }`}
                                  >
                                    {tag}
                                  </span>
                                </div>

                                <h5 className="mt-2 text-base font-semibold">
                                  {grant.grant_title}
                                </h5>

                                <p
                                  className={`mt-1 text-xs ${
                                    darkMode
                                      ? "text-white/30"
                                      : "text-slate-400"
                                  }`}
                                >
                                  {grant.funder_name}
                                </p>
                              </div>
                            </div>

                            <div className="text-left lg:min-w-[110px] lg:text-right">
                              <p className="text-3xl font-semibold text-cyan-500">
                                {score}%
                              </p>

                              <p
                                className={`text-[9px] uppercase tracking-wider ${
                                  darkMode
                                    ? "text-white/25"
                                    : "text-slate-400"
                                }`}
                              >
                                alignment
                              </p>
                            </div>
                          </div>

                          <div className="mt-5">
                            <div
                              className={`mb-1.5 flex justify-between text-[9px] ${
                                darkMode
                                  ? "text-white/20"
                                  : "text-slate-400"
                              }`}
                            >
                              <span>Alignment score</span>
                              <span>{score}%</span>
                            </div>

                            <div
                              className={`h-1.5 overflow-hidden rounded-full ${
                                darkMode
                                  ? "bg-white/[0.05]"
                                  : "bg-slate-200"
                              }`}
                            >
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-1000"
                                style={{ width: `${score}%` }}
                              />
                            </div>
                          </div>

                          {grant.why_it_matches &&
                            grant.why_it_matches.length > 0 && (
                              <div className="mt-5">
                                <p
                                  className={`text-[9px] font-bold uppercase tracking-[0.18em] ${
                                    darkMode
                                      ? "text-cyan-300/50"
                                      : "text-cyan-600"
                                  }`}
                                >
                                  Why it matches
                                </p>

                                <ul className="mt-3 space-y-2">
                                  {grant.why_it_matches.map(
                                    (reason, reasonIndex) => (
                                      <li
                                        key={`${grant.grant_id}-reason-${reasonIndex}`}
                                        className={`flex gap-2 text-xs leading-5 ${
                                          darkMode
                                            ? "text-white/50"
                                            : "text-slate-600"
                                        }`}
                                      >
                                        <span className="mt-1 text-emerald-500">
                                          ✓
                                        </span>
                                        <span>{reason}</span>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}

                          {grant.eligibility_notes && (
                            <div
                              className={`mt-5 rounded-xl border p-4 ${
                                darkMode
                                  ? "border-amber-400/10 bg-amber-400/[0.035]"
                                  : "border-amber-200 bg-amber-50"
                              }`}
                            >
                              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-amber-500">
                                Eligibility / verification
                              </p>

                              <p
                                className={`mt-2 text-xs leading-5 ${
                                  darkMode
                                    ? "text-white/40"
                                    : "text-slate-600"
                                }`}
                              >
                                {grant.eligibility_notes}
                              </p>
                            </div>
                          )}

                          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <div
                              className={`rounded-xl border p-3 ${
                                darkMode
                                  ? "border-white/[0.06] bg-white/[0.02]"
                                  : "border-slate-200 bg-white"
                              }`}
                            >
                              <p
                                className={`text-[8px] font-bold uppercase tracking-wider ${
                                  darkMode
                                    ? "text-white/20"
                                    : "text-slate-400"
                                }`}
                              >
                                Funding
                              </p>
                              <p className="mt-1 text-xs font-medium">
                                {grant.funding_amount
                                  ? `${formatMoney(
                                      grant.funding_amount.min,
                                      grant.funding_amount.currency
                                    )} – ${formatMoney(
                                      grant.funding_amount.max,
                                      grant.funding_amount.currency
                                    )}`
                                  : "Not provided"}
                              </p>
                            </div>

                            <div
                              className={`rounded-xl border p-3 ${
                                darkMode
                                  ? "border-white/[0.06] bg-white/[0.02]"
                                  : "border-slate-200 bg-white"
                              }`}
                            >
                              <p
                                className={`text-[8px] font-bold uppercase tracking-wider ${
                                  darkMode
                                    ? "text-white/20"
                                    : "text-slate-400"
                                }`}
                              >
                                Deadline
                              </p>
                              <p className="mt-1 text-xs font-medium">
                                {formatDeadline(grant.deadline)}
                              </p>
                            </div>

                            <div
                              className={`rounded-xl border p-3 ${
                                darkMode
                                  ? "border-white/[0.06] bg-white/[0.02]"
                                  : "border-slate-200 bg-white"
                              }`}
                            >
                              <p
                                className={`text-[8px] font-bold uppercase tracking-wider ${
                                  darkMode
                                    ? "text-white/20"
                                    : "text-slate-400"
                                }`}
                              >
                                Proposal format
                              </p>
                              <p className="mt-1 text-xs font-medium">
                                {grant.application_requirements
                                  ?.proposal_format || "Not provided"}
                              </p>
                            </div>

                            <div
                              className={`rounded-xl border p-3 ${
                                darkMode
                                  ? "border-white/[0.06] bg-white/[0.02]"
                                  : "border-slate-200 bg-white"
                              }`}
                            >
                              <p
                                className={`text-[8px] font-bold uppercase tracking-wider ${
                                  darkMode
                                    ? "text-white/20"
                                    : "text-slate-400"
                                }`}
                              >
                                Word limit
                              </p>
                              <p className="mt-1 text-xs font-medium">
                                {grant.application_requirements
                                  ?.maximum_word_count
                                  ? `${grant.application_requirements.maximum_word_count.toLocaleString()} words`
                                  : "Not provided"}
                              </p>
                            </div>
                          </div>

                          {grant.application_requirements
                            ?.required_sections &&
                            grant.application_requirements
                              .required_sections.length > 0 && (
                              <div className="mt-4">
                                <p
                                  className={`text-[9px] font-bold uppercase tracking-[0.18em] ${
                                    darkMode
                                      ? "text-white/25"
                                      : "text-slate-400"
                                  }`}
                                >
                                  Application sections
                                </p>

                                <div className="mt-2 flex flex-wrap gap-2">
                                  {grant.application_requirements.required_sections.map(
                                    (section) => (
                                      <span
                                        key={`${grant.grant_id}-${section}`}
                                        className={`rounded-full border px-2.5 py-1 text-[9px] ${
                                          darkMode
                                            ? "border-white/[0.07] bg-white/[0.025] text-white/35"
                                            : "border-slate-200 bg-white text-slate-500"
                                        }`}
                                      >
                                        {section}
                                      </span>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* =================================================
                STATS
                ================================================= */}

            <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                [
                  "GRANTS ANALYZED",
                  hasSearched ? String(matches.length) : "—",
                  hasSearched ? "from latest search" : "run a search",
                ],
                [
                  "STRONG MATCHES",
                  hasSearched
                    ? String(
                        matches.filter(
                          (grant) => grant.alignment_score >= 80
                        ).length
                      )
                    : "—",
                  "≥ 80% alignment",
                ],
                [
                  "PROPOSALS",
                  "—",
                  "proposal agent ready",
                ],
                [
                  "AVG. MATCH",
                  hasSearched && matches.length
                    ? `${Math.round(
                        matches.reduce(
                          (sum, grant) =>
                            sum + grant.alignment_score,
                          0
                        ) / matches.length
                      )}%`
                    : "—",
                  "latest results",
                ],
              ].map(([label, value, detail]) => (
                <div
                  key={label}
                  className={`group rounded-2xl border p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 ${
                    darkMode
                      ? "border-white/[0.07] bg-white/[0.025] hover:border-cyan-300/15 hover:bg-white/[0.04]"
                      : "border-slate-200 bg-white/80 shadow-sm hover:border-cyan-200 hover:shadow-lg hover:shadow-cyan-500/5"
                  }`}
                >
                  <p
                    className={`text-[9px] font-bold tracking-[0.2em] ${
                      darkMode
                        ? "text-white/25"
                        : "text-slate-400"
                    }`}
                  >
                    {label}
                  </p>

                  <div className="mt-4 flex items-end justify-between gap-3">
                    <p className="text-3xl font-semibold tracking-tight">
                      {value}
                    </p>

                    <span
                      className={`text-right text-[10px] ${
                        darkMode
                          ? "text-white/25"
                          : "text-slate-400"
                      }`}
                    >
                      {detail}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* =================================================
                MAIN GRID
                ================================================= */}

            <div className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
              {/* Grant Matches */}

              <div
                className={`rounded-[26px] border p-5 backdrop-blur-xl sm:p-6 ${
                  darkMode
                    ? "border-white/[0.07] bg-white/[0.025]"
                    : "border-slate-200 bg-white/80 shadow-sm"
                }`}
              >
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p
                      className={`text-[9px] font-bold uppercase tracking-[0.2em] ${
                        darkMode
                          ? "text-cyan-300/50"
                          : "text-cyan-600"
                      }`}
                    >
                      Intelligence
                    </p>

                    <h4 className="mt-1.5 text-lg font-semibold">
                      {matches.length
                        ? "Top grant matches"
                        : "Your grant results"}
                    </h4>
                  </div>

                  <span
                    className={`text-xs ${
                      darkMode
                        ? "text-white/25"
                        : "text-slate-400"
                    }`}
                  >
                    {matches.length
                      ? `${matches.length} results`
                      : "Waiting for analysis"}
                  </span>
                </div>

                {matches.length === 0 ? (
                  <div
                    className={`rounded-2xl border border-dashed p-8 text-center ${
                      darkMode
                        ? "border-white/[0.08] text-white/30"
                        : "border-slate-200 text-slate-400"
                    }`}
                  >
                    <p className="text-sm font-medium">
                      Your matched grants will appear here.
                    </p>
                    <p className="mt-2 text-xs">
                      Complete the grant matcher above to search the
                      GrantCraft intelligence engine.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {matches.slice(0, 5).map((grant) => (
                      <div
                        key={grant.grant_id}
                        className={`rounded-2xl border p-4 ${
                          darkMode
                            ? "border-white/[0.06] bg-black/20"
                            : "border-slate-200 bg-slate-50/80"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-[10px] font-bold ${
                              darkMode
                                ? "border-cyan-300/10 bg-cyan-300/[0.04] text-cyan-300"
                                : "border-cyan-200 bg-cyan-50 text-cyan-600"
                            }`}
                          >
                            {grant.grant_id}
                          </div>

                          <div className="min-w-0 flex-1">
                            <h5 className="truncate text-sm font-medium">
                              {grant.grant_title}
                            </h5>

                            <p
                              className={`mt-1 truncate text-xs ${
                                darkMode
                                  ? "text-white/30"
                                  : "text-slate-400"
                              }`}
                            >
                              {grant.funder_name}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-lg font-semibold text-cyan-500">
                              {grant.alignment_score}%
                            </p>

                            <p
                              className={`text-[9px] ${
                                darkMode
                                  ? "text-white/25"
                                  : "text-slate-400"
                              }`}
                            >
                              match
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* AI Pipeline */}

              <div
                className={`rounded-[26px] border p-5 backdrop-blur-xl sm:p-6 ${
                  darkMode
                    ? "border-white/[0.07] bg-white/[0.025]"
                    : "border-slate-200 bg-white/80 shadow-sm"
                }`}
              >
                <p
                  className={`text-[9px] font-bold uppercase tracking-[0.2em] ${
                    darkMode
                      ? "text-violet-300/50"
                      : "text-violet-600"
                  }`}
                >
                  AI pipeline
                </p>

                <h4 className="mt-1.5 text-lg font-semibold">
                  GrantCraft engine
                </h4>

                <div className="mt-6 space-y-5">
                  {pipeline.map((item) => (
                    <div key={item.name}>
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <p
                            className={`text-xs font-medium ${
                              darkMode
                                ? "text-white/65"
                                : "text-slate-700"
                            }`}
                          >
                            {item.name}
                          </p>

                          <p
                            className={`mt-0.5 text-[9px] ${
                              darkMode
                                ? "text-white/25"
                                : "text-slate-400"
                            }`}
                          >
                            {item.description}
                          </p>
                        </div>

                        <span className="text-[9px] font-medium text-emerald-500">
                          Online
                        </span>
                      </div>

                      <div
                        className={`h-1 overflow-hidden rounded-full ${
                          darkMode
                            ? "bg-white/[0.05]"
                            : "bg-slate-200"
                        }`}
                      >
                        <div
                          className="h-full w-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className={`mt-7 rounded-2xl border p-4 ${
                    darkMode
                      ? "border-emerald-400/10 bg-emerald-400/[0.035]"
                      : "border-emerald-200 bg-emerald-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />

                    <span className="text-xs font-medium text-emerald-500">
                      All systems operational
                    </span>
                  </div>

                  <p
                    className={`mt-2 text-[10px] leading-5 ${
                      darkMode ? "text-white/25" : "text-slate-500"
                    }`}
                  >
                    Your grant intelligence pipeline is ready for
                    the next analysis.
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                DOCUMENT UPLOAD
                ================================================= */}

            <div
              className={`mt-6 overflow-hidden rounded-[26px] border border-dashed p-8 text-center backdrop-blur-xl transition duration-300 ${
                darkMode
                  ? "border-white/[0.1] bg-white/[0.018] hover:border-cyan-300/20 hover:bg-cyan-300/[0.015]"
                  : "border-slate-300 bg-white/60 hover:border-cyan-300 hover:bg-cyan-50/30"
              }`}
            >
              <div
                className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border text-xl ${
                  darkMode
                    ? "border-cyan-300/10 bg-cyan-300/[0.04] text-cyan-300"
                    : "border-cyan-200 bg-cyan-50 text-cyan-600"
                }`}
              >
                ↑
              </div>

              <h4 className="mt-5 text-sm font-semibold">
                Upload NGO documents
              </h4>

              <p
                className={`mx-auto mt-2 max-w-lg text-xs leading-5 ${
                  darkMode ? "text-white/25" : "text-slate-500"
                }`}
              >
                Add program reports, grant documents, impact data,
                or other source material to power GrantCraft's
                intelligence engine.
              </p>

              <button
                type="button"
                className={`mt-5 rounded-xl border px-5 py-2.5 text-xs font-medium transition ${
                  darkMode
                    ? "border-white/[0.08] bg-white/[0.035] text-white/55 hover:border-cyan-300/15 hover:bg-white/[0.06] hover:text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                }`}
              >
                Choose documents
              </button>

              <p
                className={`mt-3 text-[9px] ${
                  darkMode ? "text-white/15" : "text-slate-400"
                }`}
              >
                PDF, DOCX, TXT supported
              </p>
            </div>

            {/* =================================================
                FOOTER
                ================================================= */}

            <div
              className={`mt-8 flex flex-col items-center justify-between gap-2 border-t pt-5 text-[9px] sm:flex-row ${
                darkMode
                  ? "border-white/[0.05] text-white/15"
                  : "border-slate-200 text-slate-400"
              }`}
            >
              <span>GrantCraft AI Grant Intelligence</span>
              <span>Secure workspace • Evidence first</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}