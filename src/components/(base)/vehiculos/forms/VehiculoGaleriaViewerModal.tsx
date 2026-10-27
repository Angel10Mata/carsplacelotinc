"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { Copy, FileText, Images } from "lucide-react";
import { Download as DownloadNode } from "lucide";
import { ModalLoadingBody, ModalShell, toast } from "@/components/ui/general-modal";
import { SigetActionButton, sigetAccent } from "@/components/ui/siget-action-button";
import { cn } from "@/lib/utils";
import {
  buildVehiculoPhotoItems,
  resolveVehiculoInvoiceSource,
  type VehiculoInvoiceSource,
} from "../lib/vehiculo-galeria-items";
import { vehiculoFacturaPdfFileName } from "../lib/vehiculo-invoice-data";
import { createGeneratedInvoiceBlobUrl } from "../lib/vehiculo-invoice-pdf-client";
import { loadReactPdf, prefetchInvoicePdfLibs } from "../lib/vehiculo-react-pdf";
import { vehiculosTablaAddOutlineButtonClass } from "../lib/tabla-vehiculos-ui";
import type { VehiculoListRow } from "../lib/zod";

const invoicePdfViewerLoader = () =>
  import("./CarPdfInlineViewer").then((m) => m.CarPdfInlineViewer);

const CarPdfInlineViewer = dynamic(invoicePdfViewerLoader, {
  ssr: false,
  loading: () => <ModalLoadingBody minHeightClass="min-h-[14rem]" />,
});

const galeriaMediaPanelInvoiceClass =
  "relative flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900";

const galeriaPhotosStageClass =
  "relative flex min-h-0 flex-1 flex-col overflow-hidden bg-zinc-50 dark:bg-zinc-950 md:flex-row";

const galeriaPhotosMainClass =
  "relative min-h-[14rem] w-full flex-1 md:min-h-0";

const galeriaPhotosThumbRailClass =
  "flex h-24 w-full shrink-0 flex-row gap-2 overflow-x-auto border-t border-zinc-200/80 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-950 md:h-full md:w-24 md:flex-col md:overflow-x-hidden md:overflow-y-auto md:border-l md:border-t-0";

function InvoicePdfLoading() {
  return <ModalLoadingBody minHeightClass="min-h-[14rem]" className="h-full min-h-0" />;
}


function formatInvoiceDateEn(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d
    .toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "America/Guatemala",
    })
    .toUpperCase()
    .replace(",", "");
}

