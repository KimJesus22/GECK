-- ==============================================================================
-- MIGRACIÓN: SEGURIDAD EN STORAGE CON RLS
-- ==============================================================================
-- Este script hace que el bucket 'archivos' sea privado y establece políticas
-- estrictas para quién puede descargar (visualizar) y quién puede subir/borrar.

-- 1. Asegurarnos de que el bucket existe y marcarlo como PRIVADO
INSERT INTO storage.buckets (id, name, public) 
VALUES ('archivos', 'archivos', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- En Supabase la tabla storage.objects ya tiene RLS activado de fábrica, omitimos ALTER TABLE

-- 2. Eliminar cualquier política previa que pueda existir en este bucket
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Autenticados pueden descargar" ON storage.objects;
DROP POLICY IF EXISTS "Solo administradores pueden insertar" ON storage.objects;
DROP POLICY IF EXISTS "Solo administradores pueden borrar" ON storage.objects;

-- 3. POLÍTICA DE LECTURA (SELECT): Solo usuarios autenticados
-- Cualquier usuario que haya iniciado sesión (AAL1 o AAL2) puede solicitar
-- descargar/visualizar archivos de este bucket.
CREATE POLICY "Autenticados pueden descargar" ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'archivos');

-- 4. POLÍTICA DE INSERCIÓN (INSERT): Solo administradores
-- Verifica que el ID del usuario en sesión tenga rol 'admin' en public.perfiles
CREATE POLICY "Solo administradores pueden insertar" ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'archivos' AND 
  EXISTS (
    SELECT 1 FROM public.perfiles 
    WHERE id = auth.uid() AND rol = 'admin'
  )
);

-- 5. POLÍTICA DE BORRADO (DELETE): Solo administradores
CREATE POLICY "Solo administradores pueden borrar" ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'archivos' AND 
  EXISTS (
    SELECT 1 FROM public.perfiles 
    WHERE id = auth.uid() AND rol = 'admin'
  )
);

-- 6. POLÍTICA DE ACTUALIZACIÓN (UPDATE): Solo administradores (por si acaso)
CREATE POLICY "Solo administradores pueden actualizar" ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'archivos' AND 
  EXISTS (
    SELECT 1 FROM public.perfiles 
    WHERE id = auth.uid() AND rol = 'admin'
  )
);

-- ==============================================================================
-- INSTRUCCIONES:
-- Ejecuta este script en Supabase -> SQL Editor.
-- Esto bloqueará todas las URLs públicas viejas automáticamente.
-- ==============================================================================
