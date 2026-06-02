import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context";
import { api } from "../lib/axios";
import bellpepper from "/icons/bellpepper-green.svg";

export default function ForgotPassword() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStatus("loading");

    try {
      await api.post("/auth/forgot-password", { email });
      setStatus("sent");
    } catch {
      setError(t({
        en: "Something went wrong. Please try again.",
        sr: "Nešto je pošlo naopako. Pokušajte ponovo.",
      }));
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <img src={bellpepper} alt="BellPepperCooks" className="w-14 mb-4 opacity-80" />
          <h1 className="text-xl font-semibold text-white">
            BellPepper<span className="text-green-400">Cooks</span>
          </h1>
        </div>

        <div className="bg-white/5 border border-white/8 rounded-2xl p-8">
          {status === "sent" ? (
            // Success state
            <div className="text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">
                  {t({ en: "Check your email", sr: "Proverite email" })}
                </h2>
                <p className="text-white/40 text-sm leading-relaxed">
                  {t({
                    en: `If an account exists for ${email}, we've sent a password reset link. Check your spam folder too.`,
                    sr: `Ako nalog postoji za ${email}, poslali smo link za resetovanje lozinke. Proverite i spam folder.`,
                  })}
                </p>
              </div>
              <Link
                to="/signin"
                className="block w-full py-2.5 rounded-xl text-sm font-medium bg-green-500 hover:bg-green-400 text-black transition-colors text-center"
              >
                {t({ en: "Back to Sign In", sr: "Nazad na prijavu" })}
              </Link>
            </div>
          ) : (
            // Form state
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-lg font-semibold text-white mb-2">
                  {t({ en: "Forgot your password?", sr: "Zaboravili ste lozinku?" })}
                </h2>
                <p className="text-white/40 text-sm">
                  {t({
                    en: "Enter your email and we'll send you a reset link.",
                    sr: "Unesite email i poslaćemo vam link za resetovanje.",
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
                    {t({ en: "Email", sr: "Email" })}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-green-500/50 transition-colors"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-green-500 hover:bg-green-400 text-black font-medium py-3 rounded-xl text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "loading"
                    ? t({ en: "Sending...", sr: "Slanje..." })
                    : t({ en: "Send Reset Link", sr: "Pošalji link za resetovanje" })}
                </button>
              </form>

              <p className="text-center text-sm text-white/30">
                {t({ en: "Remember your password?", sr: "Setili ste se lozinke?" })}{" "}
                <Link to="/signin" className="text-green-400 hover:text-green-300 transition-colors">
                  {t({ en: "Sign in", sr: "Prijavite se" })}
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}