-- ==============================================================================
-- MIGRACIÓN: AÑADIR CORREO Y ESTADO A PERFILES
-- ==============================================================================
-- Este script actualiza la tabla 'perfiles' para almacenar el correo electrónico
-- de los usuarios y su estado de actividad, permitiendo así crear un panel 
-- administrativo sin acceder directamente a auth.users.

-- 1. Añadir nuevas columnas a public.perfiles
ALTER TABLE public.perfiles 
ADD COLUMN IF NOT EXISTS correo TEXT,
ADD COLUMN IF NOT EXISTS estado TEXT DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo'));

-- 2. Modificar el trigger para que guarde el correo en nuevos registros
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.perfiles (id, rol, correo, estado)
  VALUES (new.id, 'evaluador', new.email, 'activo');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. (Opcional pero recomendado) Actualizar perfiles existentes para heredar el correo de auth.users
-- NOTA: Esto solo funciona si se ejecuta con permisos de PostgreSQL (Superusuario/Dashboard)
UPDATE public.perfiles
SET correo = users.email
FROM auth.users
WHERE public.perfiles.id = users.id
AND public.perfiles.correo IS NULL;

-- ==============================================================================
-- INSTRUCCIONES:
-- Copia y pega esto en el SQL Editor de tu Dashboard de Supabase y dale a "Run".
-- ==============================================================================
