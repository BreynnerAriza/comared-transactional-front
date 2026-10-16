# Comared Transactional Front

Portal web construido con **React + Vite** para la venta de recargas de telefonía móvil. Permite iniciar sesión, comprar recargas a los operadores disponibles, ver el comprobante de cada compra y consultar el historial de transacciones. Consume la API de [comared-transactional-back](https://github.com/BreynnerAriza/comared-transactional-back).

| | |
|---|---|
| 🌐 **App desplegada** | https://comared-transactional-front.vercel.app |
| 🔌 **API (backend)** | https://comared-transactional-back.onrender.com |
| 💻 **Repositorio** | https://github.com/BreynnerAriza/comared-transactional-front |

---

## Tabla de contenido

1. [Tecnologías](#-tecnologías)
2. [Requisitos previos](#-requisitos-previos)
3. [Instalación paso a paso](#-instalación-paso-a-paso)
4. [Variables de entorno](#-variables-de-entorno)
5. [Ejecutar el proyecto](#-ejecutar-el-proyecto)
6. [Funcionalidades](#-funcionalidades)
7. [Pruebas](#-pruebas)
8. [Estructura del proyecto](#-estructura-del-proyecto)
9. [Despliegue en Vercel](#-despliegue-en-vercel)
10. [Scripts disponibles](#-scripts-disponibles)

---

## 🧰 Tecnologías

- **React 19** + **TypeScript**
- **Vite 8** (bundler y servidor de desarrollo)
- **Tailwind CSS 4** (estilos)
- **React Router 8** (rutas públicas y protegidas)
- **React Hook Form** (formularios y validaciones)
- **Sonner** (notificaciones)
- **Vitest** (pruebas unitarias)
- **ESLint** (calidad de código)

---

## ✅ Requisitos previos

Antes de empezar, asegúrate de tener instalado:

| Herramienta | Versión | Verificar con |
|---|---|---|
| [Node.js](https://nodejs.org/) | **24.x LTS** (recomendada, mínimo 20.19) | `node -v` |
| npm | Incluido con Node.js (10+) | `npm -v` |
| [Git](https://git-scm.com/) | Cualquier versión reciente | `git --version` |

También necesitas el **backend** corriendo, ya sea en local o usando la versión desplegada en Render. Para iniciar sesión se usan las credenciales de prueba entregadas junto con la prueba técnica.

---

## 🚀 Instalación paso a paso

### 1. Clonar el repositorio

```bash
git clone https://github.com/BreynnerAriza/comared-transactional-front.git
cd comared-transactional-front
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar las variables de entorno

```bash
# Linux / macOS / Git Bash
cp .env.example .env.local

# Windows (PowerShell)
Copy-Item .env.example .env.local
```

Luego edita `.env.local` con la URL del backend. Revisa la sección [Variables de entorno](#-variables-de-entorno).

### 4. Arrancar el proyecto

```bash
npm run dev
```

Si todo salió bien, la app queda disponible en http://localhost:5173 🎉

> ⚠️ **Importante:** el backend debe permitir el origen del front. En el `.env.local` del backend, `CORS_ORIGINS` debe incluir `http://localhost:5173`.

---

## 🔐 Variables de entorno

Vite carga automáticamente el archivo `.env.local`. Solo las variables que empiezan por `VITE_` quedan disponibles en el navegador.

| Variable | Obligatoria | Descripción | Ejemplo |
|---|:---:|---|---|
| `VITE_API_URL` | ✅ | URL base del backend | `http://localhost:3000` |

Para usar el backend desplegado en lugar del local:

```bash
VITE_API_URL=https://comared-transactional-back.onrender.com
```

> 🔒 Los archivos `.env.*` están en el `.gitignore`; solo se versiona `.env.example`. Como cualquier variable `VITE_` termina dentro del código que descarga el navegador, **nunca pongas secretos aquí**.

---

## ▶️ Ejecutar el proyecto

```bash
# Desarrollo (recarga automática al guardar cambios)
npm run dev
```

### Modo producción

```bash
# 1. Revisar tipos y compilar (genera la carpeta dist/)
npm run build

# 2. Servir la versión compilada en local
npm run preview
```

> ⏳ Si usas el backend de Render, la primera petición puede tardar **30–60 segundos** mientras el servicio se activa (plan gratuito). El inicio de sesión puede demorar un poco la primera vez.

---

## ✨ Funcionalidades

| Pantalla | Ruta | Descripción |
|---|---|---|
| Inicio de sesión | `/login` | Login con correo y contraseña. Si ya hay sesión, redirige al inicio. |
| Recargas móviles | `/` | Historial paginado de recargas (10, 15 o 20 filas), compra de recargas y comprobante. Requiere sesión. |

### Compra de una recarga

1. **Datos:** se elige el operador, el número de celular y el monto.
2. **Confirmación:** se muestra un resumen antes de enviar la recarga.
3. **Comprobante:** al terminar, se abre el ticket con el estado, el ID transaccional y el mensaje del proveedor.

### Reglas de negocio validadas en el formulario

- **Monto:** entre **$ 1.000** y **$ 100.000** COP.
- **Celular:** **10 dígitos**, solo números, y debe empezar por **3**.
- **Operador:** debe seleccionarse uno de los que devuelve el backend.

El backend vuelve a validar estas mismas reglas antes de procesar la compra.

### Sesión

- El token se guarda en `localStorage` y se descarta automáticamente si está vencido.
- Si el backend responde `401` en una petición autenticada, la sesión se cierra y se vuelve al login.
- Cada compra envía un header `Idempotency-Key` único: si la petición se reintenta, el backend no cobra dos veces.

---

## 🧪 Pruebas

El proyecto tiene **pruebas unitarias** con Vitest para el cliente HTTP, los servicios de autenticación y recargas, y las validaciones del formulario (4 archivos, 29 pruebas). No requieren el backend: `fetch` se simula en cada prueba.

```bash
# Ejecutar todas las pruebas unitarias
npm test

# Ver cada prueba por nombre
npx vitest run --reporter=verbose

# Modo observador (vuelve a ejecutar al guardar cambios)
npx vitest
```

Las pruebas están junto al archivo que prueban, por ejemplo `recharge.service.ts` → `recharge.service.test.ts`.

> ℹ️ Este proyecto **no incluye pruebas de componentes ni end-to-end (e2e)**; el alcance de las pruebas es unitario.

### Calidad de código

```bash
# Linter
npm run lint
```

---

## 📁 Estructura del proyecto

```
comared-transactional-front/
├── public/                          # Archivos estáticos (favicon)
├── src/
│   ├── features/
│   │   ├── auth/                    # Login, sesión y AuthProvider
│   │   ├── dashboard/               # Página principal (historial + modales)
│   │   └── recharge/                # Compra, historial y comprobante de recargas
│   │       └── components/
│   │           └── buy-recharge/    # Modal de compra (datos → confirmación)
│   ├── routes/                      # Rutas públicas y protegidas
│   ├── shared/
│   │   ├── components/ui/           # Button, IconButton, TextField, Modal, Alert, Loader
│   │   ├── components/layout/       # DashboardLayout, Header, Sidebar
│   │   ├── lib/api-client.ts        # Cliente HTTP y manejo de errores
│   │   ├── test/                    # Utilidades para las pruebas
│   │   └── utils/format.ts          # Formato de moneda, teléfono y fechas
│   ├── App.tsx
│   └── main.tsx                     # Punto de entrada
├── .env.example                     # Plantilla de variables de entorno
├── vercel.json                      # Rutas de la SPA en Vercel
├── vite.config.ts                   # Configuración de Vite y Vitest
└── package.json
```

Cada feature sigue la misma organización: `components/`, `hooks/`, `services/`, `types/`, `utils/` y un `index.ts` con lo que expone a las demás.

El flujo de datos va en una sola dirección:

```
Componente  →  hook  →  service  →  api-client  →  backend
```

## 👤 Autor

**Breynner Ariza** · [GitHub](https://github.com/BreynnerAriza)
