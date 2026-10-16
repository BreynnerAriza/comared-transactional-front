import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, apiRequest, setUnauthorizedHandler } from "./api-client";
import { mockFetch, mockFetchNetworkError } from "../test/fetch-mock";

afterEach(() => {
  vi.unstubAllGlobals();
  setUnauthorizedHandler(null);
});

describe("apiRequest", () => {
  it("devuelve el body parseado cuando la respuesta es exitosa", async () => {
    mockFetch(200, { ok: true });
    await expect(apiRequest("/test")).resolves.toEqual({ ok: true });
  });

  it("envía el token y el body como JSON", async () => {
    const fetchMock = mockFetch(200, {});
    await apiRequest("/test", { method: "POST", body: { a: 1 }, token: "abc" });

    const [, init] = fetchMock.mock.calls[0];
    expect(init.method).toBe("POST");
    expect(init.body).toBe(JSON.stringify({ a: 1 }));
    expect(init.headers).toMatchObject({
      "Content-Type": "application/json",
      Authorization: "Bearer abc",
    });
  });

  it("lanza ApiError con el mensaje del backend", async () => {
    mockFetch(400, { statusCode: 400, message: ["campo requerido", "otro error"] });
    await expect(apiRequest("/test")).rejects.toMatchObject({
      status: 400,
      message: "campo requerido. otro error",
    });
  });

  it("lanza ApiError con status 0 si no hay conexión", async () => {
    mockFetchNetworkError();
    const request = apiRequest("/test");
    await expect(request).rejects.toBeInstanceOf(ApiError);
    await expect(request).rejects.toMatchObject({ status: 0 });
  });

  it("llama al handler de no autorizado ante un 401 con token", async () => {
    const handler = vi.fn();
    setUnauthorizedHandler(handler);
    mockFetch(401, { statusCode: 401, message: "Unauthorized" });

    await expect(apiRequest("/test", { token: "abc" })).rejects.toBeInstanceOf(ApiError);
    expect(handler).toHaveBeenCalledOnce();
  });

  it("no llama al handler ante un 401 sin token (ej. login)", async () => {
    const handler = vi.fn();
    setUnauthorizedHandler(handler);
    mockFetch(401, { statusCode: 401, message: "Credenciales inválidas" });

    await expect(apiRequest("/auth/login")).rejects.toBeInstanceOf(ApiError);
    expect(handler).not.toHaveBeenCalled();
  });
});
