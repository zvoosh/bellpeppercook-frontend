import { api } from "../lib/axios";

export interface LoginPayload {
  emailOrUsername: string; // backend očekuje ovo, ne "email"
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  avatarUrl: string | null;
  createdAt: string;
}

// obrisi stari AuthResponse interfejs i zameni sa ovim
export interface AuthResponse {
  user: AuthUser;
  token: string;
}

// naš backend vraća { success, data: { user, accessToken } }
// ova funkcija to pretvara u { user, token } koji AuthProvider očekuje
function mapResponse(data: {
  user: AuthUser;
  accessToken: string;
}): AuthResponse {
  return {
    user: data.user,
    token: data.accessToken,
  };
}
export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await api.post("/auth/login", payload);
    return mapResponse(res.data);
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const res = await api.post("/auth/register", payload);
    return mapResponse(res.data);
  },

  me: async (): Promise<AuthUser> => {
    const res = await api.get("/auth/me");
    return res.data.data;
  },
};
