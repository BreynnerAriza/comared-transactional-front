import type { AuthenticatedUser } from "../../../shared/types/user.types";

export type { AuthenticatedUser };

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthSession {
  accessToken: string;
  tokenType: "Bearer";
  user: AuthenticatedUser;
}
