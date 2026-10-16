import { vi } from "vitest";

/** Reemplaza `fetch` global para que responda con el status y body indicados. */
export function mockFetch(status: number, body?: unknown) {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(body === undefined ? null : JSON.stringify(body), { status }),
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

/** Simula que el servidor no responde (error de red). */
export function mockFetchNetworkError() {
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
}
