import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import bellpepper from "/icons/bellpepper-green.svg";
import { useLogin, useRegister } from "../hooks/useAuthApi";

export default function SignIn() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
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
                {tabKey === "signin" ? t("signIn.tabSignIn") : t("signIn.tabRegister")}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
              {tab === "signin" ? t("signIn.errorSignIn") : t("signIn.errorRegister")}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {tab === "signin" ? (
              <>
                <div>
                  <label className={labelClass}>{t("signIn.labelEmailOrUsername")}</label>
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
                    <button
                      type="button"
                      className="text-xs text-white/30 hover:text-green-400 transition-colors cursor-pointer"
                    >
                      {t("signIn.forgotPassword")}
                    </button>
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
                    <label className={labelClass}>{t("signIn.labelFirstName")}</label>
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
                    <label className={labelClass}>{t("signIn.labelLastName")}</label>
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
                  <label className={labelClass}>{t("signIn.labelUsername")}</label>
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
                  <label className={labelClass}>{t("signIn.labelPassword")}</label>
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
                  <label className={labelClass}>{t("signIn.labelConfirmPassword")}</label>
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
            <span className="text-xs text-white/25">{t("signIn.orContinueWith")}</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Social */}
          <div className="flex gap-3">
            {["Google", "GitHub"].map((provider) => (
              <button
                key={provider}
                type="button"
                className="flex-1 py-2.5 rounded-xl text-sm border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-colors cursor-pointer"
              >
                {provider}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-white/25 mt-6">
          {t("signIn.termsText", {
            terms: "",
            privacy: "",
          }).split("{{terms}}")[0]}
          <Link to="/terms" className="text-white/40 hover:text-white transition-colors">
            {t("signIn.terms")}
          </Link>
          {t("signIn.termsText", { terms: "", privacy: "" })
            .split("{{terms}}")[1]
            ?.split("{{privacy}}")[0]}
          <Link to="/privacy" className="text-white/40 hover:text-white transition-colors">
            {t("signIn.privacy")}
          </Link>
        </p>
      </div>
    </div>
  );
}
