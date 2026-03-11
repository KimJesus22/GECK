import Link from "next/link";
import { Settings, User, Shield, ArrowRight } from "lucide-react";

const settingsSections = [
  {
    icon: User,
    title: "Perfil",
    description: "Correo electrónico, rol y estado de tu cuenta.",
    href: "/ajustes/perfil",
    color: "text-indigo",
    bgColor: "bg-indigo/10",
    borderColor: "border-indigo/20",
    hoverBorder: "hover:border-indigo/40",
  },
  {
    icon: Shield,
    title: "Seguridad",
    description: "Actualiza tu contraseña y protege tu cuenta.",
    href: "/ajustes/seguridad",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    hoverBorder: "hover:border-red-500/30",
  },
];

export default function AjustesPage() {
  return (
    <div className="px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="text-xs font-semibold tracking-widest text-accent uppercase">
            Configuración
          </span>
        </div>
        <div
          className="flex items-center gap-4"
          style={{ animation: "fade-in-up 0.5s ease-out both" }}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-accent/20 bg-accent/10">
            <Settings className="h-7 w-7 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary lg:text-3xl">
              Ajustes
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Administra tu perfil y la seguridad de tu cuenta.
            </p>
          </div>
        </div>
      </header>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 max-w-3xl">
        {settingsSections.map((section, i) => (
          <Link
            key={section.title}
            href={section.href}
            className={`group relative flex gap-4 rounded-xl border ${section.borderColor} bg-surface-900 p-6
                       transition-all duration-300
                       ${section.hoverBorder} hover:shadow-lg hover:shadow-black/10`}
            style={{
              animation: `fade-in-up 0.5s ease-out ${200 + i * 100}ms both`,
            }}
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl
                          ${section.bgColor} ${section.borderColor} border
                          transition-all duration-300`}
            >
              <section.icon className={`h-5 w-5 ${section.color} transition-colors duration-300`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className={`text-sm font-semibold text-text-primary transition-colors group-hover:${section.color}`}>
                  {section.title}
                </h3>
                <ArrowRight className="h-4 w-4 text-text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-text-secondary" />
              </div>
              <p className="mt-1 text-xs text-text-muted leading-relaxed">
                {section.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <footer
        className="mt-12 flex items-center gap-3 border-t border-surface-600/20 pt-6"
        style={{ animation: "fade-in-up 0.5s ease-out 800ms both" }}
      >
        <div
          className="h-1.5 w-1.5 rounded-full bg-accent"
          style={{ animation: "glow-pulse 2s ease-in-out infinite" }}
        />
        <span className="text-xs font-medium text-text-muted">
          INGENIA BASE v1.0.0 — Configuración del sistema
        </span>
      </footer>
    </div>
  );
}
