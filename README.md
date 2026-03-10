<div align="center">

# 🖥️ INGENIA BASE

### _Codename: Proyecto G.E.C.K._

**Plataforma corporativa segura para la gestión y visualización de manuales, normativas y documentación empresarial.**

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-BaaS-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/Licencia-Privada-red?style=for-the-badge)]()

</div>

---

## 🔐 Descripción

**INGENIA BASE** es una plataforma corporativa de **solo lectura** diseñada para centralizar, proteger y distribuir el conocimiento empresarial.

El proyecto pone la **ciberseguridad como prioridad**:

- 🛡️ **Autenticación obligatoria** — Solo usuarios registrados y autorizados pueden acceder a la documentación interna.
- 🔒 **Row Level Security (RLS)** — Políticas de seguridad a nivel de base de datos que garantizan acceso **exclusivamente de lectura (`SELECT`)**, bloqueando explícitamente cualquier intento de `INSERT`, `UPDATE` o `DELETE` desde la aplicación web.
- 📦 **Storage protegido** — El bucket de archivos cuenta con políticas RLS que permiten descarga pero impiden subida, edición o eliminación de documentos.
- 🔑 **Separación de roles** — Los administradores gestionan contenido desde el panel de Supabase (`service_role`), mientras que los usuarios finales solo consumen información.

---

## ✨ Características

