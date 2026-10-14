/** Estados que persiste el backend (`RechargeStatus`). */
export type RechargeStatus = "PENDING" | "SUCCESS" | "FAILED" | "UNKNOWN";

/** Elemento de `GET /recharge/history` (`RechargeHistoryItemDto`). */
export interface RechargeHistoryItem {
  id: string;
  supplierName: string;
  /** 10 dígitos, sin prefijo. */
  cellPhone: string;
  amount: number;
  status: RechargeStatus;
  transactionalId: string | null;
  providerMessage: string | null;
  /** Fecha ISO 8601 (el backend serializa `Date`). */
  createdAt: string;
}

export interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/** Respuesta de `GET /recharge/history?page=&size=` (`RechargeHistoryResponseDto`). */
export interface RechargeHistoryResponse {
  data: RechargeHistoryItem[];
  pagination: Pagination;
}
