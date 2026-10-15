import { useEffect, useState } from "react";
import { ApiError } from "../../../shared/lib/api-client";
import { useAuth } from "../../../shared/hooks/useAuth";
import { getSuppliers } from "../services/recharge.service";
import type { Supplier } from "../types/recharge.types";

const GENERIC_ERROR = "No pudimos cargar los operadores. Intenta nuevamente.";

/** Carga el catálogo de operadores móviles cuando `enabled` es true. */
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

  // Mientras el catálogo esté habilitado y no haya resultado ni error, mostramos carga.
  const loading = enabled && !suppliers && !error;

  return { suppliers, loading, error };
}
