import Link from "next/link";
import {
  Terminal,
  ShieldCheck,
  FileText,
  GraduationCap,
  ArrowRight,
  Zap,
  Lock,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Acceso Seguro 24/7",
    description:
      "Plataforma protegida con autenticación y políticas de seguridad nivel empresarial. Accede desde cualquier lugar, en cualquier momento.",
  },
  {
    icon: FileText,
    title: "Documentación Actualizada",
    description:
      "Manuales, normativas y protocolos siempre al día. Un solo punto centralizado de verdad para tu organización.",
  },
  {
    icon: GraduationCap,
    title: "Aprendizaje a tu Ritmo",
    description:
      "Materiales de capacitación, videos y certificaciones organizados para que avances a tu propio paso.",
  },
];

const stats = [
  { value: "127+", label: "Documentos" },
  { value: "24/7", label: "Disponibilidad" },
  { value: "6", label: "Categorías" },
  { value: "100%", label: "Seguro" },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ── NAV BAR ── */}
      <nav className="fixed top-0 z-50 w-full border-b border-phosphor/10 bg-terminal-900/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center border border-phosphor/40 bg-terminal-800">
              <Terminal className="h-4.5 w-4.5 text-phosphor" />
            </div>
            <span
              className="font-mono text-base font-bold tracking-wider text-phosphor"
              style={{ textShadow: "0 0 12px rgba(57,255,20,0.3)" }}
            >
              INGENIA BASE
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="font-mono text-xs tracking-wider text-softgreen-dim transition-colors hover:text-purple-accent"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/login"
              className="border border-purple-accent/40 bg-purple-accent/10 px-4 py-2
                         font-mono text-xs font-semibold tracking-wider text-purple-accent
                         transition-all duration-200
                         hover:bg-purple-accent hover:text-terminal-900
                         hover:shadow-[0_0_20px_rgba(196,167,231,0.25)]"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 pt-32 pb-20">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div
            className="mb-8 inline-flex items-center gap-2 border border-phosphor/15 bg-terminal-700 px-4 py-1.5"
            style={{ animation: "fade-in-up 0.5s ease-out both" }}
          >
            <Zap className="h-3.5 w-3.5 text-phosphor" />
            <span className="font-mono text-xs tracking-[0.3em] text-phosphor-dim uppercase">
              Plataforma Corporativa v1.0
            </span>
          </div>

          {/* Title */}
          <h1
            className="font-mono text-4xl font-bold leading-tight tracking-tight text-softgreen sm:text-5xl lg:text-6xl"
            style={{ animation: "fade-in-up 0.6s ease-out 100ms both" }}
          >
            Bienvenido a{" "}
            <span
              className="text-phosphor"
              style={{ textShadow: "0 0 30px rgba(57,255,20,0.3)" }}
            >
              INGENIA
            </span>
            <br />
            <span
              className="text-phosphor"
              style={{ textShadow: "0 0 30px rgba(57,255,20,0.3)" }}
            >
              BASE
            </span>
            <span
              className="inline-block w-[4px] h-10 sm:h-12 bg-phosphor ml-1 align-middle"
              style={{ animation: "cursor-blink 1s step-end infinite" }}
            />
          </h1>

          {/* Subtitle */}
          <p
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-softgreen-dim sm:text-xl"
            style={{ animation: "fade-in-up 0.6s ease-out 200ms both" }}
          >
            Tu centro de conocimiento y capacitación empresarial
            <br className="hidden sm:block" /> seguro y centralizado.
          </p>

          {/* CTA Buttons */}
          <div
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            style={{ animation: "fade-in-up 0.6s ease-out 350ms both" }}
          >
            <Link
              href="/login"
              className="group flex items-center justify-center gap-2 border border-purple-accent/40
                         bg-purple-accent/15 px-8 py-4
                         font-mono text-sm font-semibold tracking-wider text-purple-accent
                         transition-all duration-300
                         hover:bg-purple-accent hover:text-terminal-900
                         hover:shadow-[0_0_30px_rgba(196,167,231,0.3)]
                         sm:min-w-[220px]"
            >
              <Lock className="h-4 w-4" />
              Iniciar Sesión
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/login"
              className="group flex items-center justify-center gap-2 border border-phosphor/20
                         bg-terminal-700 px-8 py-4
                         font-mono text-sm font-semibold tracking-wider text-softgreen
                         transition-all duration-300
                         hover:border-purple-accent/30 hover:text-purple-accent
                         hover:shadow-[0_0_20px_rgba(196,167,231,0.1)]
                         sm:min-w-[220px]"
            >
              <Globe className="h-4 w-4" />
              Solicitar Acceso
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section
        className="border-y border-phosphor/10 bg-terminal-900/50"
        style={{ animation: "fade-in-up 0.5s ease-out 500ms both" }}
      >
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-10 px-6 py-8 sm:gap-16">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <span
                className="block font-mono text-2xl font-bold text-phosphor sm:text-3xl"
                style={{ textShadow: "0 0 12px rgba(57,255,20,0.2)" }}
              >
                {stat.value}
              </span>
              <span className="mt-1 block font-mono text-xs tracking-[0.2em] text-softgreen-dim/60 uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          {/* Section header */}
          <div
            className="mb-12 text-center"
            style={{ animation: "fade-in-up 0.5s ease-out 600ms both" }}
          >
            <h2 className="font-mono text-2xl font-bold tracking-tight text-softgreen sm:text-3xl">
              ¿Por qué{" "}
              <span className="text-phosphor">INGENIA BASE</span>?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-softgreen-dim">
              Una plataforma diseñada para centralizar, proteger y distribuir
              el conocimiento de tu empresa.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map((feat, i) => (
              <div
                key={feat.title}
                className="group relative flex flex-col gap-4 border border-phosphor/15
                           bg-terminal-700 p-7 transition-all duration-300
                           hover:border-purple-accent/40 hover:shadow-[0_0_24px_rgba(196,167,231,0.1)]"
                style={{
                  animation: `fade-in-up 0.5s ease-out ${700 + i * 100}ms both`,
                }}
              >
                {/* Icon */}
                <div
                  className="flex h-14 w-14 items-center justify-center border border-phosphor/25
                              bg-terminal-800 transition-all duration-300
                              group-hover:border-purple-accent/40 group-hover:shadow-[0_0_16px_rgba(196,167,231,0.1)]"
                >
                  <feat.icon className="h-7 w-7 text-phosphor transition-colors duration-300 group-hover:text-purple-accent" />
                </div>

                {/* Title */}
                <h3 className="font-mono text-lg font-semibold tracking-wide text-softgreen transition-colors group-hover:text-purple-accent-bright">
                  {feat.title}
                </h3>

                {/* Description */}
                <p className="text-sm leading-relaxed text-softgreen-dim/80">
                  {feat.description}
                </p>

                {/* Corner accents — Minecraft style */}
                <div className="absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-phosphor/25 transition-colors duration-300 group-hover:border-purple-accent/50" />
                <div className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-phosphor/25 transition-colors duration-300 group-hover:border-purple-accent/50" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-phosphor/10 bg-terminal-900/50 px-6 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <div
              className="h-2 w-2 rounded-full bg-phosphor"
              style={{ animation: "glow-pulse 2s ease-in-out infinite" }}
            />
            <span className="font-mono text-xs tracking-wider text-softgreen-dim/50">
              INGENIA BASE v1.0.0
            </span>
          </div>
          <span className="font-mono text-xs tracking-wider text-softgreen-dim/30">
            © 2026 — Todos los derechos reservados
          </span>
        </div>
      </footer>
    </div>
  );
}
