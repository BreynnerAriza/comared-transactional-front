interface IconProps {
  /** Nombre del símbolo de Material Symbols Outlined. */
  name: string;
  /** Tamaño en px. */
  size?: number;
  filled?: boolean;
  className?: string;
}

export function Icon({ name, size = 20, filled = false, className = "" }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined leading-none ${className}`}
      style={{
        fontSize: size,
        fontVariationSettings: `"FILL" ${filled ? 1 : 0}`,
      }}
    >
      {name}
    </span>
  );
}
