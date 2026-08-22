"use client";

import { useEffect, useState } from "react";
import CustomCursor from "./components/CustomCursor";

/* =========================================================
   DATA — FEATURES
   ========================================================= */

const features = [
  {
    number: "01",
    title: "Intelligent Grant Matching",
    description:
      "Discover funding opportunities aligned with your organization's mission, programs, and impact.",
    tag: "DISCOVER",
  },
  {
    number: "02",
    title: "Evidence-Based Proposals",
    description:
      "Generate structured grant narratives grounded in your organization's verified information.",
    tag: "CREATE",
  },
  {
    number: "03",
    title: "Factuality Judge",
    description:
      "Audit proposals for unsupported claims, inaccurate metrics, and evidence gaps before submission.",
    tag: "VERIFY",
  },
];

/* =========================================================
   DATA — HOW IT WORKS
   ========================================================= */

const steps = [
  {
    number: "01",
    title: "Upload",
    description:
      "Bring your program documents, impact reports, and organizational evidence.",
  },
  {
    number: "02",
    title: "Discover",
    description:
      "GrantCraft retrieves and identifies opportunities relevant to your work.",
  },
  {
    number: "03",
    title: "Generate",
    description:
      "Build an evidence-based proposal tailored to the selected opportunity.",
  },
  {
    number: "04",
    title: "Audit",
    description:
      "Verify claims and impact metrics before your proposal reaches a funder.",
  },
];

