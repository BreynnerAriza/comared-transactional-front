import { useEffect, useState } from "react";
import { ApiError } from "../../../shared/lib/api-client";
import { useAuth } from "../../auth";
import { getRechargeById } from "../services/recharge.service";
import type { RechargeDetail } from "../types/recharge.types";

const GENERIC_ERROR = "No pudimos cargar el comprobante. Intenta nuevamente.";
const NOT_FOUND_ERROR = "La recarga no existe o no está disponible.";

/** Resultado asociado al id consultado, para no mostrar datos de una recarga anterior. */
interface DetailResult {
  id: string;
  detail: RechargeDetail | null;
  error: string | null;
}

/** Consulta el detalle de la recarga `rechargeId` desde el backend. */
export function useRechargeDetail(rechargeId: string) {
  const { session } = useAuth();
  const token = session?.accessToken;

  const [result, setResult] = useState<DetailResult | null>(null);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    getRechargeById(token, rechargeId)
      .then((response) => {
        if (cancelled) return;
        setResult({ id: rechargeId, detail: response, error: null });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setResult({ id: rechargeId, detail: null, error: toErrorMessage(err) });
      });

    return () => {
      cancelled = true;
    };
  }, [rechargeId, token]);

  const current = result?.id === rechargeId ? result : null;
  const loading = !current;

  return { detail: current?.detail ?? null, loading, error: current?.error ?? null };
}

function toErrorMessage(err: unknown): string {
  if (!(err instanceof ApiError)) return GENERIC_ERROR;
  if (err.status === 404) return NOT_FOUND_ERROR;
  if (err.status === 0) return err.message;
  return GENERIC_ERROR;
}
