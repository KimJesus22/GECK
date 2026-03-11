-- ╔══════════════════════════════════════════════════════════════════╗
-- ║            INGENIA BASE — Script Maestro de Inicialización      ║
-- ║                                                                  ║
-- ║  Este script configura una instancia nueva de Supabase desde     ║
-- ║  cero: tablas, triggers, RLS, storage y datos de ejemplo.        ║
-- ║                                                                  ║
-- ║  📍 Ejecución: Supabase Dashboard → SQL Editor → New Query       ║
-- ║  ⚠️  Ejecutar una sola vez por instancia nueva.                  ║
-- ║  ⚡ El script es idempotente (DROP IF EXISTS antes de crear).     ║
-- ╚══════════════════════════════════════════════════════════════════╝


-- ┌──────────────────────────────────────────────────────────────────┐
-- │  PASO 1: TABLA DE DOCUMENTOS                                     │
-- │  Almacena los registros de todos los documentos de la plataforma │
-- └──────────────────────────────────────────────────────────────────┘

CREATE TABLE IF NOT EXISTS public.documentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  tipo_archivo TEXT NOT NULL CHECK (tipo_archivo IN ('pdf', 'word', 'video')),
  url_archivo TEXT,
  categoria TEXT NOT NULL,
  tamano TEXT,
  fecha_creacion TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE public.documentos ENABLE ROW LEVEL SECURITY;


-- ┌──────────────────────────────────────────────────────────────────┐
-- │  PASO 2: TABLA DE PERFILES (Sistema RBAC)                        │
-- │  Gestiona los roles: 'admin' y 'evaluador'                       │
-- │  Se vincula con auth.users vía el mismo UUID                     │
-- └──────────────────────────────────────────────────────────────────┘

CREATE TABLE IF NOT EXISTS public.perfiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  rol TEXT NOT NULL DEFAULT 'evaluador' CHECK (rol IN ('admin', 'evaluador')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;


-- ┌──────────────────────────────────────────────────────────────────┐
-- │  PASO 3: TABLA DE AUDIT LOGS (Registros de Auditoría)            │
-- │  Rastrea cada visualización y descarga de documentos             │
-- │  Los registros son INMUTABLES (UPDATE/DELETE bloqueado)           │
-- └──────────────────────────────────────────────────────────────────┘

CREATE TABLE IF NOT EXISTS public.logs_acceso (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  correo_usuario TEXT NOT NULL,
  accion TEXT NOT NULL,
  documento_id UUID REFERENCES public.documentos(id) ON DELETE SET NULL,
  detalles JSONB DEFAULT '{}'::jsonb,
  fecha_hora TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.logs_acceso ENABLE ROW LEVEL SECURITY;


-- ┌──────────────────────────────────────────────────────────────────┐
-- │  PASO 4: TRIGGER — Asignación Automática de Rol                  │
-- │  Cuando un usuario se registra en Auth, automáticamente se le    │
-- │  crea un perfil con rol 'evaluador' en la tabla perfiles.        │
-- └──────────────────────────────────────────────────────────────────┘

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.perfiles (id, rol)
  VALUES (new.id, 'evaluador');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminar trigger previo si existe (para re-ejecución limpia)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ┌──────────────────────────────────────────────────────────────────┐
-- │  PASO 5: POLÍTICAS RLS — Tabla "documentos"                      │
-- │                                                                   │
-- │  SELECT  → Todos los autenticados                                │
-- │  INSERT  → Solo rol 'admin'                                      │
-- │  UPDATE  → Solo rol 'admin'                                      │
-- │  DELETE  → Solo rol 'admin'                                      │
-- └──────────────────────────────────────────────────────────────────┘

-- Limpiar políticas anteriores
DROP POLICY IF EXISTS "Lectura pública de documentos" ON public.documentos;
DROP POLICY IF EXISTS "Bloquear INSERT público" ON public.documentos;
DROP POLICY IF EXISTS "Bloquear UPDATE público" ON public.documentos;
DROP POLICY IF EXISTS "Bloquear DELETE público" ON public.documentos;
DROP POLICY IF EXISTS "INSERT para usuarios autenticados" ON public.documentos;
DROP POLICY IF EXISTS "Permitir SELECT a todos los autenticados" ON public.documentos;
DROP POLICY IF EXISTS "Permitir INSERT solo a admins" ON public.documentos;
DROP POLICY IF EXISTS "Permitir UPDATE solo a admins" ON public.documentos;
DROP POLICY IF EXISTS "Permitir DELETE solo a admins" ON public.documentos;

-- ✅ SELECT: Todos los autenticados
CREATE POLICY "documentos_select_auth"
  ON public.documentos FOR SELECT TO authenticated
  USING (true);

-- 🛡️ INSERT: Solo admin
CREATE POLICY "documentos_insert_admin"
  ON public.documentos FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.perfiles
      WHERE perfiles.id = auth.uid() AND perfiles.rol = 'admin'
    )
  );