/* =========================================================
   HOME PAGE
   ========================================================= */

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  /* =======================================================
     THEME
     ======================================================= */

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8fafc] text-slate-950 transition-colors duration-500 dark:bg-[#050816] dark:text-white">
      <CustomCursor />

      {/* =====================================================
          AMBIENT BACKGROUND
          ===================================================== */}

      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-300/20 blur-[120px] dark:bg-cyan-500/10" />

        <div className="absolute right-[-10%] top-[10%] h-[600px] w-[600px] rounded-full bg-violet-300/20 blur-[140px] dark:bg-violet-600/10" />

        <div className="absolute bottom-[-15%] left-[30%] h-[500px] w-[500px] rounded-full bg-blue-300/15 blur-[140px] dark:bg-blue-600/10" />
      </div>

{/* =====================================================
    NAVBAR
    ===================================================== */}

<nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-10">

  {/* ===================================================
      LOGO
      =================================================== */}

  <a
    href="#home"
    className="flex min-w-0 items-center gap-2.5 sm:gap-3"
  >
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/40 bg-white shadow-[0_8px_30px_rgba(34,211,238,0.15)] sm:h-11 sm:w-11 dark:bg-white/5">
      <span className="text-lg font-black text-cyan-500 sm:text-xl">
        G
      </span>
    </div>

    <div className="min-w-0">
      <div className="truncate text-base font-bold tracking-tight sm:text-lg">
        GrantCraft
      </div>

      <div className="hidden text-[9px] font-semibold uppercase tracking-[0.28em] text-slate-500 sm:block dark:text-slate-400">
        AI Grant Intelligence
      </div>
    </div>
  </a>


  {/* ===================================================
      DESKTOP NAVIGATION
      =================================================== */}

  <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex dark:text-slate-300">

    <a
      href="#home"
      className="relative transition-colors duration-300 hover:text-cyan-500"
    >
      Home
    </a>

    <a
      href="#how-it-works"
      className="relative transition-colors duration-300 hover:text-cyan-500"
    >
      How It Works
    </a>

    <a
      href="#features"
      className="relative transition-colors duration-300 hover:text-cyan-500"
    >
      Features
    </a>

    <a
      href="#team"
      className="relative transition-colors duration-300 hover:text-cyan-500"
    >
      Team
    </a>

  </div>


  {/* ===================================================
      DESKTOP ACTIONS
      =================================================== */}

  <div className="hidden items-center gap-3 md:flex">

    {/* Theme Toggle */}

    <button
      onClick={() => setDarkMode(!darkMode)}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-lg shadow-sm transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5"
      aria-label="Toggle theme"
    >
      {darkMode ? "☀" : "☾"}
    </button>

    {/* Sign In */}

    <a
      href="/login"
      className="rounded-full px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:text-cyan-500 dark:text-slate-200"
    >
      Sign In
    </a>

    {/* Get Started */}

    <a
      href="/login"
      className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-cyan-500 dark:bg-white dark:text-slate-950 dark:hover:bg-cyan-400"
    >
      Get Started
    </a>

  </div>


  {/* ===================================================
      MOBILE / TABLET ACTIONS
      =================================================== */}

  <div className="flex items-center gap-2 md:hidden">

    {/* Theme Toggle */}

    <button
      onClick={() => setDarkMode(!darkMode)}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-base shadow-sm transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5"
      aria-label="Toggle theme"
    >
      {darkMode ? "☀" : "☾"}
    </button>

  </div>

</nav>

      {/* =====================================================
          HERO SECTION
          ===================================================== */}

      <section
        id="home"
        className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-16 lg:px-10 lg:pt-24"
      >

        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">

          {/* -------------------------------------------------
              HERO COPY
              ------------------------------------------------- */}

          <div>

            {/* Badge */}

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/50 bg-cyan-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-400/5 dark:text-cyan-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-500" />

              AI-Powered Grant Intelligence
            </div>

            {/* Heading */}

            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              Turn community impact into{" "}
              <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 bg-clip-text text-transparent">
                funded opportunity.
              </span>
            </h1>

            {/* Description */}

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Discover aligned grants, generate evidence-based proposals,
              and audit every important claim before submission — all in one
              intelligent workspace.
            </p>

            {/* CTA Buttons */}

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">

              <a
                href="/login"
                className="rounded-xl bg-cyan-400 px-7 py-4 text-center text-sm font-bold text-slate-950 shadow-[0_12px_40px_rgba(34,211,238,0.25)] transition hover:-translate-y-1 hover:bg-cyan-300"
              >
                Explore Grant Matches →
              </a>

              <a
                href="#how-it-works"
                className="rounded-xl border border-slate-200 bg-white px-7 py-4 text-center text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-1 hover:border-cyan-300 dark:border-white/10 dark:bg-white/5 dark:text-white"
              >
                See How It Works
              </a>
            </div>

            {/* Technology Labels */}

            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              <span>RAG</span>
              <span>GRANT MATCHING</span>
              <span>PROPOSALS</span>
              <span>FACTUALITY JUDGE</span>
            </div>
          </div>

          {/* -------------------------------------------------
              HERO AI CORE
              ------------------------------------------------- */}

          <div className="relative flex min-h-[470px] items-center justify-center">

            {/* Outer Ring */}

            <div className="absolute h-[360px] w-[360px] rounded-full border border-cyan-300/30 dark:border-cyan-400/10" />

            {/* Middle Ring */}

            <div className="absolute h-[290px] w-[290px] rounded-full border border-blue-300/30 dark:border-blue-400/10" />

            {/* Inner Ring */}

            <div className="absolute h-[220px] w-[220px] rounded-full border border-violet-300/30 dark:border-violet-400/10" />

            {/* Rotating Ring */}

            <div className="absolute h-[310px] w-[310px] animate-[spin_18s_linear_infinite] rounded-full border border-dashed border-cyan-400/30" />

            {/* Core */}

            <div className="relative flex h-52 w-52 items-center justify-center rounded-full border border-cyan-300/50 bg-gradient-to-br from-cyan-100 via-blue-100 to-violet-100 shadow-[0_0_100px_rgba(34,211,238,0.25)] dark:from-cyan-500/30 dark:via-blue-500/20 dark:to-violet-500/30">

              <div className="absolute inset-5 rounded-full border border-white/70 bg-white/50 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/40" />

              <div className="relative text-center">

                <div className="text-5xl font-black text-cyan-600 dark:text-cyan-300">
                  G
                </div>

                <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                  Core
                </div>
              </div>
            </div>

            {/* Hero Orbit Nodes */}

            <div className="core-orbit-1 absolute right-[5%] top-[13%] rounded-full border border-cyan-300 bg-white px-4 py-2 text-[10px] font-bold tracking-[0.12em] text-cyan-600 shadow-lg shadow-cyan-500/10 dark:border-cyan-400/30 dark:bg-slate-900 dark:text-cyan-300">
              RAG
            </div>

            <div className="core-orbit-2 absolute left-[2%] top-[28%] rounded-full border border-violet-300 bg-white px-4 py-2 text-[10px] font-bold tracking-[0.12em] text-violet-600 shadow-lg shadow-violet-500/10 dark:border-violet-400/30 dark:bg-slate-900 dark:text-violet-300">
              WRITE
            </div>

            <div className="core-orbit-3 absolute bottom-[24%] left-[3%] rounded-full border border-blue-300 bg-white px-4 py-2 text-[10px] font-bold tracking-[0.12em] text-blue-600 shadow-lg shadow-blue-500/10 dark:border-blue-400/30 dark:bg-slate-900 dark:text-blue-300">
              MATCH
            </div>

            <div className="core-orbit-4 absolute bottom-[15%] right-[5%] rounded-full border border-cyan-300 bg-white px-4 py-2 text-[10px] font-bold tracking-[0.12em] text-cyan-600 shadow-lg shadow-cyan-500/10 dark:border-cyan-400/30 dark:bg-slate-900 dark:text-cyan-300">
              AUDIT
            </div>

            <div className="core-orbit-5 absolute left-[18%] top-[5%] rounded-full border border-blue-300 bg-white px-4 py-2 text-[10px] font-bold tracking-[0.12em] text-blue-600 shadow-lg shadow-blue-500/10 dark:border-blue-400/30 dark:bg-slate-900 dark:text-blue-300">
              AI
            </div>

            <div className="core-orbit-6 absolute right-[20%] top-[3%] rounded-full border border-violet-300 bg-white px-4 py-2 text-[10px] font-bold tracking-[0.12em] text-violet-600 shadow-lg shadow-violet-500/10 dark:border-violet-400/30 dark:bg-slate-900 dark:text-violet-300">
              DATA
            </div>

            <div className="core-orbit-7 absolute bottom-[7%] left-[22%] rounded-full border border-cyan-300 bg-white px-4 py-2 text-[10px] font-bold tracking-[0.12em] text-cyan-600 shadow-lg shadow-cyan-500/10 dark:border-cyan-400/30 dark:bg-slate-900 dark:text-cyan-300">
              CLAIM
            </div>

            <div className="core-orbit-8 absolute bottom-[4%] right-[22%] rounded-full border border-blue-300 bg-white px-4 py-2 text-[10px] font-bold tracking-[0.12em] text-blue-600 shadow-lg shadow-blue-500/10 dark:border-blue-400/30 dark:bg-slate-900 dark:text-blue-300">
              EVIDENCE
            </div>
          </div>
        </div>
      </section>

{/* =========================================================
    HOW IT WORKS — PIPELINE
    ========================================================= */}

<section id="how-it-works" className="py-24">
  <div className="mx-auto max-w-7xl px-6">

    {/* Section heading */}

    <div className="max-w-3xl">

      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-500">
        The GrantCraft Pipeline
      </p>

      <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl dark:text-white">
        From data to funding —
        <br />
        intelligently.
      </h2>

      <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
        One connected workflow takes your organization's evidence
        from documents to a verified proposal.
      </p>

    </div>


    {/* =====================================================
        PIPELINE CARDS
        ===================================================== */}

    <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">


      {/* =====================================================
          01 — UPLOAD
          ===================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.03]">

        <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-200 bg-cyan-50 text-cyan-500 dark:border-cyan-400/20 dark:bg-cyan-400/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M20 4h-8.59L10 2.59C9.62 2.21 9.12 2 8.59 2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 14H4V6h16z" />
            <path d="M11 12v4h2v-4h3l-4-4-4 4z" />
          </svg>
        </div>

        <h3 className="text-2xl font-bold text-slate-950 dark:text-white">
          Upload
        </h3>

        <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
          Bring your program documents, impact reports,
          and organizational evidence.
        </p>

        <div className="mt-8 h-px bg-cyan-100 dark:bg-cyan-400/20" />

      </div>


      {/* =====================================================
          02 — DISCOVER
          ===================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.03]">

        <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-500 dark:border-blue-400/20 dark:bg-blue-400/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="m21 19.59-5.4-5.4A7.92 7.92 0 0 0 17 9a8 8 0 1 0-8 8 7.92 7.92 0 0 0 5.19-1.4l5.4 5.4zM4 9a5 5 0 1 1 10 0A5 5 0 0 1 4 9" />
          </svg>
        </div>

        <h3 className="text-2xl font-bold text-slate-950 dark:text-white">
          Discover
        </h3>

        <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
          GrantCraft retrieves and identifies opportunities
          relevant to your work.
        </p>

        <div className="mt-8 h-px bg-blue-100 dark:bg-blue-400/20" />

      </div>


      {/* =====================================================
          03 — GENERATE
          ===================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.03]">

        <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-xl border border-violet-200 bg-violet-50 text-violet-500 dark:border-violet-400/20 dark:bg-violet-400/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="m19 2-1.5 4.5L13 8l4.5 1.5L19 14l1.5-4.5L25 8l-4.5-1.5zM9 7 7.5 11.5 3 13l4.5 1.5L9 19l1.5-4.5L15 13l-4.5-1.5zM17 15l-1 3-3 1 3 1 1 3 1-3 3-1-3-1z" />
          </svg>
        </div>

        <h3 className="text-2xl font-bold text-slate-950 dark:text-white">
          Generate
        </h3>

        <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
          Build an evidence-based proposal tailored to
          the selected opportunity.
        </p>

        <div className="mt-8 h-px bg-violet-100 dark:bg-violet-400/20" />

      </div>


      {/* =====================================================
          04 — AUDIT
          ===================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.03]">

        <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-200 bg-cyan-50 text-cyan-500 dark:border-cyan-400/20 dark:bg-cyan-400/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 2 4 5v6c0 5.25 3.4 10.17 8 11 4.6-.83 8-5.75 8-11V5zm0 17.87C8.78 19.04 6 15.18 6 11V6.38l6-2.25 6 2.25V11c0 4.18-2.78 8.04-6 8.87M10.59 14.59 8 12l-1.41 1.41 4 4 6-6L15.17 10z" />
          </svg>
        </div>

        <h3 className="text-2xl font-bold text-slate-950 dark:text-white">
          Audit
        </h3>

        <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
          Verify claims and impact metrics before your
          proposal reaches a funder.
        </p>

        <div className="mt-8 h-px bg-cyan-100 dark:bg-cyan-400/20" />

      </div>

    </div>
  </div>
</section>

      {/* =====================================================
    FEATURES
    ===================================================== */}

<section
  id="features"
  className="relative z-10 px-6 py-24 lg:px-10"
>
  <div className="mx-auto max-w-7xl">

    {/* =================================================
        HEADER
        ================================================= */}

    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

      <div>

        <div className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-500">
          Intelligence Layer
        </div>

        <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
          Everything your grant workflow needs.
        </h2>

      </div>

      <p className="max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
        Built around retrieval, generation, and verification — not just
        another AI chat window.
      </p>

    </div>


    {/* =================================================
        FEATURE CARDS
        ================================================= */}

    <div className="mt-14 grid gap-6 lg:grid-cols-3">

      {features.map((feature) => (

        <div
          key={feature.number}
          className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10 dark:border-white/10 dark:bg-white/[0.03]"
        >

          {/* Decorative glow */}

          <div className="absolute right-[-60px] top-[-60px] h-40 w-40 rounded-full bg-cyan-300/10 blur-3xl transition group-hover:bg-cyan-300/20" />


          {/* =================================================
              ICON + TAG
              ================================================= */}

          <div className="flex items-center justify-between">

            {/* Intelligent Grant Matching */}

            {feature.title === "Intelligent Grant Matching" && (
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-200 bg-cyan-50 text-cyan-500 transition duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-cyan-500/20 dark:border-cyan-400/20 dark:bg-cyan-400/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 2 4 5v6c0 4.7 3 8.9 8 11 5-2.1 8-6.3 8-11V5zm0 2.2 5.8 2.2V11c0 3.5-2.1 6.8-5.8 8.8C8.3 17.8 6.2 14.5 6.2 11V6.4z" />
                  <path d="M10.5 13.8 8.2 11.5l-1.4 1.4 3.7 3.7 6.7-6.7-1.4-1.4z" />
                </svg>
              </div>
            )}


            {/* Evidence-Based Proposals */}

            {feature.title === "Evidence-Based Proposals" && (
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-200 bg-violet-50 text-violet-500 transition duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-violet-500/20 dark:border-violet-400/20 dark:bg-violet-400/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8zm1 7V4.5L18.5 9zM8 13h8v2H8zm0 4h6v2H8z" />
                  <path d="m18 12 .8 2.2L21 15l-2.2.8L18 18l-.8-2.2L15 15l2.2-.8z" />
                </svg>
              </div>
            )}


            {/* Factuality Judge */}

            {feature.title === "Factuality Judge" && (
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-500 transition duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/20 dark:border-blue-400/20 dark:bg-blue-400/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 2 4 5v6c0 5.25 3.4 10.17 8 11 4.6-.83 8-5.75 8-11V5zm0 17.87C8.78 19.04 6 15.18 6 11V6.38l6-2.25 6 2.25V11c0 4.18-2.78 8.04-6 8.87" />
                  <path d="m10.59 14.59-2.3-2.3-1.41 1.42 3.71 3.7 6.71-6.7-1.41-1.42z" />
                </svg>
              </div>
            )}


            {/* Feature Tag */}

            <span className="rounded-full border border-slate-200 px-3 py-1 text-[9px] font-bold tracking-[0.2em] text-slate-400 dark:border-white/10">
              {feature.tag}
            </span>

          </div>


          {/* =================================================
              FEATURE CONTENT
              ================================================= */}

          <h3 className="mt-16 text-2xl font-bold">
            {feature.title}
          </h3>

          <p className="mt-4 leading-7 text-slate-500 dark:text-slate-400">
            {feature.description}
          </p>


          {/* =================================================
              FEATURE ACTION
              ================================================= */}

          <div className="mt-10 text-sm font-bold text-cyan-500 transition duration-300 group-hover:translate-x-1">
            Explore capability →
          </div>

        </div>

      ))}

    </div>

  </div>
</section>

      {/* =====================================================
          INTELLIGENCE VISUAL — G CORE
          ===================================================== */}

      <section
        className="relative z-10 px-6 py-20 lg:px-10"
      >

        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 px-8 py-20 text-white shadow-2xl dark:border-white/10 lg:px-16">

          <div className="grid items-center gap-14 lg:grid-cols-2">

            {/* -------------------------------------------------
                INTELLIGENCE CORE COPY
                ------------------------------------------------- */}

            <div>

              <div className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
                Grant Intelligence Core
              </div>

              <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
                Your grant intelligence,
                <span className="text-cyan-400">
                  {" "}connected.
                </span>
              </h2>

              <p className="mt-6 max-w-xl leading-7 text-slate-400">
                GrantCraft connects your documents, grant opportunities,
                proposal generation, and factuality auditing into one
                intelligent pipeline.
              </p>

              <a
                href="/login"
                className="mt-8 inline-flex rounded-xl bg-cyan-400 px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
              >
                Enter GrantCraft →
              </a>
            </div>

            {/* -------------------------------------------------
                G CORE VISUAL
                ------------------------------------------------- */}

            <div className="grant-intelligence-core relative flex h-[330px] items-center justify-center">

              {/* Outer Intelligence Ring */}

              <div className="grant-core-ring grant-core-ring-outer absolute h-72 w-72 rounded-full border border-cyan-400/20" />

              {/* Middle Ring */}

              <div className="grant-core-ring grant-core-ring-middle absolute h-52 w-52 rounded-full border border-blue-400/20" />

              {/* Inner Ring */}

              <div className="grant-core-ring grant-core-ring-inner absolute h-36 w-36 rounded-full border border-violet-400/20" />

              {/* Rotating Dashed Ring */}

              <div className="grant-core-dashed absolute h-64 w-64 rounded-full border border-dashed border-cyan-400/25" />

              {/* Ambient Glow */}

              <div className="grant-core-glow absolute h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />

              {/* -------------------------------------------------
                  G CORE CENTER
                  ------------------------------------------------- */}

              <div className="grant-core-center relative flex h-28 w-28 items-center justify-center rounded-full border border-cyan-400/50 bg-slate-900 shadow-[0_0_80px_rgba(34,211,238,0.3)]">

                <div className="absolute inset-2 rounded-full border border-cyan-300/10" />

                <div className="relative text-center">

                  <div className="text-4xl font-black text-cyan-300">
                    G
                  </div>

                  <div className="mt-1 text-[7px] font-bold uppercase tracking-[0.35em] text-slate-500">
                    CORE
                  </div>

                </div>
              </div>

              {/* -------------------------------------------------
                  INTELLIGENCE LABEL — DOCUMENTS
                  ------------------------------------------------- */}

              <span className="grant-core-label grant-core-documents absolute left-[5%] top-[20%] text-xs font-bold tracking-[0.12em] text-cyan-300">
                DOCUMENTS
              </span>

              {/* -------------------------------------------------
                  INTELLIGENCE LABEL — GRANTS
                  ------------------------------------------------- */}

              <span className="grant-core-label grant-core-grants absolute right-[2%] top-[30%] text-xs font-bold tracking-[0.12em] text-blue-300">
                GRANTS
              </span>

              {/* -------------------------------------------------
                  INTELLIGENCE LABEL — PROPOSALS
                  ------------------------------------------------- */}

              <span className="grant-core-label grant-core-proposals absolute bottom-[20%] left-[8%] text-xs font-bold tracking-[0.12em] text-violet-300">
                PROPOSALS
              </span>

              {/* -------------------------------------------------
                  INTELLIGENCE LABEL — JUDGE
                  ------------------------------------------------- */}

              <span className="grant-core-label grant-core-judge absolute bottom-[15%] right-[8%] text-xs font-bold tracking-[0.12em] text-cyan-300">
                JUDGE
              </span>

            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          TEAM
          ===================================================== */}

            {/* =====================================================
          TEAM SECTION
          ===================================================== */}

            {/* =====================================================
          TEAM SECTION
          ===================================================== */}

      <section
        id="team"
        className="relative z-10 px-6 py-24 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">

          {/* -------------------------------------------------
              TEAM HEADER
              ------------------------------------------------- */}

          <div className="mx-auto max-w-3xl text-center">

            <div className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-500">
              The People Behind GrantCraft
            </div>

            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Built by people who believe
              <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 bg-clip-text text-transparent">
                {" "}technology should matter.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400">
              A multidisciplinary team bringing together AI, engineering,
              product thinking, and quality to build GrantCraft.
            </p>
          </div>

          {/* -------------------------------------------------
              TEAM CARDS

              FINAL ORDER:
              01 Bangaram
              02 Lavanya
              03 Surya
              04 Srijai
              ------------------------------------------------- */}

          <div className="mx-auto mt-16 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {/* =================================================
                VENNAPU BANGARAM
                ================================================= */}

            <div className="team-profile-card group relative min-h-[430px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-cyan-300 hover:shadow-2xl hover:shadow-cyan-500/10 dark:border-white/10 dark:bg-white/[0.03]">

              {/* Normal Profile */}

              <div className="team-profile-main flex h-full flex-col items-center p-7">

                <span className="self-end text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Team Member
                </span>

                {/* Profile Image */}

                <div className="mt-8 h-28 w-28 overflow-hidden rounded-full border-2 border-cyan-300 bg-slate-100 p-1 shadow-[0_0_35px_rgba(34,211,238,0.15)] dark:border-cyan-400/30 dark:bg-slate-900">
                  <img
                    src="/23221a6155.jpeg"
                    alt="Vennapu Bangaram"
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>

                {/* Name */}

                <h3 className="mt-6 text-center text-xl font-bold">
                  Vennapu Bangaram
                </h3>

                {/* Role */}

                <p className="mt-2 text-center text-xs font-semibold text-cyan-500">
                  Tester · Quality Assurance
                </p>

                {/* Roll Number */}

                <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 px-5 py-2 text-[10px] font-bold tracking-[0.12em] text-slate-400 dark:border-white/5 dark:bg-white/[0.03]">
                  23221A6155
                </div>

                {/* Hover Hint */}

                <div className="mt-auto pt-8 text-[10px] font-medium text-slate-400 transition-colors group-hover:text-cyan-500">
                  View profile details →
                </div>
              </div>

              {/* Hover Information */}

              <div className="team-profile-info absolute inset-0 flex flex-col bg-white/95 p-7 backdrop-blur-xl dark:bg-slate-950/95">

                <div className="flex items-center justify-between">

                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-cyan-500">
                    Team Member
                  </span>

                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-300/50 text-cyan-500">
                    ↗
                  </span>
                </div>

                <h3 className="mt-7 text-2xl font-black">
                  Vennapu Bangaram
                </h3>

                <p className="mt-2 text-xs font-semibold text-cyan-500">
                  Tester · Quality Assurance
                </p>

                <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Focused on testing GrantCraft workflows and helping ensure
                  a reliable user experience.
                </p>

                <div className="mt-6 space-y-3 border-t border-slate-200 pt-5 dark:border-white/10">

                  <div className="flex justify-between text-[10px]">
                    <span className="font-bold uppercase tracking-[0.15em] text-slate-400">
                      Project
                    </span>
                    <span className="font-semibold">
                      GrantCraft
                    </span>
                  </div>

                  <div className="flex justify-between text-[10px]">
                    <span className="font-bold uppercase tracking-[0.15em] text-slate-400">
                      Status
                    </span>
                    <span className="font-semibold text-emerald-500">
                      Active
                    </span>
                  </div>

                </div>

                <div className="mt-auto">

                  <div className="mb-3 text-[9px] font-black uppercase tracking-[0.2em] text-cyan-500">
                    Contact Details
                  </div>

                  <a
                    href="mailto:bngmvennapu@gmail.com"
                    className="mb-2 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs transition hover:border-cyan-300 dark:border-white/10 dark:bg-white/[0.03]"
                  >
                    <span className="truncate">
                      bngmvennapu@gmail.com
                    </span>
                    <span className="ml-2 text-cyan-500">
                      ↗
                    </span>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/vennapu-bangaram-5a2911292/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs transition hover:border-cyan-300 dark:border-white/10 dark:bg-white/[0.03]"
                  >
                    <span>
                      LinkedIn
                    </span>
                    <span className="text-cyan-500">
                      ↗
                    </span>
                  </a>

                </div>
              </div>
            </div>

            {/* =================================================
                LAVANYA SAPARAPU
                ================================================= */}

            <div className="team-profile-card group relative min-h-[430px] overflow-hidden rounded-3xl border border-cyan-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-cyan-300 hover:shadow-2xl hover:shadow-cyan-500/10 dark:border-cyan-400/20 dark:bg-white/[0.03]">

              {/* Normal Profile */}

              <div className="team-profile-main flex h-full flex-col items-center p-7">

                <span className="self-end rounded-full border border-cyan-300/50 bg-cyan-50 px-3 py-1 text-[8px] font-black uppercase tracking-[0.15em] text-cyan-600 dark:border-cyan-400/20 dark:bg-cyan-400/5 dark:text-cyan-300">
                  Team Lead
                </span>

                {/* Profile Image */}

                <div className="mt-8 h-28 w-28 overflow-hidden rounded-full border-2 border-cyan-300 bg-slate-100 p-1 shadow-[0_0_40px_rgba(34,211,238,0.2)] dark:border-cyan-400/30 dark:bg-slate-900">
                  <img
                    src="/lavanya1.png"
                    alt="Lavanya Saparapu"
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>

                {/* Name */}

                <h3 className="mt-6 text-center text-xl font-bold">
                  Lavanya Saparapu
                </h3>

                {/* Role */}

                <p className="mt-2 text-center text-xs font-semibold leading-5 text-cyan-500">
                  Python Specialist · RAG Engineer
                </p>

                {/* Roll Number */}

                <div className="mt-5 rounded-xl border border-cyan-100 bg-cyan-50/50 px-5 py-2 text-[10px] font-bold tracking-[0.12em] text-cyan-600 dark:border-cyan-400/10 dark:bg-cyan-400/5 dark:text-cyan-300">
                  23221A6145
                </div>

                <div className="mt-auto pt-8 text-[10px] font-medium text-slate-400 transition-colors group-hover:text-cyan-500">
                  View profile details →
                </div>
              </div>

              {/* Hover Information */}

              <div className="team-profile-info absolute inset-0 flex flex-col bg-white/95 p-7 backdrop-blur-xl dark:bg-slate-950/95">

                <div className="flex items-center justify-between">

                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-cyan-500">
                    Team Lead
                  </span>

                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-300/50 text-cyan-500">
                    ↗
                  </span>
                </div>

                <h3 className="mt-7 text-2xl font-black">
                  Lavanya Saparapu
                </h3>

                <p className="mt-2 text-xs font-semibold text-cyan-500">
                  Python Specialist · RAG Engineer
                </p>

                <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Leads the AI development direction with strong Python
                  expertise and responsibility across the RAG pipeline.
                </p>

                <div className="mt-6 space-y-3 border-t border-slate-200 pt-5 dark:border-white/10">

                  <div className="flex justify-between text-[10px]">
                    <span className="font-bold uppercase tracking-[0.15em] text-slate-400">
                      Project
                    </span>
                    <span className="font-semibold">
                      GrantCraft
                    </span>
                  </div>

                  <div className="flex justify-between text-[10px]">
                    <span className="font-bold uppercase tracking-[0.15em] text-slate-400">
                      Status
                    </span>
                    <span className="font-semibold text-emerald-500">
                      Active
                    </span>
                  </div>

                </div>

                <div className="mt-auto">

                  <div className="mb-3 text-[9px] font-black uppercase tracking-[0.2em] text-cyan-500">
                    Contact Details
                  </div>

                  <a
                    href="mailto:saparapulavanya813@gmail.com"
                    className="mb-2 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs transition hover:border-cyan-300 dark:border-white/10 dark:bg-white/[0.03]"
                  >
                    <span className="truncate">
                      saparapulavanya813@gmail.com
                    </span>
                    <span className="ml-2 text-cyan-500">
                      ↗
                    </span>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/saparapu-lavanya-2843182aa/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs transition hover:border-cyan-300 dark:border-white/10 dark:bg-white/[0.03]"
                  >
                    <span>
                      LinkedIn
                    </span>
                    <span className="text-cyan-500">
                      ↗
                    </span>
                  </a>

                </div>
              </div>
            </div>

            {/* =================================================
                SURYA BANDARU
                ================================================= */}

            <div className="team-profile-card group relative min-h-[430px] overflow-hidden rounded-3xl border border-violet-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-violet-300 hover:shadow-2xl hover:shadow-violet-500/10 dark:border-violet-400/20 dark:bg-white/[0.03]">

              {/* Normal Profile */}

              <div className="team-profile-main flex h-full flex-col items-center p-7">

                <span className="self-end text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Team Member
                </span>

                {/* Profile Image */}

                <div className="mt-8 h-28 w-28 overflow-hidden rounded-full border-2 border-violet-300 bg-slate-100 p-1 shadow-[0_0_35px_rgba(139,92,246,0.15)] dark:border-violet-400/30 dark:bg-slate-900">
                  <img
                    src="/surya1.jpg"
                    alt="Surya Bandaru"
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>

                {/* Name */}

                <h3 className="mt-6 text-center text-xl font-bold">
                  Surya Bandaru
                </h3>

                {/* Role */}

                <p className="mt-2 text-center text-xs font-semibold text-violet-500">
                  MERN Stack Developer
                </p>

                {/* Roll Number */}

                <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 px-5 py-2 text-[10px] font-bold tracking-[0.12em] text-slate-400 dark:border-white/5 dark:bg-white/[0.03]">
                  24225A6101
                </div>

                <div className="mt-auto pt-8 text-[10px] font-medium text-slate-400 transition-colors group-hover:text-violet-500">
                  View profile details →
                </div>
              </div>

              {/* Hover Information */}

              <div className="team-profile-info absolute inset-0 flex flex-col bg-white/95 p-7 backdrop-blur-xl dark:bg-slate-950/95">

                <div className="flex items-center justify-between">

                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-violet-500">
                    Team Member
                  </span>

                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-violet-300/50 text-violet-500">
                    ↗
                  </span>
                </div>

                <h3 className="mt-7 text-2xl font-black">
                  Surya Bandaru
                </h3>

                <p className="mt-2 text-xs font-semibold text-violet-500">
                  MERN Stack Developer
                </p>

                <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Responsible for the GrantCraft frontend experience and
                  full-stack application development.
                </p>

                <div className="mt-6 space-y-3 border-t border-slate-200 pt-5 dark:border-white/10">

                  <div className="flex justify-between text-[10px]">
                    <span className="font-bold uppercase tracking-[0.15em] text-slate-400">
                      Project
                    </span>
                    <span className="font-semibold">
                      GrantCraft
                    </span>
                  </div>

                  <div className="flex justify-between text-[10px]">
                    <span className="font-bold uppercase tracking-[0.15em] text-slate-400">
                      Status
                    </span>
                    <span className="font-semibold text-emerald-500">
                      Active
                    </span>
                  </div>

                </div>

                <div className="mt-auto">

                  <div className="mb-3 text-[9px] font-black uppercase tracking-[0.2em] text-violet-500">
                    Contact Details
                  </div>

                  <a
                    href="mailto:surya.bandaru05@gmail.com"
                    className="mb-2 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs transition hover:border-violet-300 dark:border-white/10 dark:bg-white/[0.03]"
                  >
                    <span className="truncate">
                      surya.bandaru05@gmail.com
                    </span>
                    <span className="ml-2 text-violet-500">
                      ↗
                    </span>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/suryabandaru05/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs transition hover:border-violet-300 dark:border-white/10 dark:bg-white/[0.03]"
                  >
                    <span>
                      LinkedIn
                    </span>
                    <span className="text-violet-500">
                      ↗
                    </span>
                  </a>

                </div>
              </div>
            </div>

            {/* =================================================
                SRIJAI GUBBALA
                ================================================= */}

            <div className="team-profile-card group relative min-h-[430px] overflow-hidden rounded-3xl border border-blue-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-500/10 dark:border-blue-400/20 dark:bg-white/[0.03]">

              {/* Normal Profile */}

              <div className="team-profile-main flex h-full flex-col items-center p-7">

                <span className="self-end text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Team Member
                </span>

                {/* Profile Image */}

                <div className="mt-8 h-28 w-28 overflow-hidden rounded-full border-2 border-blue-300 bg-slate-100 p-1 shadow-[0_0_35px_rgba(59,130,246,0.15)] dark:border-blue-400/30 dark:bg-slate-900">
                  <img
                    src="/srijai1.jpeg"
                    alt="Srijai Gubbala"
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>

                {/* Name */}

                <h3 className="mt-6 text-center text-xl font-bold">
                  Srijai Gubbala
                </h3>

                {/* Role */}

                <p className="mt-2 text-center text-xs font-semibold leading-5 text-blue-500">
                  Python Developer · RAG Engineer · AI Integration
                </p>

                {/* Roll Number */}

                <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 px-5 py-2 text-[10px] font-bold tracking-[0.12em] text-slate-400 dark:border-white/5 dark:bg-white/[0.03]">
                  23221A6118
                </div>

                <div className="mt-auto pt-8 text-[10px] font-medium text-slate-400 transition-colors group-hover:text-blue-500">
                  View profile details →
                </div>
              </div>

              {/* Hover Information */}

              <div className="team-profile-info absolute inset-0 flex flex-col bg-white/95 p-7 backdrop-blur-xl dark:bg-slate-950/95">

                <div className="flex items-center justify-between">

                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-500">
                    Team Member
                  </span>

                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-300/50 text-blue-500">
                    ↗
                  </span>
                </div>

                <h3 className="mt-7 text-2xl font-black">
                  Srijai Gubbala
                </h3>

                <p className="mt-2 text-xs font-semibold leading-5 text-blue-500">
                  Python Developer ·  AI Integration
                </p>

                <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Contributes to Python development, and
                  AI integration across the GrantCraft pipeline.
                </p>

                <div className="mt-6 space-y-3 border-t border-slate-200 pt-5 dark:border-white/10">

                  <div className="flex justify-between text-[10px]">
                    <span className="font-bold uppercase tracking-[0.15em] text-slate-400">
                      Project
                    </span>
                    <span className="font-semibold">
                      GrantCraft
                    </span>
                  </div>

                  <div className="flex justify-between text-[10px]">
                    <span className="font-bold uppercase tracking-[0.15em] text-slate-400">
                      Status
                    </span>
                    <span className="font-semibold text-emerald-500">
                      Active
                    </span>
                  </div>

                </div>

                <div className="mt-auto">

                  <div className="mb-3 text-[9px] font-black uppercase tracking-[0.2em] text-blue-500">
                    Contact Details
                  </div>

                  <a
                    href="mailto:srijaipersonal0001@gmail.com"
                    className="mb-2 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs transition hover:border-blue-300 dark:border-white/10 dark:bg-white/[0.03]"
                  >
                    <span className="truncate">
                      srijaipersonal0001@gmail.com
                    </span>
                    <span className="ml-2 text-blue-500">
                      ↗
                    </span>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/srijai-gubbala-41320a350/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs transition hover:border-blue-300 dark:border-white/10 dark:bg-white/[0.03]"
                  >
                    <span>
                      LinkedIn
                    </span>
                    <span className="text-blue-500">
                      ↗
                    </span>
                  </a>

                </div>
              </div>
            </div>

          </div>

          {/* -------------------------------------------------
              TEAM FOOTNOTE
              ------------------------------------------------- */}

          <div className="group mt-10 flex justify-center">
            <span className="text-xs font-medium tracking-wide text-slate-400 transition-all duration-300 group-hover:text-cyan-500 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.35)]">
              Meet the team behind{" "}
              <span className="font-semibold text-slate-500 transition-colors duration-300 group-hover:text-cyan-400 dark:text-slate-300">
                GrantCraft.
              </span>
            </span>
          </div>

        </div>
      </section>

      {/* =====================================================
          FINAL CALL TO ACTION
          ===================================================== */}

      <section className="relative z-10 px-6 pb-24 pt-8 lg:px-10">

        <div className="mx-auto max-w-5xl rounded-[2rem] border border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-violet-50 px-8 py-20 text-center shadow-xl shadow-cyan-500/5 dark:border-cyan-400/10 dark:from-cyan-500/5 dark:via-white/[0.02] dark:to-violet-500/5">

          <div className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-400">
            Start Your Funding Journey
          </div>

          <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
            Your next grant could start here.
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-slate-500 dark:text-slate-400">
            Turn your organization's work into a stronger, evidence-backed
            funding opportunity.
          </p>

          <a
            href="/login"
            className="mt-9 inline-flex rounded-xl bg-slate-950 px-8 py-4 text-sm font-bold text-white shadow-xl transition hover:-translate-y-1 hover:bg-cyan-500 dark:bg-white dark:text-slate-950"
          >
            Start Building Your Grant Strategy →
          </a>
        </div>
      </section>

      {/* =====================================================
          FOOTER
          ===================================================== */}

      <footer className="relative z-10 border-t border-slate-200 px-6 py-10 dark:border-white/10 lg:px-10">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row">

          {/* Footer Brand */}

          <div>
            <div className="text-lg font-bold">
              GrantCraft
            </div>

            <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">
              AI Grant Intelligence
            </div>
          </div>

          {/* Footer Navigation */}

          <div className="flex flex-wrap gap-8 text-sm text-slate-500 dark:text-slate-400">

            <a
              href="#features"
              className="hover:text-cyan-500"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="hover:text-cyan-500"
            >
              How It Works
            </a>

            <a
              href="#team"
              className="hover:text-cyan-500"
            >
              Team
            </a>

            <a
              href="/login"
              className="hover:text-cyan-500"
            >
              Sign In
            </a>
          </div>

          {/* Copyright */}

          <div className="text-xs text-slate-400">
            © 2026 GrantCraft
          </div>
        </div>
      </footer>
    </main>
  );
}