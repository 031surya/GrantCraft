"use client";

import { useState } from "react";

const grants = [
  {
    id: "G001",
    title: "Community Clean Water Initiative Grant",
    funder: "Clean Water Community Fund",
    score: 94,
    amount: "$25K – $100K",
  },
  {
    id: "G005",
    title: "Local Climate Resilience Grant",
    funder: "Climate Resilience Community Foundation",
    score: 72,
    amount: "$30K – $125K",
  },
  {
    id: "G002",
    title: "Rural Community Health Access Grant",
    funder: "Global Health Access Foundation",
    score: 51,
    amount: "$20K – $80K",
  },
];

export default function Home() {
  const [active, setActive] = useState("Dashboard");

  return (
    <main className="min-h-screen overflow-hidden bg-[#030712] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[10%] top-[-15%] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute right-[-10%] top-[20%] h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[160px]" />
        <div className="absolute bottom-[-20%] left-[30%] h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[150px]" />

        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:60px_60px]" />
      </div>

      <div className="relative flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-white/[0.025] p-5 backdrop-blur-2xl lg:block">
          <div className="mb-10 flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
              <span className="text-lg font-bold text-cyan-300">G</span>
            </div>

            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                Grant<span className="text-cyan-300">Craft</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/35">
                AI Grant Intelligence
              </p>
            </div>
          </div>

          <nav className="space-y-2">
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
                className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all ${
                  active === label
                    ? "border border-cyan-400/20 bg-cyan-400/10 text-cyan-200 shadow-[0_0_25px_rgba(34,211,238,0.08)]"
                    : "text-white/45 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="w-5 text-center text-base">{icon}</span>
                {label}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-32">
            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs text-white/40">AI ENGINE</span>
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
              </div>

              <p className="text-sm font-medium">GrantCraft Core</p>
              <p className="mt-1 text-xs text-white/35">
                RAG + Proposal + Judge
              </p>
            </div>
          </div>
        </aside>

        {/* Main */}
        <section className="min-w-0 flex-1 p-5 sm:p-8">
          {/* Header */}
          <header className="mb-8 flex items-center justify-between">
            <div>
              <p className="mb-1 text-xs uppercase tracking-[0.25em] text-cyan-300/60">
                {active}
              </p>

              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Grant intelligence{" "}
                <span className="text-white/35">workspace</span>
              </h2>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs text-white/50 backdrop-blur-xl">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                AI systems online
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm">
                S
              </div>
            </div>
          </header>

          {/* Hero */}
          <div className="relative mb-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-2xl sm:p-8">
            <div className="absolute right-[-80px] top-[-120px] h-80 w-80 rounded-full bg-cyan-400/10 blur-[90px]" />

            <div className="relative z-10 max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1.5 text-[11px] uppercase tracking-widest text-cyan-300">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_#67e8f9]" />
                Intelligent grant workspace
              </div>

              <h3 className="text-3xl font-semibold leading-tight sm:text-5xl">
                Turn community impact into{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                  funded opportunity.
                </span>
              </h3>

              <p className="mt-4 max-w-xl text-sm leading-6 text-white/45 sm:text-base">
                Discover aligned grants, generate evidence-based proposals,
                and audit every claim before submission.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <button className="rounded-xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-black transition hover:bg-cyan-200 hover:shadow-[0_0_30px_rgba(103,232,249,0.25)]">
                  Find Grant Matches
                </button>

                <button className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/70 transition hover:bg-white/10">
                  Generate Proposal
                </button>
              </div>
            </div>

            {/* 3D-style orb */}
            <div className="absolute right-10 top-1/2 hidden -translate-y-1/2 lg:block">
              <div className="relative h-52 w-52">
                <div className="absolute inset-5 animate-pulse rounded-full bg-cyan-400/10 blur-2xl" />
                <div className="absolute inset-8 rounded-full border border-cyan-300/30 bg-gradient-to-br from-cyan-300/20 via-blue-500/10 to-violet-500/20 shadow-[inset_0_0_40px_rgba(103,232,249,0.15),0_0_70px_rgba(34,211,238,0.12)]" />
                <div className="absolute inset-14 rounded-full bg-gradient-to-br from-cyan-200/30 to-blue-600/20 blur-sm" />

                <div className="absolute inset-0 animate-[spin_12s_linear_infinite] rounded-full border border-dashed border-cyan-300/20" />
                <div className="absolute inset-[-12px] animate-[spin_18s_linear_infinite_reverse] rounded-full border border-dotted border-violet-400/15" />

                <div className="absolute left-2 top-1/2 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_15px_#67e8f9]" />
                <div className="absolute right-5 top-7 h-1.5 w-1.5 rounded-full bg-violet-300 shadow-[0_0_15px_#c4b5fd]" />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["GRANTS ANALYZED", "24", "+8 this week", "cyan"],
              ["STRONG MATCHES", "07", "≥ 80% alignment", "blue"],
              ["PROPOSALS", "03", "2 ready to review", "violet"],
              ["AVG. AUDIT", "91", "/100 accuracy", "emerald"],
            ].map(([label, value, detail]) => (
              <div
                key={label}
                className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-white/20"
              >
                <p className="text-[10px] font-medium tracking-[0.2em] text-white/35">
                  {label}
                </p>

                <div className="mt-4 flex items-end justify-between">
                  <p className="text-3xl font-semibold tracking-tight">
                    {value}
                  </p>

                  <span className="text-xs text-white/35">{detail}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Content grid */}
          <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            {/* Grants */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl sm:p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/60">
                    Intelligence
                  </p>
                  <h4 className="mt-1 text-lg font-semibold">
                    Top grant matches
                  </h4>
                </div>

                <button className="text-xs text-cyan-300 hover:text-cyan-200">
                  View all →
                </button>
              </div>

              <div className="space-y-3">
                {grants.map((grant) => (
                  <div
                    key={grant.id}
                    className="group flex flex-col gap-4 rounded-2xl border border-white/8 bg-black/20 p-4 transition hover:border-cyan-300/20 hover:bg-cyan-300/[0.025] sm:flex-row sm:items-center"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-300/10 bg-cyan-300/5 text-xs font-semibold text-cyan-300">
                      {grant.id}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h5 className="truncate text-sm font-medium">
                        {grant.title}
                      </h5>
                      <p className="mt-1 truncate text-xs text-white/35">
                        {grant.funder}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-lg font-semibold text-cyan-300">
                        {grant.score}%
                      </p>
                      <p className="text-[10px] text-white/30">
                        {grant.amount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Status */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl sm:p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-violet-300/60">
                AI pipeline
              </p>

              <h4 className="mt-1 text-lg font-semibold">
                GrantCraft engine
              </h4>

              <div className="mt-6 space-y-5">
                {[
                  ["RAG Retrieval", "Online", "100%"],
                  ["Grant Matcher", "Online", "100%"],
                  ["Proposal Agent", "Online", "100%"],
                  ["Factuality Judge", "Online", "100%"],
                ].map(([name, status, progress]) => (
                  <div key={name}>
                    <div className="mb-2 flex justify-between text-xs">
                      <span className="text-white/55">{name}</span>
                      <span className="text-emerald-300">{status}</span>
                    </div>

                    <div className="h-1 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-blue-500"
                        style={{ width: progress }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7 rounded-2xl border border-emerald-400/10 bg-emerald-400/5 p-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
                  <span className="text-xs font-medium text-emerald-300">
                    All systems operational
                  </span>
                </div>

                <p className="mt-2 text-xs leading-5 text-white/35">
                  Your grant intelligence pipeline is ready for the next
                  analysis.
                </p>
              </div>
            </div>
          </div>

          {/* Upload */}
          <div className="mt-6 rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center backdrop-blur-xl transition hover:border-cyan-300/30 hover:bg-cyan-300/[0.02]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-300/5 text-xl text-cyan-300">
              ↑
            </div>

            <h4 className="mt-4 text-sm font-semibold">
              Upload NGO documents
            </h4>

            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-white/35">
              Add program reports, grant documents, impact data, or other
              source material to power the GrantCraft intelligence engine.
            </p>

            <button className="mt-5 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs text-white/65 transition hover:bg-white/10 hover:text-white">
              Choose documents
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}