"use client";

import { FormEvent, useEffect, useState } from "react";
import CustomCursor from "../components/CustomCursor";

type GrantMatch = {
  grant_id: string;
  funder_name: string;
  grant_title: string;
  alignment_score: number;
  why_it_matches?: string[];
  eligibility_notes?: string;
  funding_amount?: { min: number; max: number; currency: string };
  application_requirements?: {
    proposal_format?: string;
    maximum_word_count?: number;
    required_sections?: string[];
  };
  deadline?: string;
};

type GrantMatchResponse = {
  success: boolean;
  data?: { matches: GrantMatch[] };
  message?: string;
};

const inputClass = (dark: boolean) =>
  `w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
    dark
      ? "border-white/[0.08] bg-black/20 text-white placeholder:text-white/20 focus:border-cyan-400/40"
      : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-cyan-300"
  }`;

function money(value: number, currency: string) {
  return `${currency} ${value.toLocaleString("en-US")}`;
}

function deadline(value?: string) {
  if (!value) return "Not provided";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function GrantMatchesPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [matching, setMatching] = useState(false);
  const [error, setError] = useState("");
  const [matches, setMatches] = useState<GrantMatch[]>([]);
  const [user, setUser] = useState<{
    id: string; name: string; email: string; role: string;
  } | null>(null);

  const [ngoName, setNgoName] = useState("");
  const [organizationType, setOrganizationType] = useState("registered nonprofit");
  const [location, setLocation] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [focusAreas, setFocusAreas] = useState("digital literacy, technology skills, education");
  const [beneficiaries, setBeneficiaries] = useState("");
  const [fundingAmount, setFundingAmount] = useState("50000");
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem("grantcraft_token");
      if (!token) {
        window.location.href = "/login";
        return;
      }
      try {
        const response = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok || !data.success) {
          localStorage.removeItem("grantcraft_token");
          localStorage.removeItem("grantcraft_user");
          window.location.href = "/login";
          return;
        }
        setUser(data.user);
        localStorage.setItem("grantcraft_user", JSON.stringify(data.user));
        setCheckingAuth(false);
      } catch (err) {
        console.error("Grant Matches authentication error:", err);
        localStorage.removeItem("grantcraft_token");
        localStorage.removeItem("grantcraft_user");
        window.location.href = "/login";
      }
    };
    verifySession();
  }, []);

  const logout = () => {
    localStorage.removeItem("grantcraft_token");
    localStorage.removeItem("grantcraft_user");
    window.location.href = "/login";
  };

  const findGrants = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const amount = Number(fundingAmount);
    if (!ngoName.trim() || !location.trim() || !beneficiaries.trim()) {
      setError("Please complete the organization name, location, and beneficiaries.");
      return;
    }
    if (projectDescription.trim().length < 20) {
      setError("Project description must be at least 20 characters long.");
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Please enter a valid funding amount.");
      return;
    }

    const token = localStorage.getItem("grantcraft_token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    setMatching(true);
    setMatches([]);

    try {
      const response = await fetch("http://localhost:5000/api/grants/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ngo: {
            name: ngoName.trim(),
            organization_type: organizationType.trim(),
            location: location.trim(),
          },
          project: {
            description: projectDescription.trim(),
            focus_areas: focusAreas.split(",").map((x) => x.trim()).filter(Boolean),
            beneficiaries: beneficiaries.trim(),
          },
          funding: {
            amount,
            currency: currency.trim().toUpperCase(),
          },
        }),
      });

      const data: GrantMatchResponse = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to get grant matches.");
      }
      setMatches(data.data?.matches || []);
    } catch (err) {
      console.error("Grant matching error:", err);
      setError(err instanceof Error ? err.message : "Unable to get grant matches right now.");
    } finally {
      setMatching(false);
    }
  };

  const clear = () => {
    setNgoName("");
    setOrganizationType("registered nonprofit");
    setLocation("");
    setProjectDescription("");
    setFocusAreas("digital literacy, technology skills, education");
    setBeneficiaries("");
    setFundingAmount("50000");
    setCurrency("USD");
    setMatches([]);
    setError("");
  };

  if (checkingAuth) {
    return (
      <main className={`flex min-h-screen items-center justify-center ${darkMode ? "bg-[#020617] text-white" : "bg-[#f8fafc] text-slate-950"}`}>
        <CustomCursor />
        <div className="text-center">
          <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border ${darkMode ? "border-cyan-400/20 bg-cyan-400/5" : "border-cyan-300 bg-white shadow-lg shadow-cyan-500/10"}`}>
            <div className={`h-6 w-6 animate-spin rounded-full border-2 ${darkMode ? "border-white/10 border-t-cyan-300" : "border-slate-200 border-t-cyan-500"}`} />
          </div>
          <p className={`mt-5 text-sm ${darkMode ? "text-white/60" : "text-slate-600"}`}>Loading Grant Matches</p>
        </div>
      </main>
    );
  }

  const initial = user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <main className={`min-h-screen transition-colors duration-500 ${darkMode ? "bg-[#020617] text-white" : "bg-[#f8fafc] text-slate-950"}`}>
      <CustomCursor />

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className={`absolute left-[-10%] top-[-15%] h-[520px] w-[520px] rounded-full blur-[150px] ${darkMode ? "bg-cyan-500/[0.08]" : "bg-cyan-300/[0.20]"}`} />
        <div className={`absolute right-[-12%] top-[15%] h-[620px] w-[620px] rounded-full blur-[170px] ${darkMode ? "bg-violet-600/[0.08]" : "bg-violet-300/[0.20]"}`} />
        <div className={`absolute inset-0 opacity-[0.025] ${darkMode ? "[background-image:linear-gradient(rgba(255,255,255,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.6)_1px,transparent_1px)]" : "[background-image:linear-gradient(rgba(15,23,42,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,.35)_1px,transparent_1px)]"} [background-size:64px_64px]`} />
      </div>

      <header className={`sticky top-0 z-30 border-b backdrop-blur-2xl ${darkMode ? "border-white/[0.06] bg-[#020617]/75" : "border-slate-200/80 bg-white/75"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="/dashboard" className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${darkMode ? "border-cyan-400/25 bg-cyan-400/[0.07]" : "border-cyan-300 bg-white shadow-sm"}`}>
              <span className="text-lg font-black text-cyan-500">G</span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Grant<span className="text-cyan-500">Craft</span></h1>
              <p className={`text-[8px] font-semibold uppercase tracking-[0.25em] ${darkMode ? "text-white/25" : "text-slate-400"}`}>AI Grant Intelligence</p>
            </div>
          </a>

          <div className="flex items-center gap-2 sm:gap-4">
            <a href="/dashboard" className={`hidden rounded-full border px-4 py-2 text-xs font-medium transition sm:block ${darkMode ? "border-white/[0.07] text-white/50 hover:border-cyan-400/20 hover:text-cyan-300" : "border-slate-200 bg-white text-slate-500 hover:border-cyan-200 hover:text-cyan-600"}`}>Dashboard</a>
            <button type="button" onClick={() => setDarkMode(!darkMode)} className={`flex h-10 w-10 items-center justify-center rounded-full border text-lg transition ${darkMode ? "border-white/10 bg-white/5 text-slate-200 hover:border-cyan-400/40" : "border-slate-200 bg-white text-slate-700 hover:border-cyan-300"}`}>{darkMode ? "☀" : "☾"}</button>
            <div className="hidden text-right sm:block">
              <p className="text-xs font-medium">{user?.name}</p>
              <p className={`text-[9px] ${darkMode ? "text-white/30" : "text-slate-400"}`}>{user?.email}</p>
            </div>
            <div className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold ${darkMode ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-200" : "border-cyan-200 bg-cyan-50 text-cyan-600"}`}>{initial}</div>
            <button type="button" onClick={logout} className={`rounded-full border px-3.5 py-2 text-[10px] font-medium transition ${darkMode ? "border-white/[0.07] bg-white/[0.025] text-white/45 hover:border-red-400/20 hover:text-red-300" : "border-slate-200 bg-white text-slate-500 hover:border-red-200 hover:text-red-500"}`}>Logout</button>
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="mb-8">
          <p className={`text-[9px] font-bold uppercase tracking-[0.25em] ${darkMode ? "text-cyan-300/60" : "text-cyan-600"}`}>Grant Intelligence</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Find the right <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 bg-clip-text text-transparent">grant.</span>
          </h2>
          <p className={`mt-3 max-w-2xl text-sm leading-6 ${darkMode ? "text-white/35" : "text-slate-500"}`}>
            Describe your organization and project and GrantCraft will rank funding opportunities using semantic matching and eligibility analysis.
          </p>
        </div>

        <form onSubmit={findGrants}>
          <div className={`rounded-[28px] border p-6 backdrop-blur-2xl sm:p-8 ${darkMode ? "border-white/[0.08] bg-white/[0.025]" : "border-slate-200 bg-white/80 shadow-[0_25px_80px_rgba(15,23,42,0.06)]"}`}>
            <div className="grid gap-5 lg:grid-cols-2">
              <div>
                <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em]">Organization Name</label>
                <input value={ngoName} onChange={(e) => setNgoName(e.target.value)} placeholder="Rural Digital Empowerment NGO" className={inputClass(darkMode)} />
              </div>
              <div>
                <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em]">Organization Type</label>
                <input value={organizationType} onChange={(e) => setOrganizationType(e.target.value)} placeholder="registered nonprofit" className={inputClass(darkMode)} />
              </div>
              <div>
                <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em]">Location</label>
                <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="rural community" className={inputClass(darkMode)} />
              </div>
              <div>
                <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em]">Primary Beneficiaries</label>
                <input value={beneficiaries} onChange={(e) => setBeneficiaries(e.target.value)} placeholder="rural girls and young women" className={inputClass(darkMode)} />
              </div>
              <div className="lg:col-span-2">
                <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em]">Project Description</label>
                <textarea value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} rows={6} placeholder="Describe the project, community need, activities, goals, and expected impact..." className={`${inputClass(darkMode)} resize-none`} />
                <p className={`mt-1.5 text-[9px] ${darkMode ? "text-white/20" : "text-slate-400"}`}>Minimum 20 characters.</p>
              </div>
              <div>
                <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em]">Focus Areas</label>
                <input value={focusAreas} onChange={(e) => setFocusAreas(e.target.value)} placeholder="digital literacy, education" className={inputClass(darkMode)} />
                <p className={`mt-1.5 text-[9px] ${darkMode ? "text-white/20" : "text-slate-400"}`}>Separate areas with commas.</p>
              </div>
              <div className="grid grid-cols-[1fr_100px] gap-3">
                <div>
                  <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em]">Funding Amount</label>
                  <input type="number" min="1" value={fundingAmount} onChange={(e) => setFundingAmount(e.target.value)} className={inputClass(darkMode)} />
                </div>
                <div>
                  <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em]">Currency</label>
                  <input value={currency} onChange={(e) => setCurrency(e.target.value.toUpperCase())} maxLength={3} className={`${inputClass(darkMode)} uppercase`} />
                </div>
              </div>
            </div>

            {error && (
              <div className={`mt-5 rounded-xl border px-4 py-3 text-xs ${darkMode ? "border-red-400/15 bg-red-400/[0.05] text-red-300" : "border-red-200 bg-red-50 text-red-600"}`}>{error}</div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="submit" disabled={matching} className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60">
                {matching ? "Analyzing grants..." : "Find Grant Matches →"}
              </button>
              <button type="button" onClick={clear} className={`rounded-xl border px-6 py-3 text-sm font-medium transition ${darkMode ? "border-white/[0.08] bg-white/[0.025] text-white/55 hover:bg-white/[0.06] hover:text-white" : "border-slate-200 bg-white text-slate-600 hover:border-cyan-200 hover:bg-cyan-50"}`}>Clear</button>
            </div>
          </div>
        </form>

        <section className="mt-8">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className={`text-[9px] font-bold uppercase tracking-[0.2em] ${darkMode ? "text-cyan-300/50" : "text-cyan-600"}`}>Ranked Opportunities</p>
              <h3 className="mt-1.5 text-xl font-semibold">{matching ? "Analyzing your project..." : "Grant matches"}</h3>
            </div>
            {!matching && matches.length > 0 && (
              <span className={`rounded-full border px-3 py-1.5 text-[10px] ${darkMode ? "border-white/[0.07] bg-white/[0.025] text-white/40" : "border-slate-200 bg-white text-slate-500"}`}>{matches.length} matches</span>
            )}
          </div>

          {matching && (
            <div className={`rounded-2xl border p-8 ${darkMode ? "border-white/[0.07] bg-white/[0.025]" : "border-slate-200 bg-white shadow-sm"}`}>
              <div className="flex items-center gap-4">
                <div className="h-9 w-9 animate-spin rounded-full border-2 border-cyan-400/15 border-t-cyan-400" />
                <div>
                  <p className="text-sm font-medium">GrantCraft is searching the grant database</p>
                  <p className={`mt-1 text-xs ${darkMode ? "text-white/30" : "text-slate-400"}`}>RAG retrieval and grant alignment analysis are running.</p>
                </div>
              </div>
            </div>
          )}

          {!matching && matches.length === 0 && (
            <div className={`rounded-2xl border border-dashed p-12 text-center ${darkMode ? "border-white/[0.08] bg-white/[0.015]" : "border-slate-200 bg-white/60"}`}>
              <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border text-xl ${darkMode ? "border-cyan-300/10 bg-cyan-300/[0.04] text-cyan-300" : "border-cyan-200 bg-cyan-50 text-cyan-600"}`}>✦</div>
              <h4 className="mt-5 text-sm font-semibold">No grant analysis yet</h4>
              <p className={`mx-auto mt-2 max-w-md text-xs leading-5 ${darkMode ? "text-white/25" : "text-slate-400"}`}>Complete the project information above and run a search to see ranked funding opportunities.</p>
            </div>
          )}

          {!matching && matches.length > 0 && (
            <div className="space-y-4">
              {matches.map((grant, index) => {
                const score = Math.max(0, Math.min(100, grant.alignment_score));
                const tag = score >= 80 ? "High Match" : score >= 60 ? "Good Match" : "Potential";

                return (
                  <article key={grant.grant_id} className={`rounded-[24px] border p-5 transition duration-300 hover:-translate-y-0.5 sm:p-6 ${darkMode ? "border-white/[0.07] bg-white/[0.025] hover:border-cyan-300/15" : "border-slate-200 bg-white/80 shadow-sm hover:border-cyan-200 hover:shadow-lg hover:shadow-cyan-500/5"}`}>
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                      <div className="flex min-w-0 flex-1 gap-4">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-[10px] font-bold ${darkMode ? "border-cyan-300/10 bg-cyan-300/[0.04] text-cyan-300" : "border-cyan-200 bg-cyan-50 text-cyan-600"}`}>{grant.grant_id}</div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`rounded-full border px-2 py-0.5 text-[8px] uppercase tracking-wider ${darkMode ? "border-white/[0.06] bg-white/[0.03] text-white/30" : "border-slate-200 bg-white text-slate-400"}`}>#{index + 1}</span>
                            <span className={`rounded-full border px-2 py-0.5 text-[8px] uppercase tracking-wider ${score >= 80 ? "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-500" : score >= 60 ? "border-cyan-400/20 bg-cyan-400/[0.06] text-cyan-500" : "border-amber-400/20 bg-amber-400/[0.06] text-amber-500"}`}>{tag}</span>
                          </div>
                          <h4 className="mt-2 text-base font-semibold sm:text-lg">{grant.grant_title}</h4>
                          <p className={`mt-1 text-xs ${darkMode ? "text-white/30" : "text-slate-400"}`}>{grant.funder_name}</p>
                        </div>
                      </div>
                      <div className="lg:min-w-[110px] lg:text-right">
                        <p className="text-3xl font-semibold text-cyan-500">{score}%</p>
                        <p className={`text-[9px] uppercase tracking-wider ${darkMode ? "text-white/25" : "text-slate-400"}`}>alignment</p>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className={`mb-1.5 flex justify-between text-[9px] ${darkMode ? "text-white/20" : "text-slate-400"}`}><span>Alignment score</span><span>{score}%</span></div>
                      <div className={`h-1.5 overflow-hidden rounded-full ${darkMode ? "bg-white/[0.05]" : "bg-slate-200"}`}>
                        <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${score}%` }} />
                      </div>
                    </div>

                    {grant.why_it_matches?.length ? (
                      <div className="mt-6">
                        <p className={`text-[9px] font-bold uppercase tracking-[0.18em] ${darkMode ? "text-cyan-300/50" : "text-cyan-600"}`}>Why it matches</p>
                        <ul className="mt-3 space-y-2">
                          {grant.why_it_matches.map((reason, i) => (
                            <li key={`${grant.grant_id}-${i}`} className={`flex gap-2 text-xs leading-5 ${darkMode ? "text-white/50" : "text-slate-600"}`}>
                              <span className="text-emerald-500">✓</span><span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {grant.eligibility_notes && (
                      <div className={`mt-5 rounded-xl border p-4 ${darkMode ? "border-amber-400/10 bg-amber-400/[0.035]" : "border-amber-200 bg-amber-50"}`}>
                        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-amber-500">Eligibility / verification</p>
                        <p className={`mt-2 text-xs leading-5 ${darkMode ? "text-white/40" : "text-slate-600"}`}>{grant.eligibility_notes}</p>
                      </div>
                    )}

                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <div className={`rounded-xl border p-3 ${darkMode ? "border-white/[0.06] bg-white/[0.02]" : "border-slate-200 bg-white"}`}>
                        <p className={`text-[8px] font-bold uppercase tracking-wider ${darkMode ? "text-white/20" : "text-slate-400"}`}>Funding</p>
                        <p className="mt-1 text-xs font-medium">{grant.funding_amount ? `${money(grant.funding_amount.min, grant.funding_amount.currency)} – ${money(grant.funding_amount.max, grant.funding_amount.currency)}` : "Not provided"}</p>
                      </div>
                      <div className={`rounded-xl border p-3 ${darkMode ? "border-white/[0.06] bg-white/[0.02]" : "border-slate-200 bg-white"}`}>
                        <p className={`text-[8px] font-bold uppercase tracking-wider ${darkMode ? "text-white/20" : "text-slate-400"}`}>Deadline</p>
                        <p className="mt-1 text-xs font-medium">{deadline(grant.deadline)}</p>
                      </div>
                      <div className={`rounded-xl border p-3 ${darkMode ? "border-white/[0.06] bg-white/[0.02]" : "border-slate-200 bg-white"}`}>
                        <p className={`text-[8px] font-bold uppercase tracking-wider ${darkMode ? "text-white/20" : "text-slate-400"}`}>Proposal format</p>
                        <p className="mt-1 text-xs font-medium">{grant.application_requirements?.proposal_format || "Not provided"}</p>
                      </div>
                      <div className={`rounded-xl border p-3 ${darkMode ? "border-white/[0.06] bg-white/[0.02]" : "border-slate-200 bg-white"}`}>
                        <p className={`text-[8px] font-bold uppercase tracking-wider ${darkMode ? "text-white/20" : "text-slate-400"}`}>Word limit</p>
                        <p className="mt-1 text-xs font-medium">{grant.application_requirements?.maximum_word_count ? `${grant.application_requirements.maximum_word_count.toLocaleString()} words` : "Not provided"}</p>
                      </div>
                    </div>

                    {grant.application_requirements?.required_sections?.length ? (
                      <div className="mt-5">
                        <p className={`text-[9px] font-bold uppercase tracking-[0.18em] ${darkMode ? "text-white/25" : "text-slate-400"}`}>Required sections</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {grant.application_requirements.required_sections.map((section) => (
                            <span key={`${grant.grant_id}-${section}`} className={`rounded-full border px-2.5 py-1 text-[9px] ${darkMode ? "border-white/[0.07] bg-white/[0.025] text-white/35" : "border-slate-200 bg-white text-slate-500"}`}>{section}</span>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <footer className={`mt-10 flex flex-col items-center justify-between gap-2 border-t py-5 text-[9px] sm:flex-row ${darkMode ? "border-white/[0.05] text-white/15" : "border-slate-200 text-slate-400"}`}>
          <span>GrantCraft AI Grant Intelligence</span>
          <span>Secure workspace • Evidence first</span>
        </footer>
      </div>
    </main>
  );
}