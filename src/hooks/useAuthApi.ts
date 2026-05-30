import { useNavigate } from "react-router-dom";
import { authApi, type LoginPayload, type RegisterPayload } from "../api/auth";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

export function useLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: ({ user, token }) => {
      login(user, token);
      navigate("/");
    },
  });
}

export function useRegister() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: ({ user, token }) => {
      login(user, token);
      navigate("/");
    },
  });
}
