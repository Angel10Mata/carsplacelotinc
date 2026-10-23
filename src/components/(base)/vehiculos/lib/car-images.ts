export const CARS_IMAGE_BUCKET = "cars-images";
export const CARS_INVOICE_BUCKET = "Facturas";

export const CAR_IMAGE_MAX_BYTES = 200 * 1024;
export const CAR_PDF_MAX_BYTES = 10 * 1024 * 1024;

const CAR_MEDIA_PATH_RE = /^([^/]+)\/(\d+)\.(jpg|pdf)$/;

const PUBLIC_BUCKET_MARKERS = [
  CARS_IMAGE_BUCKET,
  CARS_INVOICE_BUCKET,
] as const;

export function carMediaStorageBucketForPath(path: string): string {
  const trimmed = path.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    for (const bucket of PUBLIC_BUCKET_MARKERS) {
      const marker = `/storage/v1/object/public/${bucket}/`;
      if (trimmed.includes(marker)) return bucket;
    }
  }
  if (trimmed.endsWith(".pdf")) return CARS_INVOICE_BUCKET;
  return CARS_IMAGE_BUCKET;
}

function parseCarMediaStoragePath(
  raw: string,
): { folder: string; index: number; ext: "jpg" | "pdf" } | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let path = trimmed;
  if (!CAR_MEDIA_PATH_RE.test(path)) {
    for (const bucket of PUBLIC_BUCKET_MARKERS) {
      const publicMarker = `/storage/v1/object/public/${bucket}/`;
      const markerIdx = trimmed.indexOf(publicMarker);
      if (markerIdx >= 0) {
        path = decodeURIComponent(
          trimmed.slice(markerIdx + publicMarker.length).split("?")[0] ?? "",
        );
        break;
      }
    }
  }

  const match = path.match(CAR_MEDIA_PATH_RE);
  if (!match?.[1] || !match[2] || !match[3]) return null;
  const ext = match[3];
  if (ext !== "jpg" && ext !== "pdf") return null;
  return { folder: match[1], index: Number(match[2]), ext };
}

export function normalizeCarFolderId(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed || trimmed.includes("/")) return null;
  return trimmed;
}

export function isCarPdfStoragePath(path: string): boolean {
  return parseCarMediaStoragePath(path)?.ext === "pdf";
}

export function isValidCarMediaStoragePath(path: string): boolean {
  return CAR_MEDIA_PATH_RE.test(path.trim());
}

/** @deprecated Usar isValidCarMediaStoragePath */
export function isValidCarImageStoragePath(path: string): boolean {
  return /^(\d+)\/(\d+)\.jpg$/.test(path.trim());
}

export function nextCarMediaStoragePath(
  folderId: string,
  existingPaths: string[],
  ext: "jpg" | "pdf",
): string {
  const folder = normalizeCarFolderId(folderId);
  if (!folder) {
    throw new Error("INVALID_FOLDER");
  }
  let maxIndex = 0;
  for (const raw of existingPaths) {
    const parsed = parseCarMediaStoragePath(raw);
    if (parsed?.folder === folder) {
      maxIndex = Math.max(maxIndex, parsed.index);
    }
  }
  return `${folder}/${maxIndex + 1}.${ext}`;
}

export function nextCarImageStoragePath(
  folderId: string,
  existingPaths: string[],
): string {
  return nextCarMediaStoragePath(folderId, existingPaths, "jpg");
}

export function carStoragePathToPublicUrl(path: string): string {
  const trimmed = path.trim();
  if (!trimmed) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return trimmed;
  const bucket = carMediaStorageBucketForPath(trimmed);
  const encoded = trimmed
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${base}/storage/v1/object/public/${bucket}/${encoded}`;
}

export function carImagePathToPublicUrl(path: string): string {
  return carStoragePathToPublicUrl(path);
}

export function carMediaPublicUrlIsPdf(url: string): boolean {
  const path = url.split("?")[0] ?? url;
  return /\.pdf$/i.test(path);
}
