"use client";

import { useEffect, useState } from "react";
import CustomCursor from "./components/CustomCursor";

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

const steps = [
  {
    number: "01",
    title: "Upload",
    description: "Bring your program documents, impact reports, and organizational evidence.",
  },
  {
    number: "02",
    title: "Discover",
    description: "GrantCraft retrieves and identifies opportunities relevant to your work.",
  },
  {
    number: "03",
    title: "Generate",
    description: "Build an evidence-based proposal tailored to the selected opportunity.",
  },
  {
    number: "04",
    title: "Audit",
    description: "Verify claims and impact metrics before your proposal reaches a funder.",
  },
];

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8fafc] text-slate-950 transition-colors duration-500 dark:bg-[#050816] dark:text-white">
      <CustomCursor />

      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-300/20 blur-[120px] dark:bg-cyan-500/10" />
        <div className="absolute right-[-10%] top-[10%] h-[600px] w-[600px] rounded-full bg-violet-300/20 blur-[140px] dark:bg-violet-600/10" />
        <div className="absolute bottom-[-15%] left-[30%] h-[500px] w-[500px] rounded-full bg-blue-300/15 blur-[140px] dark:bg-blue-600/10" />
      </div>

      {/* NAVBAR */}
      <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">

        <a href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/40 bg-white shadow-[0_8px_30px_rgba(34,211,238,0.15)] dark:bg-white/5">
            <span className="text-xl font-black text-cyan-500">G</span>
          </div>

          <div>
            <div className="text-lg font-bold tracking-tight">GrantCraft</div>
            <div className="text-[9px] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
              AI Grant Intelligence
            </div>
          </div>
        </a>

        <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex dark:text-slate-300">
          <a href="#home" className="transition hover:text-cyan-500">
            Home
          </a>
          <a href="#how-it-works" className="transition hover:text-cyan-500">
            How It Works
          </a>
          <a href="#features" className="transition hover:text-cyan-500">
            Features
          </a>
          <a href="#team" className="transition hover:text-cyan-500">
            Team
          </a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-lg shadow-sm transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5"
            aria-label="Toggle theme"
          >
            {darkMode ? "☀" : "☾"}
          </button>

          <a
            href="/login"
            className="hidden rounded-full px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:text-cyan-500 sm:block dark:text-slate-200"
          >
            Sign In
          </a>

          <a
            href="/login"
            className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-cyan-500 dark:bg-white dark:text-slate-950 dark:hover:bg-cyan-400"
          >
            Get Started
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-16 lg:px-10 lg:pt-24">

        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">

          {/* Hero copy */}
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/50 bg-cyan-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-400/5 dark:text-cyan-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-500" />
              AI-Powered Grant Intelligence
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              Turn community impact into{" "}
              <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 bg-clip-text text-transparent">
                funded opportunity.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Discover aligned grants, generate evidence-based proposals,
              and audit every important claim before submission — all in one
              intelligent workspace.
            </p>

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

            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              <span>RAG</span>
              <span>GRANT MATCHING</span>
              <span>PROPOSALS</span>
              <span>FACTUALITY JUDGE</span>
            </div>
          </div>

          {/* AI CORE */}
          <div className="relative flex min-h-[470px] items-center justify-center">

            <div className="absolute h-[360px] w-[360px] rounded-full border border-cyan-300/30 dark:border-cyan-400/10" />
            <div className="absolute h-[290px] w-[290px] rounded-full border border-blue-300/30 dark:border-blue-400/10" />
            <div className="absolute h-[220px] w-[220px] rounded-full border border-violet-300/30 dark:border-violet-400/10" />

            <div className="absolute h-[310px] w-[310px] animate-[spin_18s_linear_infinite] rounded-full border border-dashed border-cyan-400/30" />

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

            {/* Orbit nodes */}
            {/* GrantCraft AI Core Orbit Nodes */}

<div
  className="core-orbit-1 absolute right-[5%] top-[13%] rounded-full border border-cyan-300 bg-white px-4 py-2 text-[10px] font-bold tracking-[0.12em] text-cyan-600 shadow-lg shadow-cyan-500/10 dark:border-cyan-400/30 dark:bg-slate-900 dark:text-cyan-300"
>
  RAG
</div>

<div
  className="core-orbit-2 absolute left-[2%] top-[28%] rounded-full border border-violet-300 bg-white px-4 py-2 text-[10px] font-bold tracking-[0.12em] text-violet-600 shadow-lg shadow-violet-500/10 dark:border-violet-400/30 dark:bg-slate-900 dark:text-violet-300"
>
  WRITE
</div>

<div
  className="core-orbit-3 absolute bottom-[24%] left-[3%] rounded-full border border-blue-300 bg-white px-4 py-2 text-[10px] font-bold tracking-[0.12em] text-blue-600 shadow-lg shadow-blue-500/10 dark:border-blue-400/30 dark:bg-slate-900 dark:text-blue-300"
>
  MATCH
</div>

<div
  className="core-orbit-4 absolute bottom-[15%] right-[5%] rounded-full border border-cyan-300 bg-white px-4 py-2 text-[10px] font-bold tracking-[0.12em] text-cyan-600 shadow-lg shadow-cyan-500/10 dark:border-cyan-400/30 dark:bg-slate-900 dark:text-cyan-300"
>
  AUDIT
</div>

<div
  className="core-orbit-5 absolute left-[18%] top-[5%] rounded-full border border-blue-300 bg-white px-4 py-2 text-[10px] font-bold tracking-[0.12em] text-blue-600 shadow-lg shadow-blue-500/10 dark:border-blue-400/30 dark:bg-slate-900 dark:text-blue-300"
>
  AI
</div>

<div
  className="core-orbit-6 absolute right-[20%] top-[3%] rounded-full border border-violet-300 bg-white px-4 py-2 text-[10px] font-bold tracking-[0.12em] text-violet-600 shadow-lg shadow-violet-500/10 dark:border-violet-400/30 dark:bg-slate-900 dark:text-violet-300"
>
  DATA
</div>

<div
  className="core-orbit-7 absolute bottom-[7%] left-[22%] rounded-full border border-cyan-300 bg-white px-4 py-2 text-[10px] font-bold tracking-[0.12em] text-cyan-600 shadow-lg shadow-cyan-500/10 dark:border-cyan-400/30 dark:bg-slate-900 dark:text-cyan-300"
>
  CLAIM
</div>

<div
  className="core-orbit-8 absolute bottom-[4%] right-[22%] rounded-full border border-blue-300 bg-white px-4 py-2 text-[10px] font-bold tracking-[0.12em] text-blue-600 shadow-lg shadow-blue-500/10 dark:border-blue-400/30 dark:bg-slate-900 dark:text-blue-300"
>
  EVIDENCE
</div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="relative z-10 border-y border-slate-200/70 bg-white/60 px-6 py-24 backdrop-blur-xl dark:border-white/5 dark:bg-white/[0.02] lg:px-10"
      >
        <div className="mx-auto max-w-7xl">

          <div className="max-w-2xl">
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-500">
              The GrantCraft Pipeline
            </div>

            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              From data to funding — intelligently.
            </h2>

            <p className="mt-5 text-slate-600 dark:text-slate-400">
              One connected workflow takes your organization's evidence from
              documents to a verified proposal.
            </p>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="group relative rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-cyan-300 hover:shadow-xl hover:shadow-cyan-500/10 dark:border-white/10 dark:bg-white/[0.03]"
              >
                <div className="text-sm font-black text-cyan-500">
                  {step.number}
                </div>

                <h3 className="mt-8 text-xl font-bold">{step.title}</h3>

                <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {step.description}
                </p>

                <div className="mt-7 h-px w-full bg-gradient-to-r from-cyan-400/60 to-transparent" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative z-10 px-6 py-24 lg:px-10">

        <div className="mx-auto max-w-7xl">

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

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.number}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10 dark:border-white/10 dark:bg-white/[0.03]"
              >
                <div className="absolute right-[-60px] top-[-60px] h-40 w-40 rounded-full bg-cyan-300/10 blur-3xl transition group-hover:bg-cyan-300/20" />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-cyan-500">
                    {feature.number}
                  </span>

                  <span className="rounded-full border border-slate-200 px-3 py-1 text-[9px] font-bold tracking-[0.2em] text-slate-400 dark:border-white/10">
                    {feature.tag}
                  </span>
                </div>

                <h3 className="mt-16 text-2xl font-bold">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-500 dark:text-slate-400">
                  {feature.description}
                </p>

                <div className="mt-10 text-sm font-bold text-cyan-500">
                  Explore capability →
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTELLIGENCE VISUAL */}
      <section className="relative z-10 px-6 py-20 lg:px-10">

        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 px-8 py-20 text-white shadow-2xl dark:border-white/10 lg:px-16">

          <div className="grid items-center gap-14 lg:grid-cols-2">

            <div>
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
                Grant Intelligence Core
              </div>

              <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
                Your grant intelligence,
                <span className="text-cyan-400"> connected.</span>
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

            <div className="relative flex h-[330px] items-center justify-center">

              <div className="absolute h-72 w-72 rounded-full border border-cyan-400/20" />
              <div className="absolute h-52 w-52 rounded-full border border-blue-400/20" />
              <div className="absolute h-32 w-32 rounded-full bg-gradient-to-br from-cyan-400/40 to-violet-500/40 blur-xl" />

              <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-cyan-400/40 bg-slate-900 shadow-[0_0_80px_rgba(34,211,238,0.25)]">
                <span className="text-4xl font-black text-cyan-300">G</span>
              </div>

              <span className="absolute left-[5%] top-[20%] text-xs font-bold text-cyan-300">
                DOCUMENTS
              </span>

              <span className="absolute right-[2%] top-[30%] text-xs font-bold text-blue-300">
                GRANTS
              </span>

              <span className="absolute bottom-[20%] left-[8%] text-xs font-bold text-violet-300">
                PROPOSALS
              </span>

              <span className="absolute bottom-[15%] right-[8%] text-xs font-bold text-cyan-300">
                JUDGE
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section id="team" className="relative z-10 px-6 py-24 lg:px-10">

        <div className="mx-auto max-w-7xl text-center">

          <div className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-500">
            Our Team
          </div>

          <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            Built with purpose. Built by us.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-slate-500 dark:text-slate-400">
            A team combining artificial intelligence, engineering, design,
            and a passion for building meaningful technology.
          </p>

          <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">

            {[
              ["AI / ML", "Intelligence & RAG"],
              ["Engineering", "Platform & Systems"],
              ["Design", "Product Experience"],
            ].map(([role, area]) => (
              <div
                key={role}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl dark:border-white/10 dark:bg-white/[0.03]"
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-100 to-violet-100 text-2xl font-black text-cyan-600 dark:from-cyan-400/20 dark:to-violet-400/20 dark:text-cyan-300">
                  G
                </div>

                <h3 className="mt-6 text-xl font-bold">{role}</h3>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {area}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-xs text-slate-400">
            Team member profiles can be added once the final team information
            is confirmed.
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
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

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-200 px-6 py-10 dark:border-white/10 lg:px-10">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row">

          <div>
            <div className="text-lg font-bold">GrantCraft</div>
            <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">
              AI Grant Intelligence
            </div>
          </div>

          <div className="flex flex-wrap gap-8 text-sm text-slate-500 dark:text-slate-400">
            <a href="#features" className="hover:text-cyan-500">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-cyan-500">
              How It Works
            </a>
            <a href="#team" className="hover:text-cyan-500">
              Team
            </a>
            <a href="/login" className="hover:text-cyan-500">
              Sign In
            </a>
          </div>

          <div className="text-xs text-slate-400">
            © 2026 GrantCraft
          </div>
        </div>
      </footer>
    </main>
  );
}