import type { RechargeStatus } from "../types/recharge.types";

interface StatusStyle {
  label: string;
  badge: string;
  dot: string;
  message: string;
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
