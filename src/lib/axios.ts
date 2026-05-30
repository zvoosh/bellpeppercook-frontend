import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// automatski dodaje token na svaki request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ako token istekne — logout (ali ne na auth endpointima)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const url: string = error.config?.url ?? "";
    const isAuthEndpoint = url.includes("/auth/login") || url.includes("/auth/register");
    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  },
);
