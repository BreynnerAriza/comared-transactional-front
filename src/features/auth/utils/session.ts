import type { AuthSession } from "../types/auth.types";

const STORAGE_KEY = "comared.session";

function getTokenExpiration(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const { exp } = JSON.parse(json) as { exp?: unknown };
    return typeof exp === "number" ? exp : null;
  } catch {
    return null;
  }
}

function isAuthSession(value: unknown): value is AuthSession {
  if (typeof value !== "object" || value === null) return false;
  const { accessToken, user } = value as Partial<AuthSession>;
  return (
    typeof accessToken === "string" &&
    typeof user?.name === "string" &&
    typeof user.email === "string"
  );
}

export function saveSession(session: AuthSession): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // ignore
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function loadSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!isAuthSession(parsed)) throw new Error("Sesión con formato inválido");

    const exp = getTokenExpiration(parsed.accessToken);
    if (exp !== null && exp * 1000 <= Date.now()) throw new Error("Sesión vencida");

    return parsed;
  } catch {
    clearSession();
    return null;
  }
}
