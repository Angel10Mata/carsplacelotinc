"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Copy } from "lucide-react";
import { ModalShell, toast } from "@/components/ui/general-modal";
import { cn } from "@/lib/utils";
import type { VehiculoListRow } from "../lib/zod";

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
    .toUpperCase();
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

export function VehiculoGaleriaViewerModal({
  row,
  onClose,
}: VehiculoGaleriaViewerModalProps) {
  const [selected, setSelected] = useState(0);
  const thumbListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelected(0);
  }, [row?.id]);

  const urls = row?.imageUrls ?? [];
  const open = Boolean(row && urls.length > 0);
  const activeUrl = urls[selected] ?? urls[0];

  const scrollThumbs = (dir: -1 | 1) => {
    const el = thumbListRef.current;
    if (!el) return;
    el.scrollBy({ top: dir * 72, behavior: "smooth" });
  };

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

  if (!row) return null;

  const precio = formatPrecio(row.precio);
  const titulo = tituloVehiculo(row);
  const estado = row.estado?.trim().toUpperCase();

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title=""
      hideCloseButton
      maxWidth="max-w-4xl"
      headerClassName="hidden"
      contentClassName="flex min-h-0 flex-col overflow-hidden p-0 md:p-0"
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
            <h2 className="text-lg font-black leading-tight text-foreground md:text-xl">
              {titulo}
              {precio ? (
                <span className="ml-2 font-black text-foreground">{precio}</span>
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

      <div className="flex min-h-0 flex-1 flex-col gap-3 p-4 md:min-h-[22rem] md:flex-row md:gap-4 md:p-6">
        <div className="relative flex min-h-[14rem] flex-1 items-center justify-center overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900 md:min-h-[20rem]">
          {activeUrl ? (
            <img
              src={activeUrl}
              alt=""
              className="max-h-[min(70vh,28rem)] w-full object-contain"
            />
          ) : null}
        </div>

        {urls.length > 1 ? (
          <div className="flex shrink-0 flex-row items-stretch gap-2 md:w-[5.25rem] md:flex-col">
            <button
              type="button"
              onClick={() => scrollThumbs(-1)}
              className="hidden size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-zinc-200/80 text-muted-foreground hover:bg-zinc-50 md:flex dark:border-zinc-700 dark:hover:bg-zinc-800"
              aria-label="Miniaturas anteriores"
            >
              <ChevronUp size={18} />
            </button>
            <div
              ref={thumbListRef}
              className="flex flex-1 flex-row gap-2 overflow-x-auto overflow-y-hidden pb-1 md:flex-col md:overflow-x-hidden md:overflow-y-auto md:pb-0"
            >
              {urls.map((url, index) => (
                <button
                  key={`${url}-${index}`}
                  type="button"
                  onClick={() => setSelected(index)}
                  className={cn(
                    "relative size-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors",
                    selected === index
                      ? "border-brand dark:border-brand-bright"
                      : "border-transparent opacity-80 hover:opacity-100",
                  )}
                >
                  <img
                    src={url}
                    alt=""
                    className="size-full object-cover"
                  />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => scrollThumbs(1)}
              className="hidden size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-zinc-200/80 text-muted-foreground hover:bg-zinc-50 md:flex dark:border-zinc-700 dark:hover:bg-zinc-800"
              aria-label="Miniaturas siguientes"
            >
              <ChevronDown size={18} />
            </button>
          </div>
        ) : null}
      </div>
    </ModalShell>
  );
}
