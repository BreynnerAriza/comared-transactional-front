import type { ComponentProps } from "react";

interface CheckboxProps extends Omit<ComponentProps<"input">, "type"> {
  label: string;
}

export function Checkbox({ label, className = "", ...rest }: CheckboxProps) {
  return (
    <label className="flex cursor-pointer select-none items-center gap-2.5">
      <input
        type="checkbox"
        className={`size-4 cursor-pointer rounded border-border-strong accent-primary-container focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-container ${className}`}
        {...rest}
      />
      <span className="text-body-sm text-text-secondary">{label}</span>
    </label>
  );
}
