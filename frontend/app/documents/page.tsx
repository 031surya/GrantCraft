"use client";

import { ChangeEvent, useEffect, useState } from "react";
import CustomCursor from "../components/CustomCursor";

type UploadResult = {
  source: string;
  document_type: string;
  file_type: string;
  documents_loaded: number;
  chunks_created: number;
  status: string;
};

type DocumentRecord = {
  _id: string;
  originalName: string;
  documentType: string;
  fileType: string;
  fileSize: number;
  documentsLoaded: number;
  chunksCreated: number;
  status: string;
  source: string;
  createdAt: string;
};

export default function DocumentsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [active, setActive] = useState("Documents");

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [documentType, setDocumentType] =
    useState("ngo");

  const [uploading, setUploading] =
    useState(false);

  const [uploadResult, setUploadResult] =
    useState<UploadResult | null>(null);

  const [error, setError] = useState("");

  const [documents, setDocuments] =
    useState<DocumentRecord[]>([]);

  const [loadingDocuments, setLoadingDocuments] =
    useState(true);

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
     LOAD PERSISTENT DOCUMENTS
  ========================================================= */

  const loadDocuments = async () => {
    try {
      const token =
        localStorage.getItem("grantcraft_token");

      if (!token) {
        setLoadingDocuments(false);
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/documents",
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
            data.detail ||
            "Unable to load documents."
        );
      }

      setDocuments(data.data || []);
    } catch (documentError) {
      console.error(
        "Document loading error:",
        documentError
      );
    } finally {
      setLoadingDocuments(false);
    }
  };

  useEffect(() => {
    loadDocuments();
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
      window.location.href = "/proposal-generator";
      return;
    }

    if (label === "AI Audit") {
      window.location.href = "/ai-audit";
      return;
    }

    if (label === "Documents") {
      window.location.href = "/documents";
    }
  };

  /* =========================================================
     FILE SELECTION
  ========================================================= */

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    setError("");
    setUploadResult(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase();

    if (
      !extension ||
      !["pdf", "txt", "json"].includes(extension)
    ) {
      setSelectedFile(null);

      setError(
        "Unsupported file type. Please choose a PDF, TXT, or JSON file."
      );

      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setSelectedFile(null);

      setError(
        "File is too large. Maximum file size is 10 MB."
      );

      return;
    }

    setSelectedFile(file);
  };

  /* =========================================================
     UPLOAD
  ========================================================= */

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a document first.");
      return;
    }

    setUploading(true);
    setError("");
    setUploadResult(null);

    try {
      const token =
        localStorage.getItem("grantcraft_token");

      if (!token) {
        throw new Error(
          "Authentication token not found. Please log in again."
        );
      }

      const formData = new FormData();

      formData.append(
        "file",
        selectedFile
      );

      formData.append(
        "document_type",
        documentType
      );

      const response = await fetch(
        "http://localhost:5000/api/documents/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.detail ||
            "Unable to upload document."
        );
      }

      const result =
        data.data as UploadResult;

      setUploadResult(result);

      /*
       * MongoDB is now the source of truth.
       * Reload the persistent document list instead
       * of manually creating a temporary frontend item.
       */
      await loadDocuments();

      setSelectedFile(null);

      const input =
        document.getElementById(
          "document-upload"
        ) as HTMLInputElement | null;

      if (input) {
        input.value = "";
      }
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload document."
      );
    } finally {
      setUploading(false);
    }
  };

  /* =========================================================
     HELPERS
  ========================================================= */

  const formatFileSize = (
    bytes: number
  ) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (
    fileName: string
  ) => {
    const extension =
      fileName
        .split(".")
        .pop()
        ?.toLowerCase();

    if (extension === "pdf") return "PDF";
    if (extension === "json") return "{}";

    return "TXT";
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
  ];

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
            MAIN CONTENT
        =================================================== */}

        <main className="min-w-0 flex-1">

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
                  Documents
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
                  {darkMode ? "☀" : "☾"}
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
                  Evidence Workspace
                </span>
              </div>

              <h1 className="max-w-3xl text-3xl font-black tracking-tight sm:text-4xl">
                Build your evidence
                <span className="text-cyan-500">
                  {" "}
                  library.
                </span>
              </h1>

              <p
                className={`mt-3 max-w-2xl text-sm leading-6 ${
                  darkMode
                    ? "text-white/35"
                    : "text-slate-500"
                }`}
              >
                Upload program reports, impact
                evidence, grant documents, and
                supporting material. GrantCraft
                indexes your documents so the AI
                can work from reliable evidence.
              </p>
            </div>

            {/* Stats */}
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              {[
                [
                  "Documents",
                  documents.length.toString(),
                  "Indexed documents",
                ],
                [
                  "Chunks",
                  documents
                    .reduce(
                      (sum, item) =>
                        sum + item.chunksCreated,
                      0
                    )
                    .toString(),
                  "Indexed evidence",
                ],
                [
                  "Engine",
                  "Online",
                  "Chroma + RAG",
                ],
              ].map(
                ([title, value, subtitle]) => (
                  <div
                    key={title}
                    className={`rounded-2xl border p-5 backdrop-blur-xl ${
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
                      {title}
                    </p>

                    <p className="mt-2 text-2xl font-black">
                      {value}
                    </p>

                    <p
                      className={`mt-1 text-[10px] ${
                        darkMode
                          ? "text-white/25"
                          : "text-slate-400"
                      }`}
                    >
                      {subtitle}
                    </p>
                  </div>
                )
              )}
            </div>

            {/* Main cards */}
            <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">

              {/* Upload */}
              <div
                className={`rounded-[26px] border p-5 backdrop-blur-xl sm:p-6 ${
                  darkMode
                    ? "border-white/[0.07] bg-white/[0.025]"
                    : "border-slate-200 bg-white/80 shadow-sm"
                }`}
              >
                <div className="mb-6">
                  <p
                    className={`text-[9px] font-bold uppercase tracking-[0.2em] ${
                      darkMode
                        ? "text-white/25"
                        : "text-slate-400"
                    }`}
                  >
                    Document ingestion
                  </p>

                  <h3 className="mt-1.5 text-xl font-semibold">
                    Upload source material
                  </h3>

                  <p
                    className={`mt-2 max-w-xl text-xs leading-5 ${
                      darkMode
                        ? "text-white/30"
                        : "text-slate-500"
                    }`}
                  >
                    GrantCraft will read the document,
                    split it into evidence chunks,
                    generate embeddings, and index
                    them in the RAG knowledge base.
                  </p>
                </div>

                {/* File selector */}
                <label
                  htmlFor="document-upload"
                  className={`group flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center transition-all duration-300 ${
                    darkMode
                      ? "border-white/[0.10] bg-white/[0.018] hover:border-cyan-400/30 hover:bg-cyan-400/[0.025]"
                      : "border-slate-300 bg-slate-50/60 hover:border-cyan-300 hover:bg-cyan-50/40"
                  }`}
                >
                  <div
                    className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border text-xl transition ${
                      darkMode
                        ? "border-cyan-400/15 bg-cyan-400/[0.06] text-cyan-300 group-hover:bg-cyan-400/[0.10]"
                        : "border-cyan-200 bg-cyan-50 text-cyan-600 group-hover:bg-cyan-100"
                    }`}
                  >
                    ↑
                  </div>

                  {selectedFile ? (
                    <>
                      <p className="max-w-md truncate text-sm font-bold">
                        {selectedFile.name}
                      </p>

                      <p
                        className={`mt-1 text-[11px] ${
                          darkMode
                            ? "text-white/30"
                            : "text-slate-400"
                        }`}
                      >
                        {formatFileSize(
                          selectedFile.size
                        )}
                      </p>

                      <p className="mt-3 text-[10px] font-semibold text-cyan-500">
                        Click to change document
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-bold">
                        Choose a document
                      </p>

                      <p
                        className={`mt-2 text-[11px] ${
                          darkMode
                            ? "text-white/25"
                            : "text-slate-400"
                        }`}
                      >
                        PDF, TXT, or JSON · Maximum 10 MB
                      </p>
                    </>
                  )}

                  <input
                    id="document-upload"
                    type="file"
                    accept=".pdf,.txt,.json"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {/* Type + Upload */}
                <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                  <div>
                    <label
                      className={`mb-2 block text-[9px] font-bold uppercase tracking-[0.2em] ${
                        darkMode
                          ? "text-white/25"
                          : "text-slate-400"
                      }`}
                    >
                      Document Type
                    </label>

                    <select
                      value={documentType}
                      onChange={(event) =>
                        setDocumentType(
                          event.target.value
                        )
                      }
                      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                        darkMode
                          ? "border-white/[0.08] bg-white/[0.03] text-white focus:border-cyan-400/40"
                          : "border-slate-200 bg-white text-slate-700 focus:border-cyan-300"
                      }`}
                    >
                      <option value="ngo">
                        NGO Program / Evidence
                      </option>

                      <option value="grant">
                        Grant Document
                      </option>

                      <option value="uploaded">
                        Other Document
                      </option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={
                      uploading ||
                      !selectedFile
                    }
                    className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-[0_12px_35px_rgba(34,211,238,0.12)] transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-300 hover:shadow-[0_0_35px_rgba(34,211,238,0.22)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {uploading
                      ? "Indexing..."
                      : "Upload & Index →"}
                  </button>
                </div>

                {/* Error */}
                {error && (
                  <div
                    className={`mt-4 rounded-xl border px-4 py-3 text-xs ${
                      darkMode
                        ? "border-red-400/15 bg-red-400/[0.04] text-red-300"
                        : "border-red-200 bg-red-50 text-red-600"
                    }`}
                  >
                    {error}
                  </div>
                )}

                {/* Success */}
                {uploadResult && (
                  <div
                    className={`mt-5 rounded-2xl border p-4 ${
                      darkMode
                        ? "border-emerald-400/15 bg-emerald-400/[0.035]"
                        : "border-emerald-200 bg-emerald-50/70"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-500">
                        ✓
                      </div>

                      <div>
                        <p className="text-sm font-semibold">
                          Document indexed successfully
                        </p>

                        <p
                          className={`mt-0.5 text-[10px] ${
                            darkMode
                              ? "text-white/25"
                              : "text-slate-400"
                          }`}
                        >
                          {uploadResult.source}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <div>
                        <p
                          className={`text-[8px] font-bold uppercase tracking-[0.18em] ${
                            darkMode
                              ? "text-white/20"
                              : "text-slate-400"
                          }`}
                        >
                          Loaded
                        </p>

                        <p className="mt-1 text-lg font-bold">
                          {
                            uploadResult.documents_loaded
                          }
                        </p>
                      </div>

                      <div>
                        <p
                          className={`text-[8px] font-bold uppercase tracking-[0.18em] ${
                            darkMode
                              ? "text-white/20"
                              : "text-slate-400"
                          }`}
                        >
                          Chunks
                        </p>

                        <p className="mt-1 text-lg font-bold">
                          {
                            uploadResult.chunks_created
                          }
                        </p>
                      </div>

                      <div>
                        <p
                          className={`text-[8px] font-bold uppercase tracking-[0.18em] ${
                            darkMode
                              ? "text-white/20"
                              : "text-slate-400"
                          }`}
                        >
                          Status
                        </p>

                        <p className="mt-1 text-lg font-bold text-emerald-500">
                          Indexed
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right column */}
              <div className="space-y-6">

                {/* Pipeline */}
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
                        ? "text-white/25"
                        : "text-slate-400"
                    }`}
                  >
                    AI Pipeline
                  </p>

                  <h3 className="mt-1.5 text-lg font-semibold">
                    How your evidence flows
                  </h3>

                  <div className="mt-5 space-y-3">
                    {[
                      [
                        "01",
                        "Ingestion",
                        "Read source material",
                      ],
                      [
                        "02",
                        "Chunking",
                        "Create searchable evidence",
                      ],
                      [
                        "03",
                        "Embeddings",
                        "Convert evidence into vectors",
                      ],
                      [
                        "04",
                        "Chroma",
                        "Store evidence for retrieval",
                      ],
                    ].map(
                      (item) => (
                        <div
                          key={item[0]}
                          className={`flex items-center gap-3 rounded-xl border p-3 ${
                            darkMode
                              ? "border-white/[0.05] bg-white/[0.015]"
                              : "border-slate-200/80 bg-slate-50/50"
                          }`}
                        >
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[9px] font-bold ${
                              darkMode
                                ? "bg-cyan-400/[0.07] text-cyan-300"
                                : "bg-cyan-50 text-cyan-600"
                            }`}
                          >
                            {item[0]}
                          </div>

                          <div>
                            <p className="text-xs font-semibold">
                              {item[1]}
                            </p>

                            <p
                              className={`mt-0.5 text-[10px] ${
                                darkMode
                                  ? "text-white/25"
                                  : "text-slate-400"
                              }`}
                            >
                              {item[2]}
                            </p>
                          </div>

                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Recent uploads */}
                <div
                  className={`rounded-[26px] border p-5 backdrop-blur-xl sm:p-6 ${
                    darkMode
                      ? "border-white/[0.07] bg-white/[0.025]"
                      : "border-slate-200 bg-white/80 shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`text-[9px] font-bold uppercase tracking-[0.2em] ${
                          darkMode
                            ? "text-white/25"
                            : "text-slate-400"
                        }`}
                      >
                        Evidence
                      </p>

                      <h3 className="mt-1 text-lg font-semibold">
                        Recent uploads
                      </h3>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${
                        darkMode
                          ? "bg-white/[0.04] text-white/40"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {documents.length}
                    </span>
                  </div>

                  {loadingDocuments ? (
                    <div
                      className={`mt-5 rounded-xl border border-dashed p-5 text-center ${
                        darkMode
                          ? "border-white/[0.07] text-white/20"
                          : "border-slate-200 text-slate-400"
                      }`}
                    >
                      <div className="text-2xl animate-pulse">
                        ◌
                      </div>

                      <p className="mt-2 text-[11px]">
                        Loading your documents...
                      </p>
                    </div>
                  ) : documents.length === 0 ? (
                    <div
                      className={`mt-5 rounded-xl border border-dashed p-5 text-center ${
                        darkMode
                          ? "border-white/[0.07] text-white/20"
                          : "border-slate-200 text-slate-400"
                      }`}
                    >
                      <div className="text-2xl">
                        ↑
                      </div>

                      <p className="mt-2 text-[11px]">
                        Your indexed documents
                        will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-5 space-y-2.5">
                      {documents.map(
                        (document, index) => (
                          <div
                            key={`${document._id}-${index}`}
                            className={`flex items-center gap-3 rounded-xl border p-3 ${
                              darkMode
                                ? "border-white/[0.05] bg-white/[0.015]"
                                : "border-slate-200 bg-white"
                            }`}
                          >
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[8px] font-black ${
                                darkMode
                                  ? "bg-cyan-400/[0.07] text-cyan-300"
                                  : "bg-cyan-50 text-cyan-600"
                              }`}
                            >
                              {getFileIcon(
                                document.originalName
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[11px] font-semibold">
                                {document.originalName}
                              </p>

                              <p
                                className={`mt-0.5 text-[9px] ${
                                  darkMode
                                    ? "text-white/20"
                                    : "text-slate-400"
                                }`}
                              >
                                {document.documentType} ·{" "}
                                {formatFileSize(
                                  document.fileSize
                                )}{" "}
                                ·{" "}
                                {
                                  document.chunksCreated
                                }{" "}
                                chunks
                              </p>
                            </div>

                            <span className="text-[9px] font-bold text-emerald-500">
                              {document.status === "indexed"
                                ? "Indexed"
                                : document.status}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer note */}
            <div
              className={`mt-6 rounded-2xl border px-5 py-4 ${
                darkMode
                  ? "border-white/[0.05] bg-white/[0.015]"
                  : "border-slate-200 bg-white/60"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-cyan-500">
                  ◈
                </span>

                <div>
                  <p className="text-xs font-semibold">
                    Evidence-first intelligence
                  </p>

                  <p
                    className={`mt-1 text-[10px] leading-5 ${
                      darkMode
                        ? "text-white/25"
                        : "text-slate-400"
                    }`}
                  >
                    Uploaded evidence can power
                    Grant Matching, Proposal
                    Generation, and AI Audit while
                    keeping GrantCraft grounded in
                    your source material.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}