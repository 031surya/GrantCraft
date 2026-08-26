"use client";

import {
  FormEvent,
  Suspense,
  useEffect,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import CustomCursor from "../components/CustomCursor";
import { API_URL } from "../../lib/api";

function ResetPasswordContent() {
  const searchParams = useSearchParams();

  const [darkMode, setDarkMode] = useState(false);
  const [token, setToken] = useState("");

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // GET TOKEN FROM URL
  // =====================================================

  useEffect(() => {
    const urlToken = searchParams.get("token");

    if (urlToken) {
      setToken(urlToken);
    } else {
      setError(
        "Reset token is missing. Please request a new password reset link."
      );
    }
  }, [searchParams]);

  // =====================================================
  // RESET PASSWORD
  // =====================================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!token) {
      setError(
        "Reset token is missing. Please request a new reset link."
      );
      return;
    }

    if (newPassword.length < 8) {
      setError(
        "Password must be at least 8 characters long."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            resetToken: token,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message ||
            "Unable to reset your password."
        );
        return;
      }

      setSuccess(true);
    } catch (error) {
      console.error("Reset password error:", error);

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
      <CustomCursor />

      {/* =====================================================
          BACKGROUND
          ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div
          className={`absolute -left-40 -top-40 h-96 w-96 rounded-full blur-3xl ${
            darkMode
              ? "bg-cyan-500/10"
              : "bg-cyan-300/20"
          }`}
        />

        <div
          className={`absolute -bottom-40 -right-40 h-96 w-96 rounded-full blur-3xl ${
            darkMode
              ? "bg-violet-500/10"
              : "bg-violet-300/20"
          }`}
        />

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
          CONTENT
          ===================================================== */}

      <div className="relative z-10 flex min-h-[calc(100vh-96px)] items-center justify-center px-6 py-12">

        <div className="w-full max-w-md">

          {/* Heading */}

          <div className="mb-6 text-center">

            <div className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-500">
              Password Recovery
            </div>

            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Reset your password
            </h1>

            <p
              className={`mx-auto mt-4 max-w-sm text-sm leading-6 ${
                darkMode
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            >
              Create a new secure password for your
              GrantCraft account.
            </p>

          </div>


          {/* Card */}

          <div
            className={`rounded-3xl border p-7 backdrop-blur-xl transition-all duration-500 sm:p-9 ${
              darkMode
                ? "border-white/[0.08] bg-white/[0.045] shadow-[0_25px_80px_rgba(0,0,0,0.45)]"
                : "border-slate-200 bg-white/90 shadow-2xl shadow-slate-900/10"
            }`}
          >

            {!success ? (

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* Email */}

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


                {/* New Password */}

                <div>

                  <label
                    htmlFor="newPassword"
                    className={`mb-2 block text-sm font-semibold ${
                      darkMode
                        ? "text-slate-200"
                        : "text-slate-700"
                    }`}
                  >
                    New password
                  </label>

                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(event) =>
                      setNewPassword(event.target.value)
                    }
                    placeholder="At least 8 characters"
                    required
                    minLength={8}
                    className={`w-full rounded-xl border px-4 py-3.5 text-sm outline-none transition ${
                      darkMode
                        ? "border-white/10 bg-slate-900/70 text-white placeholder:text-slate-600 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
                        : "border-slate-200 bg-slate-50 text-slate-950 placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
                    }`}
                  />

                </div>


                {/* Confirm Password */}

                <div>

                  <label
                    htmlFor="confirmPassword"
                    className={`mb-2 block text-sm font-semibold ${
                      darkMode
                        ? "text-slate-200"
                        : "text-slate-700"
                    }`}
                  >
                    Confirm new password
                  </label>

                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    placeholder="Enter your password again"
                    required
                    minLength={8}
                    className={`w-full rounded-xl border px-4 py-3.5 text-sm outline-none transition ${
                      darkMode
                        ? "border-white/10 bg-slate-900/70 text-white placeholder:text-slate-600 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
                        : "border-slate-200 bg-slate-50 text-slate-950 placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
                    }`}
                  />

                </div>


                {/* Error */}

                {error && (
                  <div className="rounded-xl border border-red-300/30 bg-red-500/5 px-4 py-3 text-sm text-red-500">
                    {error}
                  </div>
                )}


                {/* Reset Button */}

                <button
                  type="submit"
                  disabled={loading || !token}
                  className={`w-full rounded-xl px-5 py-3.5 text-sm font-bold shadow-lg transition duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 ${
                    darkMode
                      ? "bg-white text-slate-950 hover:bg-cyan-400 hover:shadow-cyan-500/20"
                      : "bg-slate-950 text-white hover:bg-cyan-500 hover:shadow-cyan-500/20"
                  }`}
                >
                  {loading
                    ? "Resetting Password..."
                    : "Reset Password →"}
                </button>

              </form>

            ) : (

              /* =================================================
                 SUCCESS
                 ================================================= */

              <div className="text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-500">

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
                  Password reset!
                </h2>

                <p
                  className={`mt-3 text-sm leading-6 ${
                    darkMode
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  Your password has been changed
                  successfully. You can now sign in with
                  your new password.
                </p>

                <a
                  href="/login"
                  className="mt-7 inline-block rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:bg-cyan-400"
                >
                  Continue to Sign In →
                </a>

              </div>

            )}

          </div>


          {/* Footer */}

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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900">
          <div className="text-sm font-medium">
            Loading reset password...
          </div>
        </main>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}