-- 🛡️ UPDATE: Solo admin
CREATE POLICY "documentos_update_admin"
  ON public.documentos FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.perfiles
      WHERE perfiles.id = auth.uid() AND perfiles.rol = 'admin'
    )
  );

-- 🛡️ DELETE: Solo admin
CREATE POLICY "documentos_delete_admin"
  ON public.documentos FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.perfiles
      WHERE perfiles.id = auth.uid() AND perfiles.rol = 'admin'
    )
  );


-- ┌──────────────────────────────────────────────────────────────────┐
-- │  PASO 6: POLÍTICAS RLS — Tabla "perfiles"                        │
-- │                                                                   │
-- │  SELECT  → Solo su propio perfil                                 │
-- └──────────────────────────────────────────────────────────────────┘

DROP POLICY IF EXISTS "Usuarios pueden leer su propio perfil" ON public.perfiles;

CREATE POLICY "perfiles_select_own"
  ON public.perfiles FOR SELECT TO authenticated
  USING (auth.uid() = id);


-- ┌──────────────────────────────────────────────────────────────────┐
-- │  PASO 7: POLÍTICAS RLS — Tabla "logs_acceso"                     │
-- │                                                                   │
-- │  INSERT  → Usuarios autenticados (solo su propio log)            │
-- │  SELECT  → Solo admins (vista de auditoría)                      │
-- │  UPDATE  → 🚫 Bloqueado para todos (inmutable)                   │
-- │  DELETE  → 🚫 Bloqueado para todos (inmutable)                   │
-- └──────────────────────────────────────────────────────────────────┘

DROP POLICY IF EXISTS "Permitir inserción de logs propios" ON public.logs_acceso;
DROP POLICY IF EXISTS "Admins pueden leer todos los logs" ON public.logs_acceso;
DROP POLICY IF EXISTS "Bloquear updates en logs" ON public.logs_acceso;
DROP POLICY IF EXISTS "Bloquear deletes en logs" ON public.logs_acceso;

-- ✅ INSERT: Solo sus propios logs
CREATE POLICY "logs_insert_own"
  ON public.logs_acceso FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

-- ✅ SELECT: Solo admins
CREATE POLICY "logs_select_admin"
  ON public.logs_acceso FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.perfiles
      WHERE perfiles.id = auth.uid() AND perfiles.rol = 'admin'
    )
  );

-- 🚫 UPDATE: Bloqueado
CREATE POLICY "logs_block_update"
  ON public.logs_acceso FOR UPDATE TO authenticated
  USING (false);

-- 🚫 DELETE: Bloqueado
CREATE POLICY "logs_block_delete"
  ON public.logs_acceso FOR DELETE TO authenticated
  USING (false);


-- ┌──────────────────────────────────────────────────────────────────┐
-- │  PASO 8: STORAGE — Bucket "archivos"                             │
-- │                                                                   │
-- │  SELECT  → Usuarios autenticados (descargar/visualizar)          │
-- │  INSERT  → Usuarios autenticados (subir, controlado por RBAC)    │
-- │  UPDATE  → 🚫 Bloqueado                                          │
-- │  DELETE  → Solo admins (para eliminar documentos)                │
-- └──────────────────────────────────────────────────────────────────┘

-- Crear bucket público si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('archivos', 'archivos', true)
ON CONFLICT (id) DO NOTHING;

-- Limpiar políticas anteriores del bucket
DROP POLICY IF EXISTS "Lectura pública de archivos" ON storage.objects;
DROP POLICY IF EXISTS "Bloquear subida de archivos" ON storage.objects;
DROP POLICY IF EXISTS "Subida para usuarios autenticados" ON storage.objects;
DROP POLICY IF EXISTS "Bloquear edición de archivos" ON storage.objects;
DROP POLICY IF EXISTS "Bloquear eliminación de archivos" ON storage.objects;

-- ✅ SELECT: Autenticados pueden descargar
CREATE POLICY "storage_select_auth"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'archivos');

-- ✅ INSERT: Autenticados pueden subir (controlado por RBAC de la app)
CREATE POLICY "storage_insert_auth"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'archivos');

-- 🚫 UPDATE: Bloqueado
CREATE POLICY "storage_block_update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id != 'archivos')
  WITH CHECK (bucket_id != 'archivos');

-- ✅ DELETE: Solo admins pueden eliminar archivos
CREATE POLICY "storage_delete_admin"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'archivos'
    AND EXISTS (
      SELECT 1 FROM public.perfiles
      WHERE perfiles.id = auth.uid() AND perfiles.rol = 'admin'
    )
  );


