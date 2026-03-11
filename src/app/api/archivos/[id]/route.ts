import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Route Handler seguro para servir archivos desde Supabase Storage Privado.
 *
 * Flujo:
 *   1. Verifica sesión activa del usuario (401 si no hay sesión).
 *   2. Consulta la tabla `documentos` para obtener la URL del archivo.
 *   3. Extrae la ruta interna del archivo en el bucket.
 *   4. Genera una URL Firmada (Signed URL) válida por 60 segundos usando `createSignedUrl`.
 *   5. Redirige al navegador del cliente hacia la URL temporal de Supabase.
 *
 * Query params:
 *   - ?download=true  → Se agrega `download: true` a la creación para forzar descarga
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getMimeType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  const mimeTypes: Record<string, string> = {
    pdf: "application/pdf",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    doc: "application/msword",
    mp4: "video/mp4",
    webm: "video/webm",
    mov: "video/quicktime",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
  };
  return mimeTypes[ext] || "application/octet-stream";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // ── 1. Crear cliente Supabase con cookies del request ──
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Seguro de ignorar en Route Handlers de solo lectura
            }
          },
        },
      }
    );

    // ── 2. Verificar sesión activa ──
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "No autorizado. Inicia sesión para acceder a este recurso." },
        { status: 401 }
      );
    }

    // ── 3. Consultar documento en la base de datos ──
    const { data: documento, error: dbError } = await supabase
      .from("documentos")
      .select("id, titulo, url_archivo, tipo_archivo")
      .eq("id", id)
      .single();

    if (dbError || !documento) {
      return NextResponse.json(
        { error: "Documento no encontrado." },
        { status: 404 }
      );
    }

    if (!documento.url_archivo || documento.url_archivo === "#") {
      return NextResponse.json(
        { error: "El documento no tiene un archivo asociado." },
        { status: 404 }
      );
    }

    // ── 4. Extraer ruta interna del bucket ──
    // La URL almacenada tiene el formato:
    //   https://<project>.supabase.co/storage/v1/object/public/archivos/<ruta>
    let filePath: string;

    try {
      const urlObj = new URL(documento.url_archivo);
      const pathParts = urlObj.pathname.split("/public/archivos/");

      if (pathParts.length < 2) {
        throw new Error("Formato de URL no reconocido");
      }

      filePath = decodeURIComponent(pathParts[1]);
    } catch {
      return NextResponse.json(
        { error: "No se pudo resolver la ruta del archivo en el Storage." },
        { status: 500 }
      );
    }

    // ── 5. Generar URL Firmada (Válida por 60s) ──
    const fileName = filePath.split("/").pop() || "archivo";
    const isDownload = request.nextUrl.searchParams.get("download") === "true";

    const { data: signedData, error: signedError } = await supabase.storage
      .from("archivos")
      .createSignedUrl(filePath, 60, {
        download: isDownload ? fileName : undefined,
      });

    if (signedError || !signedData?.signedUrl) {
      console.error("Error generando Signed URL:", signedError);
      return NextResponse.json(
        { error: "Error al generar enlace seguro de acceso." },
        { status: 500 }
      );
    }

    // ── 6. Redirigir al cliente a la URL Segura ──
    return NextResponse.redirect(new URL(signedData.signedUrl));
    
  } catch (error) {
    console.error("Error en Route Handler /api/archivos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
