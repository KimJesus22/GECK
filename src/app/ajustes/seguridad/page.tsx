"use client";

import { useState } from "react";
import { Shield, Lock, Eye, EyeOff, KeyRound } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { toast } from "sonner";

export default function SeguridadPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      toast.success("Contraseña actualizada exitosamente ✅");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al actualizar la contraseña."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="text-xs font-semibold tracking-widest text-accent uppercase">
            Seguridad
          </span>
        </div>
        <div
          className="flex items-center gap-4"
          style={{ animation: "fade-in-up 0.5s ease-out both" }}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
            <Shield className="h-7 w-7 text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary lg:text-3xl">
              Seguridad de la Cuenta
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Actualiza tu contraseña para mantener tu cuenta segura.
            </p>
          </div>
        </div>
      </header>

      {/* Password Card */}
      <div
        className="max-w-2xl rounded-2xl border border-surface-600/30 bg-surface-900 shadow-xl shadow-black/10"
        style={{ animation: "fade-in-up 0.5s ease-out 100ms both" }}
      >
        {/* Bar */}
        <div className="flex items-center gap-2 border-b border-surface-600/30 px-5 py-3 rounded-t-2xl">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
          <span className="ml-2 text-xs font-medium tracking-[0.3em] text-text-muted uppercase">
            seguridad://cambiar-contraseña
          </span>
        </div>

        {/* Form */}
        <form
          onSubmit={handleUpdatePassword}
          className="p-5 sm:p-8 flex flex-col gap-6"
        >
          {/* Info Banner */}
          <div className="flex items-start gap-3 rounded-lg border border-indigo/20 bg-indigo/5 p-4">
            <KeyRound className="h-5 w-5 shrink-0 text-indigo mt-0.5" />
            <div>
              <p className="text-sm font-medium text-indigo">
                Cambio de Contraseña
              </p>
              <p className="mt-0.5 text-xs text-text-muted">
                Tu nueva contraseña debe tener al menos 6 caracteres. Este
                cambio se aplicará inmediatamente en tu cuenta.
              </p>
            </div>
          </div>

          {/* New Password */}
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
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wider text-text-muted uppercase">
              Confirmar Nueva Contraseña
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
            {confirmPassword && confirmPassword !== newPassword && (
              <p className="mt-1.5 text-xs text-red-400">
                Las contraseñas no coinciden.
              </p>
            )}
            {confirmPassword && confirmPassword === newPassword && (
              <p className="mt-1.5 text-xs text-accent">
                ✓ Las contraseñas coinciden.
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !newPassword || newPassword !== confirmPassword}
            className="mt-2 flex items-center justify-center gap-2 rounded-lg border border-indigo/30
                       bg-indigo/10 py-3 text-sm font-semibold tracking-wider
                       text-indigo transition-all duration-200
                       hover:bg-indigo hover:text-white
                       hover:shadow-lg hover:shadow-indigo/20
                       disabled:opacity-50 disabled:cursor-not-allowed
                       disabled:hover:bg-indigo/10 disabled:hover:text-indigo"
          >
            {loading ? (
              <span
                className="inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                style={{ animation: "spin 0.6s linear infinite" }}
              />
            ) : (
              <>
                <Shield className="h-4 w-4" />
                Actualizar Contraseña
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer */}
      <footer
        className="mt-8 flex items-center gap-3 border-t border-surface-600/20 pt-6"
        style={{ animation: "fade-in-up 0.5s ease-out 800ms both" }}
      >
        <div className="h-1.5 w-1.5 rounded-full bg-red-400/50" />
        <span className="text-xs font-medium text-text-muted">
          Cambios de seguridad se aplican vía Supabase Auth
        </span>
      </footer>
    </div>
  );
}
