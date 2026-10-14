import { apiRequest } from "../../../lib/api-client";
import type { RechargeHistoryResponse } from "../types/recharge.types";

/** `GET /recharge/history`: histórico paginado del usuario autenticado (más recientes primero). */
export function getRechargeHistory(
  token: string,
  page: number,
  size: number,
): Promise<RechargeHistoryResponse> {
  const query = new URLSearchParams({ page: String(page), size: String(size) });
  return apiRequest<RechargeHistoryResponse>(`/recharge/history?${query}`, { token });
}
