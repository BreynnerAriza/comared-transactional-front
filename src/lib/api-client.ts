/** Forma de los errores por defecto de Nest (el backend no define un filtro propio). */
export interface ApiErrorResponse {
  statusCode: number;
  /** `string[]` solo en errores de validación (400). */
  message: string | string[];
  /** Ausente en algunas respuestas, p. ej. los errores de recarga. */
  error?: string;
}

/** Error HTTP devuelto por el backend. `status === 0` indica que no hubo respuesta. */
export class ApiError extends Error {
  readonly status: number;
  readonly body: ApiErrorResponse | null;

  constructor(status: number, message: string, body: ApiErrorResponse | null = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

type UnauthorizedHandler = () => void;

let onUnauthorized: UnauthorizedHandler | null = null;

/** Registra qué hacer cuando una petición autenticada recibe 401 (token vencido o inválido). */
export function setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
  onUnauthorized = handler;
}

const BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

function normalizeMessage(body: ApiErrorResponse | null, fallback: string): string {
  if (!body) return fallback;
  const { message } = body;
  if (Array.isArray(message)) return message.join(". ");
  return message || fallback;
}

async function parseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return typeof value === "object" && value !== null && "message" in value;
}

export async function apiRequest<T>(
  path: string,
  options: { method?: "GET" | "POST"; body?: unknown; token?: string } = {},
): Promise<T> {
  const { method = "GET", body, token } = options;

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        ...(body !== undefined && { "Content-Type": "application/json" }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "No fue posible conectar con el servidor");
  }

  const data = await parseBody(response);

  if (!response.ok) {
    // Solo con token: un 401 del login (credenciales incorrectas) no debe cerrar sesión.
    if (response.status === 401 && token) onUnauthorized?.();

    const errorBody = isApiErrorResponse(data) ? data : null;
    throw new ApiError(
      response.status,
      normalizeMessage(errorBody, response.statusText),
      errorBody,
    );
  }

  return data as T;
}
