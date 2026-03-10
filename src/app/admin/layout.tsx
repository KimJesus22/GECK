import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // 1. Verificar si hay un usuario autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Verificar el rol en la tabla perfiles
  const { data: perfil } = await supabase
    .from("perfiles")
    .select("rol")
    .eq("id", user.id)
    .single();

  // 3. Si no es admin, redirigir al dashboard
  if (!perfil || perfil.rol !== "admin") {
    redirect("/dashboard");
  }

  // Si es admin, permitir renderizar las vistas hijas (/admin/*)
  return <>{children}</>;
}
