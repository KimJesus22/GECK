import { ShieldAlert, Activity, LayoutDashboard } from "lucide-react";
import { createClient } from "@/lib/supabase";
import type { LogAcceso } from "@/lib/types";

export default async function AdminLogsPage() {
  let logs: LogAcceso[] = [];
  let error: string | null = null;

  try {
    const supabase = await createClient();
    
    const { data, error: dbError } = await supabase
      .from("logs_acceso")
      .select("*")
      .order("fecha_hora", { ascending: false })
      .limit(15);

    if (dbError) {
      error = dbError.message;
    } else {
      logs = data ?? [];
    }
  } catch (e) {
    error =
      e instanceof Error
        ? e.message
        : "No se pudo conectar con la base de datos.";
  }

  return (
    <div className="px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
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
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
            <ShieldAlert className="h-7 w-7 text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary lg:text-3xl">
              Registros de Auditoría
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Vigilancia del sistema. Monitoreando los últimos 15 movimientos de la plataforma.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content Box */}
      <div 
        className="rounded-2xl border border-surface-600/30 bg-surface-900 shadow-xl shadow-black/20"
        style={{ animation: "fade-in-up 0.5s ease-out 100ms both" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-600/30 px-5 py-3 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
            <span className="ml-2 text-xs font-medium tracking-[0.3em] text-text-muted uppercase">
              admin://logs_acceso
            </span>
          </div>
          <div className="flex items-center gap-2 text-accent animate-pulse">
            <Activity className="h-4 w-4" />
            <span className="text-xs font-semibold tracking-widest uppercase">Live Tracking</span>
          </div>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-surface-600/20 bg-surface-800/50 text-xs font-semibold tracking-wider uppercase text-text-muted">
              <tr>
                <th className="px-5 py-4">Fecha / Hora</th>
                <th className="px-5 py-4">Usuario</th>
                <th className="px-5 py-4">Acción</th>
                <th className="px-5 py-4">Detalles de Documento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600/10">
              {error && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-sm text-red-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ShieldAlert className="h-6 w-6" />
                      Error al cargar logs: {error}
                    </div>
                  </td>
                </tr>
              )}

              {!error && logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-sm text-text-muted">
                    No se han registrado movimientos recientes en el sistema.
                  </td>
                </tr>
              ) : (
                logs.map((log, i) => {
                  const date = new Date(log.fecha_hora);
                  const formattedDate = date.toLocaleDateString("es-MX", { day: '2-digit', month: '2-digit', year: 'numeric' });
                  const formattedTime = date.toLocaleTimeString("es-MX", { hour12: false });
                  
                  return (
                    <tr 
                      key={log.id} 
                      className="group transition-colors hover:bg-surface-800/40"
                      style={{ animation: `fade-in-up 0.3s ease-out ${200 + i * 50}ms both` }}
                    >
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-text-primary">{formattedDate}</span>
                          <span className="text-xs text-text-muted">{formattedTime} hrs</span>
                        </div>
                      </td>
                      
                      <td className="px-5 py-4">
                        <span className="text-xs font-medium text-text-secondary transition-colors group-hover:text-indigo">
                          {log.correo_usuario}
                        </span>
                      </td>
                      
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wider
                                       ${log.accion.includes('Descargó') 
                                          ? 'border border-accent/20 bg-accent/5 text-accent' 
                                          : 'border border-indigo/20 bg-indigo/5 text-indigo'}`}>
                          {log.accion}
                        </span>
                      </td>
                      
                      <td className="px-5 py-4">
                        {log.detalles?.titulo ? (
                          <div className="flex flex-col">
                            <span className="text-sm text-text-secondary">
                              {log.detalles.titulo}
                            </span>
                            <span className="text-xs font-medium text-text-muted uppercase mt-0.5">
                              ID: {log.documento_id?.split('-')[0] || "N/A"} • Tipo: {log.detalles.archivo || "N/A"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-text-muted/60 italic">Sin metadata de documento.</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="mt-8 flex items-center gap-3 border-t border-surface-600/20 pt-6"
        style={{ animation: "fade-in-up 0.5s ease-out 800ms both" }}
      >
        <div className="h-1.5 w-1.5 rounded-full bg-red-400/50" />
        <span className="text-xs font-medium text-text-muted">
          Nivel de clasificación alto — Solo acceso para directivos
        </span>
      </footer>
    </div>
  );
}
