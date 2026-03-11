"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyRound, Mail, ArrowLeft, Send } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";

export default function RecuperarPasswordPage() {
  const [email, setEmail] = useState("");
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
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/recuperar`,
    });

    setLoading(false);

    if (error) {
      setMessage({ text: error.message, type: "error" });
    } else {
      setMessage({
        text: "Te hemos enviado un enlace de recuperación. Revisa tu bandeja de entrada o buzón de spam.",
        type: "success",
      });
      setEmail("");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-950 p-4">
      <div
        className="w-full max-w-md rounded-2xl border border-surface-600/40 bg-surface-900 shadow-2xl shadow-black/30"
        style={{ animation: "fade-in-up 0.5s ease-out both" }}
      >
        {/* Header bar */}
        <div className="flex items-center gap-2 border-b border-surface-600/30 px-5 py-3 rounded-t-2xl">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
          <span className="ml-2 text-xs font-medium tracking-[0.3em] text-text-muted uppercase">
            auth://recuperar-password
          </span>
        </div>

        <div className="px-6 py-8 sm:px-8 sm:py-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo/10 border border-indigo/20">
              <KeyRound className="h-7 w-7 text-indigo" />
            </div>
            <h1 className="text-xl font-bold tracking-wide text-text-primary">
              Recuperar Contraseña
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wider text-text-muted uppercase">
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

            {message && (
              <div
                className={`rounded-lg border p-3 text-sm font-medium ${
                  message.type === "success"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border-red-500/30 bg-red-500/10 text-red-400"
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-bright disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Enviar Enlace Mágico
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-surface-600/30 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-text-muted transition-colors hover:text-text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
