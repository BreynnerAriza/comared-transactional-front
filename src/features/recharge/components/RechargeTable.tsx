import { useState } from "react";
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

/**
 * La tabla usa grid con columnas al ancho de su contenido y `justify-between`: el espacio
 * sobrante se reparte por igual entre columnas. `subgrid` mantiene alineadas las filas.
 */
const TABLE = "grid w-full min-w-max grid-cols-[repeat(8,max-content)] justify-between text-left";
const ROW_GROUP = "col-span-full grid grid-cols-subgrid items-center";
const CELL = "whitespace-nowrap px-4 py-3.5 first:pl-6 last:pr-6";

export function RechargeTable({ items, onViewReceipt }: RechargeTableProps) {
  return (
    <div className="min-h-40 w-full flex-1 overflow-auto">
      <table className={TABLE}>
        <thead className={`${ROW_GROUP} sticky top-0 z-10`}>
          <tr className={`${ROW_GROUP} border-b border-border-subtle bg-surface-subtle text-label-sm uppercase tracking-wider text-text-secondary`}>
            <th scope="col" className={CELL}>Fecha y hora</th>
            <th scope="col" className={CELL}>ID Transaccional</th>
            <th scope="col" className={CELL}>Operador</th>
            <th scope="col" className={CELL}>Celular</th>
            <th scope="col" className={CELL}>Monto</th>
            <th scope="col" className={`${CELL} text-center`}>Estado</th>
            <th scope="col" className={CELL}>Mensaje proveedor</th>
            <th scope="col" className={`${CELL} text-right`}>Acción</th>
          </tr>
        </thead>
        <tbody className={`${ROW_GROUP} divide-y divide-border-subtle text-label-sm font-medium text-text-primary`}>
          {items.map((item) => (
            <tr key={item.id} className={`${ROW_GROUP} transition-colors hover:bg-slate-50/80`}>
              <td className={CELL}>
                <div className="flex flex-col">
                  <span>
                    {formatRelativeDateTime(item.createdAt)}
                  </span>
                  <span className="text-text-secondary">
                    {formatTimestamp(item.createdAt)}
                  </span>
                </div>
              </td>
              <td className={CELL}>
                {item.transactionalId ? (
                  <span className="rounded border border-border-subtle bg-slate-100 px-2 py-0.5 text-text-secondary">
                    {item.transactionalId}
                  </span>
                ) : (
                  <span className="text-text-secondary">—</span>
                )}
              </td>
              <td className={CELL}>
                <OperatorBadge name={item.supplierName} />
              </td>
              <td className={CELL}>
                {formatPhone(item.cellPhone)}
              </td>
              <td className={CELL}>
                <span className="tabular-nums">
                  {formatCOP(item.amount)}
                </span>
              </td>
              <td className={`${CELL} text-center`}>
                <StatusBadge status={item.status} />
              </td>
              <td className={CELL}>
                {item.providerMessage ? (
                  <ProviderMessage message={item.providerMessage} className={STATUS_STYLES[item.status].message} />
                ) : (
                  <span className="text-text-secondary">—</span>
                )}
              </td>
              <td className={`${CELL} text-right`}>
                <button
                  type="button"
                  onClick={() => onViewReceipt(item)}
                  aria-label="Ver comprobante"
                  className="group relative inline-flex cursor-pointer items-center justify-center rounded-lg border border-border-subtle bg-surface-base p-1.5 text-text-secondary shadow-2xs transition-colors hover:bg-surface-subtle hover:text-text-primary focus-visible:outline-2 focus-visible:outline-primary-container"
                >
                  <Icon name="receipt" size={18} />
                  {/* Tooltip a la izquierda: arriba quedaría recortado por el scroll de la tabla. */}
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute right-full top-1/2 mr-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-caption font-medium text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                  >
                    Ver comprobante
                  </span>
                </button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr className={ROW_GROUP}>
              <td colSpan={8} className="col-span-full px-6 py-12 text-center text-text-secondary">
                Aún no has realizado recargas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/** Mensaje del proveedor truncado; si no cabe completo, muestra un tooltip con todo el texto. */
function ProviderMessage({ message, className }: { message: string; className: string }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <span className="relative inline-block align-middle">
      <span
        onMouseEnter={(event) => {
          const el = event.currentTarget;
          setShowTooltip(el.scrollWidth > el.clientWidth);
        }}
        onMouseLeave={() => setShowTooltip(false)}
        className={`block max-w-45 truncate rounded border px-2 py-1 ${className}`}
      >
        {message}
      </span>
      {/* A la izquierda, igual que el de "Ver comprobante": arriba lo recortaría el scroll de la tabla. */}
      {showTooltip && (
        <span
          role="tooltip"
          className="pointer-events-none absolute right-full top-1/2 z-20 mr-2 w-max max-w-xs -translate-y-1/2 whitespace-normal rounded-md bg-slate-800 px-2 py-1 text-caption font-medium text-white shadow-sm"
        >
          {message}
        </span>
      )}
    </span>
  );
}
