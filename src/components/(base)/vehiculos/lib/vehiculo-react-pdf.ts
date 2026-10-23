"use client";

type ReactPdfModule = typeof import("react-pdf");

let reactPdfModulePromise: Promise<ReactPdfModule> | null = null;

export function loadReactPdf(): Promise<ReactPdfModule> {
  if (!reactPdfModulePromise) {
    reactPdfModulePromise = import("react-pdf").then((mod) => {
      mod.pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${mod.pdfjs.version}/build/pdf.worker.min.mjs`;
      return mod;
    });
  }
  return reactPdfModulePromise;
}

export function prefetchInvoicePdfLibs(): void {
  void loadReactPdf();
  void import("@react-pdf/renderer");
  void import("./VehiculoFacturaPdfDocument");
}
