import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "../context";
import { api } from "../lib/axios";
import bellpepper from "/icons/bellpepper-green.svg";

export default function ResetPassword() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError(
        t({ en: "Passwords do not match", sr: "Lozinke se ne podudaraju" }),
      );
      return;
    }

    if (!token) {
      setError(
        t({ en: "Invalid reset link", sr: "Nevažeći link za resetovanje" }),
      );
      return;
    }

    setStatus("loading");

    try {
      await api.post("/auth/reset-password", { token, newPassword });
      setStatus("success");
      setTimeout(() => navigate("/signin"), 3000);
    } catch {
      setError(
        t({
          en: "This link is invalid or has expired. Please request a new one.",
          sr: "Ovaj link je nevažeći ili je istekao. Molimo zatražite novi.",
        }),
      );
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <img
            src={bellpepper}
            alt="BellPepperCooks"
            className="w-14 mb-4 opacity-80"
          />
          <h1 className="text-xl font-semibold text-white">
            BellPepper<span className="text-green-400">Cooks</span>
          </h1>
        </div>

        <div className="bg-white/5 border border-white/8 rounded-2xl p-8">
          {status === "success" ? (
            <div className="text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">
                  {t({ en: "Password reset!", sr: "Lozinka resetovana!" })}
                </h2>
                <p className="text-white/40 text-sm">
                  {t({
                    en: "Your password has been updated. Redirecting to sign in...",
                    sr: "Vaša lozinka je ažurirana. Preusmeravamo na prijavu...",
                  })}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-lg font-semibold text-white mb-2">
                  {t({ en: "Reset your password", sr: "Resetujte lozinku" })}
                </h2>
                <p className="text-white/40 text-sm">
                  {t({
                    en: "Enter your new password below.",
                    sr: "Unesite novu lozinku ispod.",
                  })}
                </p>
              </div>

              {error && (
                <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/35 font-medium mb-2">
                    {t({ en: "New Password", sr: "Nova lozinka" })}
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-green-500/50 transition-colors"
                    placeholder="••••••••"
                    required
                    minLength={8}
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/35 font-medium mb-2">
                    {t({ en: "Confirm Password", sr: "Potvrdite lozinku" })}
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none transition-colors ${
                      confirmPassword && newPassword !== confirmPassword
                        ? "border-red-500/50 focus:border-red-500/50"
                        : "border-white/10 focus:border-green-500/50"
                    }`}
                    placeholder="••••••••"
                    required
                  />
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-red-400 mt-1.5">
                      {t({
                        en: "Passwords do not match",
                        sr: "Lozinke se ne podudaraju",
                      })}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={
                    status === "loading" ||
                    (!!confirmPassword && newPassword !== confirmPassword)
                  }
                  className="w-full bg-green-500 hover:bg-green-400 text-black font-medium py-3 rounded-xl text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "loading"
                    ? t({ en: "Resetting...", sr: "Resetovanje..." })
                    : t({ en: "Reset Password", sr: "Resetuj lozinku" })}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
