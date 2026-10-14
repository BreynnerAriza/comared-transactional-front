import type { ReactNode } from "react";
import { Icon } from "../../../components/ui/Icon";
import { Modal } from "../../../components/ui/Modal";
import { formatCOP, formatPhone, formatRelativeDateTime } from "../../../utils/format";
import type { RechargeHistoryItem } from "../types/recharge.types";
import { STATUS_STYLES } from "../utils/recharge-status";

interface ReceiptModalProps {
  item: RechargeHistoryItem | null;
  onClose: () => void;
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-text-secondary">{label}</span>
      <span className="text-right">{children}</span>
    </div>
  );
}

export function ReceiptModal({ item, onClose }: ReceiptModalProps) {
  const status = item ? STATUS_STYLES[item.status] : null;

  return (
    <Modal open={item !== null} onClose={onClose} labelledBy="receipt-title">
      {item && status && (
        <div className="flex flex-col p-6">
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <Icon name="verified" size={24} className="text-success" />
              <h2 id="receipt-title" className="text-headline-sm text-text-primary">
                Tirilla digital
              </h2>
            </div>
            <button
              type="button"
              aria-label="Cerrar comprobante"
              onClick={onClose}
              className="cursor-pointer rounded-lg p-1 text-text-secondary transition-colors hover:bg-surface-subtle hover:text-text-primary focus-visible:outline-2 focus-visible:outline-primary-container"
            >
              <Icon name="close" />
            </button>
          </div>

          <div className="my-2 flex flex-col gap-3 rounded-lg border-y border-dashed border-border-subtle bg-slate-50/60 p-3 py-4 text-body-sm">
            <div className="border-b border-dashed border-border-subtle pb-2 text-center">
              <span className="text-label-md font-bold tracking-tight text-primary-container">
                COMARED TRANSACTIONAL
              </span>
              <p className="text-caption text-text-secondary">PuntoRed API - Colombia</p>
            </div>
            <Row label="ID transacción:">
              <span className="font-mono font-semibold text-text-primary">
                {item.transactionalId ?? "—"}
              </span>
            </Row>
            <Row label="Operador:">
              <span className="font-semibold text-text-primary">{item.supplierName}</span>
            </Row>
            <Row label="Número celular:">
              <span className="font-mono font-semibold text-text-primary">
                {formatPhone(item.cellPhone)}
              </span>
            </Row>
            <Row label="Fecha y hora:">
              <span className="font-medium text-text-primary">
                {formatRelativeDateTime(item.createdAt)}
              </span>
            </Row>
            <div className="flex justify-between border-t border-dashed border-border-subtle pt-2">
              <span className="font-semibold text-text-primary">Monto:</span>
              <span className="font-mono text-body-lg font-bold tabular-nums text-primary-container">
                {formatCOP(item.amount)}
              </span>
            </div>
            <Row label="Estado:">
              <span className={`font-semibold ${status.text}`}>{status.label}</span>
            </Row>
            {item.providerMessage && <Row label="Mensaje:">{item.providerMessage}</Row>}
          </div>

          <button
            type="button"
            onClick={onClose}
            autoFocus
            className="mt-3 h-10 w-full cursor-pointer rounded-lg bg-primary-container text-label-md font-semibold text-on-primary transition-colors hover:bg-primary-hover active:bg-primary-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2"
          >
            Aceptar
          </button>
        </div>
      )}
    </Modal>
  );
}
