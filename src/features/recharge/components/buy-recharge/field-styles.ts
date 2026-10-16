export type FieldStatus = "neutral" | "valid" | "error";

export function getFieldStatus(hasError: boolean, isValid: boolean): FieldStatus {
  if (hasError) return "error";
  if (isValid) return "valid";
  return "neutral";
}

export function getFieldWrapperClasses(focused: boolean, status: FieldStatus): string {
  if (focused) {
    return status === "valid"
      ? "border-success bg-surface-base ring-2 ring-success/20"
      : "border-primary-container bg-surface-base ring-2 ring-primary-container/20";
  }
  return status === "error" ? "border-error" : "border-border-subtle";
}

export const FIELD_PREFIX_CLASSES =
  "flex w-16 shrink-0 select-none items-center justify-center rounded-l-lg border-r border-border-subtle bg-surface-container px-3 py-2.5";
