import { useState } from "react";
import { toast } from "sonner";
import { DashboardLayout } from "../../../shared/components/layout/DashboardLayout";
import { Alert } from "../../../shared/components/ui/Alert";
import { Button } from "../../../shared/components/ui/Button";
import { useAuth } from "../../../shared/hooks/useAuth";
import { BuyRechargeModal } from "../../recharge/components/BuyRechargeModal";
import { ReceiptModal } from "../../recharge/components/ReceiptModal";
import { RechargeTable } from "../../recharge/components/RechargeTable";
import { TablePagination } from "../../recharge/components/TablePagination";
import { useRechargeHistory } from "../../recharge/hooks/useRechargeHistory";
import type { RechargeHistoryItem } from "../../recharge/types/recharge.types";

export default function DashboardPage() {
  const { session, signOut } = useAuth();
  const { history, loading, error, goToPage, changePageSize, refresh } = useRechargeHistory();
  const [selected, setSelected] = useState<RechargeHistoryItem | null>(null);
  const [buyOpen, setBuyOpen] = useState(false);

  // Las rutas protegidas garantizan sesión; esto solo estrecha el tipo.
  if (!session) return null;

  return (
    <DashboardLayout user={session.user} onLogout={signOut}>
      <div className="flex min-h-0 w-full flex-1 flex-col gap-6">
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
          <Button
            type="button"
            leadingIcon="add_circle"
            fullWidth={false}
            className="self-start md:self-auto"
            onClick={() => setBuyOpen(true)}
          >
            Nueva recarga
          </Button>
        </div>

        <section
          aria-label="Últimas recargas realizadas"
          className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface-base shadow-sm"
        >
          {error && (
            <div className="border-b border-border-subtle p-6">
              <Alert title="No se pudo cargar el histórico" message={error} />
            </div>
          )}

          {history && (
            <>
              <div
                aria-busy={loading}
                className={`flex min-h-0 flex-1 flex-col transition-opacity ${loading ? "opacity-50" : "opacity-100"}`}
              >
                <RechargeTable items={history.data} onViewReceipt={setSelected} />
              </div>
              <TablePagination
                pagination={history.pagination}
                onPageChange={goToPage}
                onPageSizeChange={changePageSize}
              />
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
      <BuyRechargeModal
        open={buyOpen}
        onClose={() => setBuyOpen(false)}
        onSuccess={() => {
          setBuyOpen(false);
          refresh();
          toast.success("Recarga realizada exitosamente");
        }}
      />
    </DashboardLayout>
  );
}