| Característica | Descripción |
|---|---|
| 🎨 **UI/UX Geek-Chic** | Estética de terminal retro con fondo oscuro, tipografía monoespaciada, textos en verde fósforo (Fallout) y acentos en morado pastel (BTS). |
| 🧱 **Diseño estilo bloque** | Tarjetas y componentes con esquinas rectas sin redondear, inspirados en la estética de Minecraft. |
| 📱 **100% Responsivo** | Diseño adaptable a escritorio, tablet y móvil. Tablas se transforman en tarjetas apiladas en pantallas pequeñas. |
| 📄 **Bóveda Dinámica (Dashboard)** | Cuadrícula (Grid) interactiva de documentos con barra de búsqueda en tiempo real, filtros por categoría y custom cards con insignias y estados "Empty State". |
| 🔒 **Sistema de Roles y Permisos** | Protección estricta desde SQL. Perfil _`admin`_ tiene acceso total y vista exclusiva para gestión. Perfil _`evaluador`_ solo tiene de lectura (`SELECT`). |
| 🦴 **Mejoras UX (Skeletons & Toasts)** | Animación tipo esqueleto `pulse` en carga de vistas y sistema de notificaciones globales flotantes (`sonner` Toasts) con colores temáticos del proyecto. |
| 🚀 **Panel de Administración** | Formulario protegido para subida de archivos físicos al storage bucket, automatizado junto a registros en BD sin salir de la plataforma. |
| 🔐 **Login / Registro** | Sistema de autenticación con formulario centrado, toggle visual entre modos y feedback de estado con asignación de rol automática. |
| 🚀 **Landing Page** | Página de inicio pública con hero section, CTAs, estadísticas y tarjetas de beneficios. |

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|---|---|
| [Next.js 16](https://nextjs.org/) (App Router) | Framework React con Server Components y Turbopack |
| [Tailwind CSS 4](https://tailwindcss.com/) | Sistema de diseño con tokens personalizados |
| [Supabase](https://supabase.com/) | Backend as a Service (Auth, Database, Storage, RLS) |
| [Lucide React](https://lucide.dev/) | Biblioteca de íconos SVG para UI corporativa |
| [Sonner](https://sonner.emilkowal.ski/) | Manejador de notificaciones visuales emergentes (Toasts) |
| [TypeScript](https://www.typescriptlang.org/) | Tipado estático |
| [pnpm](https://pnpm.io/) | Gestor de paquetes rápido y eficiente |

---

## 📁 Estructura del Proyecto

src/
├── app/
│   ├── page.tsx              # Landing Page pública
│   ├── layout.tsx            # Root layout con Sonner Toaster
│   ├── globals.css           # Tema, colores, animaciones
│   ├── dashboard/page.tsx    # Cuadrícula principal de bóveda con filtros
│   ├── admin/
│   │   ├── subir/page.tsx    # Formulario de subida exclusiva (Admin)
│   │   └── layout.tsx        # Route Guard SSR para perfil Admin
│   ├── normativa/page.tsx    # (y vistas dedicadas ej. rrhh, soporte, calidad)
│   └── login/
│       ├── page.tsx          # Login / Registro
│       └── layout.tsx        # Layout sin sidebar
├── components/
│   ├── Sidebar.tsx           # Menú lateral dinámico según rol
│   ├── SkeletonCard.tsx      # Bloques grises de carga interactiva (pulse)
│   ├── DocumentRow.tsx       # Fila de documento (tabla vista tradicional)
│   ├── ConditionalSidebar.tsx# Oculta sidebar en rutas públicas
│   └── MainContent.tsx       # Wrapper de contenido principal
├── lib/
│   ├── supabase.ts           # Cliente Supabase SSR (Servidor)
│   ├── supabase-browser.ts   # Cliente Supabase (Cliente/Efectos)
│   └── types.ts              # Interfaces TypeScript (Documento, Perfil)
supabase/
├── schema.sql                # Tabla documentos + seed data
├── roles-policy.sql          # Triggers, Perfiles y Roles (RBAC)
└── seed_extra.sql            # Mocks adicionales de Supabase
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
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...tu_clave_anon
```

> 📍 Encuéntralas en: **Supabase Dashboard → Settings → API**

```bash
# 4. Crear la tabla en Supabase
# Copia el contenido de supabase/schema.sql y pégalo en:
# Supabase Dashboard → SQL Editor → New Query → Run

# 5. Aplicar políticas de seguridad
# Copia el contenido de supabase/security.sql y pégalo en:
# Supabase Dashboard → SQL Editor → New Query → Run

# 6. Iniciar el servidor de desarrollo
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🗺️ Rutas

| Ruta | Descripción | Acceso |
|---|---|---|
| `/` | Landing Page | 🌐 Público |
| `/login` | Login / Registro | 🌐 Público |
| `/dashboard` | Panel de control | 🔒 Autenticado |
| `/normativas` | Documentos de normativas | 🔒 Autenticado |

---

## 📋 Lista de Tareas (Task List)

Registro de las tareas completadas durante el desarrollo del proyecto:

- [x] Planificar implementación y obtener aprobación del usuario
- [x] Crear proyecto Next.js con Tailwind CSS
- [x] Instalar dependencias (Lucide React)
- [x] Configurar tema de Tailwind CSS (paleta oscura terminal, verde fósforo, morado pastel)
- [x] Construir componente Sidebar (menú lateral)
- [x] Construir página Dashboard (saludo + grid de tarjetas de categorías)
- [x] Crear vista de Normativas con componente `DocumentRow` responsivo
- [x] Integrar Supabase como BaaS (cliente SSR, tipos, tabla `documentos`)
- [x] Implementar políticas RLS de solo lectura (tabla + storage)
- [x] Crear página de Login / Registro con formulario centrado
- [x] Renombrar plataforma a "INGENIA BASE"
- [x] Crear Landing Page pública con hero, CTAs y features
- [x] Mover Dashboard a `/dashboard` y configurar rutas condicionales
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
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...TU_CLAVE_ANON
```

> ⚠️ Reemplaza los valores con los de tu proyecto Supabase (Settings → API).

### 3. Esquema de Base de Datos y Roles

El esquema (`supabase/schema.sql` y `supabase/roles-policy.sql`) implementa 2 tablas clave y Triggers asociados:

**Tabla `perfiles`** (Gestión de Roles)
Misma ID que `auth.users`. El rol genérico por defecto de "evaluador" se asigna bajo un Trigger al crear usuario nuevo en Auth Supabase. Admins deben ser designados.

**Tabla `documentos`:**

| Columna | Tipo | Notas |
|---|---|---|
| `id` | `uuid` | PK, auto-generado |
| `titulo` | `text` | Nombre del documento |
| `descripcion` | `text` | Descripción breve |
| `tipo_archivo` | `text` | `'pdf'`, `'word'` o `'video'` |
| `url_archivo` | `text` | URL original para visualizador remoto |
| `categoria` | `text` | Ej: `'calidad'`, `'seguridad'` |
| `tamano` | `text` | Generado de los bytes de Storage |
| `fecha_creacion` | `timestamptz` | Auto-generado |

Incluye script de mocks (`seed.sql` & `seed_extra.sql`) con ejemplos documentales repartidos en todas las categorías.

### 4. Archivos Creados para la Integración

| Archivo | Descripción |
|---|---|
| `src/lib/supabase.ts` | Factory function `createClient()` para Server Components |
| `src/lib/types.ts` | Exportación e interfaces TypeScript de las tablas |
| `src/app/dashboard/page.tsx` | Client Component conectando BD con filtros debounced |
| `src/app/admin/layout.tsx` | Route Protection usando cliente SSL verificando rol |
| `supabase/schema.sql` | SQL: tabla cruda |
| `supabase/roles-policy.sql` | SQL: Triggers Auth + Perfiles CREADOR + RLS Segura |

### 5. Seguridad RLS y Sistema RBAC

**Tabla `documentos` y Bucket `archivos`:**

| Operación | Política (Admin / Evaluador) |
|---|---|
| ✅ `SELECT` | Lectura general permitida a la red Auth autenticada |
| 🛡️ `INSERT` | ✅ Permitido a Perfil 'admin' / 🚫 Restringido general |
| 🛡️ `DELETE` | ✅ Permitido a Perfil 'admin' / 🚫 Restringido general |

_Las modificaciones o subidas se ligan únicamente a IDs vinculadas al texto plano `'admin'` en tabla perfiles._

---

## 🧭 Walkthrough — Recorrido del Proyecto

### Landing Page (`/`)

Página de inicio pública con navbar, hero section, dos botones CTA ("Iniciar Sesión" y "Solicitar Acceso"), barra de estadísticas, y 3 tarjetas de características con estilo bloque Minecraft.

### Login / Registro (`/login`)

Formulario centrado con barra tipo terminal (puntos rojo/amarillo/verde), toggle visual entre "Iniciar Sesión" y "Crear Cuenta", campos de correo y contraseña con bordes rectos, y botón con hover morado pastel.

### Dashboard (`/dashboard`)

Panel de control con sidebar lateral (navegación a Inicio, Manuales, Normativas, Ajustes), saludo "Bienvenido a INGENIA BASE", barra de stats, y grid de 6 tarjetas de categorías con hover morado.

### Normativas (`/normativas`)

Vista de documentos conectada a Supabase en tiempo real. Tabla responsiva (tabla en desktop → tarjetas en móvil) con íconos por tipo de archivo (PDF en rojo, Word en azul, Video en amarillo), botones "Leer" y "Descargar", buscador y filtros.

### Estructura de Rutas

| Ruta | Vista | Sidebar |
|---|---|---|
| `/` | Landing Page pública | ❌ |
| `/login` | Login / Registro | ❌ |
| `/dashboard` | Dashboard (categorías) | ✅ |
| `/normativas` | Tabla de documentos (Supabase) | ✅ |

---

## 👤 Autor

**José de Jesús Cerón López**
_Estudiante de Ciberseguridad & Ethical Hacking_

[![GitHub](https://img.shields.io/badge/GitHub-KimJesus22-181717?style=flat-square&logo=github)](https://github.com/KimJesus22)

---

<div align="center">

_Hecho con 💚 y ☕ — INGENIA BASE v1.0.0_

</div>
