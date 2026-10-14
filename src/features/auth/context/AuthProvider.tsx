import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { setUnauthorizedHandler } from "../../../shared/lib/api-client";
import { clearSession, loadSession, saveSession } from "../session";
import type { AuthSession } from "../types/auth.types";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(loadSession);

  const signIn = useCallback((next: AuthSession) => {
    saveSession(next);
    setSession(next);
  }, []);

  const signOut = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  // Token vencido o inválido en cualquier petición autenticada: cerrar sesión.
  useEffect(() => {
    setUnauthorizedHandler(signOut);
    return () => setUnauthorizedHandler(null);
  }, [signOut]);

  const value = useMemo(() => ({ session, signIn, signOut }), [session, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
