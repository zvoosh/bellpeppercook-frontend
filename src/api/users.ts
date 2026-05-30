import { api } from "../lib/axios";

export interface PublicUser {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  role: string;
  createdAt: string;
}

export const usersApi = {
  getById: async (id: string): Promise<PublicUser> => {
    const res = await api.get(`/users/${id}`);
    return (res.data?.data ?? res.data) as PublicUser;
  },
};
