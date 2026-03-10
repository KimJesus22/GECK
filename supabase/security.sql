-- ============================================
-- INGENIA BASE — Políticas de Seguridad (Solo Lectura)
-- Pega este SQL en: Supabase Dashboard → SQL Editor → New Query
-- Ejecútalo DESPUÉS de haber ejecutado schema.sql
-- ============================================

-- =====================
-- TABLA: documentos
-- =====================

-- Verificar que RLS está habilitado (idempotente)
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas anteriores si existen (para re-ejecutar limpiamente)
DROP POLICY IF EXISTS "Lectura pública de documentos" ON documentos;
DROP POLICY IF EXISTS "Bloquear INSERT público" ON documentos;
DROP POLICY IF EXISTS "Bloquear UPDATE público" ON documentos;
DROP POLICY IF EXISTS "Bloquear DELETE público" ON documentos;

-- ✅ PERMITIR: SELECT público (lectura para todos)
CREATE POLICY "Lectura pública de documentos"
  ON documentos
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 🚫 BLOQUEAR: INSERT (nadie puede insertar desde la app web)
CREATE POLICY "Bloquear INSERT público"
  ON documentos
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

-- 🚫 BLOQUEAR: UPDATE (nadie puede modificar desde la app web)
CREATE POLICY "Bloquear UPDATE público"
  ON documentos
  FOR UPDATE
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

-- 🚫 BLOQUEAR: DELETE (nadie puede eliminar desde la app web)
CREATE POLICY "Bloquear DELETE público"
  ON documentos
  FOR DELETE
  TO anon, authenticated
  USING (false);


-- =====================
-- STORAGE: bucket "archivos"
-- =====================
-- Ejecuta esto solo si ya creaste un bucket llamado "archivos"
-- en Supabase Dashboard → Storage.
-- Si no lo has creado, puedes omitir esta sección.

-- Crear bucket público de solo lectura (si no existe)
INSERT INTO storage.buckets (id, name, public)
VALUES ('archivos', 'archivos', true)
ON CONFLICT (id) DO NOTHING;

-- Eliminar políticas anteriores del bucket (para re-ejecutar limpiamente)
DROP POLICY IF EXISTS "Lectura pública de archivos" ON storage.objects;
DROP POLICY IF EXISTS "Bloquear subida de archivos" ON storage.objects;
DROP POLICY IF EXISTS "Bloquear edición de archivos" ON storage.objects;
DROP POLICY IF EXISTS "Bloquear eliminación de archivos" ON storage.objects;

-- ✅ PERMITIR: Descargar/leer archivos del bucket
CREATE POLICY "Lectura pública de archivos"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'archivos');

-- 🚫 BLOQUEAR: Subir archivos al bucket
CREATE POLICY "Bloquear subida de archivos"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id != 'archivos');

-- 🚫 BLOQUEAR: Editar archivos del bucket
CREATE POLICY "Bloquear edición de archivos"
  ON storage.objects
  FOR UPDATE
  TO anon, authenticated
  USING (bucket_id != 'archivos')
  WITH CHECK (bucket_id != 'archivos');

-- 🚫 BLOQUEAR: Eliminar archivos del bucket
CREATE POLICY "Bloquear eliminación de archivos"
  ON storage.objects
  FOR DELETE
  TO anon, authenticated
  USING (bucket_id != 'archivos');

-- ============================================
-- NOTA: Los administradores pueden seguir gestionando datos
-- directamente desde el Supabase Dashboard (usa el rol service_role).
-- Estas políticas solo afectan al acceso desde la app web (anon/authenticated).
-- ============================================
