"use client";

import { useEffect, useState } from "react";
import CustomCursor from "../components/CustomCursor";

type Organization = {
  _id?: string;
  owner?: string;

  organizationName: string;
  organizationType: string;
  location: string;
  mission: string;
  focusAreas: string[];
  beneficiaries: string;
  fundingPreferences: string;

  createdAt?: string;
  updatedAt?: string;
};

const API_URL = "http://localhost:5000";

export default function OrganizationPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [active, setActive] = useState("Organization");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [organization, setOrganization] =
    useState<Organization>({
      organizationName: "",
      organizationType: "",
      location: "",
      mission: "",
      focusAreas: [],
      beneficiaries: "",
      fundingPreferences: "",
    });

  const [focusAreaInput, setFocusAreaInput] =
    useState("");

  /* =========================================================
     THEME
  ========================================================= */

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("grantcraft-dark-mode");

    if (savedTheme === "true") {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "grantcraft-dark-mode",
      String(darkMode)
    );
  }, [darkMode]);

  /* =========================================================
     LOAD ORGANIZATION
  ========================================================= */

  useEffect(() => {
    const loadOrganization = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem(
            "grantcraft_token"
          );

        if (!token) {
          throw new Error(
            "Authentication token not found. Please log in again."
          );
        }

        const response = await fetch(
          `${API_URL}/api/organization`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load organization profile."
          );
        }

        if (data.data) {
          setOrganization({
            organizationName:
              data.data.organizationName || "",

            organizationType:
              data.data.organizationType || "",

            location:
              data.data.location || "",

            mission:
              data.data.mission || "",

            focusAreas:
              Array.isArray(
                data.data.focusAreas
              )
                ? data.data.focusAreas
                : [],

            beneficiaries:
              data.data.beneficiaries || "",

            fundingPreferences:
              data.data.fundingPreferences ||
              "",
          });
        }
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load organization profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrganization();
  }, []);

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const navigate = (label: string) => {
    setActive(label);

    if (label === "Dashboard") {
      window.location.href = "/dashboard";
      return;
    }

    if (label === "Grant Matches") {
      window.location.href = "/grant-matches";
      return;
    }

    if (label === "Proposal Generator") {
      window.location.href =
        "/proposal-generator";
      return;
    }

    if (label === "AI Audit") {
      window.location.href = "/ai-audit";
      return;
    }

    if (label === "Documents") {
      window.location.href = "/documents";
      return;
    }

    if (label === "Organization") {
      window.location.href =
        "/organization";
    }
  };

  /* =========================================================
     FORM HELPERS
  ========================================================= */

  const updateField = (
    field: keyof Organization,
    value: string
  ) => {
    setOrganization((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const addFocusArea = () => {
    const value =
      focusAreaInput.trim();

    if (!value) {
      return;
    }

    if (
      organization.focusAreas.some(
        (area) =>
          area.toLowerCase() ===
          value.toLowerCase()
      )
    ) {
      setFocusAreaInput("");
      return;
    }

    setOrganization((previous) => ({
      ...previous,
      focusAreas: [
        ...previous.focusAreas,
        value,
      ],
    }));

    setFocusAreaInput("");
  };

  const removeFocusArea = (
    index: number
  ) => {
    setOrganization((previous) => ({
      ...previous,
      focusAreas:
        previous.focusAreas.filter(
          (_, itemIndex) =>
            itemIndex !== index
        ),
    }));
  };

  /* =========================================================
     SAVE ORGANIZATION
  ========================================================= */

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token =
        localStorage.getItem(
          "grantcraft_token"
        );

      if (!token) {
        throw new Error(
          "Authentication token not found. Please log in again."
        );
      }

      const response = await fetch(
        `${API_URL}/api/organization`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            organization
          ),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to save organization profile."
        );
      }

      setOrganization({
        organizationName:
          data.data.organizationName || "",

        organizationType:
          data.data.organizationType || "",

        location:
          data.data.location || "",

        mission:
          data.data.mission || "",

        focusAreas:
          Array.isArray(
            data.data.focusAreas
          )
            ? data.data.focusAreas
            : [],

        beneficiaries:
          data.data.beneficiaries || "",

        fundingPreferences:
          data.data.fundingPreferences ||
          "",
      });

      setSuccess(
        "Organization profile saved successfully."
      );
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save organization profile."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     NAVIGATION ITEMS
  ========================================================= */

  const navigationItems = [
    ["⌂", "Dashboard"],
    ["✦", "Grant Matches"],
    ["✎", "Proposal Generator"],
    ["◈", "AI Audit"],
    ["↑", "Documents"],
    ["◎", "Organization"],
  ];

  /* =========================================================
     INPUT CLASS
  ========================================================= */

  const inputClass = `w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
    darkMode
      ? "border-white/[0.08] bg-white/[0.025] text-white placeholder:text-white/20 focus:border-cyan-400/40 focus:bg-white/[0.04]"
      : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-300 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100"
  }`;

  const labelClass = `mb-2 block text-[9px] font-bold uppercase tracking-[0.2em] ${
    darkMode
      ? "text-white/30"
      : "text-slate-400"
  }`;

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        darkMode
          ? "bg-[#020617] text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      <CustomCursor />

      {/* =====================================================
          BACKGROUND GLOWS
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className={`absolute left-[10%] top-[-15%] h-[500px] w-[500px] rounded-full blur-3xl ${
            darkMode
              ? "bg-cyan-500/[0.035]"
              : "bg-cyan-300/[0.12]"
          }`}
        />

        <div
          className={`absolute bottom-[-20%] right-[5%] h-[500px] w-[500px] rounded-full blur-3xl ${
            darkMode
              ? "bg-blue-500/[0.03]"
              : "bg-blue-200/[0.10]"
          }`}
        />
      </div>

      <div className="relative flex min-h-screen">

        {/* ===================================================
            SIDEBAR
        =================================================== */}

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
                Grant
                <span className="text-cyan-500">
                  Craft
                </span>
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
            {navigationItems.map(
              ([icon, label]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() =>
                    navigate(label)
                  }
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
              )
            )}
          </nav>

          {/* Bottom */}

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
              Grant intelligence designed for
              evidence, accuracy, and impact.
            </div>
          </div>
        </aside>

        {/* ===================================================
            MAIN
        =================================================== */}

        <main className="min-w-0 flex-1">

          {/* Top bar */}

          <header
            className={`sticky top-0 z-30 border-b backdrop-blur-2xl ${
              darkMode
                ? "border-white/[0.07] bg-slate-950/70"
                : "border-slate-200/80 bg-white/75"
            }`}
          >
            <div className="flex items-center justify-between px-5 py-4 sm:px-8">

              <div>
                <p
                  className={`text-[9px] font-bold uppercase tracking-[0.25em] ${
                    darkMode
                      ? "text-white/25"
                      : "text-slate-400"
                  }`}
                >
                  Workspace
                </p>

                <h2 className="mt-1 text-lg font-bold">
                  Organization
                </h2>
              </div>

              <div className="flex items-center gap-2">

                <button
                  type="button"
                  onClick={() =>
                    setDarkMode(
                      (value) => !value
                    )
                  }
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border text-sm transition ${
                    darkMode
                      ? "border-white/[0.08] bg-white/[0.03] text-white/60 hover:bg-white/[0.06]"
                      : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {darkMode ? "☀" : "◐"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    window.location.href =
                      "/dashboard"
                  }
                  className={`hidden rounded-xl border px-4 py-2 text-xs font-semibold transition sm:block ${
                    darkMode
                      ? "border-white/[0.08] bg-white/[0.03] text-white/60 hover:bg-white/[0.06]"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Dashboard
                </button>
              </div>
            </div>
          </header>

          <section className="px-5 py-8 sm:px-8 lg:py-10">

            {/* Hero */}

            <div className="mb-8">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />

                <span
                  className={`text-[9px] font-bold uppercase tracking-[0.25em] ${
                    darkMode
                      ? "text-cyan-300/60"
                      : "text-cyan-600"
                  }`}
                >
                  NGO Workspace
                </span>
              </div>

              <h1 className="max-w-3xl text-3xl font-black tracking-tight sm:text-4xl">
                Tell GrantCraft about your
                <span className="text-cyan-500">
                  {" "}
                  organization.
                </span>
              </h1>

              <p
                className={`mt-3 max-w-2xl text-sm leading-6 ${
                  darkMode
                    ? "text-white/35"
                    : "text-slate-500"
                }`}
              >
                Keep your organization information
                in one place. GrantCraft can use this
                profile alongside your evidence when
                matching grants and generating
                proposals.
              </p>
            </div>

            {/* Loading */}

            {loading ? (
              <div
                className={`rounded-[26px] border p-10 text-center ${
                  darkMode
                    ? "border-white/[0.07] bg-white/[0.025]"
                    : "border-slate-200 bg-white/80 shadow-sm"
                }`}
              >
                <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-400" />

                <p
                  className={`mt-4 text-sm ${
                    darkMode
                      ? "text-white/40"
                      : "text-slate-500"
                  }`}
                >
                  Loading organization profile...
                </p>
              </div>
            ) : (
              <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">

                {/* =================================================
                    PROFILE FORM
                ================================================= */}

                <div
                  className={`rounded-[26px] border p-5 backdrop-blur-xl sm:p-6 ${
                    darkMode
                      ? "border-white/[0.07] bg-white/[0.025]"
                      : "border-slate-200 bg-white/80 shadow-sm"
                  }`}
                >
                  <div className="mb-7">
                    <p
                      className={`text-[9px] font-bold uppercase tracking-[0.2em] ${
                        darkMode
                          ? "text-white/25"
                          : "text-slate-400"
                      }`}
                    >
                      Organization profile
                    </p>

                    <h3 className="mt-1.5 text-xl font-semibold">
                      Organization details
                    </h3>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">

                    {/* Organization name */}

                    <div>
                      <label className={labelClass}>
                        Organization Name
                      </label>

                      <input
                        value={
                          organization.organizationName
                        }
                        onChange={(event) =>
                          updateField(
                            "organizationName",
                            event.target.value
                          )
                        }
                        placeholder="Your NGO name"
                        className={inputClass}
                      />
                    </div>

                    {/* Organization type */}

                    <div>
                      <label className={labelClass}>
                        Organization Type
                      </label>

                      <input
                        value={
                          organization.organizationType
                        }
                        onChange={(event) =>
                          updateField(
                            "organizationType",
                            event.target.value
                          )
                        }
                        placeholder="Nonprofit, NGO, Foundation..."
                        className={inputClass}
                      />
                    </div>

                    {/* Location */}

                    <div className="sm:col-span-2">
                      <label className={labelClass}>
                        Location
                      </label>

                      <input
                        value={
                          organization.location
                        }
                        onChange={(event) =>
                          updateField(
                            "location",
                            event.target.value
                          )
                        }
                        placeholder="City, State, Country"
                        className={inputClass}
                      />
                    </div>

                    {/* Mission */}

                    <div className="sm:col-span-2">
                      <label className={labelClass}>
                        Mission
                      </label>

                      <textarea
                        value={
                          organization.mission
                        }
                        onChange={(event) =>
                          updateField(
                            "mission",
                            event.target.value
                          )
                        }
                        placeholder="Describe your organization's mission..."
                        rows={5}
                        className={`${inputClass} resize-none`}
                      />
                    </div>

                    {/* Beneficiaries */}

                    <div className="sm:col-span-2">
                      <label className={labelClass}>
                        Primary Beneficiaries
                      </label>

                      <input
                        value={
                          organization.beneficiaries
                        }
                        onChange={(event) =>
                          updateField(
                            "beneficiaries",
                            event.target.value
                          )
                        }
                        placeholder="Who does your organization serve?"
                        className={inputClass}
                      />
                    </div>

                    {/* Funding */}

                    <div className="sm:col-span-2">
                      <label className={labelClass}>
                        Funding Preferences
                      </label>

                      <textarea
                        value={
                          organization.fundingPreferences
                        }
                        onChange={(event) =>
                          updateField(
                            "fundingPreferences",
                            event.target.value
                          )
                        }
                        placeholder="What types of grants or funding are you looking for?"
                        rows={4}
                        className={`${inputClass} resize-none`}
                      />
                    </div>

                  </div>

                  {/* Focus areas */}

                  <div className="mt-6">

                    <label className={labelClass}>
                      Focus Areas
                    </label>

                    <div className="flex flex-wrap gap-2">
                      {organization.focusAreas.map(
                        (area, index) => (
                          <button
                            key={`${area}-${index}`}
                            type="button"
                            onClick={() =>
                              removeFocusArea(
                                index
                              )
                            }
                            className={`group rounded-lg border px-3 py-2 text-xs transition ${
                              darkMode
                                ? "border-cyan-400/15 bg-cyan-400/[0.06] text-cyan-200 hover:border-red-400/20 hover:bg-red-400/[0.06] hover:text-red-300"
                                : "border-cyan-200 bg-cyan-50 text-cyan-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            }`}
                            title="Remove focus area"
                          >
                            {area}
                            <span className="ml-2 opacity-40 group-hover:opacity-100">
                              ×
                            </span>
                          </button>
                        )
                      )}
                    </div>

                    <div className="mt-3 flex gap-2">

                      <input
                        value={
                          focusAreaInput
                        }
                        onChange={(event) =>
                          setFocusAreaInput(
                            event.target.value
                          )
                        }
                        onKeyDown={(event) => {
                          if (
                            event.key ===
                            "Enter"
                          ) {
                            event.preventDefault();
                            addFocusArea();
                          }
                        }}
                        placeholder="Add a focus area..."
                        className={inputClass}
                      />

                      <button
                        type="button"
                        onClick={
                          addFocusArea
                        }
                        className="shrink-0 rounded-xl bg-cyan-400 px-4 text-xs font-bold text-slate-950 transition hover:bg-cyan-300"
                      >
                        Add
                      </button>

                    </div>

                    <p
                      className={`mt-2 text-[10px] ${
                        darkMode
                          ? "text-white/20"
                          : "text-slate-400"
                      }`}
                    >
                      Press Enter or click Add.
                    </p>
                  </div>

                  {/* Messages */}

                  {error && (
                    <div
                      className={`mt-6 rounded-xl border px-4 py-3 text-xs ${
                        darkMode
                          ? "border-red-400/15 bg-red-400/[0.05] text-red-300"
                          : "border-red-200 bg-red-50 text-red-600"
                      }`}
                    >
                      {error}
                    </div>
                  )}

                  {success && (
                    <div
                      className={`mt-6 rounded-xl border px-4 py-3 text-xs ${
                        darkMode
                          ? "border-emerald-400/15 bg-emerald-400/[0.05] text-emerald-300"
                          : "border-emerald-200 bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      {success}
                    </div>
                  )}

                  {/* Save */}

                  <div className="mt-7 flex justify-end">

                    <button
                      type="button"
                      onClick={
                        handleSave
                      }
                      disabled={saving}
                      className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-[0_12px_35px_rgba(34,211,238,0.12)] transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-300 hover:shadow-[0_0_35px_rgba(34,211,238,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving
                        ? "Saving..."
                        : "Save Organization →"}
                    </button>

                  </div>
                </div>

                {/* =================================================
                    RIGHT SIDE
                ================================================= */}

                <div className="space-y-6">

                  {/* Profile status */}

                  <div
                    className={`rounded-[26px] border p-6 backdrop-blur-xl ${
                      darkMode
                        ? "border-white/[0.07] bg-white/[0.025]"
                        : "border-slate-200 bg-white/80 shadow-sm"
                    }`}
                  >
                    <div className="mb-5 flex items-center justify-between">

                      <span
                        className={`text-[9px] font-bold uppercase tracking-[0.2em] ${
                          darkMode
                            ? "text-white/25"
                            : "text-slate-400"
                        }`}
                      >
                        Workspace status
                      </span>

                      <span className="flex items-center gap-1.5 text-[9px] text-emerald-500">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                        Ready
                      </span>

                    </div>

                    <div className="flex items-center gap-4">

                      <div
                        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border ${
                          darkMode
                            ? "border-cyan-400/20 bg-cyan-400/[0.06]"
                            : "border-cyan-200 bg-cyan-50"
                        }`}
                      >
                        <span className="text-2xl font-black text-cyan-500">
                          {organization.organizationName
                            ? organization.organizationName
                                .charAt(0)
                                .toUpperCase()
                            : "G"}
                        </span>
                      </div>

                      <div className="min-w-0">

                        <p className="truncate text-lg font-bold">
                          {organization.organizationName ||
                            "Your Organization"}
                        </p>

                        <p
                          className={`mt-1 text-xs ${
                            darkMode
                              ? "text-white/30"
                              : "text-slate-400"
                          }`}
                        >
                          {organization.location ||
                            "Location not set"}
                        </p>

                      </div>

                    </div>
                  </div>

                  {/* AI context */}

                  <div
                    className={`rounded-[26px] border p-6 backdrop-blur-xl ${
                      darkMode
                        ? "border-cyan-400/10 bg-cyan-400/[0.025]"
                        : "border-cyan-100 bg-cyan-50/40"
                    }`}
                  >
                    <div className="mb-4 flex items-center gap-2">

                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-500">
                        ✦
                      </span>

                      <div>
                        <p className="text-sm font-bold">
                          AI Context
                        </p>

                        <p
                          className={`text-[10px] ${
                            darkMode
                              ? "text-white/25"
                              : "text-slate-400"
                          }`}
                        >
                          Used by GrantCraft
                        </p>
                      </div>

                    </div>

                    <p
                      className={`text-xs leading-6 ${
                        darkMode
                          ? "text-white/35"
                          : "text-slate-500"
                      }`}
                    >
                      Your organization profile
                      will provide context for
                      grant matching, proposal
                      generation, and future
                      evidence analysis.
                    </p>

                    <div className="mt-5 space-y-3">

                      {[
                        [
                          "Organization",
                          organization.organizationName
                            ? "Added"
                            : "Missing",
                        ],
                        [
                          "Mission",
                          organization.mission
                            ? "Added"
                            : "Missing",
                        ],
                        [
                          "Focus areas",
                          organization.focusAreas
                            .length > 0
                            ? `${organization.focusAreas.length} added`
                            : "Missing",
                        ],
                        [
                          "Beneficiaries",
                          organization.beneficiaries
                            ? "Added"
                            : "Missing",
                        ],
                      ].map(
                        ([label, value]) => (
                          <div
                            key={label}
                            className="flex items-center justify-between"
                          >
                            <span
                              className={`text-[11px] ${
                                darkMode
                                  ? "text-white/30"
                                  : "text-slate-500"
                              }`}
                            >
                              {label}
                            </span>

                            <span
                              className={`text-[10px] font-semibold ${
                                value ===
                                  "Missing"
                                  ? "text-amber-500"
                                  : "text-emerald-500"
                              }`}
                            >
                              {value}
                            </span>
                          </div>
                        )
                      )}

                    </div>
                  </div>

                  {/* Documents shortcut */}

                  <div
                    className={`rounded-[26px] border p-6 backdrop-blur-xl ${
                      darkMode
                        ? "border-white/[0.07] bg-white/[0.025]"
                        : "border-slate-200 bg-white/80 shadow-sm"
                    }`}
                  >
                    <p
                      className={`text-[9px] font-bold uppercase tracking-[0.2em] ${
                        darkMode
                          ? "text-white/25"
                          : "text-slate-400"
                      }`}
                    >
                      Evidence library
                    </p>

                    <h3 className="mt-1.5 text-lg font-semibold">
                      Add supporting documents
                    </h3>

                    <p
                      className={`mt-2 text-xs leading-5 ${
                        darkMode
                          ? "text-white/30"
                          : "text-slate-500"
                      }`}
                    >
                      Upload reports, impact
                      evidence, and program
                      documents to strengthen
                      your AI context.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        window.location.href =
                          "/documents"
                      }
                      className={`mt-5 w-full rounded-xl border px-4 py-3 text-xs font-bold transition ${
                        darkMode
                          ? "border-white/[0.08] bg-white/[0.03] text-white/70 hover:bg-white/[0.06]"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      Open Documents →
                    </button>
                  </div>

                </div>
              </div>
            )}

          </section>
        </main>
      </div>
    </div>
  );
}