import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon } from "./Icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  leadingIcon?: string;
  trailingIcon?: string;
  fullWidth?: boolean;
  children: ReactNode;
}

export function Button({
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
      className={`flex h-11 ${fullWidth ? "w-full" : "w-fit px-5"} cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary-container text-label-md text-on-primary shadow-md shadow-primary-container/25 transition-all hover:bg-primary-hover active:bg-primary-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-90 ${className}`}
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
