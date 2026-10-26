"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Minus, Plus, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const ZOOM_MIN = 1;
const ZOOM_MAX = 2.75;
const ZOOM_STEP = 0.25;

import { loadReactPdf } from "../lib/vehiculo-react-pdf";

type ReactPdfModule = typeof import("react-pdf");

type CarPdfInlineViewerProps = {
  url: string;
  className?: string;
};

export function CarPdfInlineViewer({ url, className }: CarPdfInlineViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfLib, setPdfLib] = useState<ReactPdfModule | null>(null);
  const [baseWidth, setBaseWidth] = useState(640);
  const [numPages, setNumPages] = useState(0);
  const [pageAspect, setPageAspect] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    let active = true;
    void loadReactPdf().then((mod) => {
      if (!active) return;
      setPdfLib(mod);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setZoom(1);
    setPageAspect(null);
  }, [url]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w <= 0 || h <= 0) return;
      let fit = w;
      if (pageAspect !== null) {
        fit = Math.min(w, h * pageAspect);
      }
      setBaseWidth(Math.max(200, Math.round(fit)));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [pageAspect]);

  const pageWidth = Math.round(baseWidth * zoom);

  const zoomOut = () =>
    setZoom((z) => Math.max(ZOOM_MIN, Math.round((z - ZOOM_STEP) * 100) / 100));
  const zoomIn = () =>
    setZoom((z) => Math.min(ZOOM_MAX, Math.round((z + ZOOM_STEP) * 100) / 100));

  if (!pdfLib) {
    return (
      <div
        className={cn(
          "flex min-h-[12rem] flex-1 items-center justify-center bg-zinc-100 dark:bg-zinc-900",
          className,
        )}
      >
        <Loader2 className="size-8 animate-spin text-brand dark:text-brand-bright" />
      </div>
    );
  }

  const { Document, Page } = pdfLib;

  return (
    <div
      className={cn(
        "flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-zinc-100 dark:bg-zinc-900",
        className,
      )}
    >
      <div className="flex shrink-0 items-center justify-center gap-2 border-b border-zinc-200/80 bg-zinc-100 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900">
        <button
          type="button"
          onClick={zoomOut}
          disabled={zoom <= ZOOM_MIN}
          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-border bg-white text-brand transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-brand-bright dark:hover:bg-zinc-700"
          aria-label="Reducir zoom"
        >
          <Minus className="size-4" strokeWidth={2.5} />
        </button>
        <span className="min-w-[3.25rem] text-center text-xs font-bold tabular-nums text-foreground">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          onClick={zoomIn}
          disabled={zoom >= ZOOM_MAX}
          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-border bg-white text-brand transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-brand-bright dark:hover:bg-zinc-700"
          aria-label="Ampliar zoom"
        >
          <Plus className="size-4" strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={() => setZoom(1)}
          disabled={zoom === 1}
          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-border bg-white text-brand transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-brand-bright dark:hover:bg-zinc-700"
          aria-label="Restablecer zoom"
        >
          <RotateCcw className="size-3.5" strokeWidth={2.25} />
        </button>
      </div>

      <div
        ref={containerRef}
        className="flex h-full min-h-0 w-full flex-1 flex-col overflow-auto overscroll-contain p-0"
      >
        <Document
          className="flex w-full min-w-0 flex-1 flex-col"
          file={url}
          loading={
            <div className="flex min-h-[12rem] items-center justify-center">
              <Loader2 className="size-8 animate-spin text-brand dark:text-brand-bright" />
            </div>
          }
          error={
            <p className="px-4 py-8 text-center text-sm font-semibold text-destructive">
              No se pudo mostrar el PDF.
            </p>
          }
          onLoadSuccess={({ numPages: total }) => setNumPages(total)}
        >
          {Array.from({ length: numPages }, (_, index) => (
            <Page
              key={`page-${index + 1}`}
              pageNumber={index + 1}
              width={pageWidth}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              onLoadSuccess={(page) => {
                if (index !== 0 || pageAspect !== null) return;
                const viewport = page.getViewport({ scale: 1 });
                if (viewport.height > 0) {
                  setPageAspect(viewport.width / viewport.height);
                }
              }}
              className={cn(
                "mb-2 w-full max-w-none overflow-hidden rounded-none bg-white last:mb-0 [&_canvas]:!block [&_canvas]:!h-auto [&_canvas]:!w-full [&_canvas]:!max-w-full",
                index === 0 && "mb-0",
              )}
            />
          ))}
        </Document>
      </div>
    </div>
  );
}
