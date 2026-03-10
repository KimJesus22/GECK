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
  Scale,
  Activity,
  Menu,
  X,
  Headset,
  BadgeCheck,
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
  { label: "Soporte Técnico", icon: Headset, href: "/soporte" },
  { label: "Calidad", icon: BadgeCheck, href: "/calidad" },
  { label: "Legal y Cumplimiento", icon: Scale, href: "/legal" },
  { label: "Ajustes", icon: Settings, href: "/ajustes" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

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
    <>
      {/* Mobile Header (Only visible on small screens) */}
      <div className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between border-b border-phosphor/20 bg-terminal-900 px-4 md:hidden">
        <div className="flex items-center gap-3">
          <Terminal className="h-5 w-5 text-phosphor" />
          <h1 className="font-mono text-base font-bold tracking-wider text-phosphor text-shadow-glow">
            INGENIA BASE
          </h1>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-softgreen-dim transition-colors hover:text-phosphor"
          aria-label="Abrir menú"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Backdrop (visible only when mobile menu is open) */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Aside */}
      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-full min-h-screen flex-col
          border-r border-phosphor/20 bg-terminal-900
          transition-transform duration-300 ease-in-out md:translate-x-0
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          ${collapsed ? "md:w-[72px] w-[260px]" : "w-[260px]"}
        `}
      >
        {/* Logo / Mobile Close Header */}
        <div className="flex items-center justify-between border-b border-phosphor/10 px-5 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none border border-phosphor/40 bg-terminal-800">
              <Terminal className="h-5 w-5 text-phosphor" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden md:block">
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
          {/* Close button for mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden p-2 text-softgreen-dim transition-colors hover:text-phosphor"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

      {/* Navigation */}
      <nav className="mt-6 flex flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden px-3">
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

        {/* Admin Links */}
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
            <Link
              href="/admin/logs"
              className={`
                group flex items-center gap-3 rounded-none px-3 py-3
                font-mono text-sm tracking-wide
                transition-all duration-200
                ${
                  pathname === "/admin/logs"
                    ? "border border-purple-accent/30 bg-purple-glow text-purple-accent shadow-[0_0_12px_rgba(196,167,231,0.1)]"
                    : "border border-transparent text-purple-accent/60 hover:border-purple-accent/30 hover:bg-terminal-700 hover:text-purple-accent"
                }
              `}
            >
              <Activity
                className={`h-[18px] w-[18px] shrink-0 transition-colors ${
                  pathname === "/admin/logs"
                    ? "text-purple-accent"
                    : "text-purple-accent/60 group-hover:text-purple-accent"
                }`}
              />
              {!collapsed && <span>Auditoría</span>}
            </Link>
          </>
        )}
      </nav>

        {/* Collapse toggle (Desktop only) */}
        <div className="border-t border-phosphor/10 p-3 hidden md:block">
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
    </>
  );
}
