"use client";

import { useState } from "react";
import { Terminal, Mail, Lock, ArrowRight, UserPlus, LogIn } from "lucide-react";

export default function LoginPage() {
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

    // Placeholder — aquí se conectará con Supabase Auth
    setTimeout(() => {
      setLoading(false);
      if (mode === "register") {
        setMessage({
          text: "Se ha enviado un enlace de confirmación a tu correo.",
          type: "success",
        });
      } else {
        setMessage({
          text: "Verificando credenciales...",
          type: "success",
        });
      }
    }, 1500);
  };

  return (
    <div className="w-full max-w-md px-4">
      {/* Terminal-style card */}
      <div
        className="border border-phosphor/20 bg-terminal-900 shadow-[0_0_40px_rgba(57,255,20,0.05)]"
        style={{ animation: "fade-in-up 0.5s ease-out both" }}
      >
        {/* Header bar — mimics a terminal title bar */}
        <div className="flex items-center gap-2 border-b border-phosphor/10 px-5 py-3">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
          <span className="ml-2 font-mono text-[10px] tracking-[0.3em] text-softgreen-dim/50 uppercase">
            {mode === "login" ? "auth://login" : "auth://registro"}
          </span>
        </div>

        {/* Body */}
        <div className="px-8 py-10">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center border border-phosphor/30 bg-terminal-800"
              style={{
                animation: "glow-pulse 3s ease-in-out infinite",
              }}
            >
              <Terminal className="h-8 w-8 text-phosphor" />
            </div>
            <div className="text-center">
              <h1
                className="font-mono text-xl font-bold tracking-wider text-phosphor"
                style={{
                  textShadow: "0 0 16px rgba(57,255,20,0.35)",
                }}
              >
                INGENIA BASE
              </h1>
              <p className="mt-1 font-mono text-[10px] tracking-[0.25em] text-softgreen-dim/60 uppercase">
                Acceso Restringido
              </p>
            </div>
          </div>

          {/* Mode toggle */}
          <div className="mb-6 flex border border-phosphor/10">
            <button
              onClick={() => {
                setMode("login");
                setMessage(null);
              }}
              className={`flex flex-1 items-center justify-center gap-2 py-2.5 font-mono text-xs tracking-wider transition-all duration-200 ${
                mode === "login"
                  ? "bg-purple-glow text-purple-accent border-r border-purple-accent/20"
                  : "text-softgreen-dim/50 hover:text-softgreen-dim border-r border-phosphor/10"
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
              className={`flex flex-1 items-center justify-center gap-2 py-2.5 font-mono text-xs tracking-wider transition-all duration-200 ${
                mode === "register"
                  ? "bg-purple-glow text-purple-accent"
                  : "text-softgreen-dim/50 hover:text-softgreen-dim"
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
              <label className="mb-1.5 block font-mono text-[10px] tracking-[0.2em] text-softgreen-dim/60 uppercase">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-softgreen-dim/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@empresa.com"
                  className="w-full border border-phosphor/15 bg-terminal-800 py-3 pl-10 pr-4
                             font-mono text-sm text-softgreen placeholder:text-softgreen-dim/30
                             outline-none transition-all
                             focus:border-purple-accent/40 focus:shadow-[0_0_12px_rgba(196,167,231,0.1)]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block font-mono text-[10px] tracking-[0.2em] text-softgreen-dim/60 uppercase">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-softgreen-dim/40" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full border border-phosphor/15 bg-terminal-800 py-3 pl-10 pr-4
                             font-mono text-sm text-softgreen placeholder:text-softgreen-dim/30
                             outline-none transition-all
                             focus:border-purple-accent/40 focus:shadow-[0_0_12px_rgba(196,167,231,0.1)]"
                />
              </div>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`border p-3 font-mono text-xs ${
                  message.type === "success"
                    ? "border-phosphor/20 bg-phosphor-glow text-phosphor-dim"
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
              className="mt-2 flex items-center justify-center gap-2 border border-purple-accent/40
                         bg-purple-accent/10 py-3 font-mono text-sm font-semibold tracking-wider
                         text-purple-accent transition-all duration-200
                         hover:bg-purple-accent hover:text-terminal-900
                         hover:shadow-[0_0_24px_rgba(196,167,231,0.3)]
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-accent/10 disabled:hover:text-purple-accent"
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
          <div className="mt-8 border-t border-phosphor/10 pt-4 text-center">
            <p className="font-mono text-[10px] tracking-wider text-softgreen-dim/40">
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
          className="h-1.5 w-1.5 rounded-full bg-phosphor"
          style={{ animation: "glow-pulse 2s ease-in-out infinite" }}
        />
        <span className="font-mono text-[10px] tracking-wider text-softgreen-dim/30">
          INGENIA BASE v1.0.0
        </span>
      </div>
    </div>
  );
}
