"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "@/components/ui/general-modal";
import { cn } from "@/lib/utils";
import {
  carImagePathToPublicUrl,
  nextCarImageStoragePath,
} from "../lib/car-images";
import { compressCarPhotoForStorage } from "../lib/compress-car-photo";
import { carStorageErrorMessage } from "../lib/storage-messages";
import {
  removeCarImageStorageAction,
  uploadCarImageStorageAction,
} from "../lib/storage-actions";

const TILE_CLASS =
  "relative size-[7.75rem] shrink-0 overflow-hidden rounded-2xl sm:size-32";

type VehiculoFotosGaleriaProps = {
  storageFolderId: string | null;
  paths: string[];
  onChange: (paths: string[]) => void;
  onBusyChange?: (busy: boolean) => void;
  maxPhotos?: number;
};

export function VehiculoFotosGaleria({
  storageFolderId,
  paths,
  onChange,
  onBusyChange,
  maxPhotos,
}: VehiculoFotosGaleriaProps) {
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragDepthRef = useRef(0);
  const canAdd = maxPhotos === undefined || paths.length < maxPhotos;

  const acceptImageFile = (file: File) => {
    if (!canAdd) {
      toast.warn("Límite de fotografías alcanzado.");
      return;
    }
    if (!storageFolderId) {
      toast.warn("Aún no hay carpeta de vehículo asignada.");
      return;
    }
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.warn("Solo JPG, PNG o WebP.");
      return;
    }
    void uploadFile(file);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    if (!canAdd || uploading || !storageFolderId) return;
    if (!e.dataTransfer.types.includes("Files")) return;
    e.preventDefault();
    dragDepthRef.current += 1;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.dataTransfer.types.includes("Files")) return;
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
    if (dragDepthRef.current === 0) setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!canAdd || uploading || !storageFolderId) return;
    if (!e.dataTransfer.types.includes("Files")) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragDepthRef.current = 0;
    setIsDragging(false);
    if (!canAdd || uploading || !storageFolderId) return;
    const files = e.dataTransfer.files;
    if (!files?.length) return;
    const imageFile = Array.from(files).find((f) =>
      ["image/jpeg", "image/png", "image/webp"].includes(f.type),
    );
    if (!imageFile) {
      toast.warn("Solo JPG, PNG o WebP.");
      return;
    }
    acceptImageFile(imageFile);
  };

  useEffect(() => {
    onBusyChange?.(uploading);
  }, [uploading, onBusyChange]);

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    acceptImageFile(file);
  };

  const uploadFile = async (sourceFile: File) => {
    setUploading(true);
    try {
      const jpegBlob = await compressCarPhotoForStorage(sourceFile);

      if (!storageFolderId) return;
      const newPath = nextCarImageStoragePath(storageFolderId, paths);
      const formData = new FormData();
      formData.append("file", jpegBlob);
      formData.append("path", newPath);

      const result = await uploadCarImageStorageAction(formData);
      if (!result.ok) {
        let msg = carStorageErrorMessage(
          result.code,
          "detail" in result ? result.detail : undefined,
        );
        if (result.code === "STORAGE_SIZE") {
          const kb = Math.round(jpegBlob.size / 1024);
          msg = `${msg} (archivo comprimido: ${kb} KB)`;
        }
        toast.error(msg);
        return;
      }

      onChange([...paths, result.path]);
    } catch (err) {
      console.error(err);
      toast.error("Error al subir la imagen.");
    } finally {
      setUploading(false);
    }
  };

  const removeAt = async (index: number) => {
    const path = paths[index];
    if (!path) return;
    const result = await removeCarImageStorageAction(path);
    if (!result.ok) {
      toast.error(
        carStorageErrorMessage(
          result.code,
          "detail" in result ? result.detail : undefined,
        ),
      );
      return;
    }
    onChange(paths.filter((_, i) => i !== index));
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileSelected}
      />
      <div
        className="flex flex-wrap items-start gap-3"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {paths.map((path, index) => (
          <div key={path} className={cn(TILE_CLASS, "bg-zinc-100 dark:bg-zinc-800")}>
            <img
              src={carImagePathToPublicUrl(path)}
              alt=""
              className="size-full object-cover"
            />
            {index === 0 ? (
              <span className="pointer-events-none absolute bottom-1.5 left-1.5 rounded-md bg-black/55 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                Principal
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => void removeAt(index)}
              disabled={uploading}
              className="absolute right-1.5 top-1.5 flex size-7 cursor-pointer items-center justify-center rounded-full bg-red-100 text-red-600 shadow-sm transition-colors hover:bg-red-200 disabled:opacity-50 dark:bg-red-950/80 dark:text-red-300 dark:hover:bg-red-900"
              aria-label="Quitar fotografía"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>
        ))}

        {canAdd ? (
          <button
            type="button"
            disabled={uploading || !storageFolderId}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              TILE_CLASS,
              "flex flex-col items-center justify-center gap-1.5 border-2 border-dashed border-brand/25 bg-brand/5 text-brand transition-colors hover:border-brand/40 hover:bg-brand/10 disabled:opacity-60 dark:border-brand-bright/30 dark:bg-brand-bright/5 dark:text-brand-bright dark:hover:bg-brand-bright/10",
              isDragging &&
                canAdd &&
                storageFolderId &&
                !uploading &&
                "border-brand bg-brand/15 ring-2 ring-brand/30 dark:border-brand-bright dark:bg-brand-bright/15 dark:ring-brand-bright/30",
            )}
          >
            {uploading ? (
              <Loader2 size={28} className="animate-spin" />
            ) : (
              <>
                <Plus size={28} strokeWidth={2.25} />
                <span className="text-center text-[11px] font-black uppercase leading-tight tracking-wider">
                  {isDragging && canAdd && storageFolderId ? "Soltar" : "Añadir"}
                </span>
              </>
            )}
          </button>
        ) : null}
      </div>
    </>
  );
}

export async function removeCarImageFromStorage(path: string | null) {
  if (!path || /^https?:\/\//i.test(path)) return;
  await removeCarImageStorageAction(path);
}
