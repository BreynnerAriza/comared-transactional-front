import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  dismissible?: boolean;
  className?: string;
  children: ReactNode;
}

export function Modal({
  open,
  onClose,
  labelledBy,
  dismissible = true,
  className = "max-w-sm",
  children,
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onClose={onClose}
      onCancel={(event) => {
        if (!dismissible) event.preventDefault();
      }}
      onClick={(event) => {
        if (dismissible && event.target === event.currentTarget) onClose();
      }}
      className={`m-auto w-full overflow-hidden rounded-xl border border-border-subtle bg-surface-base p-0 text-text-primary shadow-2xl backdrop:bg-slate-900/50 backdrop:backdrop-blur-sm ${className}`}
    >
      {open && children}
    </dialog>
  );
}
