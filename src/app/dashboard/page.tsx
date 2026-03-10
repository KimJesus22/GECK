"use client";

import { useState, useEffect } from "react";
import { Search, FileSearch, Eye, Trash2, FileText, FileVideo, FileType, type LucideIcon } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import type { Documento } from "@/lib/types";
import { toast } from "sonner";
import SkeletonCard from "@/components/SkeletonCard";
import { logAuditAction } from "@/lib/audit";
import DocumentViewerModal from "@/components/DocumentViewerModal";

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
        const supabase = createBrowserSupabaseClient();
        
        // 1. Obtener documentos
        let query = supabase
          .from("documentos")
          .select("*")
          .order("fecha_creacion", { ascending: false });

        if (categoria !== "todas") {
          query = query.eq("categoria", categoria);
        }

        if (search.trim()) {
          query = query.ilike("titulo", `%${search}%`);
        }

        const { data: docsData, error: docsError } = await query;
        if (!docsError && docsData) {
          setDocuments(docsData);
        }

        // 2. Verificar rol para botón "Eliminar"
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

    const timeoutId = setTimeout(() => {
      fetchDocsAndRole();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, categoria]);

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

      // 3. Actualizar UI
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      toast.success("Documento purgado del sistema 🗑️");
      
    } catch (error) {
      console.error("Error al eliminar documento:", error);
      toast.error("Ocurrió un error al intentar eliminar el documento ❌");
    }
  };

  return (
    <div className="px-8 py-10 lg:px-12 lg:py-12">
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-px flex-1 max-w-[40px] bg-phosphor/40" />
          <span className="font-mono text-xs tracking-[0.3em] text-phosphor-dim uppercase">
            Sistema Activo
          </span>
        </div>
        <h1
          className="font-mono text-3xl font-bold tracking-tight text-softgreen lg:text-4xl"
          style={{ animation: "fade-in-up 0.5s ease-out both" }}
        >
          Bienvenido a{" "}
          <span
            className="text-phosphor"
            style={{ textShadow: "0 0 20px rgba(57,255,20,0.35)" }}
          >
            INGENIA BASE
          </span>
          <span
            className="inline-block w-[3px] h-8 bg-phosphor ml-1 align-middle"
            style={{ animation: "cursor-blink 1s step-end infinite" }}
          />
        </h1>
        <p
          className="mt-3 max-w-2xl text-base leading-relaxed text-softgreen-dim"
          style={{ animation: "fade-in-up 0.5s ease-out 100ms both" }}
        >
          Tu central de documentación corporativa. Filtra y explora los registros disponibles en la base de datos.
        </p>
      </header>

      {/* Toolbar (Search & Filter) */}
      <div
        className="mb-8 flex flex-col gap-4 border border-phosphor/15 bg-terminal-900 p-4 sm:flex-row sm:items-center sm:justify-between"
        style={{ animation: "fade-in-up 0.5s ease-out 200ms both" }}
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-softgreen-dim/50" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título..."
            className="w-full border border-phosphor/15 bg-terminal-800 py-3 pl-10 pr-4
                       font-mono text-sm text-softgreen placeholder:text-softgreen-dim/40
                       outline-none transition-all
                       focus:border-purple-accent/40 focus:shadow-[0_0_12px_rgba(196,167,231,0.1)]"
          />
        </div>
        
        <div className="w-full sm:w-64">
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full border border-phosphor/15 bg-terminal-800 py-3 px-4
                       font-mono text-sm text-softgreen
                       outline-none transition-all appearance-none cursor-pointer
                       focus:border-purple-accent/40 focus:shadow-[0_0_12px_rgba(196,167,231,0.1)]"
          >
            {categoriasOpts.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-terminal-900 text-softgreen">
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
        ) : documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-dashed border-phosphor/20 bg-terminal-800/30 py-24 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-terminal-900 border border-phosphor/10">
              <FileSearch className="h-8 w-8 text-phosphor/50" />
            </div>
            <h3 className="font-mono text-lg font-bold text-softgreen">Sin resultados</h3>
            <p className="mt-2 text-sm text-softgreen-dim/60 max-w-sm">
              No se encontraron registros en la base de datos que coincidan con los filtros actuales.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {documents.map((doc, i) => {
              const config = fileTypeConfig[doc.tipo_archivo] || fileTypeConfig.pdf;
              const Icon = config.icon;
              
              const catLabel = categoriasOpts.find(c => c.value === doc.categoria)?.label || doc.categoria;

              return (
                <div
                  key={doc.id}
                  className="group relative flex flex-col border border-phosphor/20 bg-terminal-900 p-6
                             transition-all duration-300
                             hover:border-phosphor hover:shadow-[0_0_20px_rgba(57,255,20,0.1)]"
                  style={{ animation: `fade-in-up 0.4s ease-out ${300 + i * 50}ms both` }}
                >
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-phosphor/20 bg-terminal-800">
                      <Icon className={`h-6 w-6 ${config.color}`} />
                    </div>
                    <span className="border border-phosphor/30 bg-terminal-800 px-2.5 py-1 font-mono text-[9px] tracking-wider text-softgreen-dim/80 uppercase">
                      {catLabel}
                    </span>
                  </div>
                  
                  <h3 className="mb-2 font-mono text-base font-semibold text-softgreen transition-colors group-hover:text-phosphor line-clamp-2">
                    {doc.titulo}
                  </h3>
                  
                  <p className="mb-6 flex-1 text-xs leading-relaxed text-softgreen-dim/70 line-clamp-3">
                    {doc.descripcion}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between border-t border-phosphor/10 pt-4">
                    <span className="font-mono text-[10px] text-softgreen-dim/50">
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
                        className={`flex items-center gap-1.5 border border-purple-accent/30 bg-purple-accent/5 px-3 py-1.5 
                                   font-mono text-[10px] font-semibold tracking-wider text-purple-accent
                                   transition-all duration-200
                                   hover:bg-purple-accent hover:text-terminal-900 hover:shadow-[0_0_16px_rgba(196,167,231,0.3)]
                                   ${doc.url_archivo === "#" ? "opacity-50 pointer-events-none" : ""}`}
                      >
                        <Eye className="h-3 w-3" />
                        VER
                      </button>
                      
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(doc.id, doc.url_archivo, doc.titulo)}
                          className="flex items-center gap-1.5 border border-red-500/30 bg-red-500/5 px-3 py-1.5
                                     font-mono text-[10px] font-semibold tracking-wider text-red-500
                                     transition-all duration-200
                                     hover:bg-red-500 hover:text-terminal-900 hover:shadow-[0_0_16px_rgba(239,68,68,0.3)]"
                        >
                          <Trash2 className="h-3 w-3" />
                          ELIMINAR
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
        className="mt-12 flex items-center gap-3 border-t border-phosphor/10 pt-6"
        style={{ animation: "fade-in-up 0.5s ease-out 800ms both" }}
      >
        <div
          className="h-2 w-2 rounded-full bg-phosphor"
          style={{ animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}
        />
        <span className="font-mono text-xs tracking-wider text-softgreen-dim/40">
          Mostrando los documentos desclasificados de la bóveda
        </span>
      </footer>

      <DocumentViewerModal
        isOpen={!!viewerDoc}
        onClose={() => setViewerDoc(null)}
        url={viewerDoc?.url_archivo || ""}
        title={viewerDoc?.titulo || ""}
        type={viewerDoc?.tipo_archivo || ""}
      />
    </div>
  );
}
