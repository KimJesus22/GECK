-- ============================================
-- INGENIA BASE — Políticas de Administrador
-- Pega este SQL en: Supabase Dashboard → SQL Editor
-- EJECUTAR DESPUÉS de security.sql
-- ============================================

-- Permitir INSERT a usuarios autenticados (admins)
-- Nota: En producción, filtra por rol de usuario.
DROP POLICY IF EXISTS "Bloquear INSERT público" ON documentos;

CREATE POLICY "INSERT para usuarios autenticados"
  ON documentos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Permitir subida al bucket "archivos" para usuarios autenticados
DROP POLICY IF EXISTS "Bloquear subida de archivos" ON storage.objects;

CREATE POLICY "Subida para usuarios autenticados"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'archivos');
