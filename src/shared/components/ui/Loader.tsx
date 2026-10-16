type LoaderSize = "sm" | "md" | "lg";

interface LoaderProps {
  label?: string;
  size?: LoaderSize;
  overlay?: boolean;
  className?: string;
}

const SPINNER_SIZES: Record<LoaderSize, string> = {
  sm: "size-5 border-2",
  md: "size-9 border-[3px]",
  lg: "size-12 border-4",
};

export function Loader({ label, size = "md", overlay = false, className = "" }: LoaderProps) {
  const position = overlay
    ? "absolute inset-0 z-20 bg-surface-base/70 backdrop-blur-[1px]"
    : "py-12";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-3 ${position} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`animate-spin rounded-full border-primary-fixed border-t-primary-container ${SPINNER_SIZES[size]}`}
      />
      {label ? (
        <span className="text-body-sm font-medium text-text-secondary">{label}</span>
      ) : (
        <span className="sr-only">Cargando…</span>
      )}
    </div>
  );
}
