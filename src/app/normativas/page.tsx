import { ShieldCheck, Search, Filter, AlertTriangle } from "lucide-react";
import DocumentRow from "@/components/DocumentRow";
import { createClient } from "@/lib/supabase";
import type { Documento } from "@/lib/types";

export default async function NormativasPage() {
  let documents: Documento[] = [];
  let error: string | null = null;

  try {
    const supabase = await createClient();
    const { data, error: dbError } = await supabase
      .from("documentos")
      .select("*")
      .eq("categoria", "normativas")
      .order("fecha_creacion", { ascending: false });

    if (dbError) {
      error = dbError.message;
    } else {
      documents = data ?? [];
    }
  } catch (e) {
    error =
      e instanceof Error
        ? e.message
        : "No se pudo conectar con la base de datos.";
  }

  return (
    <div className="px-8 py-10 lg:px-12 lg:py-12">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-px flex-1 max-w-[40px] bg-phosphor/40" />
          <span className="font-mono text-xs tracking-[0.3em] text-phosphor-dim uppercase">
            Categoría
          </span>
        </div>
        <div
          className="flex items-center gap-4"
          style={{ animation: "fade-in-up 0.5s ease-out both" }}
        >
          <div className="flex h-14 w-14 items-center justify-center border border-phosphor/30 bg-terminal-800">
            <ShieldCheck className="h-7 w-7 text-phosphor" />
          </div>
          <div>
            <h1 className="font-mono text-2xl font-bold tracking-tight text-softgreen lg:text-3xl">
              Normativas
            </h1>
            <p className="mt-1 text-sm text-softgreen-dim">
              Marco regulatorio, protocolos de seguridad y documentos de
              cumplimiento.
            </p>
          </div>
        </div>
      </header>

      {/* Error state */}
      {error && (
        <div
          className="mb-6 flex items-start gap-3 border border-red-500/30 bg-red-500/5 p-4"
          style={{ animation: "fade-in-up 0.5s ease-out 100ms both" }}
        >
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
          <div>
            <p className="font-mono text-sm font-semibold text-red-400">
              Error al cargar documentos
            </p>
            <p className="mt-1 text-xs text-red-400/70">{error}</p>
            <p className="mt-2 text-xs text-softgreen-dim/60">
              Verifica que las variables{" "}
              <code className="text-phosphor-dim">
                NEXT_PUBLIC_SUPABASE_URL
              </code>{" "}
              y{" "}
              <code className="text-phosphor-dim">
                NEXT_PUBLIC_SUPABASE_ANON_KEY
              </code>{" "}
              estén configuradas en{" "}
              <code className="text-phosphor-dim">.env.local</code>
            </p>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div
        className="mb-6 flex flex-col gap-3 border border-phosphor/10 bg-terminal-900 p-4 sm:flex-row sm:items-center sm:justify-between"
        style={{ animation: "fade-in-up 0.5s ease-out 100ms both" }}
      >
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-softgreen-dim/50" />
          <input
            type="text"
            placeholder="Buscar documento..."
            className="w-full border border-phosphor/15 bg-terminal-800 py-2 pl-10 pr-4
                       font-mono text-sm text-softgreen placeholder:text-softgreen-dim/40
                       outline-none transition-all
                       focus:border-purple-accent/40 focus:shadow-[0_0_12px_rgba(196,167,231,0.1)]"
          />
        </div>

        {/* Filter + count */}
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-2 border border-phosphor/15 bg-terminal-800
                       px-3 py-2 font-mono text-xs tracking-wider text-softgreen-dim
                       transition-all hover:border-phosphor/30 hover:text-softgreen"
          >
            <Filter className="h-3.5 w-3.5" />
            Filtrar
          </button>
          <span className="font-mono text-xs text-softgreen-dim/50">
            {documents.length} documentos
          </span>
        </div>
      </div>

      {/* Documents table / list */}
      <div
        className="border border-phosphor/10 bg-terminal-700/30"
        style={{ animation: "fade-in-up 0.5s ease-out 200ms both" }}
      >
        <table className="w-full">
          <thead className="hidden md:table-header-group">
            <tr className="border-b border-phosphor/15 bg-terminal-900/60">
              <th className="px-4 py-3 text-left font-mono text-xs font-semibold tracking-[0.2em] text-softgreen-dim/60 uppercase">
                Tipo
              </th>
              <th className="px-4 py-3 text-left font-mono text-xs font-semibold tracking-[0.2em] text-softgreen-dim/60 uppercase">
                Nombre
              </th>
              <th className="hidden px-4 py-3 text-left font-mono text-xs font-semibold tracking-[0.2em] text-softgreen-dim/60 uppercase lg:table-cell">
                Descripción
              </th>
              <th className="hidden px-4 py-3 text-left font-mono text-xs font-semibold tracking-[0.2em] text-softgreen-dim/60 uppercase xl:table-cell">
                Tamaño
              </th>
              <th className="hidden px-4 py-3 text-left font-mono text-xs font-semibold tracking-[0.2em] text-softgreen-dim/60 uppercase xl:table-cell">
                Fecha
              </th>
              <th className="px-4 py-3 text-left font-mono text-xs font-semibold tracking-[0.2em] text-softgreen-dim/60 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Mobile spacing */}
            <tr className="md:hidden">
              <td colSpan={6} className="p-2" />
            </tr>
            {documents.length === 0 && !error ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center font-mono text-sm text-softgreen-dim/50"
                >
                  No se encontraron documentos en esta categoría.
                </td>
              </tr>
            ) : (
              documents.map((doc, i) => (
                <DocumentRow
                  key={doc.id}
                  id={doc.id}
                  name={doc.titulo}
                  description={doc.descripcion}
                  fileType={doc.tipo_archivo}
                  size={doc.tamano}
                  date={doc.fecha_creacion.split("T")[0]}
                  url={doc.url_archivo}
                  delay={300 + i * 60}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <footer
        className="mt-8 flex items-center gap-3 border-t border-phosphor/10 pt-6"
        style={{ animation: "fade-in-up 0.5s ease-out 800ms both" }}
      >
        <div
          className="h-2 w-2 rounded-full bg-phosphor"
          style={{ animation: "glow-pulse 2s ease-in-out infinite" }}
        />
        <span className="font-mono text-xs tracking-wider text-softgreen-dim/60">
          Mostrando {documents.length} documento
          {documents.length !== 1 ? "s" : ""} — Fuente: Supabase
        </span>
      </footer>
    </div>
  );
}
