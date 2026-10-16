import type { ComponentProps, ReactNode } from "react";
import { Icon } from "./Icon";

interface TextFieldProps extends ComponentProps<"input"> {
  id: string;
  label: string;
  leadingIcon?: string;
  labelAside?: ReactNode;
  trailingAction?: ReactNode;
  error?: string;
}

export function TextField({
  id,
  label,
  leadingIcon,
  labelAside,
  trailingAction,
  error,
  className = "",
  ...rest
}: TextFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-label-sm text-text-primary">
          {label}
        </label>
        {labelAside}
      </div>
      <div className="relative rounded-lg shadow-sm">
        {leadingIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-text-secondary">
            <Icon name={leadingIcon} />
          </div>
        )}
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`h-11 w-full rounded-lg border bg-surface-base text-body-md text-text-primary transition-all placeholder:text-text-secondary/60 focus:outline-none focus:ring-1 ${
            error
              ? "border-error focus:border-error focus:ring-error"
              : "border-border-subtle focus:border-primary-container focus:ring-primary-container"
          } ${leadingIcon ? "pl-10" : "pl-3.5"} ${trailingAction ? "pr-11" : "pr-3"} ${className}`}
          {...rest}
        />
        {trailingAction && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">{trailingAction}</div>
        )}
      </div>
      {error && (
        <p id={errorId} className="text-body-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}
