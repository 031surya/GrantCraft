"use client";

import { useEffect, useState } from "react";
import CustomCursor from "../components/CustomCursor";

const grants = [
  {
    id: "G001",
    title: "Community Clean Water Initiative Grant",
    funder: "Clean Water Community Fund",
    score: 94,
    amount: "$25K – $100K",
    tag: "High Match",
  },
  {
    id: "G005",
    title: "Local Climate Resilience Grant",
    funder: "Climate Resilience Community Foundation",
    score: 72,
    amount: "$30K – $125K",
    tag: "Good Match",
  },
  {
    id: "G002",
    title: "Rural Community Health Access Grant",
    funder: "Global Health Access Foundation",
    score: 51,
    amount: "$20K – $80K",
    tag: "Potential",
  },
];

const pipeline = [
  {
    name: "RAG Retrieval",
    description: "Grant knowledge retrieval",
    progress: "100%",
  },
  {
    name: "Grant Matcher",
    description: "Opportunity alignment",
    progress: "100%",
  },
  {
    name: "Proposal Agent",
    description: "Evidence-based generation",
    progress: "100%",
  },
  {
    name: "Factuality Judge",
    description: "Claim verification",
    progress: "100%",
  },
];

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
        console.error(
          "Dashboard authentication error:",
          error
        );

        localStorage.removeItem("grantcraft_token");
        localStorage.removeItem("grantcraft_user");

        window.location.href = "/login";
      }
    };

    verifySession();
  }, []);

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

  const firstName =
    user?.name?.split(" ")[0] || "there";

  const userInitial =
    user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <main
      className={`min-h-screen overflow-hidden transition-colors duration-500 ${
        darkMode
          ? "bg-[#020617] text-white"
          : "bg-[#f8fafc] text-slate-950"
      }`}
    >

      {/* =====================================================
          CUSTOM CURSOR
          ===================================================== */}

      <CustomCursor />


      {/* =====================================================
          AMBIENT BACKGROUND
          ===================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div
          className={`absolute left-[-10%] top-[-15%] h-[520px] w-[520px] rounded-full blur-[150px] transition-colors duration-500 ${
            darkMode
              ? "bg-cyan-500/[0.08]"
              : "bg-cyan-300/[0.20]"
          }`}
        />

        <div
          className={`absolute right-[-12%] top-[15%] h-[620px] w-[620px] rounded-full blur-[170px] transition-colors duration-500 ${
            darkMode
              ? "bg-violet-600/[0.08]"
              : "bg-violet-300/[0.20]"
          }`}
        />

        <div
          className={`absolute bottom-[-20%] left-[30%] h-[550px] w-[550px] rounded-full blur-[160px] transition-colors duration-500 ${
            darkMode
              ? "bg-blue-600/[0.07]"
              : "bg-blue-300/[0.15]"
          }`}
        />

        {/* Grid */}

        <div
          className={`absolute inset-0 opacity-[0.025] ${
            darkMode
              ? "[background-image:linear-gradient(rgba(255,255,255,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.6)_1px,transparent_1px)]"
              : "[background-image:linear-gradient(rgba(15,23,42,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,.35)_1px,transparent_1px)]"
          } [background-size:64px_64px]`}
        />

      </div>


      {/* =====================================================
          APP LAYOUT
          ===================================================== */}

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

          {/* Logo */}

          <div className="mb-10 flex items-center gap-3 px-2">

            <div
              className={`relative flex h-11 w-11 items-center justify-center rounded-xl border shadow-lg transition-colors duration-500 ${
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
                  darkMode
                    ? "text-white/30"
                    : "text-slate-400"
                }`}
              >
                AI Grant Intelligence
              </p>

            </div>

          </div>


          {/* Navigation */}

          <div
            className={`mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.25em] ${
              darkMode
                ? "text-white/20"
                : "text-slate-400"
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
                  className={`flex h-7 w-7 items-center justify-center rounded-lg text-sm transition ${
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


          {/* Bottom Sidebar */}

          <div className="mt-auto space-y-4">

            <div
              className={`rounded-2xl border p-4 transition-colors duration-500 ${
                darkMode
                  ? "border-white/[0.07] bg-white/[0.025]"
                  : "border-slate-200 bg-white/80 shadow-sm"
              }`}
            >

              <div className="mb-3 flex items-center justify-between">

                <span
                  className={`text-[9px] font-bold uppercase tracking-[0.2em] ${
                    darkMode
                      ? "text-white/30"
                      : "text-slate-400"
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
                  darkMode
                    ? "text-white/30"
                    : "text-slate-400"
                }`}
              >
                RAG + Proposal + Judge
              </p>

            </div>


            <div
              className={`px-2 text-[10px] leading-5 ${
                darkMode
                  ? "text-white/20"
                  : "text-slate-400"
              }`}
            >
              Grant intelligence designed for evidence,
              accuracy, and impact.
            </div>

          </div>

        </aside>


        {/* =================================================
            MAIN CONTENT
            ================================================= */}

        <section className="min-w-0 flex-1">


          {/* =================================================
              TOP HEADER
              ================================================= */}

          <header
            className={`sticky top-0 z-20 border-b px-5 py-4 backdrop-blur-2xl transition-colors duration-500 sm:px-8 ${
              darkMode
                ? "border-white/[0.06] bg-[#020617]/75"
                : "border-slate-200/80 bg-white/75"
            }`}
          >

            <div className="flex items-center justify-between">


              {/* Mobile Logo */}

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


              {/* Page title */}

              <div className="hidden lg:block">

                <p
                  className={`text-[9px] font-bold uppercase tracking-[0.25em] ${
                    darkMode
                      ? "text-cyan-300/50"
                      : "text-cyan-600"
                  }`}
                >
                  {active}
                </p>

                <p
                  className={`mt-1 text-sm ${
                    darkMode
                      ? "text-white/35"
                      : "text-slate-500"
                  }`}
                >
                  Your intelligent funding workspace
                </p>

              </div>


              {/* Right controls */}

              <div className="ml-auto flex items-center gap-2 sm:gap-3">


                {/* AI status */}

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


                {/* Theme toggle */}

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


                {/* User */}

                <div className="hidden text-right sm:block">

                  <p
                    className={`text-xs font-medium ${
                      darkMode
                        ? "text-white/80"
                        : "text-slate-800"
                    }`}
                  >
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


                {/* Avatar */}

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold ${
                    darkMode
                      ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-200"
                      : "border-cyan-200 bg-cyan-50 text-cyan-600"
                  }`}
                >
                  {userInitial}
                </div>


                {/* Logout */}

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


          {/* =================================================
              PAGE CONTENT
              ================================================= */}

          <div className="px-5 py-7 sm:px-8 sm:py-9">


            {/* Welcome */}

            <div className="mb-7">

              <p
                className={`text-xs font-medium ${
                  darkMode
                    ? "text-cyan-300/60"
                    : "text-cyan-600"
                }`}
              >
                Good to see you, {firstName}.
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">

                Your grant intelligence{" "}

                <span
                  className={
                    darkMode
                      ? "text-white/25"
                      : "text-slate-300"
                  }
                >
                  workspace.
                </span>

              </h2>

              <p
                className={`mt-3 max-w-2xl text-sm leading-6 ${
                  darkMode
                    ? "text-white/35"
                    : "text-slate-500"
                }`}
              >
                Discover aligned funding opportunities, build
                evidence-based proposals, and verify every claim
                before submission.
              </p>

            </div>


            {/* =================================================
                HERO
                ================================================= */}

            <div
              className={`relative mb-6 overflow-hidden rounded-[28px] border p-6 backdrop-blur-2xl transition-colors duration-500 sm:p-8 ${
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


              <div className="relative z-10 max-w-2xl">

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


                <h3 className="text-3xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">

                  Turn community impact into{" "}

                  <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 bg-clip-text text-transparent">
                    funded opportunity.
                  </span>

                </h3>


                <p
                  className={`mt-5 max-w-xl text-sm leading-6 sm:text-base ${
                    darkMode
                      ? "text-white/40"
                      : "text-slate-500"
                  }`}
                >
                  GrantCraft connects your organization's
                  evidence with the funding opportunities where it
                  can make the greatest impact.
                </p>


                <div className="mt-7 flex flex-wrap gap-3">

                  <button className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-[0_12px_35px_rgba(34,211,238,0.12)] transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-300 hover:shadow-[0_0_35px_rgba(34,211,238,0.22)]">
                    Find Grant Matches →
                  </button>

                  <button
                    className={`rounded-xl border px-5 py-3 text-sm font-medium transition duration-300 hover:-translate-y-0.5 ${
                      darkMode
                        ? "border-white/[0.08] bg-white/[0.035] text-white/65 hover:bg-white/[0.07] hover:text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                    }`}
                  >
                    Generate Proposal
                  </button>

                </div>

              </div>


              {/* Orb */}

              <div className="absolute right-12 top-1/2 hidden -translate-y-1/2 lg:block">

                <div className="relative h-56 w-56">

                  <div
                    className={`absolute inset-5 animate-pulse rounded-full blur-3xl ${
                      darkMode
                        ? "bg-cyan-400/[0.08]"
                        : "bg-cyan-300/[0.18]"
                    }`}
                  />

                  <div
                    className={`absolute inset-9 rounded-full border bg-gradient-to-br shadow-[inset_0_0_50px_rgba(103,232,249,0.12),0_0_70px_rgba(34,211,238,0.08)] ${
                      darkMode
                        ? "border-cyan-300/20 from-cyan-300/[0.15] via-blue-500/[0.07] to-violet-500/[0.15]"
                        : "border-cyan-300/40 from-cyan-300/30 via-blue-400/10 to-violet-300/25"
                    }`}
                  />

                  <div
                    className={`absolute inset-14 rounded-full blur-sm ${
                      darkMode
                        ? "bg-gradient-to-br from-cyan-200/20 to-blue-600/10"
                        : "bg-gradient-to-br from-cyan-200/50 to-blue-400/20"
                    }`}
                  />

                  <div
                    className={`absolute inset-0 animate-[spin_14s_linear_infinite] rounded-full border border-dashed ${
                      darkMode
                        ? "border-cyan-300/15"
                        : "border-cyan-400/30"
                    }`}
                  />

                  <div
                    className={`absolute inset-[-12px] animate-[spin_20s_linear_infinite_reverse] rounded-full border border-dotted ${
                      darkMode
                        ? "border-violet-400/10"
                        : "border-violet-400/25"
                    }`}
                  />

                  <div className="absolute left-2 top-1/2 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_18px_#22d3ee]" />

                  <div className="absolute right-5 top-8 h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_15px_#8b5cf6]" />

                </div>

              </div>

            </div>


            {/* =================================================
                STATS
                ================================================= */}

            <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              {[
                ["GRANTS ANALYZED", "24", "+8 this week"],
                ["STRONG MATCHES", "07", "≥ 80% alignment"],
                ["PROPOSALS", "03", "2 ready to review"],
                ["AVG. AUDIT", "91", "/100 accuracy"],
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

                  <div className="mt-4 flex items-end justify-between">

                    <p className="text-3xl font-semibold tracking-tight">
                      {value}
                    </p>

                    <span
                      className={`text-[10px] ${
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
                className={`rounded-[26px] border p-5 backdrop-blur-xl transition-colors duration-500 sm:p-6 ${
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
                      Top grant matches
                    </h4>

                  </div>

                  <button
                    className={`text-xs font-medium transition ${
                      darkMode
                        ? "text-cyan-300 hover:text-cyan-200"
                        : "text-cyan-600 hover:text-cyan-500"
                    }`}
                  >
                    View all →
                  </button>

                </div>


                <div className="space-y-3">

                  {grants.map((grant) => (

                    <div
                      key={grant.id}
                      className={`group rounded-2xl border p-4 transition duration-300 ${
                        darkMode
                          ? "border-white/[0.06] bg-black/20 hover:border-cyan-300/15 hover:bg-cyan-300/[0.025]"
                          : "border-slate-200 bg-slate-50/80 hover:border-cyan-200 hover:bg-cyan-50/40"
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
                          {grant.id}
                        </div>


                        <div className="min-w-0 flex-1">

                          <div className="flex flex-wrap items-center gap-2">

                            <h5 className="truncate text-sm font-medium">
                              {grant.title}
                            </h5>

                            <span
                              className={`rounded-full border px-2 py-0.5 text-[8px] uppercase tracking-wider ${
                                darkMode
                                  ? "border-white/[0.06] bg-white/[0.03] text-white/30"
                                  : "border-slate-200 bg-white text-slate-400"
                              }`}
                            >
                              {grant.tag}
                            </span>

                          </div>

                          <p
                            className={`mt-1 truncate text-xs ${
                              darkMode
                                ? "text-white/30"
                                : "text-slate-400"
                            }`}
                          >
                            {grant.funder}
                          </p>

                        </div>


                        <div className="hidden text-right sm:block">

                          <p className="text-lg font-semibold text-cyan-500">
                            {grant.score}%
                          </p>

                          <p
                            className={`text-[9px] ${
                              darkMode
                                ? "text-white/25"
                                : "text-slate-400"
                            }`}
                          >
                            {grant.amount}
                          </p>

                        </div>

                      </div>


                      {/* Match bar */}

                      <div className="mt-4">

                        <div
                          className={`mb-1.5 flex justify-between text-[9px] ${
                            darkMode
                              ? "text-white/20"
                              : "text-slate-400"
                          }`}
                        >
                          <span>Alignment</span>
                          <span>{grant.score}%</span>
                        </div>

                        <div
                          className={`h-1 overflow-hidden rounded-full ${
                            darkMode
                              ? "bg-white/[0.05]"
                              : "bg-slate-200"
                          }`}
                        >
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                            style={{
                              width: `${grant.score}%`,
                            }}
                          />
                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              </div>


              {/* AI Pipeline */}

              <div
                className={`rounded-[26px] border p-5 backdrop-blur-xl transition-colors duration-500 sm:p-6 ${
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
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                          style={{
                            width: item.progress,
                          }}
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
                      darkMode
                        ? "text-white/25"
                        : "text-slate-500"
                    }`}
                  >
                    Your grant intelligence pipeline is ready
                    for the next analysis.
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
                  darkMode
                    ? "text-white/25"
                    : "text-slate-500"
                }`}
              >
                Add program reports, grant documents, impact data,
                or other source material to power GrantCraft's
                intelligence engine.
              </p>

              <button
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
                  darkMode
                    ? "text-white/15"
                    : "text-slate-400"
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

              <span>
                GrantCraft AI Grant Intelligence
              </span>

              <span>
                Secure workspace • Evidence first
              </span>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}