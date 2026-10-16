import { formatCOP } from "../../../shared/utils/format";

export const PHONE_LENGTH = 10;
export const MIN_AMOUNT = 1000;
export const MAX_AMOUNT = 100000;

export function validatePhone(cellPhone: string): true | string {
  if (cellPhone.length !== PHONE_LENGTH) return `El número debe tener ${PHONE_LENGTH} dígitos.`;
  if (!cellPhone.startsWith("3")) return "El número debe comenzar por 3.";
  return true;
}

export function validateAmount(amount: string): true | string {
  const value = parseInt(amount, 10);
  if (Number.isNaN(value)) return "Ingresa un monto válido.";
  if (value < MIN_AMOUNT) return `El monto mínimo es ${formatCOP(MIN_AMOUNT)}.`;
  if (value > MAX_AMOUNT) return `El monto máximo es ${formatCOP(MAX_AMOUNT)}.`;
  return true;
}
