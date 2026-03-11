<div align="center">

# 🖥️ INGENIA BASE

### _Codename: Proyecto G.E.C.K._

**Plataforma corporativa segura para la gestión y visualización de manuales, normativas y documentación empresarial.**

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-BaaS-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deploy-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/Licencia-Privada-red?style=for-the-badge)]()

</div>

---

## 🔐 Descripción

**INGENIA BASE** es una bóveda digital corporativa diseñada para centralizar, proteger y distribuir el conocimiento empresarial de forma segura. Funciona como una plataforma de **gestión documental de solo lectura** para empleados, con un panel de administración completo para directivos autorizados.

El proyecto pone la **ciberseguridad como prioridad**:

- 🛡️ **Autenticación obligatoria** — Solo usuarios registrados y autorizados pueden acceder a la documentación interna.
- 🔒 **Row Level Security (RLS)** — Políticas de seguridad a nivel de base de datos que garantizan acceso **exclusivamente de lectura (`SELECT`)**, bloqueando explícitamente cualquier intento de `INSERT`, `UPDATE` o `DELETE` desde la aplicación web.
- 📦 **Storage protegido** — El bucket de archivos cuenta con políticas RLS que permiten descarga pero impiden subida, edición o eliminación de documentos.
- 🔑 **Separación de roles** — Los administradores gestionan contenido desde el panel de Supabase (`service_role`), mientras que los usuarios finales solo consumen información.
- 🔀 **Route Handler seguro** — Los archivos se sirven a través de un proxy server-side (`/api/archivos/[id]`) que verifica la sesión del usuario antes de entregar el contenido. Las URLs directas de Supabase Storage nunca se exponen al cliente.
- 📋 **Auditoría inmutable** — Cada visualización y descarga de documentos genera un registro en la tabla `logs_acceso`, protegido contra ediciones y eliminaciones.

---

## ✨ Características Principales

