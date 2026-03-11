"use server";

import { createClient } from "./supabase";
import { revalidatePath } from "next/cache";
import { Perfil } from "./types";

/**
 * Obtiene todos los perfiles de usuarios. Sólo accesible para administradores.
 */
export async function getPerfilesAdministrador(): Promise<Perfil[]> {
  const supabase = await createClient();

  // Validar rol de admin
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return [];

  const { data: checkAdmin } = await supabase
    .from("perfiles")
    .select("rol")
    .eq("id", authData.user.id)
    .single();

  if (checkAdmin?.rol !== "admin") {
    throw new Error("No tienes permisos para realizar esta acción.");
  }

  // Obtener todos los perfiles
  const { data, error } = await supabase
    .from("perfiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error obteniendo usuarios:", error);
    return [];
  }

  return data as Perfil[];
}

/**
 * Cambia el rol de un usuario específico.
 */
export async function actualizarRolUsuario(userId: string, nuevoRol: "admin" | "evaluador") {
  const supabase = await createClient();

  const { error } = await supabase
    .from("perfiles")
    .update({ rol: nuevoRol })
    .eq("id", userId);

  if (error) {
    throw new Error(`Error actualizando rol: ${error.message}`);
  }

  revalidatePath("/admin/usuarios");
  return { success: true };
}

/**
 * Cambia el estado de un usuario (activo o inactivo).
 */
export async function actualizarEstadoUsuario(userId: string, nuevoEstado: "activo" | "inactivo") {
  const supabase = await createClient();

  const { error } = await supabase
    .from("perfiles")
    .update({ estado: nuevoEstado })
    .eq("id", userId);

  if (error) {
    throw new Error(`Error actualizando estado: ${error.message}`);
  }

  revalidatePath("/admin/usuarios");
  return { success: true };
}
