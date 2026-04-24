import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import * as z from "zod";
import { useAuthStore } from "../../store/authStore";

const loginBackgroundImage =
  "http://localhost:3845/assets/b0e4275591c25452f97bc869d14492bcfeca2f59.png";
const appleIconImage =
  "http://localhost:3845/assets/b54c8fa45987f5a1e48251579a1dad9f54367584.svg";

const loginSchema = z.object({
  identifier: z.string().min(1, "Vui lòng nhập email hoặc username"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

function GoogleIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.8 12.23c0-.76-.07-1.49-.19-2.19H12v4.15h5.5a4.7 4.7 0 0 1-2.04 3.08v2.56h3.3c1.93-1.78 3.04-4.4 3.04-7.6Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.75 0 5.06-.91 6.74-2.47l-3.3-2.56c-.92.62-2.1 1-3.44 1-2.64 0-4.88-1.78-5.68-4.18H2.9v2.64A9.98 9.98 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.32 13.79A5.98 5.98 0 0 1 6 12c0-.62.11-1.22.32-1.79V7.57H2.9A10 10 0 0 0 2 12c0 1.61.38 3.14 1.06 4.43l3.26-2.64Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.97c1.5 0 2.84.52 3.9 1.53l2.92-2.92C17.05 2.91 14.74 2 12 2a9.98 9.98 0 0 0-9.1 5.57l3.42 2.64c.8-2.4 3.04-4.24 5.68-4.24Z"
      />
    </svg>
  );
}

function FacebookIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.43H7.08v-3.5h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.88v2.26h3.33l-.53 3.5h-2.8V24C19.61 23.08 24 18.09 24 12.07Z"
      />
    </svg>
  );
}

function AppleIcon({ className = "h-5 w-5" }) {
  return <img src={appleIconImage} alt="" className={className} />;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, isAuthenticated } = useAuthStore();
  const returnTo = location.state?.from || "/home";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(returnTo, { replace: true });
    }
  }, [isAuthenticated, navigate, returnTo]);

  const onSubmit = async (data) => {
    const success = await login({
      identifier: data.identifier.trim(),
      password: data.password,
    });

    if (success) {
      navigate(returnTo, { replace: true });
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f9f6f5]">
      <img
        src={loginBackgroundImage}
        alt="Urban background"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[rgba(24,24,27,0.4)] backdrop-blur-md" />

      <div className="pointer-events-none absolute bottom-8 left-8 hidden font-heading text-[86px] font-extrabold italic uppercase leading-[0.9] tracking-[-0.06em] text-white/20 lg:block">
        <p>VIBE</p>
        <p>URBAN</p>
      </div>
      <div className="pointer-events-none absolute right-8 top-8 hidden h-16 w-16 rounded-full border-4 border-white/20 lg:block" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-5 sm:px-6 sm:py-8 lg:py-10">
        <section className="relative w-full max-w-lg overflow-hidden rounded-xl bg-[#f3f0ef] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="absolute right-5 top-5 inline-flex h-8 w-8 items-center justify-center rounded-full text-[#5c5b5b] transition hover:bg-black/5"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="space-y-7 px-5 pb-8 pt-11 sm:space-y-9 sm:px-9 sm:pb-10 sm:pt-12 lg:space-y-10 lg:px-12">
            <div className="space-y-1.5 sm:space-y-2">
              <p className="font-heading text-2xl font-extrabold italic uppercase tracking-[-0.03em] text-[#004be3]">
                VIBE URBAN
              </p>
              <h1 className="font-heading text-[34px] font-extrabold uppercase leading-[0.95] tracking-[-0.05em] text-[#2f2f2e] sm:text-[42px] lg:text-5xl">
                JOIN THE SQUAD
              </h1>
              <p className="text-sm text-[#5c5b5b] sm:text-[15px] lg:text-base">
                Enter the kinetic pulse of street culture.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2.5 pt-1 sm:gap-3">
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#4285f4] shadow-sm transition hover:border-[#004be3]/30 sm:h-11 sm:px-4 sm:text-sm"
              >
                <GoogleIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                Google
              </button>
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#1877f2] px-3 text-[11px] font-semibold text-white shadow-sm transition hover:brightness-105 sm:h-11 sm:text-xs"
              >
                <FacebookIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                Facebook
              </button>
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#09090b] px-3 text-[11px] font-semibold text-white shadow-sm transition hover:brightness-110 sm:h-11 sm:text-xs"
              >
                <AppleIcon className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                Apple
              </button>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <div className="h-px flex-1 bg-black/10" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5c5b5b]/70">
                or email
              </span>
              <div className="h-px flex-1 bg-black/10" />
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 sm:space-y-6"
            >
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#5c5b5b]">
                  Email Address
                </label>
                <input
                  {...register("identifier")}
                  type="text"
                  autoComplete="username"
                  className={`w-full rounded-xl border bg-white px-4 py-4 text-sm text-[#2f2f2e] outline-none transition placeholder:text-[#afadac] focus:border-[#004be3] sm:px-5 sm:py-4.25 ${
                    errors.identifier ? "border-red-400" : "border-black/10"
                  }`}
                  placeholder="you@kinetic.vibe"
                />
                {errors.identifier ? (
                  <p className="mt-2 text-xs text-red-500">
                    {errors.identifier.message}
                  </p>
                ) : null}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5c5b5b]">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs font-semibold uppercase tracking-[0.06em] text-[#004be3]"
                  >
                    Forgot?
                  </button>
                </div>
                <input
                  {...register("password")}
                  type="password"
                  autoComplete="current-password"
                  className={`w-full rounded-xl border bg-white px-4 py-4 text-sm text-[#2f2f2e] outline-none transition placeholder:text-[#afadac] focus:border-[#004be3] sm:px-5 sm:py-4.25 ${
                    errors.password ? "border-red-400" : "border-black/10"
                  }`}
                  placeholder="••••••••"
                />
                {errors.password ? (
                  <p className="mt-2 text-xs text-red-500">
                    {errors.password.message}
                  </p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#004be3_0%,#819bff_100%)] px-6 py-4.5 text-base font-bold uppercase tracking-[-0.01em] text-white shadow-[0_12px_24px_rgba(0,75,227,0.15)] transition hover:brightness-105 sm:py-5 sm:text-[17px] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                ENTER THE CORE
              </button>
            </form>

            <p className="pt-1 text-center text-sm uppercase text-[#5c5b5b]">
              NOT PART OF THE PULSE?{" "}
              <Link to="/register" className="font-semibold text-[#004be3]">
                SIGN UP NOW
              </Link>
            </p>
          </div>

          <div className="h-2 w-full bg-[linear-gradient(135deg,#004be3_0%,#819bff_100%)]" />
        </section>
      </div>
    </main>
  );
}
