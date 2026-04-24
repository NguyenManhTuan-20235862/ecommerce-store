import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import * as z from "zod";
import { useAuthStore } from "../../store/authStore";

const registerVisualImage =
  "http://localhost:3845/assets/aec4604bd250f33c1be4b439a65cba03f14008f2.png";
const appleIconImage =
  "http://localhost:3845/assets/b54c8fa45987f5a1e48251579a1dad9f54367584.svg";

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Vui lòng nhập họ và tên"),
    username: z.string().min(4, "Username ít nhất 4 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
    confirmPassword: z.string().min(6, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
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

export default function Register() {
  const navigate = useNavigate();
  const {
    register: registerApi,
    login,
    isLoading,
    isAuthenticated,
  } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    const cleanedFullName = data.fullName.trim().replace(/\s+/g, " ");
    const nameParts = cleanedFullName.split(" ");
    const lastName = nameParts[0] || cleanedFullName;
    const firstName =
      nameParts.slice(1).join(" ") || nameParts[0] || cleanedFullName;

    const success = await registerApi({
      firstName,
      lastName,
      username: data.username.trim(),
      email: data.email.trim(),
      password: data.password,
    });

    if (success) {
      const loginSuccess = await login({
        identifier: data.email.trim(),
        password: data.password,
      });

      if (loginSuccess) {
        navigate("/home", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f9f6f5]">
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center opacity-20">
        <p className="font-heading text-[72px] font-extrabold uppercase tracking-[-0.04em] text-[#dfdcdc] sm:text-[110px]">
          VIBE URBAN
        </p>
        <p className="-mt-3 font-heading text-[72px] font-extrabold uppercase tracking-[-0.04em] text-[#dfdcdc] sm:text-[110px]">
          KINETIC PULSE
        </p>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center bg-[rgba(24,24,27,0.4)] p-4 backdrop-blur-[2px] sm:p-6 lg:p-8">
        <section className="flex w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-[0_12px_24px_rgba(0,75,227,0.08)] md:min-h-215">
          <aside className="relative hidden w-[42%] overflow-hidden md:block">
            <img
              src={registerVisualImage}
              alt="Editorial visual"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[rgba(0,75,227,0.2)] mix-blend-multiply" />
            <div className="absolute inset-x-8 bottom-10 space-y-3 text-white">
              <p className="font-heading text-[49px] font-extrabold italic uppercase leading-[0.9] tracking-[-0.04em]">
                VIBE
                <br />
                URBAN
              </p>
              <p className="text-sm uppercase tracking-[0.06em] text-white/90">
                The kinetic pulse of saigon streets.
              </p>
            </div>
          </aside>

          <div className="relative w-full p-5 sm:p-8 md:w-[58%] md:px-10 md:pb-10 md:pt-8 lg:px-12">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-[#5c5b5b] transition hover:bg-black/5"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-2 pb-5 pr-9 sm:pb-6 sm:pr-10">
              <h1 className="font-heading text-[32px] font-extrabold uppercase leading-none tracking-[-0.05em] text-[#2f2f2e] sm:text-[40px] lg:text-[46px]">
                CREATE YOUR{" "}
                <span className="italic text-[#004be3]">IDENTITY</span>
              </h1>
              <p className="text-sm text-[#5c5b5b] sm:text-base">
                Tạo tài khoản để tham gia cộng đồng thời trang đường phố.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2.5 pb-5 sm:gap-3 sm:pb-6">
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

            <div className="pb-5 sm:pb-6">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-black/15" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#787676]">
                  or via email
                </span>
                <div className="h-px flex-1 bg-black/15" />
              </div>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-5"
            >
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#5c5b5b]">
                  Full Name
                </label>
                <input
                  {...register("fullName")}
                  type="text"
                  autoComplete="name"
                  className={`w-full rounded-xl border bg-[#f3f0ef] px-4 py-3.5 text-sm text-[#2f2f2e] outline-none transition placeholder:text-[#afadac] focus:border-[#004be3] sm:px-5 ${
                    errors.fullName ? "border-red-400" : "border-transparent"
                  }`}
                  placeholder="Nguyen Van A"
                />
                {errors.fullName ? (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.fullName.message}
                  </p>
                ) : null}
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#5c5b5b]">
                  Email Address
                </label>
                <input
                  {...register("email")}
                  type="email"
                  autoComplete="email"
                  className={`w-full rounded-xl border bg-[#f3f0ef] px-4 py-3.5 text-sm text-[#2f2f2e] outline-none transition placeholder:text-[#afadac] focus:border-[#004be3] sm:px-5 ${
                    errors.email ? "border-red-400" : "border-transparent"
                  }`}
                  placeholder="pulse@vibeurban.vn"
                />
                {errors.email ? (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.email.message}
                  </p>
                ) : null}
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#5c5b5b]">
                  Username
                </label>
                <input
                  {...register("username")}
                  type="text"
                  autoComplete="username"
                  className={`w-full rounded-xl border bg-[#f3f0ef] px-4 py-3.5 text-sm text-[#2f2f2e] outline-none transition placeholder:text-[#afadac] focus:border-[#004be3] sm:px-5 ${
                    errors.username ? "border-red-400" : "border-transparent"
                  }`}
                  placeholder="kineticpulse"
                />
                {errors.username ? (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.username.message}
                  </p>
                ) : null}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#5c5b5b]">
                    Password
                  </label>
                  <input
                    {...register("password")}
                    type="password"
                    autoComplete="new-password"
                    className={`w-full rounded-xl border bg-[#f3f0ef] px-4 py-3.5 text-sm text-[#2f2f2e] outline-none transition placeholder:text-[#afadac] focus:border-[#004be3] sm:px-5 ${
                      errors.password ? "border-red-400" : "border-transparent"
                    }`}
                    placeholder="••••••••"
                  />
                  {errors.password ? (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.password.message}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#5c5b5b]">
                    Confirm
                  </label>
                  <input
                    {...register("confirmPassword")}
                    type="password"
                    autoComplete="new-password"
                    className={`w-full rounded-xl border bg-[#f3f0ef] px-4 py-3.5 text-sm text-[#2f2f2e] outline-none transition placeholder:text-[#afadac] focus:border-[#004be3] sm:px-5 ${
                      errors.confirmPassword
                        ? "border-red-400"
                        : "border-transparent"
                    }`}
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword ? (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  ) : null}
                </div>
              </div>

              <label className="flex items-start gap-3 py-1 text-xs leading-5 text-[#5c5b5b]">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-[#afadac] text-[#004be3] focus:ring-[#004be3]"
                />
                <span>
                  By creating an account, I agree to the Terms of Service and
                  Privacy Policy.
                </span>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#004be3_0%,#819bff_100%)] px-6 py-4 text-base font-bold uppercase tracking-[-0.01em] text-white shadow-[0_12px_24px_rgba(0,75,227,0.08)] transition hover:brightness-105 sm:text-[17px] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                SECURE YOUR ACCESS
              </button>
            </form>

            <div className="mt-8 border-t border-black/10 pt-5 text-center text-sm text-[#5c5b5b]">
              Already in the loop?{" "}
              <Link
                to="/login"
                className="font-semibold uppercase text-[#004be3]"
              >
                LOGIN NOW
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
