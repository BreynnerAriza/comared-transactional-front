import type { ReactNode } from "react";
import { Icon } from "../../../shared/components/ui/Icon";
import { Modal } from "../../../shared/components/ui/Modal";
import { formatPhone, formatTimestamp } from "../../../shared/utils/format";
import type { RechargeHistoryItem } from "../types/recharge.types";
import { getOperatorStyle, STATUS_STYLES } from "../utils/recharge-status";

interface ReceiptModalProps {
  item: RechargeHistoryItem | null;
  onClose: () => void;
}

function formatAmount(value: number): string {
  return `$ ${new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(value)}`;
}

export function ReceiptModal({ item, onClose }: ReceiptModalProps) {
  return (
    <Modal open={item !== null} onClose={onClose} labelledBy="receipt-title" className="max-w-sm">
      {item && <Receipt item={item} onClose={onClose} />}
    </Modal>
  );
}

function Receipt({ item, onClose }: { item: RechargeHistoryItem; onClose: () => void }) {
  const status = STATUS_STYLES[item.status];
  const operator = getOperatorStyle(item.supplierName);

  return (
    <div className="flex flex-col gap-3 bg-surface-subtle p-4">
      <div className="flex items-center justify-between">
        <h2 id="receipt-title" className="text-label-md font-semibold text-text-primary">
          Comprobante de recarga
        </h2>
        <button
          type="button"
          aria-label="Cerrar comprobante"
          onClick={onClose}
          className="cursor-pointer rounded-lg p-1 text-text-secondary transition-colors hover:bg-surface-container hover:text-text-primary focus-visible:outline-2 focus-visible:outline-primary-container"
        >
          <Icon name="close" />
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-base shadow-md">
        <div className="h-1.5 w-full bg-primary-container" />

        <div className="flex flex-col px-5 py-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary-container text-[14px] font-bold text-on-primary shadow-sm">
                C
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-label-md font-bold tracking-tight text-text-primary">
                  Comared
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-widest text-primary-container">
                  Transactional
                </span>
              </div>
            </div>
            <span className="rounded bg-surface-subtle px-2 py-1 text-caption font-semibold uppercase tracking-widest text-text-secondary">
              Original cliente
            </span>
          </div>

          <div className="mt-3 flex justify-center text-center">
            <div
              className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-3 py-1 ${status.badge}`}
            >
              <span aria-hidden="true" className={`size-2 shrink-0 rounded-full ${status.dot}`} />
              <p className="text-body-sm font-semibold">{item.providerMessage ?? status.label}</p>
            </div>
          </div>

          <div className="my-4 flex flex-col items-center rounded-xl border border-border-subtle bg-surface-subtle px-4 py-2.5 text-center">
            <span className="text-caption uppercase tracking-wider text-text-secondary">
              Valor recargado
            </span>
            <div className="text-[28px] leading-9 font-bold tracking-tight tabular-nums text-text-primary">
              {formatAmount(item.amount)}{" "}
              <span className="text-label-md font-medium text-text-secondary">COP</span>
            </div>
          </div>

          <div className="relative -mx-5 my-1" aria-hidden="true">
            <div className="absolute -left-3 top-1/2 size-6 -translate-y-1/2 rounded-full border-r border-border-subtle bg-surface-subtle" />
            <div className="w-full border-b-2 border-dashed border-border-strong" />
            <div className="absolute -right-3 top-1/2 size-6 -translate-y-1/2 rounded-full border-l border-border-subtle bg-surface-subtle" />
          </div>

          <dl className="flex flex-col gap-2 pt-3">
            <Row label="Operador">
              <span className="flex items-center gap-1.5">
                <span aria-hidden="true" className={`size-2 rounded-full ${operator.dot}`} />
                {item.supplierName}
              </span>
            </Row>
            <Row label="Celular">
              <span className="tabular-nums tracking-wide">{formatPhone(item.cellPhone)}</span>
            </Row>
            <Row label="ID transaccional">
              {item.transactionalId ? (
                <span className="tabular-nums">{item.transactionalId}</span>
              ) : (
                <span className="text-text-secondary">—</span>
              )}
            </Row>
            <Row label="Fecha y hora">
              <span className="tabular-nums">{formatTimestamp(item.createdAt)}</span>
            </Row>
          </dl>

          <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-3">
            <span className="text-caption text-text-secondary">Estado de la transacción</span>
            <span className={`flex items-center gap-1.5 text-caption font-semibold ${status.text}`}>
              <span aria-hidden="true" className={`size-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        autoFocus
        className="h-10 w-full cursor-pointer rounded-lg bg-primary-container text-label-md font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary-hover active:bg-primary-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2"
      >
        Aceptar
      </button>
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-caption text-text-secondary">{label}</dt>
      <dd className="text-right text-body-sm font-semibold text-text-primary">{children}</dd>
    </div>
  );
}
