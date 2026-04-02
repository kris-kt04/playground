import { useEffect, useState } from "react";
import { authClient } from "./auth-client";

export function useSession() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSessionData = async () => {
      try {
        const response = await authClient.getSession();
        setSession(response.data?.session || null);
      } catch (error) {
        console.error("Failed to fetch session:", error);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    getSessionData();
  }, []);

  return { session, loading };
}
