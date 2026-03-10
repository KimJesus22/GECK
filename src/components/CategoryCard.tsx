"use client";

import {
  HardHat,
  Users,
  Headset,
  BadgeCheck,
  Scale,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  HardHat,
  Users,
  Headset,
  BadgeCheck,
  Scale,
  GraduationCap,
};

interface CategoryCardProps {
  title: string;
  description: string;
  iconName: string;
  count: number;
  delay?: number;
}

export default function CategoryCard({
  title,
  description,
  iconName,
  count,
  delay = 0,
}: CategoryCardProps) {
  const Icon = iconMap[iconName] ?? HardHat;

  return (
    <div
      className="group relative flex flex-col gap-4 border border-phosphor/20
                 bg-terminal-700 p-6 transition-all duration-300
                 hover:border-purple-accent/50 hover:shadow-[0_0_24px_rgba(196,167,231,0.12)]"
      style={{
        animation: `fade-in-up 0.5s ease-out ${delay}ms both`,
      }}
    >
      {/* Top row: icon + count badge */}
      <div className="flex items-start justify-between">
        <div
          className="flex h-12 w-12 items-center justify-center border border-phosphor/25
                      bg-terminal-800 transition-all duration-300
                      group-hover:border-purple-accent/40 group-hover:shadow-[0_0_16px_rgba(196,167,231,0.1)]"
        >
          <Icon className="h-6 w-6 text-phosphor transition-colors duration-300 group-hover:text-purple-accent" />
        </div>
        <span
          className="font-mono text-xs tracking-wider text-softgreen-dim
                     border border-phosphor/15 bg-terminal-800 px-2 py-0.5"
        >
          {count} docs
        </span>
      </div>

      {/* Title */}
      <h3 className="font-mono text-base font-semibold tracking-wide text-softgreen transition-colors group-hover:text-purple-accent-bright">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm leading-relaxed text-softgreen-dim/80">
        {description}
      </p>

      {/* Bottom accent line */}
      <div className="mt-auto pt-4">
        <div className="h-px w-full bg-phosphor/10 transition-all duration-500 group-hover:bg-purple-accent/30" />
      </div>

      {/* Corner accent — Minecraft block-edge feel */}
      <div className="absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-phosphor/30 transition-colors duration-300 group-hover:border-purple-accent/60" />
      <div className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-phosphor/30 transition-colors duration-300 group-hover:border-purple-accent/60" />
    </div>
  );
}
