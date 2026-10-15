import { useCallback, useEffect, useState } from "react";
import { ApiError } from "../../../shared/lib/api-client";
import { useAuth } from "../../../shared/hooks/useAuth";
import { getRechargeHistory } from "../services/recharge.service";
import type { RechargeHistoryResponse } from "../types/recharge.types";

/** Opciones de filas por página que ofrece la tabla. */
export const PAGE_SIZE_OPTIONS = [10, 15, 20] as const;
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];
const GENERIC_ERROR = "No pudimos cargar el histórico de recargas. Intenta nuevamente.";

export function useRechargeHistory() {
  const { session } = useAuth();
  const token = session?.accessToken;

  const [page, setPage] = useState(1);
  const [size, setSize] = useState<PageSize>(PAGE_SIZE_OPTIONS[0]);
  const [reloadKey, setReloadKey] = useState(0);
  const [history, setHistory] = useState<RechargeHistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    // Evita que una respuesta antigua pise a una más reciente (cambios rápidos de página).
    let cancelled = false;

    getRechargeHistory(token, page, size)
      .then((response) => {
        if (cancelled) return;
        setHistory(response);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof ApiError && err.status === 0 ? err.message : GENERIC_ERROR);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token, page, size, reloadKey]);

  // `loading` se activa en los manejadores de eventos (no dentro del efecto) al pedir otra carga.
  const goToPage = useCallback((next: number) => {
    setLoading(true);
    setPage(next);
  }, []);

  const refresh = useCallback(() => {
    setLoading(true);
    setReloadKey((key) => key + 1);
  }, []);

  // Al cambiar el tamaño volvemos a la primera página: la actual podría dejar de existir.
  const changePageSize = useCallback((next: PageSize) => {
    setLoading(true);
    setSize(next);
    setPage(1);
  }, []);

  return { history, loading, error, goToPage, changePageSize, refresh };
}
