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
  LayoutDashboard,
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
      {/* ── Mobile Header ── */}
      <div className="fixed top-0 left-0 right-0 z-40 flex h-14 items-center justify-between border-b border-surface-600/60 bg-surface-900/95 backdrop-blur-md px-4 md:hidden">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
            <LayoutDashboard className="h-4 w-4 text-accent" aria-hidden="true" />
          </div>
          <span className="text-sm font-semibold tracking-wide text-text-primary">
            INGENIA BASE
          </span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface-700 hover:text-text-primary"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {/* Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-full min-h-screen flex-col
          border-r border-surface-600/40 bg-surface-950
          transition-transform duration-300 ease-in-out md:translate-x-0
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          ${collapsed ? "md:w-[72px] w-[260px]" : "w-[260px]"}
        `}
      >
        {/* Logo Header */}
        <div className="flex items-center justify-between border-b border-surface-600/30 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 border border-accent/20">
              <LayoutDashboard className="h-5 w-5 text-accent" aria-hidden="true" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <h1 className="text-base font-bold tracking-wide text-text-primary">
                  INGENIA BASE
                </h1>
                <p className="text-xs font-medium tracking-widest text-text-muted uppercase">
                  Plataforma de Conocimiento
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-surface-700 hover:text-text-primary md:hidden"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4 flex flex-1 flex-col gap-0.5 overflow-y-auto overflow-x-hidden px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`
                  group flex items-center gap-3 rounded-lg px-3 py-2.5
                  text-sm font-medium
                  transition-all duration-150
                  ${
                    isActive
                      ? "bg-indigo/10 text-indigo border border-indigo/20"
                      : "border border-transparent text-text-secondary hover:bg-surface-700/60 hover:text-text-primary"
                  }
                `}
              >
                <item.icon
                  className={`h-[18px] w-[18px] transition-colors ${
                    isActive
                      ? "text-indigo"
                      : "text-text-muted group-hover:text-text-primary"
                  }`}
                  aria-hidden="true"
                />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}

          {/* Admin Links */}
          {isAdmin && (
            <>
              <div className="my-3 h-px bg-surface-600/30 mx-1" />
              <p className="px-3 pb-1.5 text-xs font-semibold tracking-widest text-text-muted uppercase">
                Admin
              </p>
              <Link
                href="/admin/subir"
                className={`
                  group flex items-center gap-3 rounded-lg px-3 py-2.5
                  text-sm font-medium
                  transition-all duration-150
                  ${
                    pathname === "/admin/subir"
                      ? "bg-accent/10 text-accent border border-accent/20"
                      : "border border-transparent text-text-secondary hover:bg-surface-700/60 hover:text-accent"
                  }
                `}
              >
                <Upload
                  className={`h-[18px] w-[18px] shrink-0 transition-colors ${
                    pathname === "/admin/subir"
                      ? "text-accent"
                      : "text-text-muted group-hover:text-accent"
                  }`}
                />
                {!collapsed && <span>Subir Archivo</span>}
              </Link>
              <Link
                href="/admin/usuarios"
                className={`
                  group flex items-center gap-3 rounded-lg px-3 py-2.5
                  text-sm font-medium
                  transition-all duration-150
                  ${
                    pathname === "/admin/usuarios"
                      ? "bg-accent/10 text-accent border border-accent/20"
                      : "border border-transparent text-text-secondary hover:bg-surface-700/60 hover:text-accent"
                  }
                `}
              >
                <Users
                  className={`h-[18px] w-[18px] shrink-0 transition-colors ${
                    pathname === "/admin/usuarios"
                      ? "text-accent"
                      : "text-text-muted group-hover:text-accent"
                  }`}
                />
                {!collapsed && <span>Usuarios</span>}
              </Link>
              <Link
                href="/admin/logs"
                className={`
                  group flex items-center gap-3 rounded-lg px-3 py-2.5
                  text-sm font-medium
                  transition-all duration-150
                  ${
                    pathname === "/admin/logs"
                      ? "bg-accent/10 text-accent border border-accent/20"
                      : "border border-transparent text-text-secondary hover:bg-surface-700/60 hover:text-accent"
                  }
                `}
              >
                <Activity
                  className={`h-[18px] w-[18px] shrink-0 transition-colors ${
                    pathname === "/admin/logs"
                      ? "text-accent"
                      : "text-text-muted group-hover:text-accent"
                  }`}
                />
                {!collapsed && <span>Auditoría</span>}
              </Link>
            </>
          )}
        </nav>

        {/* Collapse toggle (Desktop only) */}
        <div className="border-t border-surface-600/30 p-3 hidden md:block">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-surface-600/40
                       px-3 py-2 text-xs font-medium text-text-muted
                       transition-all hover:border-surface-500 hover:bg-surface-800 hover:text-text-secondary"
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
