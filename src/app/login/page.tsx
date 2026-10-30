
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";

import OrganizationLogo from "@/components/website/OrganizationLogo";

const VERSION = "v26.1.1";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          password: form.password,
          rememberMe,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.success === false) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      window.location.replace("/admin/dashboard");
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FCFAF7] px-4 py-8 sm:py-10">
      {/* Background watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-8 select-none text-center sm:top-10"
      >
        <p className="watermark-text text-[clamp(2.5rem,8vw,6.5rem)] font-bold tracking-tight text-[#7A1F3D]">
          Lifeline Achham
        </p>
      </div>

      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="floating-heart heart-one">♥</div>
        <div className="floating-heart heart-two">♥</div>
        <div className="floating-heart heart-three">♥</div>

        <div className="soft-orb orb-one" />
        <div className="soft-orb orb-two" />

        <svg
          className="absolute left-0 top-[23%] w-full opacity-50"
          viewBox="0 0 1440 180"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M-30 80 C180 -10 230 190 440 100 S760 30 970 110 S1250 160 1470 30"
            stroke="#D7A0B0"
            strokeWidth="1.5"
          />
        </svg>

        <svg
          className="absolute bottom-0 h-44 w-full opacity-70 sm:h-64"
          viewBox="0 0 1440 280"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0 85 C260 150 330 275 700 250 C1030 230 1170 65 1440 15 V280 H0 Z"
            fill="#EAD6DE"
            fillOpacity=".55"
          />
          <path
            d="M0 145 C270 180 400 280 760 260 C1060 240 1230 100 1440 75 V280 H0 Z"
            fill="#E9EEF5"
            fillOpacity=".65"
          />
          <path
            d="M-20 95 C260 155 330 275 700 250 C1030 230 1170 65 1460 15"
            stroke="#D7A0B0"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Login card */}
      <section className="login-card relative z-10 my-auto w-full max-w-[420px] rounded-2xl border border-[#DDE1E8] bg-white/95 p-6 shadow-[0_15px_50px_rgba(23,32,51,0.07)] backdrop-blur-sm sm:p-8">
        {/* Shared organization logo */}
        <div className="mb-5 flex h-[100px] w-full items-center justify-center overflow-hidden">
          <OrganizationLogo
            className="block h-auto max-h-[88px] w-auto max-w-[160px] object-contain"
            fallbackClassName="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#7A1F3D] text-xl font-bold text-white"
          />
        </div>

        {/* Heading */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-[#172033]">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-[#64748B]">
            Sign in to your admin account
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[#253047]"
            >
              Email address
            </label>

            <div className="relative">
              <Mail
                size={19}
                strokeWidth={1.8}
                aria-hidden="true"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#718096]"
              />

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    email: event.target.value,
                  }))
                }
                className="h-12 w-full rounded-lg border border-[#D5DBE5] bg-white pl-11 pr-3 text-sm text-[#172033] outline-none transition placeholder:text-[#9AA5B7] focus:border-[#7A1F3D] focus:ring-2 focus:ring-[#7A1F3D]/10"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[#253047]"
            >
              Password
            </label>

            <div className="relative">
              <LockKeyhole
                size={19}
                strokeWidth={1.8}
                aria-hidden="true"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#718096]"
              />

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                placeholder="Enter your password"
                value={form.password}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    password: event.target.value,
                  }))
                }
                className="h-12 w-full rounded-lg border border-[#D5DBE5] bg-white pl-11 pr-11 text-sm text-[#172033] outline-none transition placeholder:text-[#9AA5B7] focus:border-[#7A1F3D] focus:ring-2 focus:ring-[#7A1F3D]/10"
              />

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#718096] transition hover:text-[#7A1F3D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7A1F3D]/30"
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-[#475569]">
            <input
              type="checkbox"
              name="rememberMe"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="h-4 w-4 rounded border-gray-300 accent-[#7A1F3D]"
            />
            Remember me
          </label>

          {/* Error message */}
          {error && (
            <p
              role="alert"
              aria-live="polite"
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="group flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#7A1F3D] px-4 text-sm font-semibold text-white transition duration-200 hover:bg-[#641830] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <span
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                />
                Signing in...
              </>
            ) : (
              <>
                Sign in
                <ArrowRight
                  size={17}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-7 border-t border-[#E8EBF0] pt-5">
          <div className="flex items-center justify-between gap-3">
            <a
              href="https://www.sudeeppandit.com.np"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-w-0 items-center gap-2 text-xs text-[#64748B] transition hover:text-[#7A1F3D]"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#7A1F3D]/5 text-[#7A1F3D]">
                <ArrowLeft size={14} />
              </span>

              <span>
                Powered by{" "}
                <span className="font-semibold text-[#344054] group-hover:text-[#7A1F3D]">
                  Sudeep Pandit
                </span>
              </span>
            </a>

            <span className="shrink-0 text-xs font-medium text-[#8A94A6]">
              {VERSION}
            </span>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-xs text-[#64748B] transition hover:text-[#7A1F3D]"
            >
              Back to website
            </Link>
          </div>
        </div>
      </section>

      {/* Animations */}
      <style jsx>{`
        .watermark-text {
          opacity: 0.055;
          animation: watermarkFade 5s ease-in-out infinite alternate;
        }

        .floating-heart {
          position: absolute;
          color: #d7a0b0;
          opacity: 0.4;
          animation: floatHeart 7s ease-in-out infinite;
        }

        .heart-one {
          top: 24%;
          left: 9%;
          font-size: 21px;
        }

        .heart-two {
          top: 46%;
          right: 9%;
          font-size: 17px;
          animation-delay: -2s;
        }

        .heart-three {
          bottom: 13%;
          right: 22%;
          font-size: 20px;
          animation-delay: -4s;
        }

        .soft-orb {
          position: absolute;
          width: 180px;
          height: 180px;
          border-radius: 9999px;
          filter: blur(65px);
          opacity: 0.2;
          animation: orbFloat 12s ease-in-out infinite alternate;
        }

        .orb-one {
          top: 14%;
          left: -100px;
          background: #d7a0b0;
        }

        .orb-two {
          right: -100px;
          bottom: 16%;
          background: #b7c9e0;
          animation-delay: -5s;
        }

        .login-card {
          animation: cardEnter 0.6s ease-out both;
        }

        @keyframes floatHeart {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-12px);
          }
        }

        @keyframes orbFloat {
          from {
            transform: translate(0, 0) scale(1);
          }

          to {
            transform: translate(30px, -20px) scale(1.15);
          }
        }

        @keyframes watermarkFade {
          from {
            opacity: 0.035;
          }

          to {
            opacity: 0.07;
          }
        }

        @keyframes cardEnter {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .watermark-text,
          .floating-heart,
          .soft-orb,
          .login-card {
            animation: none !important;
          }
        }
      `}</style>
    </main>
  );
}
