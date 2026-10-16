import { afterEach, describe, expect, it, vi } from "vitest";
import {
  RechargeError,
  buyRecharge,
  getRechargeById,
  getRechargeHistory,
  getSuppliers,
} from "./recharge.service";
import type { BuyRechargeRequest } from "../types/recharge.types";
import { mockFetch, mockFetchNetworkError } from "../../../shared/test/fetch-mock";

const TOKEN = "token";
const payload: BuyRechargeRequest = { supplierId: "1", supplierName: "Claro", value: 10000, cellPhone: "3124567890" };

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("consultas de recargas", () => {
  it("getRechargeHistory envía página y tamaño en la URL", async () => {
    const fetchMock = mockFetch(200, { data: [], pagination: {} });
    await getRechargeHistory(TOKEN, 2, 15);
    expect(fetchMock.mock.calls[0][0]).toContain("/recharge/history?page=2&size=15");
  });

  it("getRechargeById consulta la recarga por id", async () => {
    const fetchMock = mockFetch(200, { id: "abc" });
    await expect(getRechargeById(TOKEN, "abc")).resolves.toEqual({ id: "abc" });
    expect(fetchMock.mock.calls[0][0]).toContain("/recharge/abc");
  });

  it("getSuppliers devuelve la lista de operadores", async () => {
    mockFetch(200, [{ id: "1", name: "Claro" }]);
    await expect(getSuppliers(TOKEN)).resolves.toEqual([{ id: "1", name: "Claro" }]);
  });
});

describe("buyRecharge", () => {
  it("devuelve la respuesta y envía la Idempotency-Key", async () => {
    const response = { rechargeId: "r1", transactionalID: "t1", message: "ok" };
    const fetchMock = mockFetch(201, response);

    await expect(buyRecharge(TOKEN, payload, "key-1")).resolves.toEqual(response);
    expect(fetchMock.mock.calls[0][1].headers).toMatchObject({ "Idempotency-Key": "key-1" });
  });

  it("409: avisa que la recarga ya se está procesando", async () => {
    mockFetch(409, { statusCode: 409, message: "Conflict" });
    await expect(buyRecharge(TOKEN, payload, "k")).rejects.toThrow(
      "Tu recarga ya se está procesando",
    );
  });

  it("IDEMPOTENCY_KEY_REUSED: pide volver a confirmar", async () => {
    mockFetch(422, { statusCode: 422, message: "x", code: "IDEMPOTENCY_KEY_REUSED" });
    await expect(buyRecharge(TOKEN, payload, "k")).rejects.toThrow(
      "Los datos de la recarga cambiaron. Vuelve a confirmarla.",
    );
  });

  it("422: usa el mensaje del backend y conserva el rechargeId", async () => {
    mockFetch(422, { statusCode: 422, message: "Saldo insuficiente", rechargeId: "r1" });
    const error = await buyRecharge(TOKEN, payload, "k").catch((e) => e);

    expect(error).toBeInstanceOf(RechargeError);
    expect(error.message).toBe("Saldo insuficiente");
    expect(error.rechargeId).toBe("r1");
  });

  it("502: usa el mensaje del backend y conserva el rechargeId", async () => {
    mockFetch(502, { statusCode: 502, message: "Proveedor no disponible", rechargeId: "r2" });
    const error = await buyRecharge(TOKEN, payload, "k").catch((e) => e);
    expect(error.rechargeId).toBe("r2");
  });

  it.each([
    [400, "Verifica los datos de la recarga."],
    [404, "El operador seleccionado no está disponible."],
    [500, "No pudimos procesar la recarga. Intenta nuevamente en unos minutos."],
  ])("status %i: muestra '%s'", async (status, message) => {
    mockFetch(status, { statusCode: status, message: "x" });
    await expect(buyRecharge(TOKEN, payload, "k")).rejects.toThrow(message);
  });

  it("sin conexión: informa que no se pudo conectar", async () => {
    mockFetchNetworkError();
    await expect(buyRecharge(TOKEN, payload, "k")).rejects.toThrow(
      "No fue posible conectar con el servidor",
    );
  });
});
