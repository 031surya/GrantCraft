"use client";

import { FormEvent, useState } from "react";
import CustomCursor from "../components/CustomCursor";
import { API_URL } from "../../lib/api";

export default function SignupPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // =====================================================
  // FORM STATE
  // =====================================================

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // SIGNUP
  // =====================================================

  const handleSignup = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Unable to create account"
        );
        return;
      }

      setSuccess(
        "Account created successfully. Redirecting..."
      );

      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);
    } catch (error) {
      console.error("Signup error:", error);

      setError(
        "Unable to connect to GrantCraft server. Please try again."
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
          SIGNUP CONTENT
          ===================================================== */}

      <div className="relative z-10 flex min-h-[calc(100vh-96px)] items-center justify-center px-6 py-12">

        <div className="w-full max-w-md">


          {/* =================================================
              HEADING
              ================================================= */}

          <div className="mb-6 text-center">

            <div className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-500">
              Join GrantCraft
            </div>

            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Create your account.
            </h1>

            <p
              className={`mx-auto mt-4 max-w-sm text-sm leading-6 ${
                darkMode
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            >
              Start building smarter, evidence-based grant
              proposals with GrantCraft.
            </p>

          </div>


          {/* =================================================
              SIGNUP CARD
              ================================================= */}

          <div
            className={`rounded-3xl border p-7 backdrop-blur-xl transition-all duration-500 sm:p-9 ${
              darkMode
                ? "border-white/[0.08] bg-white/[0.045] shadow-[0_25px_80px_rgba(0,0,0,0.45)]"
                : "border-slate-200 bg-white/90 shadow-2xl shadow-slate-900/10"
            }`}
          >

            <form
              onSubmit={handleSignup}
              className="space-y-5"
            >

              {/* =================================================
                  FULL NAME
                  ================================================= */}

              <div>

                <label
                  htmlFor="name"
                  className={`mb-2 block text-sm font-semibold ${
                    darkMode
                      ? "text-slate-200"
                      : "text-slate-700"
                  }`}
                >
                  Full name
                </label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Your full name"
                  required
                  className={`w-full rounded-xl border px-4 py-3.5 text-sm outline-none transition ${
                    darkMode
                      ? "border-white/10 bg-slate-900/70 text-white placeholder:text-slate-600 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
                      : "border-slate-200 bg-slate-50 text-slate-950 placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
                  }`}
                />

              </div>


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
                  PASSWORD
                  ================================================= */}

              <div>

                <label
                  htmlFor="password"
                  className={`mb-2 block text-sm font-semibold ${
                    darkMode
                      ? "text-slate-200"
                      : "text-slate-700"
                  }`}
                >
                  Password
                </label>

                <div className="relative">

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Create a password"
                    required
                    className={`w-full rounded-xl border px-4 py-3.5 pr-14 text-sm outline-none transition ${
                      darkMode
                        ? "border-white/10 bg-slate-900/70 text-white placeholder:text-slate-600 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
                        : "border-slate-200 bg-slate-50 text-slate-950 placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-semibold text-slate-400 transition hover:text-cyan-500"
                  >
                    {showPassword
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>

              </div>


              {/* =================================================
                  CONFIRM PASSWORD
                  ================================================= */}

              <div>

                <label
                  htmlFor="confirmPassword"
                  className={`mb-2 block text-sm font-semibold ${
                    darkMode
                      ? "text-slate-200"
                      : "text-slate-700"
                  }`}
                >
                  Confirm password
                </label>

                <div className="relative">

                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value
                      )
                    }
                    placeholder="Confirm your password"
                    required
                    className={`w-full rounded-xl border px-4 py-3.5 pr-14 text-sm outline-none transition ${
                      darkMode
                        ? "border-white/10 bg-slate-900/70 text-white placeholder:text-slate-600 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
                        : "border-slate-200 bg-slate-50 text-slate-950 placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-semibold text-slate-400 transition hover:text-cyan-500"
                  >
                    {showConfirmPassword
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>

              </div>


              {/* =================================================
                  TERMS
                  ================================================= */}

              <label
                className={`flex cursor-pointer items-start gap-2 text-xs leading-5 ${
                  darkMode
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >

                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 accent-cyan-500"
                />

                <span>
                  I agree to the{" "}
                  <a
                    href="#"
                    className="font-semibold text-cyan-500 hover:text-cyan-400"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="font-semibold text-cyan-500 hover:text-cyan-400"
                  >
                    Privacy Policy
                  </a>
                  .
                </span>

              </label>


              {/* =================================================
                  ERROR / SUCCESS MESSAGE
                  ================================================= */}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-medium text-cyan-600 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-400">
                  {success}
                </div>
              )}


              {/* =================================================
                  CREATE ACCOUNT BUTTON
                  ================================================= */}

              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-xl px-5 py-3.5 text-sm font-bold shadow-lg transition duration-300 hover:-translate-y-0.5 ${
                  darkMode
                    ? "bg-white text-slate-950 hover:bg-cyan-400 hover:shadow-cyan-500/20"
                    : "bg-slate-950 text-white hover:bg-cyan-500 hover:shadow-cyan-500/20"
                } ${
                  loading
                    ? "cursor-not-allowed opacity-70"
                    : ""
                }`}
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account →"}
              </button>

            </form>


            {/* =================================================
                GOOGLE SIGN UP DIVIDER
                ================================================= */}

            <div className="my-7 flex items-center gap-4">

              <div
                className={`h-px flex-1 ${
                  darkMode
                    ? "bg-white/10"
                    : "bg-slate-200"
                }`}
              />

              <span
                className={`text-xs ${
                  darkMode
                    ? "text-slate-600"
                    : "text-slate-400"
                }`}
              >
                OR
              </span>

              <div
                className={`h-px flex-1 ${
                  darkMode
                    ? "bg-white/10"
                    : "bg-slate-200"
                }`}
              />

            </div>


            {/* =================================================
                CONTINUE WITH GOOGLE
                ================================================= */}

            <button
              type="button"
              className={`flex w-full items-center justify-center gap-3 rounded-xl border px-5 py-3.5 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 ${
                darkMode
                  ? "border-white/10 bg-white/[0.03] text-slate-200 hover:border-white/20 hover:bg-white/[0.06]"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >

              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >

                <path
                  fill="#4285F4"
                  d="M21.35 12.23c0-.78-.07-1.53-.2-2.25H12v4.26h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.4z"
                />

                <path
                  fill="#34A853"
                  d="M12 21.75c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.93-3.31.93-2.54 0-4.69-1.72-5.46-4.03H3.29v2.53A9.74 9.74 0 0 0 12 21.75z"
                />

                <path
                  fill="#FBBC05"
                  d="M6.54 13.84A5.85 5.85 0 0 1 6.23 12c0-.64.11-1.26.31-1.84V7.63H3.29A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.06 1.04 4.37z"
                />

                <path
                  fill="#EA4335"
                  d="M12 6.13c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.83 3.18 14.63 2.25 12 2.25a9.74 9.74 0 0 0-8.71 5.38l3.25 2.53C7.31 7.85 9.46 6.13 12 6.13z"
                />

              </svg>

              Continue with Google

            </button>


            {/* =================================================
                SIGN IN LINK
                ================================================= */}

            <div className="mt-7 text-center">

              <p
                className={`text-sm ${
                  darkMode
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                Already have an account?
              </p>

              <a
                href="/login"
                className="mt-2 inline-block text-sm font-bold text-cyan-500 transition hover:text-cyan-400"
              >
                Sign in to GrantCraft →
              </a>

            </div>

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
            Secure access to your GrantCraft workspace.
          </p>

        </div>

      </div>

    </main>
  );
}