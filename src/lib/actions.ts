"use server";

import { createClient } from "@/lib/supabase";
import { unstable_cache } from "next/cache";
import { revalidatePath } from "next/cache";
import type { Documento } from "@/lib/types";

/**
 * Obtiene todos los documentos desde Supabase con caché de Next.js.
 *
 * - Revalida automáticamente cada 60 segundos (stale-while-revalidate)
 * - Se invalida manualmente al subir o eliminar documentos via revalidateDocumentos()
 */
import { createClient as createBrowserClient } from "@supabase/supabase-js";

export async function getDocumentosCached(): Promise<Documento[]> {
  const supabaseAuth = await createClient();
  const { data: { session } } = await supabaseAuth.auth.getSession();
  
  if (!session) return [];

  return fetchDocumentosCached(session.access_token);
}

const fetchDocumentosCached = unstable_cache(
  async (token: string) => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );
    const { data, error } = await supabase
      .from("documentos")
      .select("*")
      .order("fecha_creacion", { ascending: false });

    if (error) {
      console.error("Error al obtener documentos (cache):", error);
      return [];
    }

    return (data as Documento[]) ?? [];
  },
  ["documentos-list"],
  {
    revalidate: 60,
  }
);

/**
 * Invalida la caché de documentos.
 * Llamar esta función después de subir o eliminar un documento.
 */
export async function revalidateDocumentos() {
  revalidatePath("/dashboard");
  revalidatePath("/manuales");
  revalidatePath("/normativas");
  revalidatePath("/instructivos");
  revalidatePath("/capacitacion");
  revalidatePath("/seguridad");
  revalidatePath("/rrhh");
  revalidatePath("/soporte");
  revalidatePath("/calidad");
  revalidatePath("/legal");
}
