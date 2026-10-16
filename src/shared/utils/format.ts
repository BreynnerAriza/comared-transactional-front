const LOCALE = "es-CO";

/** `20000` → `$ 20.000 COP` */
export function formatCOP(value: number): string {
  return `$ ${new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 }).format(value)} COP`;
}

/** `3124567890` → `+57 312 456 7890`. Si no tiene 10 dígitos se devuelve tal cual. */
export function formatPhone(cellPhone: string): string {
  const match = /^(\d{3})(\d{3})(\d{4})$/.exec(cellPhone);
  return match ? `+57 ${match[1]} ${match[2]} ${match[3]}` : cellPhone;
}

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

/** `Hoy, 11:20 a. m.` / `Ayer, …` / `18 may 2025, …` */
export function formatRelativeDateTime(iso: string, now: Date = new Date()): string {
  const date = new Date(iso);
  const time = new Intl.DateTimeFormat(LOCALE, { hour: "2-digit", minute: "2-digit" }).format(date);
  const dayDiff = Math.round((startOfDay(now) - startOfDay(date)) / 86_400_000);

  if (dayDiff === 0) return `Hoy, ${time}`;
  if (dayDiff === 1) return `Ayer, ${time}`;

  const day = new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
  return `${day}, ${time}`;
}

/** `2025-05-18 11:20:14` (hora local). */
export function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  );
}

/** `Carlos Pérez` → `CP` */
export function getInitials(name: string): string {
  const letters = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase());
  return letters.join("") || "?";
}
