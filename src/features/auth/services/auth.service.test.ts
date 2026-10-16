import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthError, login } from "./auth.service";
import type { AuthSession, LoginCredentials } from "../types/auth.types";
import { mockFetch, mockFetchNetworkError } from "../../../shared/test/fetch-mock";

const credentials: LoginCredentials = { email: "user@test.com", password: "123456" };

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("login", () => {
  it("devuelve la sesión cuando las credenciales son correctas", async () => {
    const session: AuthSession = {
      accessToken: "token",
      tokenType: "Bearer",
      user: { name: "Carlos", email: "user@test.com" },
    };
    mockFetch(200, session);
    await expect(login(credentials)).resolves.toEqual(session);
  });

  it("muestra el mensaje del backend ante credenciales incorrectas (401)", async () => {
    mockFetch(401, { statusCode: 401, message: "Credenciales inválidas" });
    const error = await login(credentials).catch((e) => e);
    expect(error).toBeInstanceOf(AuthError);
    expect(error.message).toBe("Credenciales inválidas");
  });

  it("pide verificar los datos ante un 400", async () => {
    mockFetch(400, { statusCode: 400, message: ["email inválido"] });
    await expect(login(credentials)).rejects.toThrow("Verifica que tus datos sean válidos.");
  });

  it("muestra un mensaje genérico ante un error del servidor", async () => {
    mockFetch(500, { statusCode: 500, message: "Internal server error" });
    await expect(login(credentials)).rejects.toThrow(
      "No pudimos iniciar sesión. Intenta nuevamente en unos minutos.",
    );
  });

  it("informa cuando no hay conexión con el servidor", async () => {
    mockFetchNetworkError();
    await expect(login(credentials)).rejects.toThrow("No fue posible conectar con el servidor");
  });
});
