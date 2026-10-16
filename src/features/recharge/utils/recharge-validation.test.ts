import { describe, expect, it } from "vitest";
import { validateAmount, validatePhone } from "./recharge-validation";

describe("validatePhone", () => {
  it("acepta un celular de 10 dígitos que empieza por 3", () => {
    expect(validatePhone("3124567890")).toBe(true);
  });

  it("rechaza un número con menos de 10 dígitos", () => {
    expect(validatePhone("312456")).toBe("El número debe tener 10 dígitos.");
  });

  it("rechaza un número que no empieza por 3", () => {
    expect(validatePhone("6014567890")).toBe("El número debe comenzar por 3.");
  });
});

describe("validateAmount", () => {
  it("acepta montos dentro del rango", () => {
    expect(validateAmount("1000")).toBe(true);
    expect(validateAmount("100000")).toBe(true);
  });

  it("rechaza un monto vacío", () => {
    expect(validateAmount("")).toBe("Ingresa un monto válido.");
  });

  it("rechaza montos fuera del rango", () => {
    expect(validateAmount("999")).toBe("El monto mínimo es $ 1.000 COP.");
    expect(validateAmount("100001")).toBe("El monto máximo es $ 100.000 COP.");
  });
});
