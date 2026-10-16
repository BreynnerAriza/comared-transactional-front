import { Icon } from "../../../shared/components/ui/Icon";

const OPERATORS = ["Claro", "Movistar", "Tigo", "WOM"];

export function AuthShowcase() {
  return (
    <aside
      aria-hidden="true"
      className="relative hidden flex-col justify-between overflow-hidden bg-linear-to-br from-[#0b1324] via-[#0f172a] to-[#020617] p-10 text-surface-base lg:flex lg:w-1/2"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-primary-container/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 size-80 rounded-full bg-tertiary-container/15 blur-3xl" />

      <svg className="pointer-events-none absolute inset-0 size-full opacity-10">
        <defs>
          <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#FFFFFF" />
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFFFFF" strokeDasharray="2 4" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>

      <div className="relative z-10 flex items-center justify-end">
        <div className="flex items-center gap-1.5 rounded-md bg-surface-base/5 px-3 py-1 text-caption text-text-secondary">
          <Icon name="hub" size={15} className="text-primary-container" />
          <span>Nodo: BOG-DC-04</span>
        </div>
      </div>

      <div className="relative z-10 my-auto space-y-4 py-8">
        <div className="rounded-xl border border-surface-base/15 bg-surface-base/10 p-5 shadow-2xl backdrop-blur-xl transition-transform duration-300 hover:-translate-y-0.5">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg border border-success/30 bg-success-surface/20 text-success">
                <Icon name="phone_android" size={22} />
              </div>
              <div>
                <div className="text-label-sm">Recarga Exitosa Claro Móvil</div>
                <div className="text-caption text-text-secondary">Referencia: PR-89410924</div>
              </div>
            </div>
            <span className="text-currency-table font-bold tabular-nums text-emerald-400">
              +$ 50.000 COP
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-surface-base/10 pt-2 text-caption text-slate-300">
            <span className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-emerald-400" /> Aprobada vía Switch Central
            </span>
            <span>0.42 ms</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-surface-base/10 bg-surface-base/5 p-3.5 backdrop-blur-md">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-caption text-text-secondary">Disponibilidad SLA</span>
              <Icon name="verified" size={16} className="text-primary-container" />
            </div>
            <div className="text-headline-sm font-bold">99.98%</div>
            <div className="mt-1 text-caption text-slate-400">Conexión Segura API ComaRed</div>
          </div>
          <div className="rounded-xl border border-surface-base/10 bg-surface-base/5 p-3.5 backdrop-blur-md">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-caption text-text-secondary">Operadores Conectados</span>
              <Icon name="cell_tower" size={16} className="text-tertiary-fixed" />
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              {OPERATORS.map((operator) => (
                <span
                  key={operator}
                  className="rounded bg-surface-base/10 px-1.5 py-0.5 text-caption font-semibold"
                >
                  {operator}
                </span>
              ))}
            </div>
            <div className="mt-2 text-caption text-slate-400">Enrutamiento dinámico activo</div>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-surface-base/10 pt-4">
        <h2 className="mb-1 text-label-md font-semibold">
          Plataforma Transaccional de Recargas Móviles
        </h2>
        <p className="text-body-sm leading-relaxed text-slate-300">
          Rapidez, disponibilidad e interoperabilidad con todos los operadores de Colombia (Claro,
          Movistar, Tigo, WOM) con respaldo institucional ComaRed.
        </p>
      </div>
    </aside>
  );
}
