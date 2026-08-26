"use client";

import { FormEvent, useState } from "react";
import CustomCursor from "../components/CustomCursor";
import { API_URL } from "../../lib/api";

export default function ForgotPasswordPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // =====================================================
  // FORGOT PASSWORD
  // =====================================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!email.trim()) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message ||
            "Something went wrong. Please try again."
        );
        return;
      }

      setMessage(data.message);
      setSubmitted(true);

    } catch (error) {
      console.error("Forgot password error:", error);

      setError(
        "Unable to connect to GrantCraft. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={`relative min-h-screen overflow-hidden transition-colors duration-500 ${
        darkMode
          ? "bg-[#020617] text-white"
          : "bg-slate-50 text-slate-950"
      }`}
    >

      {/* =====================================================
          CUSTOM CURSOR
          ===================================================== */}

      <CustomCursor />


      {/* =====================================================
          BACKGROUND EFFECTS
          ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Cyan Glow */}

        <div
          className={`absolute -left-40 -top-40 h-96 w-96 rounded-full blur-3xl ${
            darkMode
              ? "bg-cyan-500/10"
              : "bg-cyan-300/20"
          }`}
        />

        {/* Violet Glow */}

        <div
          className={`absolute -bottom-40 -right-40 h-96 w-96 rounded-full blur-3xl ${
            darkMode
              ? "bg-violet-500/10"
              : "bg-violet-300/20"
          }`}
        />

        {/* Center Glow */}

        <div
          className={`absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl ${
            darkMode
              ? "bg-blue-500/5"
              : "bg-blue-300/10"
          }`}
        />

      </div>


      {/* =====================================================
          TOP BAR
          ===================================================== */}

      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">

        {/* Logo */}

        <a href="/" className="flex items-center gap-3">

          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
              darkMode
                ? "border-cyan-400/30 bg-white/5"
                : "border-cyan-400/40 bg-white shadow-[0_8px_30px_rgba(34,211,238,0.15)]"
            }`}
          >
            <span className="text-xl font-black text-cyan-500">
              G
            </span>
          </div>

          <div>

            <div className="text-lg font-bold tracking-tight">
              GrantCraft
            </div>

            <div className="hidden text-[9px] font-semibold uppercase tracking-[0.28em] text-slate-500 sm:block">
              AI Grant Intelligence
            </div>

          </div>

        </a>


        {/* =================================================
            THEME + LOGIN
            ================================================= */}

        <div className="flex items-center gap-3">

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`flex h-10 w-10 items-center justify-center rounded-full border text-lg shadow-sm transition hover:-translate-y-0.5 ${
              darkMode
                ? "border-white/10 bg-white/5 text-slate-200 hover:text-cyan-400"
                : "border-slate-200 bg-white text-slate-700 hover:text-cyan-500"
            }`}
            aria-label="Toggle theme"
          >
            {darkMode ? "☀" : "☾"}
          </button>

          <a
            href="/login"
            className={`hidden rounded-full px-4 py-2 text-sm font-semibold transition sm:block ${
              darkMode
                ? "text-slate-400 hover:text-cyan-400"
                : "text-slate-600 hover:text-cyan-500"
            }`}
          >
            ← Sign In
          </a>

        </div>

      </nav>


      {/* =====================================================
          FORGOT PASSWORD CONTENT
          ===================================================== */}

      <div className="relative z-10 flex min-h-[calc(100vh-96px)] items-center justify-center px-6 py-12">

        <div className="w-full max-w-md">


          {/* =================================================
              HEADING
              ================================================= */}

          <div className="mb-6 text-center">

            <div className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-500">
              Account Recovery
            </div>

            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Forgot your password?
            </h1>

            <p
              className={`mx-auto mt-4 max-w-sm text-sm leading-6 ${
                darkMode
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            >
              Enter the email associated with your GrantCraft
              account and we'll send you a reset link.
            </p>

          </div>


          {/* =================================================
              RECOVERY CARD
              ================================================= */}

          <div
            className={`rounded-3xl border p-7 backdrop-blur-xl transition-all duration-500 sm:p-9 ${
              darkMode
                ? "border-white/[0.08] bg-white/[0.045] shadow-[0_25px_80px_rgba(0,0,0,0.45)]"
                : "border-slate-200 bg-white/90 shadow-2xl shadow-slate-900/10"
            }`}
          >

            {!submitted ? (

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >

                {/* =================================================
                    EMAIL
                    ================================================= */}

                <div>

                  <label
                    htmlFor="email"
                    className={`mb-2 block text-sm font-semibold ${
                      darkMode
                        ? "text-slate-200"
                        : "text-slate-700"
                    }`}
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="you@example.com"
                    required
                    className={`w-full rounded-xl border px-4 py-3.5 text-sm outline-none transition ${
                      darkMode
                        ? "border-white/10 bg-slate-900/70 text-white placeholder:text-slate-600 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
                        : "border-slate-200 bg-slate-50 text-slate-950 placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
                    }`}
                  />

                </div>


                {/* =================================================
                    ERROR
                    ================================================= */}

                {error && (
                  <div className="rounded-xl border border-red-300/30 bg-red-500/5 px-4 py-3 text-sm text-red-500">
                    {error}
                  </div>
                )}


                {/* =================================================
                    SEND RESET LINK
                    ================================================= */}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full rounded-xl px-5 py-3.5 text-sm font-bold shadow-lg transition duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 ${
                    darkMode
                      ? "bg-white text-slate-950 hover:bg-cyan-400 hover:shadow-cyan-500/20"
                      : "bg-slate-950 text-white hover:bg-cyan-500 hover:shadow-cyan-500/20"
                  }`}
                >
                  {loading
                    ? "Sending..."
                    : "Send Reset Link →"}
                </button>

              </form>

            ) : (

              /* =================================================
                 SUCCESS STATE
                 ================================================= */

              <div className="text-center">

                {/* Success Icon */}

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-500">

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m5 12 4 4L19 6"
                    />
                  </svg>

                </div>


                <h2 className="mt-6 text-2xl font-bold">
                  Check your email.
                </h2>

                <p
                  className={`mt-3 text-sm leading-6 ${
                    darkMode
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  {message ||
                    `If an account exists for ${email}, we've sent instructions to reset your password.`}
                </p>


                {/* Back to Login */}

                <a
                  href="/login"
                  className="mt-7 inline-block text-sm font-bold text-cyan-500 transition hover:text-cyan-400"
                >
                  ← Back to Sign In
                </a>

              </div>

            )}

          </div>


          {/* =================================================
              FOOTER
              ================================================= */}

          <p
            className={`mt-7 text-center text-xs ${
              darkMode
                ? "text-slate-600"
                : "text-slate-400"
            }`}
          >
            Secure account recovery powered by GrantCraft.
          </p>

        </div>

      </div>
    </main>
  );
}