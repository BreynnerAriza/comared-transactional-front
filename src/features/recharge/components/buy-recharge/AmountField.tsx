import { useState } from "react";
import { Icon } from "../../../../shared/components/ui/Icon";
import { formatCOP, formatNumber } from "../../../../shared/utils/format";
import { MAX_AMOUNT, MIN_AMOUNT, validateAmount } from "../../utils/recharge-validation";
import { FIELD_PREFIX_CLASSES, getFieldStatus, getFieldWrapperClasses } from "./field-styles";

interface AmountFieldProps {
  value: string;
  onChange: (digits: string) => void;
  onBlur: () => void;
  error?: string;
}

const MAX_DIGITS = 7;

export function AmountField({ value, onChange, onBlur, error }: AmountFieldProps) {
  const [focused, setFocused] = useState(false);
  const status = getFieldStatus(Boolean(error), validateAmount(value) === true);
  const hasError = status === "error";

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor="amountInput"
        className="flex items-center gap-1 text-label-sm font-semibold text-text-primary"
      >
        Monto de la recarga (COP) <span className="text-error">*</span>
      </label>
      <div
        className={`relative flex items-center rounded-lg border bg-surface-subtle transition-all ${getFieldWrapperClasses(focused, status)}`}
      >
        <div className={FIELD_PREFIX_CLASSES}>
          <span className="text-label-md font-semibold text-text-primary">$</span>
        </div>
        <input
          id="amountInput"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="20.000"
          value={value ? formatNumber(parseInt(value, 10)) : ""}
          onChange={(event) => {
            const digits = event.target.value.replace(/\D/g, "").slice(0, MAX_DIGITS);
            onChange(digits);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onBlur();
          }}
          aria-invalid={hasError || undefined}
          className="w-full bg-transparent px-3 py-2.5 text-right font-semibold tracking-wider text-label-md text-text-primary placeholder:text-text-secondary/50 focus:outline-none"
        />
        <div className="pointer-events-none flex items-center pl-1 pr-3 text-text-secondary">
          <span className="text-label-sm font-semibold">COP</span>
        </div>
      </div>
      <div className="flex items-center justify-between px-0.5">
        <span
          className={`flex items-center gap-1 text-caption ${hasError ? "text-error" : "text-text-secondary"}`}
        >
          <Icon
            name={hasError ? "error" : "info"}
            size={15}
            className={hasError ? "" : "text-tertiary"}
          />
          {error ?? `Mínimo ${formatCOP(MIN_AMOUNT)} — Máximo ${formatCOP(MAX_AMOUNT)}`}
        </span>
      </div>
    </div>
  );
}
