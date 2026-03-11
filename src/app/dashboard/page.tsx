"use client";

import { useState, useEffect } from "react";
import { Search, FileSearch, Eye, Trash2, FileText, FileVideo, FileType, Filter, type LucideIcon } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import type { Documento } from "@/lib/types";
import { toast } from "sonner";
import SkeletonCard from "@/components/SkeletonCard";
import { logAuditAction } from "@/lib/audit";
import DocumentViewerModal from "@/components/DocumentViewerModal";
import { getDocumentosCached, revalidateDocumentos } from "@/lib/actions";

const categoriasOpts = [
  { value: "todas", label: "Todas las Categorías" },
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

const fileTypeConfig: Record<string, { icon: LucideIcon; label: string; color: string }> = {
  pdf: { icon: FileText, label: "PDF", color: "text-red-400" },
  word: { icon: FileType, label: "DOCX", color: "text-blue-400" },
  video: { icon: FileVideo, label: "VIDEO", color: "text-yellow-400" },
};

export default function DashboardPage() {
  const [documents, setDocuments] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [isAdmin, setIsAdmin] = useState(false);
  const [viewerDoc, setViewerDoc] = useState<Documento | null>(null);

  useEffect(() => {
    async function fetchDocsAndRole() {
      setLoading(true);
      try {
        // 1. Obtener documentos desde la caché del servidor
        const allDocs = await getDocumentosCached();
        setDocuments(allDocs);

        // 2. Verificar rol para botón "Eliminar"
        const supabase = createBrowserSupabaseClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: perfilData } = await supabase
            .from("perfiles")
            .select("rol")
            .eq("id", user.id)
            .single();

          if (perfilData?.rol === "admin") {
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDocsAndRole();
  }, []);

  // Filtrado client-side (búsqueda + categoría)
  const filtered = documents.filter((doc) => {
    const matchesCategoria = categoria === "todas" || doc.categoria === categoria;
    const matchesSearch = !search.trim() || doc.titulo.toLowerCase().includes(search.toLowerCase());
    return matchesCategoria && matchesSearch;
  });

  const handleDelete = async (id: string, urlArchivo: string, titulo: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${titulo}" de la bóveda? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      const supabase = createBrowserSupabaseClient();
      
      // 1. Extraer la ruta del archivo del bucket (solo si no es en enlace dummy '#')
      if (urlArchivo && urlArchivo !== "#") {
        const urlObj = new URL(urlArchivo);
        const pathParts = urlObj.pathname.split("/public/archivos/");
        if (pathParts.length > 1) {
          const filePath = decodeURIComponent(pathParts[1]);
          await supabase.storage.from("archivos").remove([filePath]);
        }
      }

      // 2. Eliminar registro de la tabla documentos
      const { error } = await supabase.from("documentos").delete().eq("id", id);
      
      if (error) throw error;

      // 3. Actualizar UI e invalidar caché
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      await revalidateDocumentos();
      toast.success("Documento purgado del sistema 🗑️");
      
    } catch (error) {
      console.error("Error al eliminar documento:", error);
      toast.error("Ocurrió un error al intentar eliminar el documento ❌");
    }
  };

  return (
    <div className="px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="text-xs font-semibold tracking-widest text-accent uppercase">
            Sistema Activo
          </span>
        </div>
        <h1
          className="text-3xl font-bold tracking-tight text-text-primary lg:text-4xl"
          style={{ animation: "fade-in-up 0.5s ease-out both" }}
        >
          Bienvenido a{" "}
          <span className="text-accent">
            INGENIA BASE
          </span>
        </h1>
        <p
          className="mt-3 max-w-2xl text-base leading-relaxed text-text-secondary"
          style={{ animation: "fade-in-up 0.5s ease-out 100ms both" }}
        >
          Tu central de documentación corporativa. Filtra y explora los registros disponibles.
        </p>
      </header>

      {/* Toolbar (Search & Filter) */}
      <div
        className="mb-8 flex flex-col gap-3 rounded-xl border border-surface-600/30 bg-surface-900 p-4 sm:flex-row sm:items-center sm:justify-between"
        style={{ animation: "fade-in-up 0.5s ease-out 200ms both" }}
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título..."
            className="w-full rounded-lg border border-surface-600/40 bg-surface-800 py-3 pl-10 pr-4
                       text-sm text-text-primary placeholder:text-text-muted/60
                       outline-none transition-all
                       focus:border-indigo/40 focus:ring-2 focus:ring-indigo/10"
          />
        </div>
        
        <div className="relative w-full sm:w-64">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted pointer-events-none" />
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full rounded-lg border border-surface-600/40 bg-surface-800 py-3 pl-10 pr-4
                       text-sm text-text-primary
                       outline-none transition-all appearance-none cursor-pointer
                       focus:border-indigo/40 focus:ring-2 focus:ring-indigo/10"
          >
            {categoriasOpts.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-surface-950 text-text-primary">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Document Grid & Empty State */}
      <div style={{ animation: "fade-in-up 0.5s ease-out 300ms both" }}>
        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} delay={i * 100} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-600/30 bg-surface-800/30 py-24 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-900 border border-surface-600/20">
              <FileSearch className="h-8 w-8 text-text-muted" />
            </div>
            <h3 className="text-lg font-bold text-text-primary">Sin resultados</h3>
            <p className="mt-2 text-sm text-text-muted max-w-sm">
              No se encontraron registros que coincidan con los filtros actuales.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((doc, i) => {
              const config = fileTypeConfig[doc.tipo_archivo] || fileTypeConfig.pdf;
              const Icon = config.icon;
              
              const catLabel = categoriasOpts.find(c => c.value === doc.categoria)?.label || doc.categoria;

              return (
                <div
                  key={doc.id}
                  className="group relative flex flex-col rounded-xl border border-surface-600/30 bg-surface-900 p-6
                             transition-all duration-300
                             hover:border-indigo/30 hover:shadow-lg hover:shadow-indigo/5"
                  style={{ animation: `fade-in-up 0.4s ease-out ${300 + i * 50}ms both` }}
                >
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-surface-600/30 bg-surface-800">
                      <Icon className={`h-5 w-5 ${config.color}`} />
                    </div>
                    <span className="rounded-md bg-surface-800 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-text-muted uppercase">
                      {catLabel}
                    </span>
                  </div>
                  
                  <h3 className="mb-2 text-base font-semibold text-text-primary transition-colors group-hover:text-indigo line-clamp-2">
                    {doc.titulo}
                  </h3>
                  
                  <p className="mb-6 flex-1 text-xs leading-relaxed text-text-muted line-clamp-3">
                    {doc.descripcion}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between border-t border-surface-600/20 pt-4">
                    <span className="text-[10px] font-medium text-text-muted">
                      {doc.fecha_creacion.split("T")[0]}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (doc.url_archivo && doc.url_archivo !== "#") {
                            logAuditAction("Visualizó documento en modal", doc.id, { titulo: doc.titulo, ubicacion: "dashboard" });
                            setViewerDoc(doc);
                          }
                        }}
                        className={`flex items-center gap-1.5 rounded-lg border border-indigo/30 bg-indigo/5 px-3 py-1.5
                                   text-[11px] font-semibold tracking-wide text-indigo
                                   transition-all duration-200
                                   hover:bg-indigo hover:text-white hover:shadow-md hover:shadow-indigo/20
                                   ${doc.url_archivo === "#" ? "opacity-50 pointer-events-none" : ""}`}
                      >
                        <Eye className="h-3 w-3" />
                        Ver
                      </button>
                      
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(doc.id, doc.url_archivo, doc.titulo)}
                          className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-1.5
                                     text-[11px] font-semibold tracking-wide text-red-400
                                     transition-all duration-200
                                     hover:bg-red-500 hover:text-white hover:shadow-md hover:shadow-red-500/20"
                        >
                          <Trash2 className="h-3 w-3" />
                          Eliminar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer
        className="mt-12 flex items-center gap-3 border-t border-surface-600/20 pt-6"
        style={{ animation: "fade-in-up 0.5s ease-out 800ms both" }}
      >
        <div
          className="h-2 w-2 rounded-full bg-accent"
          style={{ animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}
        />
        <span className="text-xs font-medium text-text-muted/60">
          Mostrando documentos disponibles en la plataforma
        </span>
      </footer>

      <DocumentViewerModal
        isOpen={!!viewerDoc}
        onClose={() => setViewerDoc(null)}
        url={viewerDoc ? `/api/archivos/${viewerDoc.id}` : ""}
        title={viewerDoc?.titulo || ""}
        type={viewerDoc?.tipo_archivo || ""}
      />
    </div>
  );
}