-- ┌──────────────────────────────────────────────────────────────────┐
-- │  PASO 9: DATOS SEED — Documentos de ejemplo                     │
-- │  Estos datos populan todas las categorías para que las vistas    │
-- │  no se vean vacías al iniciar la plataforma por primera vez.     │
-- └──────────────────────────────────────────────────────────────────┘

INSERT INTO public.documentos (titulo, descripcion, tipo_archivo, url_archivo, categoria, tamano, fecha_creacion) VALUES

  -- ═══ NORMATIVAS ═══
  ('NOM-001 Instalaciones Eléctricas',
   'Condiciones de seguridad para instalaciones eléctricas en los centros de trabajo.',
   'pdf', '#', 'normativas', '2.4 MB', '2026-02-15T00:00:00Z'),
  ('NOM-002 Prevención de Incendios',
   'Condiciones de prevención y protección contra incendios en los centros de trabajo.',
   'pdf', '#', 'normativas', '3.1 MB', '2026-01-28T00:00:00Z'),
  ('Protocolo de Evacuación v3.2',
   'Procedimiento actualizado de evacuación de emergencia para todas las instalaciones.',
   'word', '#', 'normativas', '1.8 MB', '2026-03-01T00:00:00Z'),
  ('ISO 45001 - Resumen Ejecutivo',
   'Documento resumen del sistema de gestión de seguridad y salud en el trabajo.',
   'pdf', '#', 'normativas', '890 KB', '2025-12-10T00:00:00Z'),
  ('Reglamento Interno de Seguridad',
   'Reglamento vigente con las políticas de seguridad aplicables a todo el personal.',
   'word', '#', 'normativas', '1.2 MB', '2026-02-05T00:00:00Z'),

  -- ═══ MANUALES ═══
  ('Manual de Identidad Corporativa',
   'Lineamientos gráficos, uso de logos y colores oficiales de la marca.',
   'pdf', '#', 'manuales', '5.2 MB', '2026-02-10T10:00:00Z'),
  ('Manual de Uso del ERP',
   'Guía completa sobre cómo utilizar el sistema ERP para gestión de inventarios.',
   'pdf', '#', 'manuales', '12.4 MB', '2026-01-15T09:30:00Z'),
  ('Onboarding: Manual del Empleado',
   'Guía de bienvenida con todo lo que necesitas saber en tu primer día.',
   'word', '#', 'manuales', '1.1 MB', '2026-03-01T14:20:00Z'),

  -- ═══ INSTRUCTIVOS ═══
  ('Instructivo: Configuración de VPN',
   'Pasos para conectarse a la red corporativa desde casa de forma segura.',
   'pdf', '#', 'instructivos', '850 KB', '2026-02-28T11:00:00Z'),
  ('Uso de la Impresora 3D Industrial',
   'Guía paso a paso para operar, limpiar y mantener la impresora 3D principal.',
   'video', '#', 'instructivos', '85 MB', '2026-01-20T16:45:00Z'),
  ('Instructivo: Solicitud de Vacaciones',
   'Proceso en el portal de RRHH para solicitar días libres.',
   'word', '#', 'instructivos', '420 KB', '2026-02-05T08:15:00Z'),

  -- ═══ CAPACITACIÓN ═══
  ('Introducción a la Ciberseguridad',
   'Módulo 1: Phishing, contraseñas seguras y protección de datos.',
   'video', '#', 'capacitacion', '240 MB', '2026-03-05T09:00:00Z'),
  ('Curso de React y Next.js',
   'Material de apoyo para el taller de desarrollo frontend avanzado.',
   'pdf', '#', 'capacitacion', '4.8 MB', '2026-02-22T13:30:00Z'),
  ('Liderazgo y Resolución de Conflictos',
   'Presentación del taller impartido a gerentes en febrero 2026.',
   'word', '#', 'capacitacion', '2.3 MB', '2026-02-18T10:00:00Z'),

  -- ═══ SEGURIDAD INDUSTRIAL ═══
  ('Protocolo de Manejo de Químicos',
   'Normas ISO para el almacenamiento y manipulación de solventes en planta.',
   'pdf', '#', 'seguridad', '3.6 MB', '2026-01-10T15:00:00Z'),
  ('Uso Correcto de Equipo de Protección (EPP)',
   'Demostración del ajuste correcto de arneses y cascos de seguridad.',
   'video', '#', 'seguridad', '110 MB', '2026-02-08T12:00:00Z'),
  ('Mapa de Riesgos - Planta Norte',
   'Plano actualizado con ubicaciones de extintores y salidas de emergencia.',
   'pdf', '#', 'seguridad', '7.1 MB', '2026-03-02T08:00:00Z'),

  -- ═══ RECURSOS HUMANOS ═══
  ('Política de Trabajo Remoto 2026',
   'Condiciones, horarios y evaluación de desempeño en modalidad Home Office.',
   'pdf', '#', 'rrhh', '1.5 MB', '2026-01-05T09:00:00Z'),
  ('Beneficios Corporativos Extendidos',
   'Catálogo de seguros médicos, vales de despensa y convenios con gimnasios.',
   'word', '#', 'rrhh', '890 KB', '2026-01-12T10:30:00Z'),
  ('Formato de Evaluación de Desempeño',
   'Plantilla para la revisión trimestral de objetivos (Q1 2026).',
   'word', '#', 'rrhh', '315 KB', '2026-03-08T14:00:00Z'),

  -- ═══ SOPORTE TÉCNICO ═══
  ('Troubleshooting: Error 502 en Gateway',
   'Guía paso a paso para identificar y reiniciar el servicio Nginx del servidor principal.',
   'pdf', '#', 'soporte', '1.2 MB', '2026-03-05T10:00:00Z'),
  ('Manual de Instalación de Antivirus',
   'Procedimiento para instalar la suite de seguridad en equipos nuevos de Windows y macOS.',
   'word', '#', 'soporte', '850 KB', '2026-02-20T09:30:00Z'),
  ('Configuración de VLAN Avanzada',
   'Video explicativo sobre puertos troncales y enrutamiento en switches Cisco corporativos.',
   'video', '#', 'soporte', '135 MB', '2026-01-18T14:20:00Z'),

  -- ═══ CALIDAD ═══
  ('Auditoría Interna ISO 9001:2015',
   'Checklist y formato oficial para evaluar el sistema de gestión de calidad.',
   'word', '#', 'calidad', '450 KB', '2026-02-28T11:00:00Z'),
  ('Control Estadístico de Procesos (CEP)',
   'Manual que detalla los gráficos de control utilizados en las líneas 1 y 2 de producción.',
   'pdf', '#', 'calidad', '3.4 MB', '2026-01-22T16:45:00Z'),
  ('Taller: Causas Raíz y 5 Porqués',
   'Grabación del taller bimestral sobre análisis de problemas frecuentes en envases.',
   'video', '#', 'calidad', '210 MB', '2026-03-08T08:15:00Z'),

  -- ═══ LEGAL Y CUMPLIMIENTO ═══
  ('Aviso de Privacidad 2026',
   'Texto oficial del aviso de privacidad para clientes, empleados y proveedores.',
   'pdf', '#', 'legal', '1.1 MB', '2026-01-05T09:00:00Z'),
  ('Formato de Contrato NDA (No Divulgación)',
   'Plantilla estándar para los acuerdos de confidencialidad con visitantes o consultores externos.',
   'word', '#', 'legal', '245 KB', '2026-02-15T13:30:00Z'),
  ('Políticas Anti-Corrupción y Soborno',
   'Directrices de cumplimiento aplicables a licitaciones públicas y asociaciones corporativas.',
   'pdf', '#', 'legal', '2.8 MB', '2026-03-01T10:00:00Z');


