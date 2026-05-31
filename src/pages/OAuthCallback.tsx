import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userStr = params.get("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        login(user, token);
        navigate("/", { replace: true });
      } catch {
        navigate("/signin", { replace: true });
      }
    } else {
      navigate("/signin", { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-white/20 border-t-green-400 rounded-full animate-spin" />
        <p className="text-white/30 text-sm">Signing you in...</p>
      </div>
    </div>
  );
}
