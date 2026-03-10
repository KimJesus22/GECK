import { Terminal, ShieldAlert, Activity } from "lucide-react";
import { createClient } from "@/lib/supabase";
import type { LogAcceso } from "@/lib/types";

export default async function AdminLogsPage() {
  let logs: LogAcceso[] = [];
  let error: string | null = null;

  try {
    const supabase = await createClient();
    
    // Obtener los últimos 15 movimientos
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
    <div className="px-8 py-10 lg:px-12 lg:py-12">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-px flex-1 max-w-[40px] bg-phosphor/40" />
          <span className="font-mono text-xs tracking-[0.3em] text-red-400/80 uppercase">
            ⚠ Panel de Administración
          </span>
        </div>
        <div
          className="flex items-center gap-4"
          style={{ animation: "fade-in-up 0.5s ease-out both" }}
        >
          <div className="flex h-14 w-14 items-center justify-center border border-red-500/30 bg-terminal-800">
            <ShieldAlert className="h-7 w-7 text-red-500" />
          </div>
          <div>
            <h1 className="font-mono text-2xl font-bold tracking-tight text-softgreen lg:text-3xl">
              Registros de Auditoría
            </h1>
            <p className="mt-1 text-sm text-softgreen-dim">
              Vigilancia del sistema. Monitoreando los últimos 15 movimientos de la plataforma.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content Box */}
      <div 
        className="border border-phosphor/15 bg-terminal-900 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
        style={{ animation: "fade-in-up 0.5s ease-out 100ms both" }}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-phosphor/10 px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
            <span className="ml-2 font-mono text-[10px] tracking-[0.3em] text-softgreen-dim/50 uppercase">
              admin://logs_acceso_root
            </span>
          </div>
          <div className="flex items-center gap-2 text-phosphor animate-pulse">
            <Activity className="h-4 w-4" />
            <span className="font-mono text-[10px] tracking-widest uppercase">Live Tracking</span>
          </div>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-phosphor/15 bg-terminal-800/50 font-mono text-[10px] tracking-[0.2em] uppercase text-softgreen-dim/60">
              <tr>
                <th className="px-5 py-4 font-semibold">Fecha / Hora</th>
                <th className="px-5 py-4 font-semibold">Usuario</th>
                <th className="px-5 py-4 font-semibold">Acción</th>
                <th className="px-5 py-4 font-semibold">Detalles de Documento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-phosphor/5">
              {error && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center font-mono text-sm text-red-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ShieldAlert className="h-6 w-6" />
                      Error al cargar logs: {error}
                    </div>
                  </td>
                </tr>
              )}

              {!error && logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center font-mono text-sm text-softgreen-dim/50">
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
                      className="group transition-colors hover:bg-terminal-800/40"
                      style={{ animation: `fade-in-up 0.3s ease-out ${200 + i * 50}ms both` }}
                    >
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-mono text-xs text-softgreen">{formattedDate}</span>
                          <span className="font-mono text-[10px] text-softgreen-dim/40">{formattedTime} hrs</span>
                        </div>
                      </td>
                      
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs text-softgreen transition-colors group-hover:text-phosphor">
                          {log.correo_usuario}
                        </span>
                      </td>
                      
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2 py-1 font-mono text-[10px] uppercase tracking-wider
                                       ${log.accion.includes('Descargó') 
                                          ? 'border border-phosphor/30 bg-phosphor/5 text-phosphor' 
                                          : 'border border-purple-accent/30 bg-purple-accent/5 text-purple-accent'}`}>
                          {log.accion}
                        </span>
                      </td>
                      
                      <td className="px-5 py-4">
                        {log.detalles?.titulo ? (
                          <div className="flex flex-col">
                            <span className="text-sm text-softgreen-dim">
                              {log.detalles.titulo}
                            </span>
                            <span className="font-mono text-[10px] text-softgreen-dim/40 uppercase mt-0.5">
                              ID: {log.documento_id?.split('-')[0] || "N/A"} • Tipo: {log.detalles.archivo || "N/A"}
                            </span>
                          </div>
                        ) : (
                          <span className="font-mono text-[10px] text-softgreen-dim/30 italic">Sin metadata de documento incrustada.</span>
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
        className="mt-8 flex items-center gap-3 border-t border-phosphor/10 pt-6"
        style={{ animation: "fade-in-up 0.5s ease-out 800ms both" }}
      >
        <Terminal className="h-3.5 w-3.5 text-red-400/50" />
        <span className="font-mono text-xs tracking-wider text-softgreen-dim/40">
          Nivel de Clasificación Alto — Solo acceso para directivos
        </span>
      </footer>
    </div>
  );
}
