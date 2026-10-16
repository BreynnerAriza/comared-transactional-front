import { Icon } from "./Icon";

interface AlertProps {
  title: string;
  message: string;
  onDismiss?: () => void;
}

export function Alert({ title, message, onDismiss }: AlertProps) {
  return (
    <div
      role="alert"
      className="flex items-start justify-between gap-3 rounded-xl border border-error/20 bg-error-surface p-4"
    >
      <div className="flex items-start gap-2.5">
        <Icon name="error" size={20} filled className="mt-0.5 text-error" />
        <div className="flex flex-col">
          <span className="text-label-sm text-error">{title}</span>
          <span className="text-body-sm text-on-surface-variant">{message}</span>
        </div>
      </div>
      {onDismiss && (
        <button
          type="button"
          aria-label="Cerrar notificación"
          onClick={onDismiss}
          className="cursor-pointer rounded p-0.5 text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-primary-container"
        >
          <Icon name="close" size={18} />
        </button>
      )}
    </div>
  );
}
