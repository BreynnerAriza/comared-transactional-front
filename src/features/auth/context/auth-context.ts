import { createContext } from "react";
import type { AuthSession } from "../types/auth.types";

export interface AuthContextValue {
  session: AuthSession | null;
  signIn: (session: AuthSession) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
