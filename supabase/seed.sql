-- ============================================
-- INGENIA BASE — Datos Mock (Seed)
-- Pega este SQL en: Supabase Dashboard → SQL Editor → New Query → Run
-- Esto poblará tus vistas para que no se vean vacías.
-- ============================================

INSERT INTO documentos (titulo, descripcion, tipo_archivo, url_archivo, categoria, tamano, fecha_creacion)
VALUES
  -- MANUALES
  ('Manual de Identidad Corporativa', 'Lineamientos gráficos, uso de logos y colores oficiales de la marca.', 'pdf', '#', 'manuales', '5.2 MB', '2026-02-10T10:00:00Z'),
  ('Manual de Uso del ERP', 'Guía completa sobre cómo utilizar el sistema ERP para gestión de inventarios.', 'pdf', '#', 'manuales', '12.4 MB', '2026-01-15T09:30:00Z'),
  ('Onboarding: Manual del Empleado', 'Guía de bienvenida con todo lo que necesitas saber en tu primer día.', 'word', '#', 'manuales', '1.1 MB', '2026-03-01T14:20:00Z'),

  -- INSTRUCTIVOS
  ('Instructivo: Configuración de VPN', 'Pasos para conectarse a la red corporativa desde casa de forma segura.', 'pdf', '#', 'instructivos', '850 KB', '2026-02-28T11:00:00Z'),
  ('Uso de la Impresora 3D Industrial', 'Guía paso a paso para operar, limpiar y mantener la impresora 3D principal.', 'video', '#', 'instructivos', '85 MB', '2026-01-20T16:45:00Z'),
  ('Instructivo: Solicitud de Vacaciones', 'Proceso en el portal de RRHH para solicitar días libres.', 'word', '#', 'instructivos', '420 KB', '2026-02-05T08:15:00Z'),

  -- CAPACITACIÓN
  ('Introducción a la Ciberseguridad', 'Módulo 1: Phishing, contraseñas seguras y protección de datos.', 'video', '#', 'capacitacion', '240 MB', '2026-03-05T09:00:00Z'),
  ('Curso de React y Next.js', 'Material de apoyo para el taller de desarrollo frontend avanzado.', 'pdf', '#', 'capacitacion', '4.8 MB', '2026-02-22T13:30:00Z'),
  ('Liderazgo y Resolución de Conflictos', 'Presentación del taller impartido a gerentes en febrero 2026.', 'word', '#', 'capacitacion', '2.3 MB', '2026-02-18T10:00:00Z'),

  -- SEGURIDAD INDUSTRIAL
  ('Protocolo de Manejo de Químicos', 'Normas ISO para el almacenamiento y manipulación de solventes en planta.', 'pdf', '#', 'seguridad', '3.6 MB', '2026-01-10T15:00:00Z'),
  ('Uso Correcto de Equipo de Protección (EPP)', 'Demostración del ajuste correcto de arneses y cascos de seguridad.', 'video', '#', 'seguridad', '110 MB', '2026-02-08T12:00:00Z'),
  ('Mapa de Riesgos - Planta Norte', 'Plano actualizado con ubicaciones de extintores y salidas de emergencia.', 'pdf', '#', 'seguridad', '7.1 MB', '2026-03-02T08:00:00Z'),

  -- RECURSOS HUMANOS
  ('Política de Trabajo Remoto 2026', 'Condiciones, horarios y evaluación de desempeño en modalidad Home Office.', 'pdf', '#', 'rrhh', '1.5 MB', '2026-01-05T09:00:00Z'),
  ('Beneficios Corporativos Extendidos', 'Catálogo de seguros médicos, vales de despensa y convenios con gimnasios.', 'word', '#', 'rrhh', '890 KB', '2026-01-12T10:30:00Z'),
  ('Formato de Evaluación de Desempeño', 'Plantilla para la revisión trimestral de objetivos (Q1 2026).', 'word', '#', 'rrhh', '315 KB', '2026-03-08T14:00:00Z');
