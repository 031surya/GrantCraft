"use client";

import { useEffect, useMemo, useState } from "react";
import CustomCursor from "../components/CustomCursor";

type HistoryItem = {
  _id: string;

  grant: {
    grantId: string;
    funderName?: string;
    grantTitle?: string;
    funding?: {
      min?: number | null;
      max?: number | null;
      currency?: string;
      requestedAmount?: number | null;
      fitsRange?: boolean;
    };
    deadline?: string | null;
  };

  proposal: {
    organizationBackground?: string;
    programDescription?: string;
    targetBeneficiaries?: string;
    expectedOutcomes?: string;
    implementationPlan?: string;
    evaluationPlan?: string;
    budgetSummary?: string;
  };

  audit?: {
    status?: "PASS" | "FAIL" | null;
    accuracyScore?: number | null;
    totalChecked?: number;
    verified?: number;
    mismatches?: number;
    notFound?: number;
    unsupportedClaimsCount?: number;
    summary?: string;
  };

  revisionCount?: number;
  wordCount?: number;
  wordLimit?: number;

  status:
    | "draft"
    | "audited"
    | "submitted"
    | "accepted"
    | "rejected";

  createdAt: string;
  updatedAt: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

function formatDate(dateString?: string) {
  if (!dateString) return "Unknown date";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatFunding(
  funding?: HistoryItem["grant"]["funding"]
) {
  if (!funding) return "Funding unavailable";

  const currency = funding.currency || "USD";

  if (
    typeof funding.min === "number" &&
    typeof funding.max === "number"
  ) {
    return `${currency} ${funding.min.toLocaleString()} – ${funding.max.toLocaleString()}`;
  }

  if (typeof funding.requestedAmount === "number") {
    return `${currency} ${funding.requestedAmount.toLocaleString()}`;
  }

  return "Funding unavailable";
}

function statusLabel(status: HistoryItem["status"]) {
  switch (status) {
    case "draft":
      return "Draft";

    case "audited":
      return "Audited";

    case "submitted":
      return "Submitted";

    case "accepted":
      return "Accepted";

    case "rejected":
      return "Rejected";

    default:
      return status;
  }
}

export default function HistoryPage() {
  const [darkMode, setDarkMode] = useState(false);

  const [checkingAuth, setCheckingAuth] =
    useState(true);

  const [loading, setLoading] = useState(true);

  const [user, setUser] =
    useState<User | null>(null);

  const [history, setHistory] =
    useState<HistoryItem[]>([]);

  const [selectedItem, setSelectedItem] =
    useState<HistoryItem | null>(null);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [error, setError] = useState("");

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

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
        localStorage.getItem(
          "grantcraft_token"
        );

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

        if (
          !response.ok ||
          !data.success
        ) {
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
      } catch (error) {
        console.error(
          "History authentication error:",
          error
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
  // LOAD HISTORY
  // =====================================================

  const loadHistory = async () => {
    const token =
      localStorage.getItem(
        "grantcraft_token"
      );

    if (!token) {
      window.location.href = "/login";
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/history",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to load proposal history."
        );
      }

      setHistory(data.data || []);
    } catch (error) {
      console.error(
        "Load proposal history error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load proposal history."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!checkingAuth) {
      loadHistory();
    }
  }, [checkingAuth]);

  // =====================================================
  // FILTER
  // =====================================================

  const filteredHistory = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return history.filter((item) => {
      const matchesSearch =
        !query ||
        item.grant?.grantTitle
          ?.toLowerCase()
          .includes(query) ||
        item.grant?.funderName
          ?.toLowerCase()
          .includes(query) ||
        item.grant?.grantId
          ?.toLowerCase()
          .includes(query) ||
        item.proposal?.programDescription
          ?.toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        item.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    history,
    search,
    statusFilter,
  ]);

  // =====================================================
  // DELETE HISTORY
  // =====================================================

  const handleDelete = async (
    id: string
  ) => {
    const confirmed =
      window.confirm(
        "Delete this proposal from your history?"
      );

    if (!confirmed) return;

    const token =
      localStorage.getItem(
        "grantcraft_token"
      );

    if (!token) {
      window.location.href = "/login";
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch(
        `http://localhost:5000/api/history/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to delete history."
        );
      }

      setHistory((current) =>
        current.filter(
          (item) => item._id !== id
        )
      );

      if (
        selectedItem?._id === id
      ) {
        setSelectedItem(null);
      }
    } catch (error) {
      console.error(
        "Delete history error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to delete history."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // UPDATE STATUS
  // =====================================================

  const handleStatusChange = async (
    id: string,
    status: HistoryItem["status"]
  ) => {
    const token =
      localStorage.getItem(
        "grantcraft_token"
      );

    if (!token) {
      window.location.href = "/login";
      return;
    }

    setUpdatingId(id);

    try {
      const response = await fetch(
        `http://localhost:5000/api/history/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to update status."
        );
      }

      setHistory((current) =>
        current.map((item) =>
          item._id === id
            ? {
                ...item,
                status,
              }
            : item
        )
      );

      if (
        selectedItem?._id === id
      ) {
        setSelectedItem({
          ...selectedItem,
          status,
        });
      }
    } catch (error) {
      console.error(
        "Update status error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to update status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem(
      "grantcraft_token"
    );

    localStorage.removeItem(
      "grantcraft_user"
    );

    window.location.href = "/login";
  };

  // =====================================================
  // LOADING SCREEN
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
                : "border-cyan-300 bg-white shadow-lg"
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
                ? "text-white/60"
                : "text-slate-600"
            }`}
          >
            Loading your GrantCraft workspace
          </p>
        </div>
      </main>
    );
  }

  const firstName =
    user?.name?.split(" ")[0] ||
    "there";

  const userInitial =
    user?.name
      ?.charAt(0)
      .toUpperCase() || "U";

  const auditedCount =
    history.filter(
      (item) =>
        item.audit?.status === "PASS"
    ).length;

  const submittedCount =
    history.filter(
      (item) =>
        item.status === "submitted"
    ).length;

  const acceptedCount =
    history.filter(
      (item) =>
        item.status === "accepted"
    ).length;

  return (
    <main
      className={`min-h-screen transition-colors duration-500 ${
        darkMode
          ? "bg-[#020617] text-white"
          : "bg-[#f8fafc] text-slate-950"
      }`}
    >
      <CustomCursor />

      {/* =====================================================
          BACKGROUND
          ===================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className={`absolute left-[-10%] top-[-15%] h-[520px] w-[520px] rounded-full blur-[150px] ${
            darkMode
              ? "bg-cyan-500/[0.08]"
              : "bg-cyan-300/[0.18]"
          }`}
        />

        <div
          className={`absolute right-[-12%] top-[15%] h-[620px] w-[620px] rounded-full blur-[170px] ${
            darkMode
              ? "bg-violet-600/[0.08]"
              : "bg-violet-300/[0.18]"
          }`}
        />
      </div>

      <div className="relative flex min-h-screen">
        {/* =====================================================
            SIDEBAR
            ===================================================== */}

        <aside
          className={`hidden w-72 shrink-0 border-r p-5 backdrop-blur-2xl lg:flex lg:flex-col ${
            darkMode
              ? "border-white/[0.07] bg-white/[0.018]"
              : "border-slate-200/80 bg-white/70"
          }`}
        >
          <div className="mb-10 flex items-center gap-3 px-2">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
                darkMode
                  ? "border-cyan-400/25 bg-cyan-400/[0.07]"
                  : "border-cyan-300 bg-white"
              }`}
            >
              <span className="text-xl font-black text-cyan-500">
                G
              </span>
            </div>

            <div>
              <h1 className="text-lg font-bold">
                Grant<span className="text-cyan-500">
                  Craft
                </span>
              </h1>

              <p
                className={`text-[9px] font-semibold uppercase tracking-[0.27em] ${
                  darkMode
                    ? "text-white/30"
                    : "text-slate-400"
                }`}
              >
                AI Grant Intelligence
              </p>
            </div>
          </div>

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
              ["⌂", "Dashboard", "/dashboard"],
              ["✦", "Grant Matches", "/grant-matches"],
              ["✎", "Proposal Generator", "/proposal-generator"],
              ["◈", "AI Audit", "/ai-audit"],
              ["↑", "Documents", "/documents"],
              ["◷", "History", "/history"],
            ].map(
              ([icon, label, path]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    window.location.href =
                      path;
                  }}
                  className={`group flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                    label === "History"
                      ? darkMode
                        ? "border-cyan-400/15 bg-cyan-400/[0.07] text-cyan-200"
                        : "border-cyan-200 bg-cyan-50 text-cyan-700"
                      : darkMode
                        ? "border-transparent text-white/40 hover:bg-white/[0.035] hover:text-white/80"
                        : "border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg">
                    {icon}
                  </span>

                  <span>{label}</span>
                </button>
              )
            )}
          </nav>

          <div className="mt-auto">
            <div
              className={`rounded-2xl border p-4 ${
                darkMode
                  ? "border-white/[0.07] bg-white/[0.025]"
                  : "border-slate-200 bg-white/80"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[9px] font-bold uppercase tracking-[0.2em] ${
                    darkMode
                      ? "text-white/30"
                      : "text-slate-400"
                  }`}
                >
                  AI ENGINE
                </span>

                <span className="text-[9px] text-emerald-500">
                  ● Online
                </span>
              </div>

              <p className="mt-3 text-sm font-semibold">
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
          </div>
        </aside>

        {/* =====================================================
            MAIN
            ===================================================== */}

        <section className="min-w-0 flex-1">
          <header
            className={`sticky top-0 z-20 border-b px-5 py-4 backdrop-blur-2xl sm:px-8 ${
              darkMode
                ? "border-white/[0.06] bg-[#020617]/75"
                : "border-slate-200/80 bg-white/75"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-[9px] font-bold uppercase tracking-[0.25em] ${
                    darkMode
                      ? "text-cyan-300/50"
                      : "text-cyan-600"
                  }`}
                >
                  Grant & Proposal History
                </p>

                <p
                  className={`mt-1 text-sm ${
                    darkMode
                      ? "text-white/35"
                      : "text-slate-500"
                  }`}
                >
                  Your saved grant intelligence
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setDarkMode(
                      !darkMode
                    )
                  }
                  className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                    darkMode
                      ? "border-white/10 bg-white/5"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  {darkMode
                    ? "☀"
                    : "☾"}
                </button>

                <div
                  className={`hidden h-10 w-10 items-center justify-center rounded-full border text-sm font-bold sm:flex ${
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
                  className={`rounded-full border px-3.5 py-2 text-[10px] ${
                    darkMode
                      ? "border-white/[0.07] bg-white/[0.025] text-white/45"
                      : "border-slate-200 bg-white text-slate-500"
                  }`}
                >
                  Logout
                </button>
              </div>
            </div>
          </header>

          <div className="px-5 py-7 sm:px-8 sm:py-9">
            {/* =================================================
                TITLE
                ================================================= */}

            <div className="mb-7">
              <p
                className={`text-xs font-medium ${
                  darkMode
                    ? "text-cyan-300/60"
                    : "text-cyan-600"
                }`}
              >
                Welcome back, {firstName}.
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Your grant history.
              </h2>

              <p
                className={`mt-3 max-w-2xl text-sm leading-6 ${
                  darkMode
                    ? "text-white/35"
                    : "text-slate-500"
                }`}
              >
                Review proposals you generated,
                their grant opportunities, and
                factuality audit results.
              </p>
            </div>

            {/* =================================================
                STATS
                ================================================= */}

            <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                [
                  "TOTAL PROPOSALS",
                  history.length,
                  "saved records",
                ],
                [
                  "AUDITED",
                  auditedCount,
                  "passed AI audit",
                ],
                [
                  "SUBMITTED",
                  submittedCount,
                  "marked submitted",
                ],
                [
                  "ACCEPTED",
                  acceptedCount,
                  "successful proposals",
                ],
              ].map(
                ([label, value, detail]) => (
                  <div
                    key={label}
                    className={`rounded-2xl border p-5 ${
                      darkMode
                        ? "border-white/[0.07] bg-white/[0.025]"
                        : "border-slate-200 bg-white/80 shadow-sm"
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
                      <p className="text-3xl font-semibold">
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
                )
              )}
            </div>

            {/* =================================================
                SEARCH / FILTER
                ================================================= */}

            <div
              className={`mb-6 rounded-2xl border p-4 ${
                darkMode
                  ? "border-white/[0.07] bg-white/[0.025]"
                  : "border-slate-200 bg-white/80"
              }`}
            >
              <div className="flex flex-col gap-3 md:flex-row">
                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search grants, funders, or proposals..."
                  className={`flex-1 rounded-xl border px-4 py-3 text-sm outline-none ${
                    darkMode
                      ? "border-white/[0.08] bg-black/20 text-white placeholder:text-white/20 focus:border-cyan-400/40"
                      : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-cyan-300"
                  }`}
                />

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value
                    )
                  }
                  className={`rounded-xl border px-4 py-3 text-sm outline-none ${
                    darkMode
                      ? "border-white/[0.08] bg-black/20 text-white"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  <option value="all">
                    All statuses
                  </option>
                  <option value="draft">
                    Draft
                  </option>
                  <option value="audited">
                    Audited
                  </option>
                  <option value="submitted">
                    Submitted
                  </option>
                  <option value="accepted">
                    Accepted
                  </option>
                  <option value="rejected">
                    Rejected
                  </option>
                </select>

                <button
                  type="button"
                  onClick={loadHistory}
                  className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300"
                >
                  Refresh
                </button>
              </div>
            </div>

            {/* =================================================
                ERROR
                ================================================= */}

            {error && (
              <div
                className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
                  darkMode
                    ? "border-red-400/15 bg-red-400/[0.05] text-red-300"
                    : "border-red-200 bg-red-50 text-red-600"
                }`}
              >
                {error}
              </div>
            )}

            {/* =================================================
                HISTORY
                ================================================= */}

            {loading ? (
              <div
                className={`rounded-[26px] border p-12 text-center ${
                  darkMode
                    ? "border-white/[0.07] bg-white/[0.025]"
                    : "border-slate-200 bg-white/80"
                }`}
              >
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-cyan-500" />

                <p className="mt-4 text-sm">
                  Loading proposal history...
                </p>
              </div>
            ) : filteredHistory.length ===
              0 ? (
              <div
                className={`rounded-[26px] border border-dashed p-12 text-center ${
                  darkMode
                    ? "border-white/[0.08] bg-white/[0.018]"
                    : "border-slate-300 bg-white/60"
                }`}
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border text-2xl">
                  ◷
                </div>

                <h3 className="mt-5 text-lg font-semibold">
                  No proposal history yet
                </h3>

                <p
                  className={`mx-auto mt-2 max-w-md text-sm ${
                    darkMode
                      ? "text-white/30"
                      : "text-slate-500"
                  }`}
                >
                  Generate a proposal and save
                  it to GrantCraft history to
                  see it here.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    (window.location.href =
                      "/proposal-generator")
                  }
                  className="mt-5 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950"
                >
                  Create Proposal →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredHistory.map(
                  (item) => (
                    <div
                      key={item._id}
                      className={`rounded-[24px] border p-5 transition hover:-translate-y-0.5 ${
                        darkMode
                          ? "border-white/[0.07] bg-white/[0.025]"
                          : "border-slate-200 bg-white/80 shadow-sm"
                      }`}
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase ${
                                item.status ===
                                "accepted"
                                  ? "border-emerald-300 bg-emerald-50 text-emerald-600"
                                  : item.status ===
                                      "rejected"
                                    ? "border-red-300 bg-red-50 text-red-600"
                                    : "border-cyan-300 bg-cyan-50 text-cyan-600"
                              }`}
                            >
                              {statusLabel(
                                item.status
                              )}
                            </span>

                            <span
                              className={`text-[10px] ${
                                darkMode
                                  ? "text-white/25"
                                  : "text-slate-400"
                              }`}
                            >
                              {formatDate(
                                item.createdAt
                              )}
                            </span>
                          </div>

                          <h3 className="mt-3 text-lg font-semibold">
                            {item.grant
                              ?.grantTitle ||
                              "Untitled Grant"}
                          </h3>

                          <p
                            className={`mt-1 text-xs ${
                              darkMode
                                ? "text-white/30"
                                : "text-slate-400"
                            }`}
                          >
                            {item.grant
                              ?.funderName ||
                              "Unknown funder"}{" "}
                            •{" "}
                            {item.grant
                              ?.grantId ||
                              "No grant ID"}
                          </p>

                          <p
                            className={`mt-4 line-clamp-2 text-sm leading-6 ${
                              darkMode
                                ? "text-white/45"
                                : "text-slate-600"
                            }`}
                          >
                            {item.proposal
                              ?.programDescription ||
                              "No proposal description available."}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-[420px]">
                          <div
                            className={`rounded-xl border p-3 ${
                              darkMode
                                ? "border-white/[0.06] bg-white/[0.02]"
                                : "border-slate-200 bg-white"
                            }`}
                          >
                            <p className="text-[8px] uppercase tracking-wider text-slate-400">
                              Audit
                            </p>

                            <p
                              className={`mt-1 text-lg font-semibold ${
                                item.audit
                                  ?.status ===
                                "PASS"
                                  ? "text-emerald-500"
                                  : item.audit
                                      ?.status ===
                                      "FAIL"
                                    ? "text-red-500"
                                    : "text-slate-400"
                              }`}
                            >
                              {item.audit
                                ?.accuracyScore ??
                                "—"}
                              {item.audit
                                ?.accuracyScore !=
                                null &&
                                "%"}
                            </p>
                          </div>

                          <div
                            className={`rounded-xl border p-3 ${
                              darkMode
                                ? "border-white/[0.06] bg-white/[0.02]"
                                : "border-slate-200 bg-white"
                            }`}
                          >
                            <p className="text-[8px] uppercase tracking-wider text-slate-400">
                              Words
                            </p>

                            <p className="mt-1 text-sm font-semibold">
                              {item.wordCount ||
                                "—"}
                            </p>
                          </div>

                          <div
                            className={`rounded-xl border p-3 ${
                              darkMode
                                ? "border-white/[0.06] bg-white/[0.02]"
                                : "border-slate-200 bg-white"
                            }`}
                          >
                            <p className="text-[8px] uppercase tracking-wider text-slate-400">
                              Revisions
                            </p>

                            <p className="mt-1 text-sm font-semibold">
                              {item.revisionCount ??
                                0}
                            </p>
                          </div>

                          <div
                            className={`rounded-xl border p-3 ${
                              darkMode
                                ? "border-white/[0.06] bg-white/[0.02]"
                                : "border-slate-200 bg-white"
                            }`}
                          >
                            <p className="text-[8px] uppercase tracking-wider text-slate-400">
                              Funding
                            </p>

                            <p className="mt-1 text-xs font-semibold">
                              {formatFunding(
                                item.grant
                                  ?.funding
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-200/50 pt-4 dark:border-white/[0.05]">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedItem(
                              item
                            )
                          }
                          className="rounded-xl bg-cyan-400 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-300"
                        >
                          View Proposal
                        </button>

                        <select
                          value={item.status}
                          disabled={
                            updatingId ===
                            item._id
                          }
                          onChange={(event) =>
                            handleStatusChange(
                              item._id,
                              event.target
                                .value as HistoryItem["status"]
                            )
                          }
                          className={`rounded-xl border px-3 py-2.5 text-xs ${
                            darkMode
                              ? "border-white/[0.08] bg-white/[0.03] text-white"
                              : "border-slate-200 bg-white text-slate-600"
                          }`}
                        >
                          <option value="draft">
                            Draft
                          </option>
                          <option value="audited">
                            Audited
                          </option>
                          <option value="submitted">
                            Submitted
                          </option>
                          <option value="accepted">
                            Accepted
                          </option>
                          <option value="rejected">
                            Rejected
                          </option>
                        </select>

                        <button
                          type="button"
                          disabled={
                            deletingId ===
                            item._id
                          }
                          onClick={() =>
                            handleDelete(
                              item._id
                            )
                          }
                          className={`rounded-xl border px-4 py-2.5 text-xs ${
                            darkMode
                              ? "border-red-400/10 bg-red-400/[0.04] text-red-300"
                              : "border-red-200 bg-red-50 text-red-500"
                          }`}
                        >
                          {deletingId ===
                          item._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* =====================================================
          PROPOSAL DETAIL MODAL
          ===================================================== */}

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div
            className={`max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[28px] border p-6 shadow-2xl ${
              darkMode
                ? "border-white/[0.08] bg-[#07111f]"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-500">
                  Proposal Details
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  {selectedItem.grant
                    ?.grantTitle ||
                    "Untitled Grant"}
                </h2>

                <p
                  className={`mt-1 text-sm ${
                    darkMode
                      ? "text-white/35"
                      : "text-slate-500"
                  }`}
                >
                  {selectedItem.grant
                    ?.funderName ||
                    "Unknown funder"}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedItem(null)
                }
                className={`rounded-full border px-3 py-2 text-sm ${
                  darkMode
                    ? "border-white/[0.08] text-white/50"
                    : "border-slate-200 text-slate-500"
                }`}
              >
                ✕
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border p-4">
                <p className="text-[9px] uppercase tracking-wider text-slate-400">
                  Audit
                </p>

                <p className="mt-1 text-xl font-semibold text-cyan-500">
                  {selectedItem.audit
                    ?.accuracyScore ??
                    "—"}
                  {selectedItem.audit
                    ?.accuracyScore !=
                    null &&
                    "%"}
                </p>
              </div>

              <div className="rounded-xl border p-4">
                <p className="text-[9px] uppercase tracking-wider text-slate-400">
                  Status
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {statusLabel(
                    selectedItem.status
                  )}
                </p>
              </div>

              <div className="rounded-xl border p-4">
                <p className="text-[9px] uppercase tracking-wider text-slate-400">
                  Created
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {formatDate(
                    selectedItem.createdAt
                  )}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              {[
                [
                  "Organization Background",
                  selectedItem.proposal
                    ?.organizationBackground,
                ],
                [
                  "Program Description",
                  selectedItem.proposal
                    ?.programDescription,
                ],
                [
                  "Target Beneficiaries",
                  selectedItem.proposal
                    ?.targetBeneficiaries,
                ],
                [
                  "Expected Outcomes",
                  selectedItem.proposal
                    ?.expectedOutcomes,
                ],
                [
                  "Implementation Plan",
                  selectedItem.proposal
                    ?.implementationPlan,
                ],
                [
                  "Evaluation Plan",
                  selectedItem.proposal
                    ?.evaluationPlan,
                ],
                [
                  "Budget Summary",
                  selectedItem.proposal
                    ?.budgetSummary,
                ],
              ].map(
                ([title, content]) => (
                  <div
                    key={title}
                    className={`rounded-2xl border p-5 ${
                      darkMode
                        ? "border-white/[0.06] bg-white/[0.02]"
                        : "border-slate-200 bg-slate-50/60"
                    }`}
                  >
                    <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-cyan-500">
                      {title}
                    </h3>

                    <p
                      className={`mt-3 text-sm leading-6 ${
                        darkMode
                          ? "text-white/55"
                          : "text-slate-600"
                      }`}
                    >
                      {content ||
                        "Not provided."}
                    </p>
                  </div>
                )
              )}
            </div>

            {selectedItem.audit
              ?.summary && (
              <div
                className={`mt-5 rounded-2xl border p-5 ${
                  selectedItem.audit
                    ?.status === "PASS"
                    ? darkMode
                      ? "border-emerald-400/10 bg-emerald-400/[0.035]"
                      : "border-emerald-200 bg-emerald-50"
                    : darkMode
                      ? "border-red-400/10 bg-red-400/[0.035]"
                      : "border-red-200 bg-red-50"
                }`}
              >
                <h3 className="text-xs font-bold uppercase tracking-[0.15em]">
                  AI Audit Summary
                </h3>

                <p className="mt-3 text-sm leading-6">
                  {selectedItem.audit.summary}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}