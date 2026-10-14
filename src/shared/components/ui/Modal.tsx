import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Id del elemento que titula el diálogo (para `aria-labelledby`). */
  labelledBy: string;
  className?: string;
  children: ReactNode;
}

/** Diálogo modal basado en `<dialog>`: el navegador gestiona foco, Esc y capa superior. */
export function Modal({ open, onClose, labelledBy, className = "max-w-sm", children }: ModalProps) {
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
      onClick={(event) => {
        // Un clic directo sobre el <dialog> (y no sobre su contenido) es un clic en el fondo.
        if (event.target === event.currentTarget) onClose();
      }}
      className={`m-auto w-full overflow-hidden rounded-xl border border-border-subtle bg-surface-base p-0 text-text-primary shadow-2xl backdrop:bg-slate-900/50 backdrop:backdrop-blur-sm ${className}`}
    >
      {open && children}
    </dialog>
  );
}
