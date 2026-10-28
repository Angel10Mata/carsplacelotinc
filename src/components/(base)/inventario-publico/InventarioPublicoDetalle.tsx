"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, Copy, FileText, Images, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  resolveVehiculoInvoiceSource,
  type VehiculoInvoiceSource,
} from "@/components/(base)/vehiculos/lib/vehiculo-galeria-items";
import { createGeneratedInvoiceBlobUrl } from "@/components/(base)/vehiculos/lib/vehiculo-invoice-pdf-client";
import { loadReactPdf, prefetchInvoicePdfLibs } from "@/components/(base)/vehiculos/lib/vehiculo-react-pdf";
import { vehiculosTablaAddOutlineButtonClass } from "@/components/(base)/vehiculos/lib/tabla-vehiculos-ui";
import type { VehiculoListRow } from "@/components/(base)/vehiculos/lib/zod";
import type { PublicInventoryItem } from "./lib/zod";

const invoicePdfViewerLoader = () =>
  import("@/components/(base)/vehiculos/forms/CarPdfInlineViewer").then(
    (m) => m.CarPdfInlineViewer,
  );

const CarPdfInlineViewer = dynamic(invoicePdfViewerLoader, {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-0 w-full flex-1 items-center justify-center">
      <span className="size-8 rounded-full border-2 border-brand/25 border-t-brand animate-spin dark:border-brand-bright/25 dark:border-t-brand-bright" />
    </div>
  ),
});

const inventarioDetalleToggleFooterClass =
  "flex shrink-0 justify-center border-t border-zinc-200/80 px-4 py-4 dark:border-zinc-700 md:px-6";

const inventarioDetalleToggleBtnClass = cn(
  vehiculosTablaAddOutlineButtonClass,
  "w-[7rem] max-lg:w-full",
);

const inventarioDetalleInvoicePanelClass =
  "relative flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900";

const viewFadeTransition = {
  duration: 0.38,
  ease: [0.22, 1, 0.36, 1] as const,
};

type InventarioPublicoDetalleProps = {
  item: PublicInventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
};

function InvoicePanel({
  invoiceSource,
  generatedBlobUrl,
  generatedLoading,
  generatedError,
}: {
  invoiceSource: VehiculoInvoiceSource;
  generatedBlobUrl: string | null;
  generatedLoading: boolean;
  generatedError: boolean;
}) {
  const viewerClassName = "h-full min-h-0 w-full min-w-0 flex-1 rounded-2xl";

  if (invoiceSource.kind === "uploaded-pdf") {
    return <CarPdfInlineViewer url={invoiceSource.url} className={viewerClassName} />;
  }

  if (generatedError) {
    return (
      <p className="flex flex-1 items-center justify-center px-4 py-8 text-center text-sm font-semibold text-destructive">
        No se pudo cargar la factura.
      </p>
    );
  }

  if (generatedLoading || !generatedBlobUrl) {
    return (
      <div className="flex h-full min-h-0 w-full flex-1 items-center justify-center">
        <span className="size-8 rounded-full border-2 border-brand/25 border-t-brand animate-spin dark:border-brand-bright/25 dark:border-t-brand-bright" />
      </div>
    );
  }

  return <CarPdfInlineViewer url={generatedBlobUrl} className={viewerClassName} />;
}

