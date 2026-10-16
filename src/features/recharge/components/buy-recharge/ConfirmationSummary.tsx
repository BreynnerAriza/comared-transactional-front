import { Icon } from "../../../../shared/components/ui/Icon";
import { formatCOP, formatPhone } from "../../../../shared/utils/format";
import { getOperatorStyle } from "../../utils/operator-styles";

interface ConfirmationSummaryProps {
  supplierName: string;
  cellPhone: string;
  amount: number;
  terminal?: string;
}

export function ConfirmationSummary({
  supplierName,
  cellPhone,
  amount,
  terminal,
}: ConfirmationSummaryProps) {
  const operatorStyle = getOperatorStyle(supplierName);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface-base">
        <div className="flex items-center justify-between border-b border-border-subtle bg-surface-subtle px-4 py-2.5">
          <span className="text-caption font-semibold uppercase tracking-wider text-text-secondary">
            Resumen de la recarga
          </span>
          {terminal && (
            <span className="text-caption font-medium text-text-secondary">{terminal}</span>
          )}
        </div>

        <div className="flex flex-col divide-y divide-border-subtle">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-body-sm text-text-secondary">Operador móvil</span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-label-sm font-semibold ${operatorStyle.badge}`}
            >
              <span className={`size-2 rounded-full ${operatorStyle.dot}`} aria-hidden="true" />
              {supplierName}
            </span>
          </div>

          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-body-sm text-text-secondary">Número de celular</span>
            <span className="font-mono text-label-md font-semibold text-text-primary">
              {formatPhone(cellPhone)}
            </span>
          </div>

          <div className="flex items-center justify-between bg-primary-fixed/20 px-4 py-4">
            <span className="text-label-sm font-semibold text-text-primary">Monto</span>
            <span className="text-headline-md font-bold tracking-tight text-primary-container">
              {formatCOP(amount)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-info/20 bg-info-surface p-3.5">
        <Icon name="info" size={20} className="mt-0.5 text-info" />
        <div className="flex flex-col">
          <span className="text-label-sm font-semibold text-info">Antes de confirmar</span>
          <span className="text-body-sm text-text-secondary">
            Verifica el operador, número y monto.
          </span>
        </div>
      </div>
    </div>
  );
}
