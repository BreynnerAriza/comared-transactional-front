import { useState } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { Alert } from "../../../components/ui/Alert";
import { Button } from "../../../components/ui/Button";
import { Icon } from "../../../components/ui/Icon";
import { useAuth } from "../../../hooks/useAuth";
import { ReceiptModal } from "../../recharge/components/ReceiptModal";
import { RechargeTable } from "../../recharge/components/RechargeTable";
import { TablePagination } from "../../recharge/components/TablePagination";
import { useRechargeHistory } from "../../recharge/hooks/useRechargeHistory";
import type { RechargeHistoryItem } from "../../recharge/types/recharge.types";

export default function DashboardPage() {
  const { session, signOut } = useAuth();
  const { history, loading, error, goToPage, refresh } = useRechargeHistory();
  const [selected, setSelected] = useState<RechargeHistoryItem | null>(null);

  // Las rutas protegidas garantizan sesión; esto solo estrecha el tipo.
  if (!session) return null;

  return (
    <DashboardLayout user={session.user} onLogout={signOut}>
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 border-b border-border-subtle/60 pb-2 md:flex-row md:items-center">
          <div className="flex flex-col gap-1">
            <h1 className="text-headline-lg font-bold tracking-tight text-text-primary">
              Recargas móviles
            </h1>
            <p className="max-w-2xl text-body-md text-text-secondary">
              Realiza recargas en línea y consulta las últimas transacciones procesadas en el core de
              Comared.
            </p>
          </div>
          <Button type="button" leadingIcon="add_circle" fullWidth={false} className="self-start md:self-auto">
            Nueva recarga
          </Button>
        </div>

        <section
          aria-labelledby="history-title"
          className="flex flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface-base shadow-sm"
        >
          <div className="flex flex-col justify-between gap-4 border-b border-border-subtle bg-surface-base p-6 sm:flex-row sm:items-center">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <Icon name="receipt_long" size={22} className="text-primary-container" />
                <h2 id="history-title" className="text-headline-sm text-text-primary">
                  Últimas recargas realizadas
                </h2>
              </div>
              <p className="text-body-sm text-text-secondary">
                Histórico inmediato de órdenes validadas y enviadas al operador.
              </p>
            </div>
            <button
              type="button"
              onClick={refresh}
              disabled={loading}
              title="Refrescar lista transaccional"
              className="flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-border-subtle bg-surface-base px-3.5 text-text-secondary transition-colors hover:bg-surface-subtle hover:text-text-primary focus-visible:outline-2 focus-visible:outline-primary-container disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Icon name="sync" size={18} className={loading ? "animate-spin" : ""} />
              <span className="hidden text-label-sm md:inline">Actualizar</span>
            </button>
          </div>

          {error && (
            <div className="border-b border-border-subtle p-6">
              <Alert title="No se pudo cargar el histórico" message={error} />
            </div>
          )}

          {history && (
            <>
              <div
                aria-busy={loading}
                className={`transition-opacity ${loading ? "opacity-50" : "opacity-100"}`}
              >
                <RechargeTable items={history.data} onViewReceipt={setSelected} />
              </div>
              <TablePagination pagination={history.pagination} onPageChange={goToPage} />
            </>
          )}

          {!history && loading && (
            <p role="status" className="px-6 py-12 text-center text-body-md text-text-secondary">
              Cargando recargas…
            </p>
          )}
        </section>
      </div>

      <ReceiptModal item={selected} onClose={() => setSelected(null)} />
    </DashboardLayout>
  );
}
