"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, Copy, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PublicInventoryItem } from "./lib/zod";

type InventarioPublicoDetalleProps = {
  item: PublicInventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
};

export function InventarioPublicoDetalle({
  item,
  isOpen,
  onClose,
}: InventarioPublicoDetalleProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.touchAction = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.touchAction = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    setActiveImage(0);
    setIsImageLoading(true);
  }, [item?.id]);

  useEffect(() => {
    setIsImageLoading(true);
  }, [activeImage]);

  if (!isOpen || !item) return null;

  const images = item.imageUrls.length > 0 ? item.imageUrls : [];
  const activeSrc = images[activeImage];

  const copyVin = () => {
    if (!item.vin) return;
    void navigator.clipboard.writeText(item.vin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusAvailable = item.status === "AVAILABLE";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-2xl dark:bg-black/80"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-none border-y border-black/10 bg-white shadow-2xl dark:border-white/10 dark:bg-black sm:rounded-lg sm:border">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-[100] rounded-full border border-black/10 bg-black/5 p-2 text-black backdrop-blur-md hover:bg-black/10 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 sm:right-6 sm:top-6"
          aria-label="Cerrar"
        >
          <X className="size-5" />
        </button>

        <div className="flex shrink-0 flex-col gap-2 border-b border-black/5 bg-gradient-to-b from-black/[0.01] to-transparent p-6 dark:border-white/5 dark:from-white/[0.03] sm:p-8">
          <div className="flex items-center gap-4">
            <span
              className={cn(
                "rounded px-2 py-0.5 text-[10px] font-black uppercase border",
                statusAvailable
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                  : "border-red-500/20 bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400",
              )}
            >
              {item.status}
            </span>
            <span className="text-sm font-bold uppercase tracking-widest text-black/40 dark:text-white/60">
              {item.invoiceDateLabel}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-baseline gap-4">
              <h2 className="text-lg font-black uppercase italic leading-none tracking-tighter text-black dark:text-white sm:text-xl">
                {item.title}
              </h2>
              <p className="font-mono text-lg font-black tracking-tighter text-primary sm:text-xl">
                {item.priceLabel}
              </p>
            </div>
            {item.vin ? (
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold uppercase tracking-wider text-black/40 dark:text-white/40 sm:text-lg">
                  VIN: {item.vin}
                </span>
                <button
                  type="button"
                  onClick={copyVin}
                  className="p-1 transition-opacity hover:opacity-70"
                  aria-label="Copiar VIN"
                >
                  {copied ? (
                    <Check className="size-4 text-emerald-500" />
                  ) : (
                    <Copy className="size-4 text-black/40 dark:text-white/40" />
                  )}
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-gray-50 dark:bg-black sm:flex-row">
          <div className="relative h-full w-full flex-1">
            {activeSrc ? (
              <Image
                key={`${item.id}-${activeImage}`}
                src={activeSrc}
                alt={item.title}
                fill
                className={cn(
                  "object-contain p-4 transition-all duration-700",
                  isImageLoading
                    ? "scale-95 opacity-0 blur-sm"
                    : "scale-100 opacity-100 blur-0",
                )}
                sizes="(max-width: 768px) 100vw, 80vw"
                priority
                onLoad={() => setIsImageLoading(false)}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm font-semibold text-muted-foreground">
                Sin fotografías
              </div>
            )}
          </div>

          {images.length > 1 ? (
            <div className="flex h-24 w-full shrink-0 gap-2 overflow-x-auto border-t border-black/5 bg-black/[0.02] p-3 dark:border-white/5 dark:bg-white/[0.01] sm:h-full sm:w-24 sm:flex-col sm:overflow-y-auto sm:border-l sm:border-t-0">
              {images.map((img, idx) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActiveImage(idx)}
                  className={cn(
                    "relative aspect-square h-full shrink-0 overflow-hidden rounded-xl border-2 transition-all sm:h-auto sm:w-full",
                    activeImage === idx
                      ? "scale-105 border-primary"
                      : "border-transparent opacity-40 hover:opacity-100 dark:opacity-30",
                  )}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="96px" />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
