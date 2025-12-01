import { useQuery } from "@tanstack/react-query";

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'; 

async function fetchUserRoles(userId: string) {
  const res = await fetch(`${API_BASE}/users/${userId}/roles`);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to fetch user roles");
  }

  return (await res.json()) as string[];
}

export const useUserRole = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["userRoles", userId],
    queryFn: async () => {
      if (!userId) return [];
      return await fetchUserRoles(userId);
    },
    enabled: !!userId,
  });
};
