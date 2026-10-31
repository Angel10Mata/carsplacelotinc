import { TIMEZONE_GT } from "@/lib/fechas-gt";
import { mapCarToListRow } from "@/components/(base)/vehiculos/lib/helpers";
import type { CustomerRow } from "@/components/(base)/clientes/lib/zod";
import type { CarRow } from "@/components/(base)/vehiculos/lib/zod";
import {
  carImagePathToPublicUrl,
  isCarPdfStoragePath,
} from "@/components/(base)/vehiculos/lib/car-images";
import type { PublicInventoryItem } from "./zod";

export function formatPublicInventoryTitle(
  carTitle: string,
  carModel: string | null | undefined,
): string {
  const title = carTitle.trim();
  const model = carModel?.trim();
  if (!model || model === "—") return title;
  return `${title} ${model}`;
}

export function formatPublicPriceLabel(
  carPrice: number | null | undefined,
  total: number,
): string {
  const amount = carPrice ?? total;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatPublicInvoiceDateLabel(iso: string): string {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE_GT,
    month: "long",
    day: "numeric",
    year: "numeric",
  })
    .format(parsed)
    .toUpperCase()
    .replace(",", "");
}

export function mapCarRowToPublicInventoryItem(
  row: CarRow,
  customer?: CustomerRow | null,
): PublicInventoryItem {
  const imageUrls = row.car_images
    .filter((path) => !isCarPdfStoragePath(path))
    .map((path) => carImagePathToPublicUrl(path));
  const coverImageUrl = imageUrls[0] ?? null;
  const status = row.car_status?.trim().toUpperCase() || "SOLD";

  return {
    id: row.id,
    invoiceNumber: row.invoice_number,
    title: formatPublicInventoryTitle(row.car_title, row.car_model),
    status,
    vin: row.car_vin?.trim() || null,
    priceLabel: formatPublicPriceLabel(row.car_price, row.total),
    invoiceDateLabel: formatPublicInvoiceDateLabel(row.invoice_date),
    coverImageUrl,
    imageUrls,
    invoiceRow: mapCarToListRow(row, customer ?? null),
  };
}
