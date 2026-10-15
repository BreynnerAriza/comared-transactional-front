import { useState } from "react";
import type { ReactNode } from "react";
import type { AuthenticatedUser } from "../../../features/auth/types/auth.types";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  user: AuthenticatedUser;
  onLogout: () => void;
  children: ReactNode;
}

/** Menú lateral abierto solo en pantallas anchas; en pantallas pequeñas arranca colapsado. */
const isWideScreen = () => window.matchMedia("(min-width: 1024px)").matches;

export function DashboardLayout({ user, onLogout, children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(() => !isWideScreen());

  return (
    <div className="min-h-screen bg-surface-subtle">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((prev) => !prev)} onLogout={onLogout} />
      <div className={`transition-[padding] duration-200 ${collapsed ? "pl-18" : "pl-65"}`}>
        <Header collapsed={collapsed} userName={user.name} userEmail={user.email} />
        {/* Alto del viewport: el contenido se reparte el espacio y cada vista decide qué hace scroll. */}
        <main className="flex h-dvh w-full flex-col overflow-y-auto pt-16">
          <div className="mx-auto flex min-h-0 w-full max-w-420 flex-1 flex-col p-4 sm:p-8 2xl:px-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
