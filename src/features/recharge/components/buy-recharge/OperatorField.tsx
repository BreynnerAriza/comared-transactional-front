import { Icon } from "../../../../shared/components/ui/Icon";
import type { Supplier } from "../../types/recharge.types";
import { getOperatorStyle } from "../../utils/operator-styles";

interface OperatorFieldProps {
  suppliers: Supplier[] | null;
  loading: boolean;
  loadError: string | null;
  value: string;
  onChange: (supplierId: string) => void;
  error?: string;
}

export function OperatorField({
  suppliers,
  loading,
  loadError,
  value,
  onChange,
  error,
}: OperatorFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="flex items-center gap-1 text-label-sm font-semibold text-text-primary">
        Operador móvil <span className="text-error">*</span>
      </span>

      {loading && (
        <p className="rounded-lg border border-border-subtle bg-surface-subtle px-3 py-3 text-body-sm text-text-secondary">
          Cargando operadores…
        </p>
      )}

      {loadError && !loading && (
        <p className="rounded-lg border border-error/20 bg-error-surface px-3 py-2 text-body-sm text-error">
          {loadError}
        </p>
      )}

      {!loading && !loadError && suppliers && suppliers.length > 0 && (
        <div className="grid grid-cols-4 gap-2.5">
          {suppliers.map((supplier) => {
            const isSelected = supplier.id === value;
            const style = getOperatorStyle(supplier.name);
            return (
              <button
                key={supplier.id}
                type="button"
                onClick={() => onChange(supplier.id)}
                aria-pressed={isSelected}
                className={`relative flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border p-2.5 text-center transition-all focus-visible:outline-2 focus-visible:outline-primary-container ${
                  isSelected
                    ? "border-primary-container bg-primary-fixed/20"
                    : "border-border-subtle bg-surface-base hover:bg-surface-subtle"
                }`}
              >
                {isSelected && (
                  <Icon
                    name="check_circle"
                    size={16}
                    className="absolute right-1 top-1 text-primary-container"
                  />
                )}
                <div
                  className={`flex size-8 items-center justify-center rounded-full text-label-md font-bold ${style.badge}`}
                >
                  {supplier.name.charAt(0).toUpperCase()}
                </div>
                <span
                  className={`text-label-sm text-text-primary ${isSelected ? "font-semibold" : ""}`}
                >
                  {supplier.name}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {!loading && !loadError && suppliers && suppliers.length === 0 && (
        <p className="rounded-lg border border-border-subtle bg-surface-subtle px-3 py-2 text-body-sm text-text-secondary">
          No hay operadores disponibles.
        </p>
      )}

      {error && <p className="text-body-sm text-error">{error}</p>}
    </div>
  );
}
