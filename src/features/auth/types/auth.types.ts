/** Cuerpo de `POST /auth/login`. */
export interface LoginCredentials {
  email: string;
  password: string;
}

/** Usuario autenticado (`user` en la respuesta de login y respuesta de `GET /auth/me`). */
export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
}

/** Respuesta de `POST /auth/login`. */
export interface AuthSession {
  accessToken: string;
  tokenType: "Bearer";
  user: AuthenticatedUser;
}
