-- ============================================
-- INGENIA BASE — Módulo de Auditoría y Logs
-- Ejecutar en: Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================

-- 1. Crear tabla logs_acceso
CREATE TABLE public.logs_acceso (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  correo_usuario text NOT NULL,
  accion text NOT NULL,
  documento_id uuid REFERENCES public.documentos(id) ON DELETE SET NULL,
  detalles jsonb DEFAULT '{}'::jsonb,
  fecha_hora timestamptz DEFAULT now() NOT NULL
);

-- 2. Habilitar RLS en logs_acceso
ALTER TABLE public.logs_acceso ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de RLS
-- Permitir a los usuarios insertar sus propios logs (necesario para rastrear clics desde la UI)
CREATE POLICY "Permitir inserción de logs propios" 
ON public.logs_acceso
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = usuario_id);

-- Solo los administradores pueden leer los logs de todos
CREATE POLICY "Admins pueden leer todos los logs"
ON public.logs_acceso
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.perfiles
    WHERE perfiles.id = auth.uid()
    AND perfiles.rol = 'admin'
  )
);

-- Bloquear update y delete para todos (registro inmutable)
CREATE POLICY "Bloquear updates en logs" ON public.logs_acceso FOR UPDATE TO authenticated USING (false);
CREATE POLICY "Bloquear deletes en logs" ON public.logs_acceso FOR DELETE TO authenticated USING (false);

-- 4. Opcional: Trigger si necesitas crear un log automáticamente al descargar/ver desde Supabase RPC, 
-- pero como lo haremos en Next.js Client, con las políticas INSERT es suficiente.
