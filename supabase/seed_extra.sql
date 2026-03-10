-- ============================================
-- INGENIA BASE — Datos Mock Extras (Soporte, Calidad, Legal)
-- Pega este SQL en: Supabase Dashboard → SQL Editor → New Query → Run
-- Esto poblará tus nuevas vistas para que no se vean vacías.
-- ============================================

INSERT INTO documentos (titulo, descripcion, tipo_archivo, url_archivo, categoria, tamano, fecha_creacion)
VALUES
  -- SOPORTE TÉCNICO
  ('Troubleshooting: Error 502 en Gateway', 'Guía paso a paso para identificar y reiniciar el servicio Nginx del servidor principal.', 'pdf', '#', 'soporte', '1.2 MB', '2026-03-05T10:00:00Z'),
  ('Manual de Instalación de Antivirus', 'Procedimiento para instalar la suite de seguridad en equipos nuevos de Windows y macOS.', 'word', '#', 'soporte', '850 KB', '2026-02-20T09:30:00Z'),
  ('Configuración de VLAN Avanzada', 'Video explicativo sobre puertos troncales y enrutamiento en switches Cisco corporativos.', 'video', '#', 'soporte', '135 MB', '2026-01-18T14:20:00Z'),

  -- CALIDAD
  ('Auditoría Interna ISO 9001:2015', 'Checklist y formato oficial para evaluar el sistema de gestión de calidad.', 'word', '#', 'calidad', '450 KB', '2026-02-28T11:00:00Z'),
  ('Control Estadístico de Procesos (CEP)', 'Manual que detalla los gráficos de control utilizados en las líneas 1 y 2 de producción.', 'pdf', '#', 'calidad', '3.4 MB', '2026-01-22T16:45:00Z'),
  ('Taller: Causas Raíz y 5 Porqués', 'Grabación del taller bimestral sobre análisis de problemas frecuentes en envases.', 'video', '#', 'calidad', '210 MB', '2026-03-08T08:15:00Z'),

  -- LEGAL Y CUMPLIMIENTO
  ('Aviso de Privacidad 2026', 'Texto oficial del aviso de privacidad para clientes, empleados y proveedores.', 'pdf', '#', 'legal', '1.1 MB', '2026-01-05T09:00:00Z'),
  ('Formato de Contrato NDA (No Divulgación)', 'Plantilla estándar para los acuerdos de confidencialidad con visitantes o consultores externos.', 'word', '#', 'legal', '245 KB', '2026-02-15T13:30:00Z'),
  ('Políticas Anti-Corrupción y Soborno', 'Directrices de cumplimiento aplicables a licitaciones públicas y asociaciones corporativas.', 'pdf', '#', 'legal', '2.8 MB', '2026-03-01T10:00:00Z');
