import { NavLink } from "react-router";
import { Icon } from "../ui/Icon";
import { IconButton } from "../ui/IconButton";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onLogout: () => void;
}

export function Sidebar({ collapsed, onToggle, onLogout }: SidebarProps) {
  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-screen flex-col justify-between border-r border-border-subtle bg-surface-base transition-[width] duration-200 ${
        collapsed ? "w-18" : "w-65"
      }`}
    >
      <div className="flex flex-col">
        <div
          className={`flex h-16 items-center border-b border-border-subtle ${
            collapsed ? "justify-center" : "justify-between px-6"
          }`}
        >
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary-container text-[16px] font-bold text-on-primary shadow-sm">
                C
              </div>
              <span className="text-[18px] font-bold tracking-tight text-text-primary">Comared</span>
            </div>
          )}
          <IconButton
            icon={collapsed ? "keyboard_double_arrow_right" : "keyboard_double_arrow_left"}
            label={collapsed ? "Expandir menú lateral" : "Colapsar menú lateral"}
            aria-expanded={!collapsed}
            onClick={onToggle}
          />
        </div>

        {!collapsed && (
          <div className="px-4 pt-4">
            <span className="px-2 text-caption uppercase tracking-wider text-text-secondary">
              Módulos
            </span>
          </div>
        )}

        <nav aria-label="Módulos" className="flex flex-col gap-1 px-4 pt-1">
          <NavLink
            to="/"
            end
            title={collapsed ? "Recargas móviles" : undefined}
            className={`group flex items-center gap-3 rounded-lg border-l-4 border-primary bg-primary-fixed py-2.5 text-label-md text-primary shadow-sm transition-all ${
              collapsed ? "justify-center px-0" : "px-4"
            }`}
          >
            <Icon name="phone_android" className="transition-transform group-hover:scale-105" />
            {!collapsed && <span>Recargas móviles</span>}
          </NavLink>
        </nav>
      </div>

      <div className="border-t border-border-subtle p-4">
        <button
          type="button"
          onClick={onLogout}
          title={collapsed ? "Cerrar sesión" : undefined}
          className={`group flex w-full cursor-pointer items-center gap-3 rounded-lg py-2.5 text-body-md text-text-secondary transition-all hover:bg-error-surface hover:text-error focus-visible:outline-2 focus-visible:outline-primary-container ${
            collapsed ? "justify-center px-0" : "px-4"
          }`}
        >
          <Icon name="logout" />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
}
