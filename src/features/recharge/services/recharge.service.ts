import { ApiError, apiRequest } from "../../../shared/lib/api-client";
import type {
  BuyRechargeRequest,
  BuyRechargeResponse,
  RechargeHistoryResponse,
  Supplier,
} from "../types/recharge.types";

/** Error de recarga con mensaje apto para mostrar al usuario. */
export class RechargeError extends Error {
  readonly rechargeId: string | null;

  constructor(message: string, rechargeId: string | null = null) {
    super(message);
    this.name = "RechargeError";
    this.rechargeId = rechargeId;
  }
}

const GENERIC_BUY_ERROR =
  "No pudimos procesar la recarga. Intenta nuevamente en unos minutos.";

/** `GET /recharge/history`: histórico paginado del usuario autenticado (más recientes primero). */
export function getRechargeHistory(
  token: string,
  page: number,
  size: number,
): Promise<RechargeHistoryResponse> {
  const query = new URLSearchParams({ page: String(page), size: String(size) });
  return apiRequest<RechargeHistoryResponse>(`/recharge/history?${query}`, { token });
}

/** `GET /suppliers`: catálogo de operadores móviles disponibles. */
export function getSuppliers(token: string): Promise<Supplier[]> {
  return apiRequest<Supplier[]>("/suppliers", { token });
}

/** `POST /recharge`: procesa la compra de una recarga para el usuario autenticado. */
export async function buyRecharge(
  token: string,
  payload: BuyRechargeRequest,
): Promise<BuyRechargeResponse> {
  try {
    return await apiRequest<BuyRechargeResponse>("/recharge", {
      method: "POST",
      body: payload,
      token,
    });
  } catch (err) {
    if (!(err instanceof ApiError)) throw err;

    const rechargeId = extractRechargeId(err);

    if (err.status === 422) throw new RechargeError(err.message, rechargeId);
    if (err.status === 502) throw new RechargeError(err.message, rechargeId);
    if (err.status === 400) throw new RechargeError("Verifica los datos de la recarga.");
    if (err.status === 404) throw new RechargeError("El operador seleccionado no está disponible.");
    if (err.status === 0) throw new RechargeError(err.message);
    throw new RechargeError(GENERIC_BUY_ERROR);
  }
}

/** El backend devuelve `rechargeId` en el body del error para 422/502. */
function extractRechargeId(err: ApiError): string | null {
  const body = err.body as { rechargeId?: unknown } | null;
  return typeof body?.rechargeId === "string" ? body.rechargeId : null;
}
