export const CARS_IMAGE_BUCKET = "cars-images";

const CAR_IMAGE_PATH_RE = /^(\d+)\/(\d+)\.jpg$/;

function parseCarImageStoragePath(raw: string): { folder: string; index: number } | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let path = trimmed;
  if (!CAR_IMAGE_PATH_RE.test(path)) {
    const publicMarker = `/storage/v1/object/public/${CARS_IMAGE_BUCKET}/`;
    const markerIdx = trimmed.indexOf(publicMarker);
    if (markerIdx >= 0) {
      path = decodeURIComponent(
        trimmed.slice(markerIdx + publicMarker.length).split("?")[0] ?? "",
      );
    }
  }

  const match = path.match(CAR_IMAGE_PATH_RE);
  if (!match?.[1] || !match[2]) return null;
  return { folder: match[1], index: Number(match[2]) };
}

export function normalizeCarFolderId(value: string): string | null {
  const trimmed = value.trim();
  if (!/^\d+$/.test(trimmed)) return null;
  return trimmed;
}

export function isValidCarImageStoragePath(path: string): boolean {
  return CAR_IMAGE_PATH_RE.test(path.trim());
}

export function nextCarImageStoragePath(
  folderId: string,
  existingPaths: string[],
): string {
  const folder = normalizeCarFolderId(folderId);
  if (!folder) {
    throw new Error("INVALID_FOLDER");
  }
  let maxIndex = 0;
  for (const raw of existingPaths) {
    const parsed = parseCarImageStoragePath(raw);
    if (parsed?.folder === folder) {
      maxIndex = Math.max(maxIndex, parsed.index);
    }
  }
  return `${folder}/${maxIndex + 1}.jpg`;
}

export function carImagePathToPublicUrl(path: string): string {
  const trimmed = path.trim();
  if (!trimmed) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return trimmed;
  const encoded = trimmed
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${base}/storage/v1/object/public/${CARS_IMAGE_BUCKET}/${encoded}`;
}
