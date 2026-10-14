import { Icon } from "../../../shared/components/ui/Icon";
import { formatCOP, formatPhone, formatRelativeDateTime, formatTimestamp } from "../../../shared/utils/format";
import type { RechargeHistoryItem } from "../types/recharge.types";
import { STATUS_STYLES } from "../utils/recharge-status";
import { OperatorBadge } from "./OperatorBadge";
import { StatusBadge } from "./StatusBadge";

interface RechargeTableProps {
  items: RechargeHistoryItem[];
  onViewReceipt: (item: RechargeHistoryItem) => void;
}

const HEADER_CELL = "px-4 py-3.5";

export function RechargeTable({ items, onViewReceipt }: RechargeTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-border-subtle bg-surface-subtle text-label-sm uppercase tracking-wider text-text-secondary">
            <th scope="col" className="px-6 py-3.5">Fecha y hora</th>
            <th scope="col" className={HEADER_CELL}>ID Transaccional</th>
            <th scope="col" className={HEADER_CELL}>Operador</th>
            <th scope="col" className={HEADER_CELL}>Celular</th>
            <th scope="col" className={`${HEADER_CELL} text-right`}>Monto</th>
            <th scope="col" className={`${HEADER_CELL} text-center`}>Estado</th>
            <th scope="col" className={HEADER_CELL}>Mensaje proveedor</th>
            <th scope="col" className="px-6 py-3.5 text-right">Acción</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle text-body-md text-text-primary">
          {items.map((item) => (
            <tr key={item.id} className="transition-colors hover:bg-slate-50/80">
              <td className="whitespace-nowrap px-6 py-3.5">
                <div className="flex flex-col">
                  <span className="text-label-md font-medium text-text-primary">
                    {formatRelativeDateTime(item.createdAt)}
                  </span>
                  <span className="font-mono text-[11px] text-text-secondary">
                    {formatTimestamp(item.createdAt)}
                  </span>
                </div>
              </td>
              <td className="whitespace-nowrap px-4 py-3.5">
                {item.transactionalId ? (
                  <span className="rounded border border-border-subtle bg-slate-100 px-2 py-0.5 font-mono text-label-sm tracking-tight text-text-secondary">
                    {item.transactionalId}
                  </span>
                ) : (
                  <span className="text-text-secondary">—</span>
                )}
              </td>
              <td className="whitespace-nowrap px-4 py-3.5">
                <OperatorBadge name={item.supplierName} />
              </td>
              <td className="whitespace-nowrap px-4 py-3.5 font-mono text-label-md font-medium text-text-primary">
                {formatPhone(item.cellPhone)}
              </td>
              <td className="whitespace-nowrap px-4 py-3.5 text-right">
                <span className="text-currency-table tabular-nums text-text-primary">
                  {formatCOP(item.amount)}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3.5 text-center">
                <StatusBadge status={item.status} />
              </td>
              <td className="whitespace-nowrap px-4 py-3.5">
                {item.providerMessage ? (
                  <span
                    title={item.providerMessage}
                    className={`inline-block max-w-45 truncate rounded border px-2 py-1 align-middle text-caption ${STATUS_STYLES[item.status].message}`}
                  >
                    {item.providerMessage}
                  </span>
                ) : (
                  <span className="text-text-secondary">—</span>
                )}
              </td>
              <td className="whitespace-nowrap px-6 py-3.5 text-right">
                <button
                  type="button"
                  onClick={() => onViewReceipt(item)}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border-subtle bg-surface-base px-3 py-1.5 text-label-sm font-medium text-text-primary shadow-2xs transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-primary-container"
                >
                  <Icon name="receipt" size={16} className="text-text-secondary" />
                  Ver comprobante
                </button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={8} className="px-6 py-12 text-center text-body-md text-text-secondary">
                Aún no has realizado recargas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
