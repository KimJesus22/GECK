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
| 📄 **Visor de documentos** | Tabla interactiva con íconos por tipo de archivo (PDF, Word, Video), botones de lectura y descarga. |
| 🔐 **Login / Registro** | Sistema de autenticación con formulario centrado, toggle visual entre modos y feedback de estado. |
| 🚀 **Landing Page** | Página de inicio pública con hero section, CTAs, estadísticas y tarjetas de beneficios. |
| 🗂️ **Dashboard** | Panel de control con sidebar colapsable, grid de categorías y barra de estadísticas. |

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|---|---|
| [Next.js 16](https://nextjs.org/) (App Router) | Framework React con Server Components y Turbopack |
| [Tailwind CSS 4](https://tailwindcss.com/) | Sistema de diseño con tokens personalizados |
| [Supabase](https://supabase.com/) | Backend as a Service (Auth, Database, Storage) |
| [Lucide React](https://lucide.dev/) | Biblioteca de íconos SVG |
| [TypeScript](https://www.typescriptlang.org/) | Tipado estático |
| [pnpm](https://pnpm.io/) | Gestor de paquetes rápido y eficiente |

---

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── page.tsx              # Landing Page pública
│   ├── layout.tsx            # Root layout (fuentes, sidebar condicional)
│   ├── globals.css           # Tema, colores, animaciones
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard con categorías
│   ├── normativas/
│   │   └── page.tsx          # Vista de documentos (Supabase)
│   └── login/
│       ├── page.tsx          # Login / Registro
│       └── layout.tsx        # Layout sin sidebar
├── components/
│   ├── Sidebar.tsx           # Menú lateral con navegación
│   ├── CategoryCard.tsx      # Tarjeta de categoría
│   ├── DocumentRow.tsx       # Fila de documento (tabla + tarjeta móvil)
│   ├── ConditionalSidebar.tsx # Oculta sidebar en rutas públicas
│   └── MainContent.tsx       # Wrapper de contenido principal
├── lib/
│   ├── supabase.ts           # Cliente Supabase SSR
│   └── types.ts              # Interfaces TypeScript
supabase/
├── schema.sql                # Tabla documentos + seed data
└── security.sql              # Políticas RLS de solo lectura
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

### 3. Esquema de Base de Datos

Tabla `documentos` (`supabase/schema.sql`):

| Columna | Tipo | Notas |
|---|---|---|
| `id` | `uuid` | PK, auto-generado |
| `titulo` | `text` | Nombre del documento |
| `descripcion` | `text` | Descripción breve |
| `tipo_archivo` | `text` | `'pdf'`, `'word'` o `'video'` |
| `url_archivo` | `text` | URL del archivo |
| `categoria` | `text` | Ej: `'normativas'` |
| `tamano` | `text` | Ej: `'2.4 MB'` |
| `fecha_creacion` | `timestamptz` | Auto-generado |

Incluye datos seed con 8 documentos de ejemplo y habilitación de RLS con política de lectura pública.

### 4. Archivos Creados para la Integración

| Archivo | Descripción |
|---|---|
| `src/lib/supabase.ts` | Factory function `createClient()` para Server Components |
| `src/lib/types.ts` | Interfaz `Documento` que mapea la tabla de Supabase |
| `src/app/normativas/page.tsx` | Async Server Component con `SELECT * FROM documentos` |
| `supabase/schema.sql` | SQL: tabla + seed data |
| `supabase/security.sql` | SQL: políticas RLS de solo lectura |

### 5. Seguridad RLS

**Tabla `documentos`:**

| Operación | Política |
|---|---|
| ✅ `SELECT` | Permitido para `anon` y `authenticated` |
| 🚫 `INSERT` | Bloqueado con `WITH CHECK (false)` |
| 🚫 `UPDATE` | Bloqueado con `USING (false)` |
| 🚫 `DELETE` | Bloqueado con `USING (false)` |

**Bucket de Storage `archivos`:**

| Operación | Política |
|---|---|
| ✅ `SELECT` | Permitido (descargar/leer) |
| 🚫 `INSERT` | Bloqueado |
| 🚫 `UPDATE` | Bloqueado |
| 🚫 `DELETE` | Bloqueado |

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
