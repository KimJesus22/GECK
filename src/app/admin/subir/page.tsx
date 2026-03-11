"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  Terminal,
  Loader2,
} from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { revalidateDocumentos } from "@/lib/actions";

const categorias = [
  { value: "normativas", label: "Normativas" },
  { value: "manuales", label: "Manuales" },
  { value: "instructivos", label: "Instructivos" },
  { value: "capacitacion", label: "Capacitación" },
  { value: "seguridad", label: "Seguridad Industrial" },
  { value: "rrhh", label: "Recursos Humanos" },
  { value: "soporte", label: "Soporte Técnico" },
  { value: "calidad", label: "Calidad" },
  { value: "legal", label: "Legal y Cumplimiento" },
];

function getFileType(filename: string): "pdf" | "word" | "video" {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (ext === "mp4" || ext === "webm" || ext === "mov" || ext === "avi")
    return "video";
  if (ext === "doc" || ext === "docx") return "word";
  return "pdf";
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminSubirPage() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("normativas");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!archivo) {
      toast.error("Selecciona un archivo para subir ❌");
      return;
    }

    setLoading(true);

    try {
      const supabase = createBrowserSupabaseClient();

      // 1. Subir archivo al bucket "archivos"
      const timestamp = Date.now();
      const safeName = archivo.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const filePath = `${categoria}/${timestamp}_${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from("archivos")
        .upload(filePath, archivo, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Error al subir archivo: ${uploadError.message}`);
      }

      // 2. Obtener URL pública
      const {
        data: { publicUrl },
      } = supabase.storage.from("archivos").getPublicUrl(filePath);

      // 3. INSERT en la tabla documentos
      const { error: insertError } = await supabase.from("documentos").insert({
        titulo,
        descripcion,
        tipo_archivo: getFileType(archivo.name),
        url_archivo: publicUrl,
        categoria,
        tamano: formatFileSize(archivo.size),
      });

      if (insertError) {
        throw new Error(`Error al registrar documento: ${insertError.message}`);
      }

      // Éxito: invalidar caché y notificar
      await revalidateDocumentos();
      toast.success("Documento encriptado y subido a la base ✅");

      // Reset form
      setTitulo("");
      setDescripcion("");
      setCategoria("normativas");
      setArchivo(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Acceso denegado o error de red ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-5 py-8 sm:px-8 sm:py-10 md:px-12 md:py-12">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
          <span className="text-xs font-semibold tracking-widest text-red-400/80 uppercase">
            Panel de Administración
          </span>
        </div>
        <div
          className="flex items-center gap-4"
          style={{ animation: "fade-in-up 0.5s ease-out both" }}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-accent/20 bg-accent/10">
            <Upload className="h-7 w-7 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary lg:text-3xl">
              Subir Documento
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Sube archivos al Storage y regístralos automáticamente en la base
              de datos.
            </p>
          </div>
        </div>
      </header>

      {/* Form card */}
      <div
        className="max-w-2xl rounded-2xl border border-surface-600/30 bg-surface-900"
        style={{ animation: "fade-in-up 0.5s ease-out 100ms both" }}
      >
        {/* Header bar */}
        <div className="flex items-center gap-2 border-b border-surface-600/30 px-5 py-3 rounded-t-2xl">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
          <span className="ml-2 text-[10px] font-medium tracking-[0.3em] text-text-muted uppercase">
            admin://subir-documento
          </span>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-5 sm:p-8">
          {/* Título */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-text-muted uppercase">
              Título del Documento
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej: NOM-003 Manual de Operaciones"
                className="w-full rounded-lg border border-surface-600/40 bg-surface-800 py-3 pl-10 pr-4
                           text-sm text-text-primary placeholder:text-text-muted/60
                           outline-none transition-all
                           focus:border-indigo/40 focus:ring-2 focus:ring-indigo/10"
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-text-muted uppercase">
              Descripción Breve
            </label>
            <textarea
              required
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe brevemente el contenido del documento..."
              rows={3}
              className="w-full rounded-lg border border-surface-600/40 bg-surface-800 py-3 px-4
                         text-sm text-text-primary placeholder:text-text-muted/60
                         outline-none transition-all resize-none
                         focus:border-indigo/40 focus:ring-2 focus:ring-indigo/10"
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-text-muted uppercase">
              Categoría
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full rounded-lg border border-surface-600/40 bg-surface-800 py-3 px-4
                         text-sm text-text-primary
                         outline-none transition-all appearance-none
                         focus:border-indigo/40 focus:ring-2 focus:ring-indigo/10"
            >
              {categorias.map((cat) => (
                <option
                  key={cat.value}
                  value={cat.value}
                  className="bg-surface-950 text-text-primary"
                >
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Archivo */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-text-muted uppercase">
              Archivo (PDF, DOCX, MP4)
            </label>
            <div
              className={`relative flex items-center gap-3 rounded-lg border bg-surface-800 px-4 py-4 transition-all cursor-pointer
                          ${
                            archivo
                              ? "border-accent/30"
                              : "border-dashed border-surface-600/30 hover:border-surface-500"
                          }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload
                className={`h-5 w-5 shrink-0 ${
                  archivo ? "text-accent" : "text-text-muted"
                }`}
              />
              <div className="flex-1 min-w-0">
                {archivo ? (
                  <div>
                    <p className="text-sm text-text-primary truncate">
                      {archivo.name}
                    </p>
                    <p className="text-[10px] text-text-muted">
                      {formatFileSize(archivo.size)} —{" "}
                      {getFileType(archivo.name).toUpperCase()}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-text-muted">
                    Click para seleccionar archivo...
                  </p>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.mp4,.webm,.mov"
                onChange={(e) => setArchivo(e.target.files?.[0] || null)}
                className="hidden"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex items-center justify-center gap-3 rounded-lg border border-indigo/30
                       bg-indigo/10 py-4 text-sm font-semibold tracking-wider
                       text-indigo transition-all duration-200
                       hover:bg-indigo hover:text-white
                       hover:shadow-lg hover:shadow-indigo/20
                       disabled:opacity-50 disabled:cursor-not-allowed
                       disabled:hover:bg-indigo/10 disabled:hover:text-indigo"
          >
            {loading ? (
              <>
                <Loader2
                  className="h-4 w-4"
                  style={{ animation: "spin 0.8s linear infinite" }}
                />
                Subiendo...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Subir Archivo
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer */}
      <footer
        className="mt-8 flex items-center gap-3 border-t border-surface-600/20 pt-6"
        style={{ animation: "fade-in-up 0.5s ease-out 800ms both" }}
      >
        <div className="h-1.5 w-1.5 rounded-full bg-red-400/50" />
        <span className="text-xs font-medium text-text-muted">
          Acceso restringido — Solo administradores autorizados
        </span>
      </footer>
    </div>
  );
}
