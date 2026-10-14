import { createContext } from "react";
import type { AuthSession } from "../types/auth.types";

export interface AuthContextValue {
  /** Sesión activa, o null si no hay usuario autenticado. */
  session: AuthSession | null;
  signIn: (session: AuthSession) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
