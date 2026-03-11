"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Mail, Lock, ArrowRight, UserPlus, LogIn, Smartphone } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register" | "mfa">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (mode === "mfa" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [mode]);

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
    } else if (mode === "mfa") {
      // 1. Obtener los factores vinculados
      const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
      
      if (factorsError) {
        setLoading(false);
        setMessage({ text: "Error recuperando métodos MFA.", type: "error" });
        return;
      }

      const totpFactor = factorsData.all.find(f => f.factor_type === 'totp' && f.status === 'verified');
      
      if (!totpFactor) {
        setLoading(false);
        setMessage({ text: "No se encontró un factor MFA válido.", type: "error" });
        setMode("login");
        return;
      }

      // 2. Desafío de Verificación
      const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId: totpFactor.id,
        code: mfaCode,
      });

      setLoading(false);

      if (error) {
        setMessage({ text: "Código incorrecto o expirado.", type: "error" });
      } else {
        setMessage({ text: "✅ Identidad verificada. Redirigiendo...", type: "success" });
        setTimeout(() => router.push("/dashboard"), 1000);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        setLoading(false);
        setMessage({ text: error.message, type: "error" });
      } else {
        // Consultar si requiere MFA
        const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        
        setLoading(false);

        // aal2 significa que el usuario configuró MFA y se requiere el PIN para elevar la sesión
        if (aalData?.nextLevel === 'aal2' && aalData?.currentLevel === 'aal1') {
          setMode("mfa");
          setMessage({ text: "Ingresa tu código de doble factor para continuar.", type: "success" });
        } else {
          setMessage({ text: "✅ Acceso concedido. Redirigiendo...", type: "success" });
          setTimeout(() => router.push("/dashboard"), 1000);
        }
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
          <span className="ml-2 text-xs font-medium tracking-[0.3em] text-text-muted uppercase">
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
              <p className="mt-1 text-xs font-medium tracking-[0.25em] text-text-muted uppercase">
                Acceso Restringido
              </p>
            </div>
          </div>

          {/* Mode toggle - Oculto durante MFA */}
          {mode !== "mfa" && (
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
                Crea tu cuenta
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {mode === "mfa" ? (
              /* --- VISTA MFA --- */
              <div className="flex flex-col items-center">
                <div className="mb-6 rounded-full bg-indigo/10 p-4 border border-indigo/20">
                  <Smartphone className="h-8 w-8 text-indigo" />
                </div>
                <h2 className="text-xl font-bold text-text-primary mb-2">Doble Factor de Autenticación</h2>
                <p className="text-sm text-text-secondary text-center mb-6">
                  Hemos detectado que tienes 2FA activado. Abre tu aplicación autenticadora y genera un código.
                </p>
                <input
                  ref={inputRef}
                  type="text"
                  maxLength={6}
                  required
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full max-w-[200px] text-center text-3xl tracking-[0.3em] font-medium rounded-lg border border-surface-600/40 bg-surface-800 py-4
                             text-text-primary placeholder:text-text-muted/30
                             outline-none transition-all focus:border-indigo/40 focus:ring-2 focus:ring-indigo/10 mb-2"
                />
                
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setPassword("");
                    setMfaCode("");
                    setMessage(null);
                    // Cerramos la sesión parcial AAL1
                    createBrowserSupabaseClient().auth.signOut();
                  }}
                  className="mt-4 text-xs font-medium text-text-muted transition-colors hover:text-text-primary"
                >
                  Cancelar e iniciar con otra cuenta
                </button>
              </div>
            ) : (
              /* --- VISTA LOGIN / REGISTER --- */
              <>
                {/* Email */}
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

                {/* Password */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold tracking-wider text-text-muted uppercase">
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
                  {mode === "login" && (
                    <div className="mt-2 flex justify-end">
                      <Link 
                        href="/recuperar-password" 
                        className="text-xs font-semibold text-indigo transition-colors hover:text-indigo-bright"
                      >
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}

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
                  {mode === "mfa" ? "Verificar Código" : mode === "login" ? "Iniciar Sesión" : "Crea tu cuenta"}
                  {mode !== "mfa" && <ArrowRight className="h-4 w-4" />}
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-8 border-t border-surface-600/30 pt-4 text-center">
            <p className="text-xs font-medium tracking-wider text-text-muted">
              {mode === "mfa" 
                ? "La seguridad de tu cuenta está reforzada con TOTP."
                : mode === "login"
                ? "Solo personal autorizado. Contacta a tu administrador si no tienes cuenta."
                : "Acceso instantáneo. No se requiere aprobación previa."}
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
        <span className="text-xs font-medium tracking-wider text-text-muted/60">
          INGENIA BASE v1.0.0
        </span>
      </div>
    </div>
  );
}
