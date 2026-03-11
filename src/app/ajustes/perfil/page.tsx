"use client";

import { useState, useEffect } from "react";
import { User, Mail, Shield, CheckCircle, Loader2 } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";

export default function PerfilPage() {
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const supabase = createBrowserSupabaseClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setEmail(user.email || "");
          setCreatedAt(
            new Date(user.created_at).toLocaleDateString("es-MX", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })
          );

          const { data } = await supabase
            .from("perfiles")
            .select("rol")
            .eq("id", user.id)
            .single();

          setRol(data?.rol || "evaluador");
        }
      } catch (error) {
        console.error("Error al obtener perfil:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="text-xs font-semibold tracking-widest text-accent uppercase">
            Mi Cuenta
          </span>
        </div>
        <div
          className="flex items-center gap-4"
          style={{ animation: "fade-in-up 0.5s ease-out both" }}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-indigo/20 bg-indigo/10">
            <User className="h-7 w-7 text-indigo" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary lg:text-3xl">
              Perfil de Usuario
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Información de tu cuenta y estado en la plataforma.
            </p>
          </div>
        </div>
      </header>

      {/* Profile Card */}
      <div
        className="max-w-2xl rounded-2xl border border-surface-600/30 bg-surface-900 shadow-xl shadow-black/10"
        style={{ animation: "fade-in-up 0.5s ease-out 100ms both" }}
      >
        {/* Bar */}
        <div className="flex items-center gap-2 border-b border-surface-600/30 px-5 py-3 rounded-t-2xl">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
          <span className="ml-2 text-[10px] font-medium tracking-[0.3em] text-text-muted uppercase">
            perfil://datos-usuario
          </span>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-8 flex flex-col gap-6">
          {/* Email */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-text-muted uppercase">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="email"
                value={email}
                readOnly
                className="w-full rounded-lg border border-surface-600/40 bg-surface-800/60 py-3 pl-10 pr-4
                           text-sm text-text-primary cursor-not-allowed opacity-80 outline-none"
              />
            </div>
          </div>

          {/* Rol */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-text-muted uppercase">
              Rol en la Plataforma
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={rol === "admin" ? "Administrador" : "Evaluador"}
                readOnly
                className="w-full rounded-lg border border-surface-600/40 bg-surface-800/60 py-3 pl-10 pr-4
                           text-sm text-text-primary cursor-not-allowed opacity-80 outline-none"
              />
              <span
                className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase
                  ${
                    rol === "admin"
                      ? "bg-accent/10 text-accent border border-accent/20"
                      : "bg-indigo/10 text-indigo border border-indigo/20"
                  }`}
              >
                {rol}
              </span>
            </div>
          </div>

          {/* Estado */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-text-muted uppercase">
              Estado de Cuenta
            </label>
            <div className="relative">
              <CheckCircle className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent" />
              <input
                type="text"
                value="Activa"
                readOnly
                className="w-full rounded-lg border border-accent/20 bg-accent/5 py-3 pl-10 pr-4
                           text-sm font-medium text-accent cursor-not-allowed outline-none"
              />
            </div>
          </div>

          {/* Fecha de creación */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-text-muted uppercase">
              Cuenta Creada
            </label>
            <input
              type="text"
              value={createdAt}
              readOnly
              className="w-full rounded-lg border border-surface-600/40 bg-surface-800/60 py-3 px-4
                         text-sm text-text-primary cursor-not-allowed opacity-80 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="mt-8 flex items-center gap-3 border-t border-surface-600/20 pt-6"
        style={{ animation: "fade-in-up 0.5s ease-out 800ms both" }}
      >
        <div
          className="h-1.5 w-1.5 rounded-full bg-accent"
          style={{ animation: "glow-pulse 2s ease-in-out infinite" }}
        />
        <span className="text-xs font-medium text-text-muted">
          Datos obtenidos desde Supabase Auth y la tabla de Perfiles
        </span>
      </footer>
    </div>
  );
}
