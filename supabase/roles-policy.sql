-- ============================================
-- INGENIA BASE — Sistema de Roles (Admin/Evaluador)
-- Pega este SQL en: Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================

-- 1. Crear la tabla de perfiles
CREATE TABLE public.perfiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  rol TEXT NOT NULL DEFAULT 'evaluador' CHECK (rol IN ('admin', 'evaluador')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS en perfiles
ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden leer su propio perfil
CREATE POLICY "Usuarios pueden leer su propio perfil" 
  ON public.perfiles 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

-- 2. Función para crear el perfil automáticamente tras el registro
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.perfiles (id, rol)
  VALUES (new.id, 'evaluador');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Trigger que ejecuta la función al insertar en auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Actualizar políticas RLS de la tabla 'documentos'

-- Eliminar políticas anteriores para evitar conflictos
-- (Ajusta los nombres si tus políticas anteriores se llamaban distinto)
DROP POLICY IF EXISTS "Lectura pública de documentos" ON public.documentos;
DROP POLICY IF EXISTS "INSERT para usuarios autenticados" ON public.documentos;
DROP POLICY IF EXISTS "Bloquear INSERT público" ON public.documentos;

-- Política A: Todos los usuarios autenticados pueden LEER (SELECT)
CREATE POLICY "Permitir SELECT a todos los autenticados"
  ON public.documentos
  FOR SELECT
  TO authenticated
  USING (true);

-- Política B: Solo los 'admin' pueden CREAR (INSERT)
CREATE POLICY "Permitir INSERT solo a admins"
  ON public.documentos
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.perfiles
      WHERE perfiles.id = auth.uid() AND perfiles.rol = 'admin'
    )
  );

-- Política C: Solo los 'admin' pueden ACTUALIZAR (UPDATE)
CREATE POLICY "Permitir UPDATE solo a admins"
  ON public.documentos
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.perfiles
      WHERE perfiles.id = auth.uid() AND perfiles.rol = 'admin'
    )
  );

-- Política D: Solo los 'admin' pueden ELIMINAR (DELETE)
CREATE POLICY "Permitir DELETE solo a admins"
  ON public.documentos
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.perfiles
      WHERE perfiles.id = auth.uid() AND perfiles.rol = 'admin'
    )
  );
