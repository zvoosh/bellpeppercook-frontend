import { useQuery } from "@tanstack/react-query";
import { usersApi } from "../api/users";

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => usersApi.getById(id!),
    enabled: !!id,
  });
}
