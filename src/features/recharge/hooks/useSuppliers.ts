import { useEffect, useState } from "react";
import { ApiError } from "../../../shared/lib/api-client";
import { useAuth } from "../../auth";
import { getSuppliers } from "../services/recharge.service";
import type { Supplier } from "../types/recharge.types";

const GENERIC_ERROR = "No pudimos cargar los operadores. Intenta nuevamente.";

export function useSuppliers(enabled: boolean) {
  const { session } = useAuth();
  const token = session?.accessToken;

  const [suppliers, setSuppliers] = useState<Supplier[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !token) return;

    let cancelled = false;

    getSuppliers(token)
      .then((response) => {
        if (cancelled) return;
        setSuppliers(response);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof ApiError && err.status === 0 ? err.message : GENERIC_ERROR);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, token]);

  const loading = enabled && !suppliers && !error;

  return { suppliers, loading, error };
}
