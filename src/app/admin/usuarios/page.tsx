import { redirect } from "next/navigation";
import { Users, Shield, ShieldAlert, CheckCircle2, Ban } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { getPerfilesAdministrador } from "@/lib/admin-actions";
import { Metadata } from "next";
import ClientUserTable from "./ClientUserTable";

export const metadata: Metadata = {
  title: "Gestión de Usuarios",
};

export default async function AdminUsuariosPage() {
  const supabase = await createClient();

  // 1. Verificación de seguridad: Solo admins pueden entrar
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    redirect("/login");
  }

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("rol")
    .eq("id", authData.user.id)
    .single();

  if (perfil?.rol !== "admin") {
    // Si un evaluador intenta entrar, es expulsado al dashboard
    redirect("/dashboard");
  }

  // 2. Obtener lista de usuarios desde la Server Action
  const usuarios = await getPerfilesAdministrador();

  return (
    <div className="mx-auto max-w-7xl animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            <Users className="h-8 w-8 text-indigo" />
            Gestión de Usuarios
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Administra los roles y el acceso a la plataforma de todo el personal.
          </p>
        </div>
      </div>

      {/* Tarjeta con la tabla */}
      <div className="overflow-hidden rounded-2xl border border-surface-600/30 bg-surface-900 shadow-xl shadow-black/20">
        <div className="border-b border-surface-600/30 bg-surface-800/50 px-6 py-5">
          <h2 className="text-base font-semibold tracking-wide text-text-primary">
            Directorio de Personal ({usuarios.length})
          </h2>
        </div>

        <ClientUserTable initialUsuarios={usuarios} currentUserId={authData.user.id} />
      </div>
    </div>
  );
}
