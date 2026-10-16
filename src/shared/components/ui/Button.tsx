import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon } from "./Icon";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  loadingText?: string;
  leadingIcon?: string;
  trailingIcon?: string;
  fullWidth?: boolean;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-container font-semibold text-on-primary shadow-md shadow-primary-container/25 hover:bg-primary-hover active:bg-primary-active",
  secondary:
    "border border-border-subtle bg-surface-base font-medium text-text-secondary hover:bg-surface-subtle hover:text-text-primary",
};

export function Button({
  variant = "primary",
  loading = false,
  loadingText,
  leadingIcon,
  trailingIcon,
  fullWidth = true,
  disabled,
  className = "",
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`flex h-11 ${fullWidth ? "w-full" : "w-fit px-5"} cursor-pointer items-center justify-center gap-2 rounded-lg text-label-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-80 ${VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    >
      {!loading && leadingIcon && <Icon name={leadingIcon} size={20} />}
      <span>{loading ? (loadingText ?? children) : children}</span>
      {loading ? (
        <svg aria-hidden="true" className="size-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path className="opacity-75" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor" />
        </svg>
      ) : (
        trailingIcon && <Icon name={trailingIcon} size={18} />
      )}
    </button>
  );
}
