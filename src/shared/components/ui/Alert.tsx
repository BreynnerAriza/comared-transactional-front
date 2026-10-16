import { Icon } from "./Icon";
import { IconButton } from "./IconButton";

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
        <IconButton icon="close" label="Cerrar notificación" iconSize={18} onClick={onDismiss} />
      )}
    </div>
  );
}
