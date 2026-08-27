import { useState, useEffect } from "react";
import { fetchApi } from "../utils/fetch-api";
import { getErrorMessage } from "../utils/errorHandling";
import { useAuthStore } from "../store/authStore";

export function useFetch<T>(endpoint: string, params?: Record<string, string>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchApi.get<{ data: T }>(endpoint, params);
      setData(result.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    fetchData();
  }, [endpoint, isAuthenticated]);

  return { data, loading, error, refetch: fetchData };
}
