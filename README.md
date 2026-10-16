# Comared · Portal transaccional (frontend)

Portal web para iniciar sesión, comprar recargas móviles y consultar el histórico de
transacciones con su comprobante.

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS 4 · React Router · React Hook Form ·
Vitest

## Requisitos

- Node.js 20 o superior
- El backend de Comared corriendo (por defecto en `http://localhost:3000`)

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # ajusta VITE_API_URL si el backend corre en otra URL
npm run dev
```

La app queda en `http://localhost:5173`.

| Variable       | Descripción                  | Ejemplo                 |
| -------------- | ---------------------------- | ----------------------- |
| `VITE_API_URL` | URL base del backend (API)   | `http://localhost:3000` |

## Scripts

| Comando           | Qué hace                                         |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Servidor de desarrollo con recarga en caliente   |
| `npm run build`   | Revisa tipos (`tsc`) y genera la build en `dist/` |
| `npm run preview` | Sirve la build de `dist/` localmente             |
| `npm run lint`    | Revisa el código con ESLint                      |
| `npm test`        | Ejecuta los tests unitarios (Vitest)             |

Para ver cada test por nombre: `npx vitest run --reporter=verbose`. En modo watch: `npx vitest`.

## Estructura

El código se organiza por **features** (funcionalidades). Cada feature agrupa todo lo suyo y
expone lo que usan las demás desde su `index.ts`.

```
src/
├── features/
│   ├── auth/              Login y sesión
│   │   ├── components/    LoginForm, AuthShowcase
│   │   ├── context/       AuthProvider: guarda la sesión y la comparte con la app
│   │   ├── hooks/         useAuth()
│   │   ├── pages/         LoginPage
│   │   ├── services/      Llamadas al backend (login)
│   │   ├── types/
│   │   └── utils/         Guardar/leer la sesión en localStorage
│   ├── dashboard/
│   │   └── pages/         DashboardPage: tabla de recargas + modales
│   └── recharge/          Recargas móviles
│       ├── components/
│       │   ├── buy-recharge/   Modal de compra (paso 1: datos, paso 2: confirmación)
│       │   ├── ReceiptModal    Comprobante de una recarga
│       │   └── RechargeTable, TablePagination, badges…
│       ├── hooks/         useRechargeHistory, useRechargeDetail, useSuppliers
│       ├── services/      Llamadas al backend (histórico, detalle, operadores, compra)
│       ├── types/
│       └── utils/         Validaciones y estilos por estado/operador
├── routes/                Rutas públicas y protegidas
└── shared/                Lo que usa más de una feature
    ├── components/ui/     Button, IconButton, TextField, Modal, Alert, Loader, Icon
    ├── components/layout/ DashboardLayout, Header, Sidebar
    ├── lib/api-client.ts  fetch al backend + manejo de errores
    ├── test/              Utilidades para los tests
    └── utils/format.ts    Formato de moneda, teléfono y fechas
```

### Flujo de datos

```
Componente  →  hook (useRechargeHistory…)  →  service (recharge.service)  →  api-client  →  backend
```

- **services**: solo hablan con el backend y traducen los errores HTTP a mensajes para el usuario.
- **hooks**: guardan el estado de la petición (`loading`, `error`, datos) para los componentes.
- **components**: solo muestran datos y reaccionan a lo que hace el usuario.

## Tests

Los tests van junto al archivo que prueban (`recharge.service.ts` → `recharge.service.test.ts`).
Cubren el cliente HTTP, los servicios y las validaciones del formulario de recarga. `fetch` se
simula, así que no necesitan el backend corriendo.
