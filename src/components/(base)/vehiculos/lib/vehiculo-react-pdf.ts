"use client";

type ReactPdfModule = typeof import("react-pdf");

let reactPdfModule: ReactPdfModule | null = null;
let reactPdfModulePromise: Promise<ReactPdfModule> | null = null;

export function getLoadedReactPdf(): ReactPdfModule | null {
  return reactPdfModule;
}

export function loadReactPdf(): Promise<ReactPdfModule> {
  if (reactPdfModule) return Promise.resolve(reactPdfModule);
  if (!reactPdfModulePromise) {
    reactPdfModulePromise = import("react-pdf").then((mod) => {
      mod.pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${mod.pdfjs.version}/build/pdf.worker.min.mjs`;
      reactPdfModule = mod;
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
