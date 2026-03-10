"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import {
  Home,
  BookOpen,
  ShieldCheck,
  Settings,
  Terminal,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  GraduationCap,
  HardHat,
  Users,
  Upload,
} from "lucide-react";

const navItems = [
  { label: "Inicio", icon: Home, href: "/dashboard" },
  { label: "Manuales", icon: BookOpen, href: "/manuales" },
  { label: "Normativas", icon: ShieldCheck, href: "/normativas" },
  { label: "Instructivos", icon: ClipboardList, href: "/instructivos" },
  { label: "Capacitación", icon: GraduationCap, href: "/capacitacion" },
  { label: "Seguridad Industrial", icon: HardHat, href: "/seguridad" },
  { label: "Recursos Humanos", icon: Users, href: "/rrhh" },
  { label: "Ajustes", icon: Settings, href: "/ajustes" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkRole() {
      try {
        const supabase = createBrowserSupabaseClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data } = await supabase
            .from("perfiles")
            .select("rol")
            .eq("id", user.id)
            .single();

          if (data?.rol === "admin") {
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.error("Error al verificar rol:", error);
      }
    }
    checkRole();
  }, []);

  return (
    <aside
      className={`
        fixed left-0 top-0 z-40 flex h-screen flex-col
        border-r border-phosphor/20 bg-terminal-900
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-[72px]" : "w-[260px]"}
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-phosphor/10 px-5 py-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none border border-phosphor/40 bg-terminal-800">
          <Terminal className="h-5 w-5 text-phosphor" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1
              className="font-mono text-lg font-bold tracking-wider text-phosphor"
              style={{
                textShadow: "0 0 12px rgba(57,255,20,0.4)",
              }}
            >
              INGENIA BASE
            </h1>
            <p className="text-[10px] leading-tight tracking-widest text-softgreen-dim">
              PLATAFORMA DE CONOCIMIENTO
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex flex-1 flex-col gap-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`
                group flex items-center gap-3 rounded-none px-3 py-3
                font-mono text-sm tracking-wide
                transition-all duration-200
                ${
                  isActive
                    ? "border border-purple-accent/30 bg-purple-glow text-purple-accent shadow-[0_0_12px_rgba(196,167,231,0.1)]"
                    : "border border-transparent text-softgreen-dim hover:border-phosphor/15 hover:bg-terminal-700 hover:text-softgreen"
                }
              `}
            >
              <item.icon
                className={`h-[18px] w-[18px] shrink-0 transition-colors ${
                  isActive
                    ? "text-purple-accent"
                    : "text-softgreen-dim group-hover:text-phosphor"
                }`}
              />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}

        {/* Enlace estricto de administrador */}
        {isAdmin && (
          <>
            <div className="my-2 h-px bg-phosphor/10 px-3" />
            <Link
              href="/admin/subir"
              className={`
                group flex items-center gap-3 rounded-none px-3 py-3
                font-mono text-sm tracking-wide
                transition-all duration-200
                ${
                  pathname === "/admin/subir"
                    ? "border border-purple-accent/30 bg-purple-glow text-purple-accent shadow-[0_0_12px_rgba(196,167,231,0.1)]"
                    : "border border-transparent text-purple-accent/60 hover:border-purple-accent/30 hover:bg-terminal-700 hover:text-purple-accent"
                }
              `}
            >
              <Upload
                className={`h-[18px] w-[18px] shrink-0 transition-colors ${
                  pathname === "/admin/subir"
                    ? "text-purple-accent"
                    : "text-purple-accent/60 group-hover:text-purple-accent"
                }`}
              />
              {!collapsed && <span>Subir Archivo</span>}
            </Link>
          </>
        )}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-phosphor/10 p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center gap-2 rounded-none border border-terminal-500
                     px-3 py-2 font-mono text-xs text-softgreen-dim
                     transition-all hover:border-phosphor/30 hover:text-softgreen"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Colapsar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