| Característica | Descripción |
|---|---|
| 🎨 **UI Corporate SaaS Dark Mode** | Estética profesional con paleta esmeralda/indigo, bordes redondeados, tipografía Inter y fondo oscuro slate. Diseño elegante que transmite confianza tecnológica. |
| 📱 **100% Responsivo** | Diseño mobile-first con menú hamburguesa deslizante, grids adaptativos y formularios optimizados para interacción táctil. |
| 📄 **Dashboard Interactivo** | Grid dinámico de documentos con búsqueda en tiempo real, filtros por categoría, skeleton loaders y estados vacíos (Empty State). |
| 📖 **Visor de Documentos In-App** | Modal integrado para visualizar PDFs, Word (vía Office Viewer) y videos sin salir de la plataforma. |
| 🔒 **Sistema RBAC** | Perfil _admin_ con acceso total (subida, eliminación, auditoría). Perfil _evaluador_ con acceso de solo lectura. |
| 📋 **Audit Logs** | Registros de auditoría inmutables que rastrean quién visualizó o descargó cada documento, visibles solo para administradores. |
| 🔀 **API Proxy Segura** | Route Handler (`/api/archivos/[id]`) que sirve archivos sin exponer URLs de Storage. Verifica sesión activa (401 si no autenticado). |
| ⚡ **Caché con Revalidación** | Consultas cacheadas con `unstable_cache` (60s) e invalidación on-demand al subir o eliminar documentos. |
| 🦴 **Skeletons & Toasts** | Bloques animados de carga (pulse) y notificaciones flotantes (`sonner`) con feedback visual inmediato. |
| 🚀 **Panel de Administración** | Formulario protegido para subida de archivos, vista de auditoría y gestión segura. |
| 🔐 **Login / Registro** | Autenticación con formulario centrado, toggle visual entre modos, asignación de rol automática y cambio de contraseña funcional. |
| ⚙️ **Ajustes Funcionales** | Vista de perfil read-only (correo, rol, estado) y formulario de cambio de contraseña conectado a Supabase Auth. |
| 🚀 **Landing Page** | Página de inicio pública con hero section, CTAs, estadísticas y tarjetas de beneficios. |

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|---|---|
| [Next.js 16](https://nextjs.org/) (App Router + Turbopack) | Framework React con Server Components, Route Handlers y Server Actions |
| [Tailwind CSS 4](https://tailwindcss.com/) | Sistema de diseño con `@theme inline` y tokens personalizados |
| [Supabase](https://supabase.com/) | Backend as a Service (Auth, Database, Storage, RLS) |
| [Vercel](https://vercel.com/) | Plataforma de despliegue con CD automático desde GitHub |
| [Lucide React](https://lucide.dev/) | Biblioteca de íconos SVG para UI corporativa |
| [Sonner](https://sonner.emilkowal.ski/) | Manejador de notificaciones visuales emergentes (Toasts) |
| [TypeScript](https://www.typescriptlang.org/) | Tipado estático end-to-end |
| [pnpm](https://pnpm.io/) | Gestor de paquetes rápido y eficiente |

---

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── page.tsx                    # Landing Page pública
│   ├── layout.tsx                  # Root layout con Sonner Toaster
│   ├── globals.css                 # Tema Corporate SaaS, colores, animaciones
│   ├── dashboard/page.tsx          # Grid principal con filtros y caché
│   ├── login/page.tsx              # Login / Registro
│   ├── ajustes/
│   │   ├── page.tsx                # Hub de configuración
│   │   ├── perfil/page.tsx         # Vista de perfil read-only
│   │   └── seguridad/page.tsx      # Cambio de contraseña funcional
│   ├── admin/
│   │   ├── subir/page.tsx          # Formulario de subida (Admin)
│   │   ├── logs/page.tsx           # Registros de auditoría (Admin)
│   │   └── layout.tsx              # Route Guard SSR para Admin
│   ├── api/
│   │   └── archivos/[id]/route.ts  # Route Handler proxy seguro
│   ├── normativas/page.tsx         # Vista por categoría
│   ├── manuales/page.tsx           # (y demás categorías...)
│   └── ...                         # calidad, legal, rrhh, soporte, etc.
├── components/
│   ├── Sidebar.tsx                 # Menú lateral + hamburguesa móvil
│   ├── DocumentRow.tsx             # Fila de documento responsiva
│   ├── DocumentViewerModal.tsx     # Modal visor de documentos in-app
│   ├── SkeletonCard.tsx            # Bloques de carga animados (pulse)
│   ├── ConditionalSidebar.tsx      # Oculta sidebar en rutas públicas
│   └── MainContent.tsx             # Wrapper de contenido principal
├── lib/
│   ├── supabase.ts                 # Cliente Supabase SSR (Servidor)
│   ├── supabase-browser.ts         # Cliente Supabase (Cliente/Efectos)
│   ├── actions.ts                  # Server Actions (caché + revalidación)
│   ├── audit.ts                    # Función de logging de auditoría
│   └── types.ts                    # Interfaces TypeScript
supabase/
├── schema.sql                      # Tabla documentos + seed data
├── roles-policy.sql                # Triggers, Perfiles y Roles (RBAC)
├── audit-logs.sql                  # Tabla logs_acceso + políticas RLS
└── seed_extra.sql                  # Mocks adicionales
```

---

## 🚀 Instalación Local

### Prerrequisitos

- [Node.js](https://nodejs.org/) v18+
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)
- Una cuenta en [Supabase](https://supabase.com/)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/KimJesus22/GECK.git
cd GECK

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp .env.local.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=eyJhbGciOi...tu_clave_anon
```

> 📍 Encuéntralas en: **Supabase Dashboard → Settings → API**

```bash
# 4. Crear las tablas en Supabase
# Ejecuta los siguientes archivos SQL en orden desde Supabase Dashboard → SQL Editor:
#   - supabase/schema.sql          (tabla documentos)
#   - supabase/roles-policy.sql    (perfiles + RBAC)
#   - supabase/audit-logs.sql      (tabla logs_acceso)
#   - supabase/seed_extra.sql      (datos mock opcionales)

# 5. Iniciar el servidor de desarrollo
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## ☁️ Despliegue en Vercel

### Un solo clic

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FKimJesus22%2FGECK)

### Manual

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Vincular y desplegar
vercel

# 3. Configurar variables de entorno en Vercel Dashboard:
#    → Settings → Environment Variables
#    NEXT_PUBLIC_SUPABASE_URL
#    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
```

> El proyecto está configurado con **CD automático**: cada `git push` a `main` dispara un nuevo despliegue en Vercel.

---

## 🗺️ Rutas de la Aplicación

| Ruta | Descripción | Acceso |
|---|---|---|
| `/` | Landing Page | 🌐 Público |
| `/login` | Login / Registro | 🌐 Público |
| `/dashboard` | Panel de control con grid de documentos | 🔒 Autenticado |
| `/manuales` | Documentos de manuales | 🔒 Autenticado |
| `/normativas` | Documentos de normativas | 🔒 Autenticado |
| `/instructivos` | Documentos instructivos | 🔒 Autenticado |
| `/capacitacion` | Documentos de capacitación | 🔒 Autenticado |
| `/seguridad` | Documentos de seguridad industrial | 🔒 Autenticado |
| `/rrhh` | Documentos de recursos humanos | 🔒 Autenticado |
| `/soporte` | Documentos de soporte técnico | 🔒 Autenticado |
| `/calidad` | Documentos de calidad | 🔒 Autenticado |
| `/legal` | Documentos legales y cumplimiento | 🔒 Autenticado |
| `/ajustes` | Configuración de cuenta | 🔒 Autenticado |
| `/ajustes/perfil` | Vista de perfil (read-only) | 🔒 Autenticado |
| `/ajustes/seguridad` | Cambio de contraseña | 🔒 Autenticado |
| `/admin/subir` | Subida de documentos | 🔴 Solo Admin |
| `/admin/logs` | Registros de auditoría | 🔴 Solo Admin |
| `/api/archivos/[id]` | Proxy seguro de archivos | 🔒 API Auth |

---

## 📋 Lista de Tareas (Task List)

Registro de las tareas completadas durante el desarrollo del proyecto:

- [x] Planificar implementación y obtener aprobación del usuario
- [x] Crear proyecto Next.js con Tailwind CSS
- [x] Instalar dependencias (Lucide React, Sonner)
- [x] Configurar tema de Tailwind CSS (paleta Corporate SaaS Dark Mode)
- [x] Construir componente Sidebar (menú lateral + hamburguesa móvil)
- [x] Construir página Dashboard (grid de documentos con filtros y caché)
- [x] Crear vista de categorías con componente `DocumentRow` responsivo
- [x] Integrar Supabase como BaaS (cliente SSR, tipos, tabla `documentos`)
- [x] Implementar políticas RLS de solo lectura (tabla + storage)
- [x] Crear página de Login / Registro con formulario centrado
- [x] Renombrar plataforma a "INGENIA BASE"
- [x] Crear Landing Page pública con hero, CTAs y features
- [x] Mover Dashboard a `/dashboard` y configurar rutas condicionales
- [x] Implementar Skeletons de carga y Toasts de notificación
- [x] Añadir todas las categorías de documentos con datos mock
- [x] Implementar sistema de Audit Logs (tabla `logs_acceso` + RLS + vista admin)
- [x] Crear Modal Visor de Documentos in-app (PDF, Word, Video)
- [x] Optimizar diseño responsivo (menú hamburguesa, inputs táctiles)
- [x] Migrar UI a Corporate SaaS Dark Mode (esmeralda/indigo)
- [x] Implementar vistas funcionales de Ajustes (Perfil + Seguridad)
- [x] Crear Route Handler seguro `/api/archivos/[id]` con verificación de sesión
- [x] Implementar caché de documentos con revalidación on-demand
- [x] Verificar todas las vistas en navegador

---

## 📐 Plan de Implementación — Integración Supabase

### 1. Paquetes Instalados

```bash
pnpm add @supabase/supabase-js @supabase/ssr
```

- **`@supabase/supabase-js`** — Cliente core de Supabase
- **`@supabase/ssr`** — Helpers para Server Components / App Router

### 2. Variables de Entorno

Archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=eyJhbGciOi...TU_CLAVE_ANON
```

> ⚠️ Reemplaza los valores con los de tu proyecto Supabase (Settings → API).

### 3. Esquema de Base de Datos y Roles

El esquema (`supabase/schema.sql`, `supabase/roles-policy.sql` y `supabase/audit-logs.sql`) implementa 3 tablas clave y Triggers asociados:

**Tabla `perfiles`** (Gestión de Roles)
Misma ID que `auth.users`. El rol genérico por defecto de "evaluador" se asigna bajo un Trigger al crear usuario nuevo en Auth Supabase. Admins deben ser designados.

**Tabla `documentos`:**

| Columna | Tipo | Notas |
|---|---|---|
| `id` | `uuid` | PK, auto-generado |
| `titulo` | `text` | Nombre del documento |
| `descripcion` | `text` | Descripción breve |
| `tipo_archivo` | `text` | `'pdf'`, `'word'` o `'video'` |
| `url_archivo` | `text` | URL interna (proxeada vía Route Handler) |
| `categoria` | `text` | Ej: `'calidad'`, `'seguridad'` |
| `tamano` | `text` | Generado de los bytes de Storage |
| `fecha_creacion` | `timestamptz` | Auto-generado |

**Tabla `logs_acceso`** (Auditoría):

| Columna | Tipo | Notas |
|---|---|---|
| `id` | `uuid` | PK, auto-generado |
| `usuario_id` | `uuid` | FK a `auth.users` |
| `correo_usuario` | `text` | Email del usuario |
| `accion` | `text` | Ej: `'Visualizó documento en modal'` |
| `documento_id` | `uuid` | FK al documento accedido |
| `detalles` | `jsonb` | Metadata adicional |
| `fecha_hora` | `timestamptz` | Auto-generado |

> ⚠️ La tabla `logs_acceso` es **inmutable**: las políticas RLS bloquean `UPDATE` y `DELETE` para todos los usuarios.

Incluye script de mocks (`seed.sql` & `seed_extra.sql`) con ejemplos documentales repartidos en todas las categorías.

### 4. Archivos Creados para la Integración

| Archivo | Descripción |
|---|---|
| `src/lib/supabase.ts` | Factory function `createClient()` para Server Components |
| `src/lib/supabase-browser.ts` | Factory function para Client Components |
| `src/lib/types.ts` | Interfaces TypeScript (`Documento`, `Perfil`, `LogAcceso`) |
| `src/lib/audit.ts` | Función `logAuditAction()` para registros de auditoría |
| `src/lib/actions.ts` | Server Actions con `unstable_cache` y `revalidatePath` |
| `src/app/api/archivos/[id]/route.ts` | Route Handler proxy seguro para archivos |
| `src/app/dashboard/page.tsx` | Client Component con filtros y datos cacheados |
| `src/app/admin/layout.tsx` | Route Protection verificando rol admin |
| `supabase/schema.sql` | SQL: tabla documentos |
| `supabase/roles-policy.sql` | SQL: Triggers Auth + Perfiles + RLS |
| `supabase/audit-logs.sql` | SQL: tabla logs_acceso + políticas inmutables |

### 5. Seguridad RLS y Sistema RBAC

**Tabla `documentos` y Bucket `archivos`:**

| Operación | Política (Admin / Evaluador) |
|---|---|
| ✅ `SELECT` | Lectura general permitida a la red Auth autenticada |
| 🛡️ `INSERT` | ✅ Permitido a Perfil 'admin' / 🚫 Restringido general |
| 🛡️ `DELETE` | ✅ Permitido a Perfil 'admin' / 🚫 Restringido general |

**Tabla `logs_acceso`:**

| Operación | Política |
|---|---|
| ✅ `SELECT` | Solo Perfil 'admin' |
| ✅ `INSERT` | Usuarios autenticados (solo su propio registro) |
| 🚫 `UPDATE` | Bloqueado para todos |
| 🚫 `DELETE` | Bloqueado para todos |

_Las modificaciones o subidas se ligan únicamente a IDs vinculadas al texto plano `'admin'` en tabla perfiles._

---

## 🧭 Walkthrough — Recorrido del Proyecto

### Landing Page (`/`)

Página de inicio pública con navbar, hero section, dos botones CTA ("Iniciar Sesión" y "Solicitar Acceso"), barra de estadísticas, y 3 tarjetas de características con estilo corporativo.

### Login / Registro (`/login`)

Formulario centrado con barra tipo terminal (puntos rojo/amarillo/verde), toggle visual entre "Iniciar Sesión" y "Crear Cuenta", campos de correo y contraseña con bordes redondeados, y botón con hover indigo corporativo.

### Dashboard (`/dashboard`)

Panel de control con sidebar lateral (navegación a 10 categorías + enlaces admin), saludo "Bienvenido a INGENIA BASE", barra de búsqueda con filtro de categoría, y grid responsivo de tarjetas de documentos con skeleton loaders.

### Categorías (`/normativas`, `/manuales`, etc.)

Vista de documentos conectada a Supabase en tiempo real. Tabla responsiva (tabla en desktop → tarjetas en móvil) con íconos por tipo de archivo (PDF en rojo, Word en azul, Video en amarillo), botones "Leer" (abre modal) y "Descargar" (via API proxy), buscador y filtros.

### Ajustes (`/ajustes`)

Hub de configuración con dos secciones funcionales:
- **Perfil** — Datos read-only (correo, rol, estado, fecha de creación)
- **Seguridad** — Formulario de cambio de contraseña con validación en tiempo real

### Admin: Auditoría (`/admin/logs`)

Tabla de los últimos 15 movimientos del sistema con badges por tipo de acción, visible solo para administradores.

### Estructura de Rutas

| Ruta | Vista | Sidebar |
|---|---|---|
| `/` | Landing Page pública | ❌ |
| `/login` | Login / Registro | ❌ |
| `/dashboard` | Dashboard (documentos) | ✅ |
| `/normativas` | Tabla de documentos (Supabase) | ✅ |
| `/ajustes` | Configuración de cuenta | ✅ |
| `/admin/subir` | Subida de archivos | ✅ |
| `/admin/logs` | Auditoría del sistema | ✅ |

---

## 👤 Autor

**José de Jesús Cerón López**
_Estudiante de Ciberseguridad & Ethical Hacking_

[![GitHub](https://img.shields.io/badge/GitHub-KimJesus22-181717?style=flat-square&logo=github)](https://github.com/KimJesus22)

---

<div align="center">

_Hecho con 💚 y ☕ — INGENIA BASE v1.0.0_

</div>
