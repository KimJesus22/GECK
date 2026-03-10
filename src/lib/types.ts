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
