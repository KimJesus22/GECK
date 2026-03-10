-- ============================================
-- G.E.C.K. — Tabla de Documentos
-- Pega este SQL en: Supabase Dashboard → SQL Editor → New Query
-- ============================================

-- 1. Crear la tabla
CREATE TABLE documentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  tipo_archivo TEXT NOT NULL CHECK (tipo_archivo IN ('pdf', 'word', 'video')),
  url_archivo TEXT,
  categoria TEXT NOT NULL,
  tamano TEXT,
  fecha_creacion TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Habilitar Row Level Security
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;

-- 3. Política de lectura pública (cualquiera puede leer)
CREATE POLICY "Lectura pública de documentos"
  ON documentos
  FOR SELECT
  USING (true);

-- 4. Datos seed (los mismos que teníamos como datos estáticos)
INSERT INTO documentos (titulo, descripcion, tipo_archivo, url_archivo, categoria, tamano, fecha_creacion) VALUES
  ('NOM-001 Instalaciones Eléctricas',
   'Condiciones de seguridad para instalaciones eléctricas en los centros de trabajo.',
   'pdf', '#', 'normativas', '2.4 MB', '2026-02-15T00:00:00Z'),

  ('NOM-002 Prevención de Incendios',
   'Condiciones de prevención y protección contra incendios en los centros de trabajo.',
   'pdf', '#', 'normativas', '3.1 MB', '2026-01-28T00:00:00Z'),

  ('Protocolo de Evacuación v3.2',
   'Procedimiento actualizado de evacuación de emergencia para todas las instalaciones.',
   'word', '#', 'normativas', '1.8 MB', '2026-03-01T00:00:00Z'),

  ('Capacitación: Manejo de Extintores',
   'Video tutorial sobre el uso correcto de extintores tipo ABC en áreas de producción.',
   'video', '#', 'normativas', '145 MB', '2026-02-20T00:00:00Z'),

  ('ISO 45001 - Resumen Ejecutivo',
   'Documento resumen del sistema de gestión de seguridad y salud en el trabajo.',
   'pdf', '#', 'normativas', '890 KB', '2025-12-10T00:00:00Z'),

  ('Reglamento Interno de Seguridad',
   'Reglamento vigente con las políticas de seguridad aplicables a todo el personal.',
   'word', '#', 'normativas', '1.2 MB', '2026-02-05T00:00:00Z'),

  ('Inducción: Normas de Planta',
   'Video de inducción para nuevos empleados sobre las normas de seguridad en planta.',
   'video', '#', 'normativas', '210 MB', '2026-01-15T00:00:00Z'),

  ('Plan de Respuesta a Emergencias',
   'Plan integral de respuesta ante emergencias químicas, sísmicas y de incendio.',
   'pdf', '#', 'normativas', '4.5 MB', '2026-03-05T00:00:00Z');