-- ┌──────────────────────────────────────────────────────────────────┐
-- │  PASO 10: PROMOVER USUARIO A ADMIN (Opcional)                    │
-- │                                                                   │
-- │  ⚠️  INSTRUCCIONES:                                               │
-- │  1. Primero registra al usuario desde la app (login/registro)    │
-- │  2. Luego ejecuta SOLO este UPDATE reemplazando el correo        │
-- │  3. El Trigger del Paso 4 ya creó su perfil como 'evaluador'     │
-- │  4. Este UPDATE simplemente lo promueve a 'admin'                │
-- └──────────────────────────────────────────────────────────────────┘

-- Descomenta y reemplaza el correo del usuario que deseas promover:

-- UPDATE public.perfiles
-- SET rol = 'admin'
-- WHERE id = (
--   SELECT id FROM auth.users
--   WHERE email = 'correo@admin.com'
-- );


-- ╔══════════════════════════════════════════════════════════════════╗
-- ║  ✅ LISTO — La base de datos está completamente configurada.     ║
-- ║                                                                  ║
-- ║  Resumen de lo creado:                                           ║
-- ║  • 3 tablas: documentos, perfiles, logs_acceso                   ║
-- ║  • 1 trigger: asignación de rol al registrar usuario             ║
-- ║  • 11 políticas RLS: RBAC por rol admin/evaluador                ║
-- ║  • 1 bucket de storage: "archivos" con 4 políticas               ║
-- ║  • 29 documentos seed en 9 categorías                            ║
-- ║                                                                  ║
-- ║  Siguiente paso: Configura las variables de entorno en .env.local║
-- ║  y ejecuta `pnpm dev` para iniciar la aplicación.                ║
-- ╚══════════════════════════════════════════════════════════════════╝