function formatPrecio(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

function tituloVehiculo(row: VehiculoListRow): string {
  const modelo = row.modelo !== "—" ? row.modelo : "";
  return [row.marca, modelo].filter(Boolean).join(" ").trim() || row.placa;
}

type VehiculoGaleriaViewerModalProps = {
  row: VehiculoListRow | null;
  onClose: () => void;
};

function InvoiceDownloadButton({
  row,
  invoiceSource,
}: {
  row: VehiculoListRow;
  invoiceSource: VehiculoInvoiceSource;
}) {
  const [downloading, setDownloading] = useState(false);

  return (
    <SigetActionButton
      label="Descargar"
      accentColor={sigetAccent.excel}
      morphFrom={DownloadNode}
      morphTo={DownloadNode}
      morphOnHover={false}
      disabled={downloading}
      className="w-auto shrink-0"
      onClick={() => {
        setDownloading(true);
        if (invoiceSource.kind === "uploaded-pdf") {
          const a = document.createElement("a");
          a.href = invoiceSource.url;
          a.download = vehiculoFacturaPdfFileName(row.placa);
          a.rel = "noopener";
          a.target = "_blank";
          a.click();
          setDownloading(false);
          return;
        }
        void import("../lib/vehiculo-invoice-pdf-client")
          .then((m) => m.downloadGeneratedInvoicePdf(row))
          .catch(() => toast.error("No se pudo descargar la factura."))
          .finally(() => setDownloading(false));
      }}
    />
  );
}

function InvoicePanel({
  invoiceSource,
  generatedBlobUrl,
  generatedLoading,
}: {
  invoiceSource: VehiculoInvoiceSource;
  generatedBlobUrl: string | null;
  generatedLoading: boolean;
}) {
  const viewerClassName = "h-full min-h-0 w-full";

  if (invoiceSource.kind === "uploaded-pdf") {
    return <CarPdfInlineViewer url={invoiceSource.url} className={viewerClassName} />;
  }

  if (generatedLoading || !generatedBlobUrl) {
    return <InvoicePdfLoading />;
  }

  return <CarPdfInlineViewer url={generatedBlobUrl} className={viewerClassName} />;
}

export function VehiculoGaleriaViewerModal({
  row,
  onClose,
}: VehiculoGaleriaViewerModalProps) {
  const [selected, setSelected] = useState(0);
  const [viewMode, setViewMode] = useState<"photos" | "invoice">("photos");

  const photoItems = useMemo(
    () => (row ? buildVehiculoPhotoItems(row) : []),
    [row],
  );
  const invoiceSource = useMemo(
    () => (row ? resolveVehiculoInvoiceSource(row) : null),
    [row],
  );
  const [generatedBlobUrl, setGeneratedBlobUrl] = useState<string | null>(null);
  const [generatedLoading, setGeneratedLoading] = useState(false);

  useEffect(() => {
    setSelected(0);
    setViewMode("photos");
  }, [row?.id]);

  useEffect(() => {
    if (!row || !invoiceSource) return;

    prefetchInvoicePdfLibs();
    void loadReactPdf();
    void invoicePdfViewerLoader();

    let active = true;
    let prefetchedUrl: string | null = null;

    const clearGeneratedBlob = () => {
      setGeneratedBlobUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    };

    if (invoiceSource.kind !== "generated-invoice") {
      clearGeneratedBlob();
      setGeneratedLoading(false);
      return () => {
        active = false;
      };
    }

    clearGeneratedBlob();
    setGeneratedLoading(true);

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
        if (active) clearGeneratedBlob();
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
  }, [row, invoiceSource]);

  useEffect(() => {
    if (selected >= photoItems.length) {
      setSelected(Math.max(0, photoItems.length - 1));
    }
  }, [photoItems.length, selected]);

  const open = Boolean(row);
  const activePhoto = photoItems[selected] ?? photoItems[0] ?? null;

  const copyVin = async () => {
    const vin = row?.vin?.trim();
    if (!vin) return;
    try {
      await navigator.clipboard.writeText(vin);
      toast.success("VIN copiado.");
    } catch {
      toast.error("No se pudo copiar el VIN.");
    }
  };

  if (!row || !invoiceSource) return null;

  const precio = formatPrecio(row.precio);
  const titulo = tituloVehiculo(row);
  const estado = row.estado?.trim().toUpperCase();

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title=""
      hideCloseButton
      fullHeight
      maxWidth="max-w-5xl"
      className="md:!h-[90vh] md:!max-h-[90vh]"
      headerClassName="hidden"
      contentClassName="flex min-h-0 flex-1 flex-col overflow-hidden p-0 md:p-0"
    >
      <div className="flex shrink-0 flex-col gap-2 border-b border-zinc-200/80 px-4 py-4 dark:border-zinc-700 md:px-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              {estado ? (
                <span className="rounded-md bg-red-100 px-2 py-0.5 text-red-700 dark:bg-red-950/50 dark:text-red-300">
                  {estado}
                </span>
              ) : null}
              <span>{formatInvoiceDateEn(row.invoiceDate)}</span>
            </div>
            <h2 className="text-lg font-black italic leading-tight text-foreground md:text-xl">
              {titulo}
              {precio ? (
                <span className="ml-2 font-black not-italic text-foreground">
                  {precio}
                </span>
              ) : null}
            </h2>
            {row.vin ? (
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="font-mono text-xs uppercase tracking-wide">
                  VIN: {row.vin}
                </span>
                <button
                  type="button"
                  onClick={() => void copyVin()}
                  className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-zinc-200/80 text-brand transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-brand-bright dark:hover:bg-zinc-800"
                  aria-label="Copiar VIN"
                >
                  <Copy size={14} />
                </button>
              </div>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {viewMode === "invoice" ? (
              <InvoiceDownloadButton
                row={row}
                invoiceSource={invoiceSource}
              />
            ) : (
              <span
                className="inline-flex h-9 min-w-[6.75rem] shrink-0"
                aria-hidden
              />
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-zinc-200/80 text-muted-foreground transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
              aria-label="Cerrar"
            >
              <span className="text-xl leading-none">×</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-0">
        {viewMode === "photos" ? (
          <>
            <div className={galeriaPhotosStageClass}>
              <div className={galeriaPhotosMainClass}>
                {activePhoto ? (
                  <img
                    key={activePhoto.url}
                    src={activePhoto.url}
                    alt=""
                    className="absolute inset-0 size-full object-contain p-4"
                  />
                ) : (
                  <p className="flex h-full min-h-[14rem] items-center justify-center px-6 text-center text-sm font-semibold text-muted-foreground">
                    Sin fotografías. Usa Invoice para ver la factura.
                  </p>
                )}
              </div>

              {photoItems.length > 1 ? (
                <div className={galeriaPhotosThumbRailClass}>
                  {photoItems.map((item, index) => (
                    <button
                      key={`${item.url}-${index}`}
                      type="button"
                      onClick={() => setSelected(index)}
                      className={cn(
                        "relative aspect-square h-full shrink-0 overflow-hidden rounded-xl border-2 transition-all md:h-auto md:w-full",
                        selected === index
                          ? "scale-105 border-brand dark:border-brand-bright"
                          : "border-transparent opacity-40 hover:opacity-100 dark:opacity-30",
                      )}
                    >
                      <img
                        src={item.url}
                        alt=""
                        className="size-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="flex shrink-0 justify-center border-t border-zinc-200/80 px-4 py-4 dark:border-zinc-700 md:px-6">
              <button
                type="button"
                onClick={() => setViewMode("invoice")}
                className={cn(
                  vehiculosTablaAddOutlineButtonClass,
                  "w-[7rem] max-lg:w-full",
                )}
              >
                <FileText className="size-4 shrink-0" strokeWidth={2.25} aria-hidden />
                Invoice
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex min-h-0 w-full flex-1 flex-col gap-3 p-4 md:min-h-0 md:p-6 md:pb-4">
              <div className={galeriaMediaPanelInvoiceClass}>
                <InvoicePanel
                  invoiceSource={invoiceSource}
                  generatedBlobUrl={generatedBlobUrl}
                  generatedLoading={generatedLoading}
                />
              </div>
            </div>

            <div className="flex shrink-0 justify-center border-t border-zinc-200/80 px-4 py-4 dark:border-zinc-700 md:px-6">
              <button
                type="button"
                onClick={() => setViewMode("photos")}
                className={cn(
                  vehiculosTablaAddOutlineButtonClass,
                  "w-[7rem] max-lg:w-full",
                )}
              >
                <Images className="size-4 shrink-0" strokeWidth={2.25} aria-hidden />
                Fotos
              </button>
            </div>
          </>
        )}
      </div>
    </ModalShell>
  );
}
