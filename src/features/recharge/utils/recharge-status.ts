import type { RechargeStatus } from "../types/recharge.types";

interface StatusStyle {
  label: string;
  /** Clases del chip de estado. */
  badge: string;
  dot: string;
  /** Clases del chip del mensaje del proveedor. */
  message: string;
  /** Color del texto de estado en el comprobante. */
  text: string;
}

export const STATUS_STYLES: Record<RechargeStatus, StatusStyle> = {
  SUCCESS: {
    label: "Exitosa",
    badge: "bg-success-surface text-success border-emerald-200",
    dot: "bg-success",
    message: "bg-slate-50 text-text-secondary border-border-subtle",
    text: "text-success",
  },
  PENDING: {
    label: "Pendiente",
    badge: "bg-warning-surface text-amber-700 border-amber-200",
    dot: "bg-warning animate-pulse",
    message: "bg-warning-surface text-amber-700 border-amber-200",
    text: "text-amber-600",
  },
  FAILED: {
    label: "Fallida",
    badge: "bg-error-surface text-error border-rose-100",
    dot: "bg-error",
    message: "bg-error-surface text-error border-rose-100",
    text: "text-error",
  },
  UNKNOWN: {
    label: "Por confirmar",
    badge: "bg-info-surface text-info border-blue-100",
    dot: "bg-info",
    message: "bg-info-surface text-info border-blue-100",
    text: "text-info",
  },
};

interface OperatorStyle {
  badge: string;
  dot: string;
}

const OPERATOR_STYLES: Record<string, OperatorStyle> = {
  claro: { badge: "bg-error-surface text-error border-rose-100", dot: "bg-error" },
  movistar: { badge: "bg-info-surface text-info border-blue-100", dot: "bg-info" },
  tigo: {
    badge: "bg-secondary-container text-on-secondary-fixed-variant border-indigo-100",
    dot: "bg-secondary",
  },
  wom: { badge: "bg-primary-fixed text-primary border-pink-200", dot: "bg-primary" },
};

const DEFAULT_OPERATOR_STYLE: OperatorStyle = {
  badge: "bg-slate-100 text-text-secondary border-border-subtle",
  dot: "bg-text-secondary",
};

/** Color por operador; los operadores que no tienen color propio usan uno neutro. */
export function getOperatorStyle(supplierName: string): OperatorStyle {
  const key = supplierName.trim().toLowerCase();
  const match = Object.keys(OPERATOR_STYLES).find((name) => key.includes(name));
  return match ? OPERATOR_STYLES[match] : DEFAULT_OPERATOR_STYLE;
}
