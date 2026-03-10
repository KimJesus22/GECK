import CategoryCard from "@/components/CategoryCard";

const categories = [
  {
    title: "Seguridad Industrial",
    description:
      "Protocolos, procedimientos de emergencia y normativas de seguridad en planta.",
    iconName: "HardHat",
    count: 24,
  },
  {
    title: "Recursos Humanos",
    description:
      "Políticas internas, onboarding, evaluaciones de desempeño y beneficios.",
    iconName: "Users",
    count: 18,
  },
  {
    title: "Soporte Técnico",
    description:
      "Guías de troubleshooting, documentación de sistemas y bases de conocimiento.",
    iconName: "Headset",
    count: 31,
  },
  {
    title: "Calidad",
    description:
      "Estándares ISO, auditorías internas, control de procesos y mejora continua.",
    iconName: "BadgeCheck",
    count: 15,
  },
  {
    title: "Legal y Cumplimiento",
    description:
      "Marco regulatorio, contratos, políticas de privacidad y compliance.",
    iconName: "Scale",
    count: 12,
  },
  {
    title: "Capacitación",
    description:
      "Programas de formación, cursos en línea, certificaciones y desarrollo profesional.",
    iconName: "GraduationCap",
    count: 27,
  },
];

export default function Home() {
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
          style={{
            animation: "fade-in-up 0.5s ease-out both",
          }}
        >
          Bienvenido a{" "}
          <span
            className="text-phosphor"
            style={{
              textShadow: "0 0 20px rgba(57,255,20,0.35)",
            }}
          >
            INGENIA BASE
          </span>
          <span
            className="inline-block w-[3px] h-8 bg-phosphor ml-1 align-middle"
            style={{
              animation: "cursor-blink 1s step-end infinite",
            }}
          />
        </h1>
        <p
          className="mt-3 max-w-2xl text-base leading-relaxed text-softgreen-dim"
          style={{
            animation: "fade-in-up 0.5s ease-out 100ms both",
          }}
        >
          INGENIA BASE — Tu central de documentación, normativas y recursos
          de aprendizaje corporativo.
        </p>
      </header>

      {/* Stats bar */}
      <div
        className="mb-8 flex flex-wrap gap-6 border border-phosphor/10 bg-terminal-900 px-6 py-4"
        style={{
          animation: "fade-in-up 0.5s ease-out 200ms both",
        }}
      >
        {[
          { label: "Documentos", value: "127" },
          { label: "Categorías", value: "6" },
          { label: "Actualizados hoy", value: "3" },
          { label: "Usuarios activos", value: "42" },
        ].map((stat) => (
          <div key={stat.label} className="flex items-baseline gap-2">
            <span className="font-mono text-xl font-bold text-phosphor">
              {stat.value}
            </span>
            <span className="text-xs tracking-wider text-softgreen-dim">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Section title */}
      <div
        className="mb-6 flex items-center gap-3"
        style={{
          animation: "fade-in-up 0.5s ease-out 300ms both",
        }}
      >
        <h2 className="font-mono text-sm font-semibold tracking-[0.2em] text-softgreen-dim uppercase">
          Categorías de Documentos
        </h2>
        <div className="h-px flex-1 bg-phosphor/10" />
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((cat, i) => (
          <CategoryCard
            key={cat.title}
            title={cat.title}
            description={cat.description}
            iconName={cat.iconName}
            count={cat.count}
            delay={400 + i * 80}
          />
        ))}
      </div>

      {/* Footer */}
      <footer
        className="mt-12 flex items-center gap-3 border-t border-phosphor/10 pt-6"
        style={{
          animation: "fade-in-up 0.5s ease-out 900ms both",
        }}
      >
        <div
          className="h-2 w-2 rounded-full bg-phosphor"
          style={{
            animation: "glow-pulse 2s ease-in-out infinite",
          }}
        />
        <span className="font-mono text-xs tracking-wider text-softgreen-dim/60">
          INGENIA BASE v1.0.0 — Todos los sistemas operativos
        </span>
      </footer>
    </div>
  );
}
