import type { RechargeStatus } from "../types/recharge.types";
import { STATUS_STYLES } from "../utils/status-styles";

export function StatusBadge({ status }: { status: RechargeStatus }) {
  const style = STATUS_STYLES[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-label-sm font-medium ${style.badge}`}
    >
      <span aria-hidden="true" className={`size-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
}
