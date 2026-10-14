import { Icon } from "../../../shared/components/ui/Icon";
import type { Pagination } from "../types/recharge.types";

interface TablePaginationProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

const PAGE_BUTTON =
  "flex h-8 cursor-pointer items-center justify-center rounded-lg border border-border-subtle bg-surface-base text-label-sm font-medium text-text-primary transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-primary-container disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-surface-base";

/** Páginas visibles alrededor de la actual (ej. 1 … 4 5 6 … 12). */
function getVisiblePages(page: number, totalPages: number): (number | "gap")[] {
  const pages = [...new Set([1, totalPages, page - 1, page, page + 1])]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);

  const result: (number | "gap")[] = [];
  pages.forEach((p, index) => {
    if (index > 0 && p - pages[index - 1] > 1) result.push("gap");
    result.push(p);
  });
  return result;
}

export function TablePagination({ pagination, onPageChange }: TablePaginationProps) {
  const { page, size, totalElements, totalPages } = pagination;
  const from = totalElements === 0 ? 0 : (page - 1) * size + 1;
  const to = Math.min(page * size, totalElements);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-border-subtle bg-surface-subtle px-6 py-3.5 text-body-sm text-text-secondary sm:flex-row">
      <div className="flex items-center gap-4">
        <span>
          Mostrando{" "}
          <span className="font-semibold text-text-primary">
            {from} - {to}
          </span>{" "}
          de <span className="font-semibold text-text-primary">{totalElements}</span> transacciones
        </span>
        <span className="hidden items-center gap-1.5 border-l border-border-subtle pl-3 md:flex">
          <span className="text-[11px]">Filas:</span>
          <span className="rounded border border-border-subtle bg-surface-base px-1.5 py-0.5 text-[11px] font-semibold text-text-primary">
            {size}
          </span>
        </span>
      </div>

      {totalPages > 1 && (
        <nav aria-label="Paginación" className="flex items-center gap-1">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className={`${PAGE_BUTTON} gap-1 px-2.5`}
          >
            <Icon name="chevron_left" size={16} />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          {getVisiblePages(page, totalPages).map((item, index) =>
            item === "gap" ? (
              <span key={`gap-${index}`} aria-hidden="true" className="px-1">
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                aria-current={item === page ? "page" : undefined}
                onClick={() => onPageChange(item)}
                className={
                  item === page
                    ? "flex size-8 cursor-pointer items-center justify-center rounded-lg bg-primary-container text-label-sm font-semibold text-on-primary shadow-xs"
                    : `${PAGE_BUTTON} w-8`
                }
              >
                {item}
              </button>
            ),
          )}

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className={`${PAGE_BUTTON} gap-1 px-2.5`}
          >
            <span className="hidden sm:inline">Siguiente</span>
            <Icon name="chevron_right" size={16} />
          </button>
        </nav>
      )}
    </div>
  );
}
