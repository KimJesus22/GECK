"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Mail, Lock, ArrowRight, UserPlus, LogIn } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = createBrowserSupabaseClient();

    if (mode === "register") {
      const { error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) {
        setMessage({ text: error.message, type: "error" });
      } else {
        setMessage({
          text: "✅ Cuenta creada exitosamente. Ahora puedes iniciar sesión.",
          type: "success",
        });
        setMode("login");
        setPassword("");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setLoading(false);
      if (error) {
        setMessage({ text: error.message, type: "error" });
      } else {
        setMessage({ text: "✅ Acceso concedido. Redirigiendo...", type: "success" });
        setTimeout(() => router.push("/dashboard"), 1000);
      }
    }
  };

  return (
    <div className="w-full max-w-md px-4">
      {/* Card */}
      <div
        className="rounded-2xl border border-surface-600/40 bg-surface-900 shadow-2xl shadow-black/30"
        style={{ animation: "fade-in-up 0.5s ease-out both" }}
      >
        {/* Header bar */}
        <div className="flex items-center gap-2 border-b border-surface-600/30 px-5 py-3 rounded-t-2xl">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
          <span className="ml-2 text-[10px] font-medium tracking-[0.3em] text-text-muted uppercase">
            {mode === "login" ? "auth://login" : "auth://registro"}
          </span>
        </div>

        {/* Body */}
        <div className="px-6 py-8 sm:px-8 sm:py-10">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20"
              style={{
                animation: "glow-pulse 3s ease-in-out infinite",
              }}
            >
              <LayoutDashboard className="h-8 w-8 text-accent" />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold tracking-wide text-text-primary">
                INGENIA BASE
              </h1>
              <p className="mt-1 text-[10px] font-medium tracking-[0.25em] text-text-muted uppercase">
                Acceso Restringido
              </p>
            </div>
          </div>

          {/* Mode toggle */}
          <div className="mb-6 flex rounded-lg border border-surface-600/40 overflow-hidden">
            <button
              onClick={() => {
                setMode("login");
                setMessage(null);
              }}
              className={`flex flex-1 items-center justify-center gap-2 py-2.5 text-xs font-medium tracking-wider transition-all duration-200 ${
                mode === "login"
                  ? "bg-indigo/10 text-indigo border-r border-indigo/20"
                  : "text-text-muted hover:text-text-secondary border-r border-surface-600/40"
              }`}
            >
              <LogIn className="h-3.5 w-3.5" />
              Iniciar Sesión
            </button>
            <button
              onClick={() => {
                setMode("register");
                setMessage(null);
              }}
              className={`flex flex-1 items-center justify-center gap-2 py-2.5 text-xs font-medium tracking-wider transition-all duration-200 ${
                mode === "register"
                  ? "bg-indigo/10 text-indigo"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              <UserPlus className="h-3.5 w-3.5" />
              Crear Cuenta
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-text-muted uppercase">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@empresa.com"
                  className="w-full rounded-lg border border-surface-600/40 bg-surface-800 py-3 pl-10 pr-4
                             text-sm text-text-primary placeholder:text-text-muted/60
                             outline-none transition-all
                             focus:border-indigo/40 focus:ring-2 focus:ring-indigo/10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-text-muted uppercase">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full rounded-lg border border-surface-600/40 bg-surface-800 py-3 pl-10 pr-4
                             text-sm text-text-primary placeholder:text-text-muted/60
                             outline-none transition-all
                             focus:border-indigo/40 focus:ring-2 focus:ring-indigo/10"
                />
              </div>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`rounded-lg border p-3 text-xs font-medium ${
                  message.type === "success"
                    ? "border-accent/20 bg-accent/5 text-accent"
                    : "border-red-500/30 bg-red-500/5 text-red-400"
                }`}
                style={{ animation: "fade-in-up 0.3s ease-out both" }}
              >
                {message.text}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex items-center justify-center gap-2 rounded-lg border border-indigo/30
                         bg-indigo/10 py-3 text-sm font-semibold tracking-wider
                         text-indigo transition-all duration-200
                         hover:bg-indigo hover:text-white
                         hover:shadow-lg hover:shadow-indigo/20
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo/10 disabled:hover:text-indigo"
            >
              {loading ? (
                <span
                  className="inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                  style={{ animation: "spin 0.6s linear infinite" }}
                />
              ) : (
                <>
                  {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-8 border-t border-surface-600/30 pt-4 text-center">
            <p className="text-[10px] font-medium tracking-wider text-text-muted">
              {mode === "login"
                ? "Solo personal autorizado. Contacta a tu administrador si no tienes cuenta."
                : "Tu cuenta deberá ser aprobada por un administrador."}
            </p>
          </div>
        </div>
      </div>

      {/* Version tag */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <div
          className="h-1.5 w-1.5 rounded-full bg-accent"
          style={{ animation: "glow-pulse 2s ease-in-out infinite" }}
        />
        <span className="text-[10px] font-medium tracking-wider text-text-muted/60">
          INGENIA BASE v1.0.0
        </span>
      </div>
    </div>
  );
}
