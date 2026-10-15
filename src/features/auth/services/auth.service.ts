import { ApiError, apiRequest } from "../../../shared/lib/api-client";
import type { AuthSession, LoginCredentials } from "../types/auth.types";

export class AuthError extends Error {}

const GENERIC_MESSAGE = "No pudimos iniciar sesión. Intenta nuevamente en unos minutos.";

export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  try {
    return await apiRequest<AuthSession>("/auth/login", {
      method: "POST",
      body: credentials,
    });
  } catch (err) {
    if (!(err instanceof ApiError)) throw err;
    if (err.status === 401) throw new AuthError(err.message);
    if (err.status === 400) throw new AuthError("Verifica que tus datos sean válidos.");
    if (err.status === 0) throw new AuthError(err.message);
    throw new AuthError(GENERIC_MESSAGE);
  }
  
}