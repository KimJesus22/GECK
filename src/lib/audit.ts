import { createBrowserSupabaseClient } from "./supabase-browser";

export async function logAuditAction(
  accion: string,
  documento_id: string | null = null,
  detalles: any = {}
) {
  try {
    const supabase = createBrowserSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("logs_acceso").insert({
      usuario_id: user.id,
      correo_usuario: user.email || "desconocido",
      accion,
      documento_id,
      detalles,
    });
  } catch (error) {
    console.error("Error al registrar log de auditoría:", error);
  }
}
