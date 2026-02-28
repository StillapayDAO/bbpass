import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";

interface User {
  id: string;
  name: string;
  email: string;
}

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      setUser(null);
      window.location.href = "/";
    },
  });

  useEffect(() => {
    // Fetch current user
    const fetchUser = async () => {
      try {
        // This would be implemented based on your auth system
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    loading,
    logout: () => logoutMutation.mutate(),
  };
}
