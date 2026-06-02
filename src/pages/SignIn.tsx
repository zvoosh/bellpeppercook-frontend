import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import bellpepper from "/icons/bellpepper-green.svg";
import { useLogin, useRegister } from "../hooks/useAuthApi";
const API_URL = import.meta.env.VITE_API_URL;
export default function SignIn() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const isPendingVerification = searchParams.get("verified") === "pending";
  const [tab, setTab] = useState<"signin" | "register">(
    searchParams.get("tab") === "register" ? "register" : "signin",
  );

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const isPending = loginMutation.isPending || registerMutation.isPending;
  const error = loginMutation.error || registerMutation.error;

  const getBackendMessage = (err: unknown): string | null => {
    const msg = (
      err as { response?: { data?: { message?: string | string[] } } }
    )?.response?.data?.message;
    if (!msg) return null;
    const raw = Array.isArray(msg) ? (msg[0] ?? null) : msg;
    return raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : null;
  };

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-green-500/50 transition-colors";

  const labelClass =
    "block text-xs uppercase tracking-widest text-white/35 font-medium mb-2";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === "signin") {
      loginMutation.mutate({ emailOrUsername, password });
    } else {
      if (registerPassword !== confirmPassword) return;
      registerMutation.mutate({
        firstName,
        lastName,
        username,
        email: registerEmail,
        password: registerPassword,
      });
    }
  };

  return (
    <div className="min-h-[65vh] flex items-center justify-center py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <img
            src={bellpepper}
            alt="BellPepperCooks"
            className="w-16 mb-4 opacity-80 select-none"
          />
          <h1 className="text-2xl font-semibold text-white">
            BellPepper<span className="text-green-400">Cooks</span>
          </h1>
        </div>

        {/* Pending verification banner */}
        {isPendingVerification && (
          <div className="mb-6 px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-xl text-sm text-green-400">
            📧 {t("signIn.verifyPending")}
          </div>
        )}

        {/* Card */}
        <div className="bg-white/5 border border-white/8 rounded-2xl p-8">
          {/* Tabs */}
          <div className="flex gap-1 bg-white/5 rounded-full p-1 mb-8">
            {(["signin", "register"] as const).map((tabKey) => (
              <button
                key={tabKey}
                onClick={() => setTab(tabKey)}
                className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  tab === tabKey
                    ? "bg-green-500 text-black"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {tabKey === "signin"
                  ? t("signIn.tabSignIn")
                  : t("signIn.tabRegister")}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
              {tab === "signin"
                ? t("signIn.errorSignIn")
                : (getBackendMessage(registerMutation.error) ??
                  t("signIn.errorRegister"))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {tab === "signin" ? (
              <>
                <div>
                  <label className={labelClass}>
                    {t("signIn.labelEmailOrUsername")}
                  </label>
                  <input
                    type="text"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    className={inputClass}
                    placeholder={t("signIn.placeholderEmailOrUsername")}
                    required
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className={labelClass} style={{ marginBottom: 0 }}>
                      {t("signIn.labelPassword")}
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-white/30 hover:text-green-400 transition-colors"
                    >
                      {t("signIn.forgotPassword")}
                    </Link>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClass}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className={labelClass}>
                      {t("signIn.labelFirstName")}
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={inputClass}
                      placeholder="Dušan"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className={labelClass}>
                      {t("signIn.labelLastName")}
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={inputClass}
                      placeholder="Ilić"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    {t("signIn.labelUsername")}
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={inputClass}
                    placeholder="dusan99"
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>{t("signIn.labelEmail")}</label>
                  <input
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className={inputClass}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    {t("signIn.labelPassword")}
                  </label>
                  <input
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className={inputClass}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    {t("signIn.labelConfirmPassword")}
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`${inputClass} ${
                      confirmPassword && registerPassword !== confirmPassword
                        ? "border-red-500/50"
                        : ""
                    }`}
                    placeholder="••••••••"
                    required
                  />
                  {confirmPassword && registerPassword !== confirmPassword && (
                    <p className="text-xs text-red-400 mt-1.5">
                      {t("signIn.passwordMismatch")}
                    </p>
                  )}
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={
                isPending ||
                (tab === "register" && registerPassword !== confirmPassword)
              }
              className="w-full bg-green-500 hover:bg-green-400 text-black font-medium py-3 rounded-xl text-sm transition-colors cursor-pointer mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending
                ? tab === "signin"
                  ? t("signIn.signingIn")
                  : t("signIn.creatingAccount")
                : tab === "signin"
                  ? t("signIn.buttonSignIn")
                  : t("signIn.buttonCreateAccount")}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-white/25">
              {t("signIn.orContinueWith")}
            </span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          <div className="flex gap-3">
            <a
              href={`${API_URL}/auth/github`}
              className="flex-1 py-2.5 rounded-xl text-sm border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </a>
            <a
              href={`${API_URL}/auth/google`}
              className="flex-1 py-2.5 rounded-xl text-sm border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </a>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-white/25 mt-6">
            {
              t("signIn.termsText", {
                terms: "",
                privacy: "",
              }).split("{{terms}}")[0]
            }
            <Link
              to="/terms"
              className="text-white/40 hover:text-white transition-colors"
            >
              {t("signIn.terms")}{" "}
            </Link>
            {
              t("signIn.termsText", { terms: "", privacy: "" })
                .split("{{terms}}")[1]
                ?.split("{{privacy}}")[0]
            }
            <Link
              to="/privacy"
              className="text-white/40 hover:text-white transition-colors"
            >
              {t("signIn.privacy")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
