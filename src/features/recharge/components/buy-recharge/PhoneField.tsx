import { useState } from "react";
import { Icon } from "../../../../shared/components/ui/Icon";
import { PHONE_LENGTH, validatePhone } from "../../utils/recharge-validation";
import {
  FIELD_PREFIX_CLASSES,
  getFieldStatus,
  getFieldWrapperClasses,
  type FieldStatus,
} from "./field-styles";

interface PhoneFieldProps {
  value: string;
  onChange: (digits: string) => void;
  onBlur: () => void;
  error?: string;
}

const STATUS_UI: Record<FieldStatus, { text: string; icon: string; hintIcon: string; counter: string }> = {
  neutral: {
    text: "text-text-secondary",
    icon: "pending",
    hintIcon: "info",
    counter: "border-border-subtle bg-surface-subtle text-text-secondary",
  },
  valid: {
    text: "text-success",
    icon: "check_circle",
    hintIcon: "verified",
    counter: "border-emerald-200 bg-success-surface text-success",
  },
  error: {
    text: "text-error",
    icon: "error",
    hintIcon: "error",
    counter: "border-rose-200 bg-error-surface text-error",
  },
};

/** `3124567890` → `312 456 7890` */
function formatPhoneMask(digits: string): string {
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

export function PhoneField({ value, onChange, onBlur, error }: PhoneFieldProps) {
  const [focused, setFocused] = useState(false);
  const status = getFieldStatus(Boolean(error), validatePhone(value) === true);
  const ui = STATUS_UI[status];

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor="cellPhoneInput"
        className="flex items-center gap-1 text-label-sm font-semibold text-text-primary"
      >
        Número de celular <span className="text-error">*</span>
      </label>
      <div
        className={`relative flex items-center rounded-lg border bg-surface-subtle transition-all ${getFieldWrapperClasses(focused, status)}`}
      >
        <div className={FIELD_PREFIX_CLASSES}>
          <span className="text-label-sm font-bold text-text-primary">+57</span>
        </div>
        <input
          id="cellPhoneInput"
          type="tel"
          inputMode="numeric"
          autoComplete="off"
          placeholder="300 000 0000"
          value={formatPhoneMask(value)}
          onChange={(event) => {
            const digits = event.target.value.replace(/\D/g, "").slice(0, PHONE_LENGTH);
            onChange(digits);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onBlur();
          }}
          aria-invalid={status === "error" || undefined}
          className="w-full bg-transparent px-3 py-2.5 font-semibold tracking-wider text-label-md text-text-primary placeholder:text-text-secondary/50 focus:outline-none"
        />
        <div className={`pr-3 ${ui.text}`}>
          <Icon name={ui.icon} size={20} />
        </div>
      </div>
      <div className="flex items-center justify-between px-0.5">
        <span className={`flex items-center gap-1 text-caption ${ui.text}`}>
          <Icon name={ui.hintIcon} size={15} />
          {error ?? `El número debe comenzar por 3 y tener ${PHONE_LENGTH} dígitos.`}
        </span>
        <span
          className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[11px] font-medium ${ui.counter}`}
        >
          {value.length}/{PHONE_LENGTH} dígitos
        </span>
      </div>
    </div>
  );
}
