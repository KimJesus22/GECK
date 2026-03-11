"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, EyeOff, Eye, Shield, CheckCircle2 } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";

export default function RecoverPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [success, setSuccess] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      setMessage({ text: "La contraseña debe tener al menos 6 caracteres.", type: "error" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ text: "Las contraseñas no coinciden.", type: "error" });
      return;
    }

    setLoading(true);
    setMessage(null);

    const supabase = createBrowserSupabaseClient();
    
    // Supabase Auth maneja la sesión automáticamente tras el clic en el email link magic
    // Podemos llamar directamente a updateUser()
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setLoading(false);

    if (error) {
      setMessage({ text: error.message, type: "error" });
    } else {
      setSuccess(true);
      // Tras actualizar, desloguear por seguridad, para que el usuario inicie sesión propiamente
      await supabase.auth.signOut();
      
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-950 p-4">
        <div className="w-full max-w-md rounded-2xl border border-emerald-500/20 bg-surface-900 p-8 text-center shadow-2xl shadow-emerald-500/10">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 mb-6">
            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold tracking-wide text-text-primary mb-2">Contraseña Actualizada</h2>
          <p className="text-sm text-text-secondary mb-6">
            Tu contraseña ha sido restablecida con éxito. Ya puedes usar tu nueva clave para acceder a la plataforma.
          </p>
          <div className="flex justify-center">
            <span className="inline-block h-5 w-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="mt-4 text-xs tracking-wider text-text-muted">Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-950 p-4">
      <div
        className="w-full max-w-md rounded-2xl border border-surface-600/40 bg-surface-900 shadow-2xl shadow-black/30"
        style={{ animation: "fade-in-up 0.5s ease-out both" }}
      >
        <div className="flex items-center gap-2 border-b border-surface-600/30 px-5 py-3 rounded-t-2xl">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
          <span className="ml-2 text-xs font-medium tracking-[0.3em] text-text-muted uppercase">
            auth://nueva-contraseña
          </span>
        </div>

        <div className="px-6 py-8 sm:px-8 sm:py-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo/10 border border-indigo/20">
              <Shield className="h-7 w-7 text-indigo" />
            </div>
            <h1 className="text-xl font-bold tracking-wide text-text-primary">
              Restablecer Contraseña
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Por favor, ingresa tu nueva contraseña segura.
            </p>
          </div>

          <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wider text-text-muted uppercase">
                Nueva Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                  className="w-full rounded-lg border border-surface-600/40 bg-surface-800 py-3 pl-10 pr-12
                             text-sm text-text-primary placeholder:text-text-muted/60
                             outline-none transition-all
                             focus:border-indigo/40 focus:ring-2 focus:ring-indigo/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-text-muted
                             transition-colors hover:text-text-primary"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wider text-text-muted uppercase">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite tu contraseña"
                  minLength={6}
                  className={`w-full rounded-lg border bg-surface-800 py-3 pl-10 pr-4
                             text-sm text-text-primary placeholder:text-text-muted/60
                             outline-none transition-all
                             focus:ring-2 focus:ring-indigo/10
                             ${
                               confirmPassword && confirmPassword !== newPassword
                                 ? "border-red-500/40 focus:border-red-500/40"
                                 : confirmPassword && confirmPassword === newPassword
                                 ? "border-accent/40 focus:border-accent/40"
                                 : "border-surface-600/40 focus:border-indigo/40"
                             }`}
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
              disabled={loading || !newPassword || newPassword !== confirmPassword}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-bright disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                "Guardar y Continuar"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
