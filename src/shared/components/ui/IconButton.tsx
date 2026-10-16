import type { ButtonHTMLAttributes } from "react";
import { Icon } from "./Icon";

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  icon: string;
  label: string;
  iconSize?: number;
}

export function IconButton({
  icon,
  label,
  iconSize = 20,
  className = "",
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={`cursor-pointer rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-surface-subtle hover:text-text-primary focus-visible:outline-2 focus-visible:outline-primary-container ${className}`}
      {...rest}
    >
      <Icon name={icon} size={iconSize} />
    </button>
  );
}
