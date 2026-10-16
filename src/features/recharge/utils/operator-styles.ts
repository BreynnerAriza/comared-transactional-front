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

export function getOperatorStyle(supplierName: string): OperatorStyle {
  const key = supplierName.trim().toLowerCase();
  const match = Object.keys(OPERATOR_STYLES).find((name) => key.includes(name));
  return match ? OPERATOR_STYLES[match] : DEFAULT_OPERATOR_STYLE;
}
