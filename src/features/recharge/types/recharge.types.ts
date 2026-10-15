export type RechargeStatus = "PENDING" | "SUCCESS" | "FAILED" | "UNKNOWN";

export interface RechargeHistoryItem {
  id: string;
  supplierName: string;
  cellPhone: string;
  amount: number;
  status: RechargeStatus;
  transactionalId: string | null;
  providerMessage: string | null;
  createdAt: string;
}

export interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface RechargeHistoryResponse {
  data: RechargeHistoryItem[];
  pagination: Pagination;
}

export interface Supplier {
  id: string;
  name: string;
}

export interface BuyRechargeRequest {
  supplierId: string;
  supplierName: string;
  value: number;
  cellPhone: string;
}

export interface BuyRechargeResponse {
  rechargeId: string;
  transactionalID: string;
  message: string;
  cellPhone: string;
  value: number;
  supplierName: string;
}
