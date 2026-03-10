import { Settings, User, Bell, Shield, Palette } from "lucide-react";

const settingsSections = [
  {
    icon: User,
    title: "Perfil",
    description: "Información de cuenta, correo y contraseña.",
    status: "Próximamente",
  },
  {
    icon: Bell,
    title: "Notificaciones",
    description: "Configura alertas de nuevos documentos y actualizaciones.",
    status: "Próximamente",
  },
  {
    icon: Shield,
    title: "Seguridad",
    description: "Autenticación de dos factores y sesiones activas.",
    status: "Próximamente",
  },
  {
    icon: Palette,
    title: "Apariencia",
    description: "Tema, tamaño de fuente y preferencias de visualización.",
    status: "Próximamente",
  },
];

export default function AjustesPage() {
  return (
    <div className="px-8 py-10 lg:px-12 lg:py-12">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-px flex-1 max-w-[40px] bg-phosphor/40" />
          <span className="font-mono text-xs tracking-[0.3em] text-phosphor-dim uppercase">
            Configuración
          </span>
        </div>
        <div
          className="flex items-center gap-4"
          style={{ animation: "fade-in-up 0.5s ease-out both" }}
        >
          <div className="flex h-14 w-14 items-center justify-center border border-phosphor/30 bg-terminal-800">
            <Settings className="h-7 w-7 text-phosphor" />
          </div>
          <div>
            <h1 className="font-mono text-2xl font-bold tracking-tight text-softgreen lg:text-3xl">
              Ajustes
            </h1>
            <p className="mt-1 text-sm text-softgreen-dim">
              Configuración de cuenta, notificaciones y preferencias.
            </p>
          </div>
        </div>
      </header>

      {/* Settings grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {settingsSections.map((section, i) => (
          <div
            key={section.title}
            className="group relative flex gap-4 border border-phosphor/15 bg-terminal-700 p-6
                       transition-all duration-300
                       hover:border-purple-accent/30 hover:shadow-[0_0_20px_rgba(196,167,231,0.08)]"
            style={{
              animation: `fade-in-up 0.5s ease-out ${200 + i * 100}ms both`,
            }}
          >
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center border border-phosphor/20
                          bg-terminal-800 transition-all duration-300
                          group-hover:border-purple-accent/30"
            >
              <section.icon className="h-5 w-5 text-phosphor transition-colors duration-300 group-hover:text-purple-accent" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-sm font-semibold text-softgreen transition-colors group-hover:text-purple-accent-bright">
                  {section.title}
                </h3>
                <span className="font-mono text-[9px] tracking-[0.2em] text-softgreen-dim/40 uppercase">
                  {section.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-softgreen-dim/70">
                {section.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer
        className="mt-12 flex items-center gap-3 border-t border-phosphor/10 pt-6"
        style={{ animation: "fade-in-up 0.5s ease-out 800ms both" }}
      >
        <div
          className="h-2 w-2 rounded-full bg-phosphor"
          style={{ animation: "glow-pulse 2s ease-in-out infinite" }}
        />
        <span className="font-mono text-xs tracking-wider text-softgreen-dim/60">
          INGENIA BASE v1.0.0 — Configuración del sistema
        </span>
      </footer>
    </div>
  );
}
