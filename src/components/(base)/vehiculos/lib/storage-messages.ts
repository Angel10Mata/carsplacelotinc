import { mensajeSiServiceRoleKeyInvalida } from "@/lib/supabase-service-role-env";

export function classifyStorageError(message: string) {
  const m = message.toLowerCase();
  if (m.includes("row-level security") || m.includes("violates policy")) {
    return "STORAGE_RLS" as const;
  }
  if (m.includes("bucket not found") || m.includes("bucket_id")) {
    return "STORAGE_BUCKET" as const;
  }
  if (m.includes("already exists") || m.includes("duplicate")) {
    return "STORAGE_DUPLICATE" as const;
  }
  if (
    m.includes("maximum allowed size") ||
    m.includes("payload too large") ||
    m.includes("file size limit")
  ) {
    return "STORAGE_SIZE" as const;
  }
  return "STORAGE_ERROR" as const;
}

export function carStorageErrorMessage(
  code: string,
  detail?: string | null,
): string {
  if (code === "STORAGE_RLS") {
    return "Storage sin permisos. En Supabase → SQL Editor ejecuta db/storage-cars.sql.";
  }
  if (code === "STORAGE_BUCKET") {
    return "No existe el bucket «cars-images» o «Facturas». Ejecuta db/storage-cars.sql en Supabase.";
  }
  if (code === "STORAGE_DUPLICATE") {
    return "Esa ruta ya tiene una foto (p. ej. 1/1.jpg). Quita una miniatura o usa otra carpeta.";
  }
  if (code === "STORAGE_SIZE") {
    return "El archivo supera el límite del bucket (fotos 200 KB en cars-images, PDF 10 MB en Facturas).";
  }
  if (code === "UNAUTHORIZED") {
    return "Inicia sesión para subir imágenes.";
  }
  if (code === "VALIDATION") {
    return "Ruta de imagen inválida. Vuelve al paso 1 y pulsa Siguiente otra vez.";
  }
  if (code === "SERVICE_ROLE_CONFIG") {
    return (
      mensajeSiServiceRoleKeyInvalida() ??
      "Revisa SUPABASE_SERVICE_ROLE_KEY en .env.local."
    );
  }
  if (detail?.trim()) {
    return `Storage: ${detail.trim()}`;
  }
  return "No se pudo subir a Storage. Revisa bucket cars-images, políticas RLS y la service role en .env.local.";
}
