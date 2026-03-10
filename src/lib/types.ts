export interface Documento {
  id: string;
  titulo: string;
  descripcion: string;
  tipo_archivo: "pdf" | "word" | "video";
  url_archivo: string;
  categoria: string;
  tamano: string;
  fecha_creacion: string;
}

export interface Perfil {
  id: string; // referenciado a auth.users
  rol: "admin" | "evaluador";
  created_at: string;
}

export interface LogAcceso {
  id: string;
  usuario_id: string;
  correo_usuario: string;
  accion: string;
  documento_id: string | null;
  detalles: any;
  fecha_hora: string;
}
