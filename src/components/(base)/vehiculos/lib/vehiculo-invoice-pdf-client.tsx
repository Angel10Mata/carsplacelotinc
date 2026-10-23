"use client";

import {
  buildVehiculoFacturaPdfData,
  vehiculoFacturaPdfFileName,
} from "./vehiculo-invoice-data";
import type { VehiculoListRow } from "./zod";

function logoSrcForPdf(): string {
  return `${window.location.origin}/logo.png`;
}

async function renderInvoiceBlob(row: VehiculoListRow): Promise<Blob> {
  const [{ pdf }, { VehiculoFacturaPdfDocument }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("./VehiculoFacturaPdfDocument"),
  ]);
  const data = buildVehiculoFacturaPdfData(row, logoSrcForPdf());
  return pdf(<VehiculoFacturaPdfDocument data={data} />).toBlob();
}

export async function downloadGeneratedInvoicePdf(row: VehiculoListRow) {
  const blob = await renderInvoiceBlob(row);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = vehiculoFacturaPdfFileName(row.placa);
  a.click();
  URL.revokeObjectURL(url);
}

export async function createGeneratedInvoiceBlobUrl(
  row: VehiculoListRow,
): Promise<string> {
  const blob = await renderInvoiceBlob(row);
  return URL.createObjectURL(blob);
}
