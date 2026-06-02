import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "../context";
import { api } from "../lib/axios";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error",
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    api
      .post("/auth/verify-email", { token })
      .then((res) => {
        const data = res.data?.data ?? res.data;
        login(data.user, data.accessToken);
        setStatus("success");
        setTimeout(() => navigate("/"), 2000);
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        {status === "loading" && (
          <>
            <div className="w-10 h-10 border-2 border-white/20 border-t-green-400 rounded-full animate-spin mx-auto" />
            <p className="text-white/40 text-sm">
              {t({
                en: "Verifying your email...",
                sr: "Verifikacija email adrese...",
              })}
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-5xl">✅</div>
            <h2 className="text-xl font-semibold text-white">
              {t({ en: "Email verified!", sr: "Email potvrđen!" })}
            </h2>
            <p className="text-white/40 text-sm">
              {t({
                en: "Redirecting you to the home page...",
                sr: "Preusmeravamo te na početnu stranicu...",
              })}
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-5xl">❌</div>
            <h2 className="text-xl font-semibold text-white">
              {t({ en: "Invalid link", sr: "Nevažeći link" })}
            </h2>
            <p className="text-white/40 text-sm">
              {t({
                en: "This verification link is invalid or has expired.",
                sr: "Ovaj verifikacioni link je nevažeći ili je istekao.",
              })}
            </p>
            <button
              onClick={() => navigate("/signin")}
              className="text-sm text-green-400 hover:text-green-300 transition-colors"
            >
              {t({ en: "Back to Sign In", sr: "Nazad na prijavu" })}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