export function InventarioPublicoDetalle({
  item,
  isOpen,
  onClose,
}: InventarioPublicoDetalleProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"photos" | "invoice">("photos");
  const [generatedBlobUrl, setGeneratedBlobUrl] = useState<string | null>(null);
  const [generatedLoading, setGeneratedLoading] = useState(false);
  const [generatedError, setGeneratedError] = useState(false);

  const invoiceRow = item?.invoiceRow as VehiculoListRow | undefined;
  const invoiceSource = useMemo(
    () => (invoiceRow ? resolveVehiculoInvoiceSource(invoiceRow) : null),
    [invoiceRow],
  );
  const invoiceKind = invoiceSource?.kind ?? null;
  const itemId = item?.id ?? null;
  const invoiceRowRef = useRef(invoiceRow);
  invoiceRowRef.current = invoiceRow;

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
    setViewMode("photos");
  }, [itemId]);

  useEffect(() => {
    setIsImageLoading(true);
  }, [activeImage]);

  useEffect(() => {
    const row = invoiceRowRef.current;
    if (!isOpen || !itemId || !row || !invoiceKind) return;

    prefetchInvoicePdfLibs();
    void loadReactPdf();
    void invoicePdfViewerLoader();

    let active = true;
    let prefetchedUrl: string | null = null;

    if (invoiceKind !== "generated-invoice") {
      setGeneratedBlobUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      setGeneratedLoading(false);
      setGeneratedError(false);
      return () => {
        active = false;
      };
    }

    setGeneratedBlobUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setGeneratedLoading(true);
    setGeneratedError(false);

    void createGeneratedInvoiceBlobUrl(row)
      .then((url) => {
        if (!active) {
          URL.revokeObjectURL(url);
          return;
        }
        prefetchedUrl = url;
        setGeneratedBlobUrl(url);
      })
      .catch((err) => {
        console.error("prefetch generated invoice:", err);
        if (active) {
          setGeneratedBlobUrl(null);
          setGeneratedError(true);
        }
      })
      .finally(() => {
        if (active) setGeneratedLoading(false);
      });

    return () => {
      active = false;
      if (prefetchedUrl) URL.revokeObjectURL(prefetchedUrl);
      setGeneratedBlobUrl(null);
      setGeneratedLoading(false);
    };
  }, [isOpen, itemId, invoiceKind]);

  if (!isOpen || !item || !invoiceSource) return null;

  const images = item.imageUrls.length > 0 ? item.imageUrls : [];
  const activeSrc = images[activeImage];
  const showingPhotos = viewMode === "photos";

  const copyVin = () => {
    if (!item.vin) return;
    void navigator.clipboard.writeText(item.vin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusAvailable = item.status === "AVAILABLE";

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center overflow-hidden p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-2xl dark:bg-black/80"
        onClick={onClose}
        aria-hidden
      />

      <div
        className="relative flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-none border-y border-black/10 bg-white shadow-2xl dark:border-white/10 dark:bg-black sm:rounded-lg sm:border"
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
      >
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

        <div className="relative min-h-0 flex-1">
          <motion.div
            className="absolute inset-0 flex flex-col overflow-hidden bg-gray-50 dark:bg-black sm:flex-row"
            initial={false}
            animate={{ opacity: showingPhotos ? 1 : 0 }}
            transition={viewFadeTransition}
            style={{ pointerEvents: showingPhotos ? "auto" : "none" }}
            aria-hidden={!showingPhotos}
          >
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
          </motion.div>

          <motion.div
            className="absolute inset-0 flex flex-col overflow-hidden bg-gray-50 p-4 dark:bg-black sm:p-6"
            initial={false}
            animate={{ opacity: showingPhotos ? 0 : 1 }}
            transition={viewFadeTransition}
            style={{ pointerEvents: showingPhotos ? "none" : "auto" }}
            aria-hidden={showingPhotos}
          >
            <div className={inventarioDetalleInvoicePanelClass}>
              <InvoicePanel
                invoiceSource={invoiceSource}
                generatedBlobUrl={generatedBlobUrl}
                generatedLoading={generatedLoading}
                generatedError={generatedError}
              />
            </div>
          </motion.div>
        </div>

        <div className={inventarioDetalleToggleFooterClass}>
          <button
            type="button"
            onClick={() => setViewMode(showingPhotos ? "invoice" : "photos")}
            className={inventarioDetalleToggleBtnClass}
          >
            {showingPhotos ? (
              <>
                <FileText className="size-4 shrink-0" strokeWidth={2.25} aria-hidden />
                Invoice
              </>
            ) : (
              <>
                <Images className="size-4 shrink-0" strokeWidth={2.25} aria-hidden />
                Fotos
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
