import imageCompression from "browser-image-compression";

const TARGET_MAX_BYTES = 900 * 1024;

const COMPRESS_ATTEMPTS = [
  { maxSizeMB: 0.18, maxWidthOrHeight: 1280, initialQuality: 0.72 },
  { maxSizeMB: 0.12, maxWidthOrHeight: 1024, initialQuality: 0.65 },
  { maxSizeMB: 0.08, maxWidthOrHeight: 800, initialQuality: 0.55 },
] as const;

export async function compressCarPhotoForStorage(source: File): Promise<File> {
  let best: File = source;

  for (const opts of COMPRESS_ATTEMPTS) {
    const compressed = await imageCompression(source, {
      maxSizeMB: opts.maxSizeMB,
      maxWidthOrHeight: opts.maxWidthOrHeight,
      initialQuality: opts.initialQuality,
      useWebWorker: true,
      fileType: "image/jpeg",
    });

    const jpeg =
      compressed.type === "image/jpeg"
        ? compressed
        : new File(
            [compressed],
            source.name.replace(/\.[^.]+$/, ".jpg") || "photo.jpg",
            { type: "image/jpeg" },
          );

    best = jpeg instanceof File ? jpeg : best;
    if (best.size <= TARGET_MAX_BYTES) return best;
  }

  return best;
}
