/** Cuerpo de `POST /auth/login`. */
export interface LoginCredentials {
  email: string;
  password: string;
}

/** Usuario autenticado (`user` en la respuesta de `POST /auth/login`; el backend no expone su id). */
export interface AuthenticatedUser {
  name: string;
  email: string;
}

/** Respuesta de `POST /auth/login`. */
export interface AuthSession {
  accessToken: string;
  tokenType: "Bearer";
  user: AuthenticatedUser;
}
