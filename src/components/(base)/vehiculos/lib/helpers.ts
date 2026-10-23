import type { CustomerRow } from "@/components/(base)/clientes/lib/zod";
import type { CarRow, VehiculoListRow } from "./zod";
import {
  carImagePathToPublicUrl,
  isCarPdfStoragePath,
} from "./car-images";

export const DEFAULT_CAR_TERMS = "SOLD AS IS, NO WARRANTY";
export const DEFAULT_CAR_INCOTERMS = "FOB";
export const DEFAULT_CAR_STATUS = "SOLD";

export function formatMarcaModeloDisplay(
  title: string,
  model: string | null | undefined,
): string {
  const t = title.trim();
  const m = model?.trim();
  if (!m || m === "—") return t;
  return `${t} / ${m}`;
}

const CAR_STORAGE_FOLDER_MAX_LEN = 120;

export function buildCarStorageFolderName(
  car_title: string,
  car_model?: string | null,
): string | null {
  const title = car_title.trim().replace(/\//g, " ").replace(/\s+/g, " ");
  if (!title) return null;
  const model = car_model?.trim().replace(/\//g, " ").replace(/\s+/g, " ");
  const combined =
    model && model !== "—" ? `${title} ${model}`.replace(/\s+/g, " ").trim() : title;
  const sanitized = combined
    .replace(/[/\\]/g, "")
    .replace(/[\u0000-\u001f]/g, "")
    .trim()
    .slice(0, CAR_STORAGE_FOLDER_MAX_LEN);
  return sanitized || null;
}

export function carStorageFolderFromMarcaModeloInput(
  value: string,
): string | null {
  const { car_title, car_model } = parseMarcaModeloInput(value);
  return buildCarStorageFolderName(car_title, car_model);
}

export function folderFromCarMediaStoragePath(path: string): string | null {
  const trimmed = path.trim();
  const slash = trimmed.indexOf("/");
  if (slash <= 0) return null;
  return trimmed.slice(0, slash);
}

export function parseMarcaModeloInput(value: string): {
  car_title: string;
  car_model?: string;
} {
  const trimmed = value.trim();
  if (!trimmed) return { car_title: "" };
  const sep = trimmed.indexOf("/");
  if (sep === -1) return { car_title: trimmed };
  const marca = trimmed.slice(0, sep).trim();
  const modelo = trimmed.slice(sep + 1).trim();
  if (marca && modelo) return { car_title: marca, car_model: modelo };
  if (marca) return { car_title: marca };
  return { car_title: trimmed };
}

export function mapCarToListRow(
  row: CarRow,
  customer?: CustomerRow | null,
): VehiculoListRow {
  const imageUrls = row.car_images.map((path) =>
    carImagePathToPublicUrl(path),
  );
  const firstImagePath = row.car_images.find((p) => !isCarPdfStoragePath(p));
  const hasUploadedPdf = row.car_images.some((p) => isCarPdfStoragePath(p));
  return {
    id: row.id,
    placa: row.invoice_number,
    vin: row.car_vin?.trim() || null,
    fotoUrl: firstImagePath
      ? carImagePathToPublicUrl(firstImagePath)
      : null,
    imageUrls,
    hasUploadedPdf,
    marca: row.car_title,
    modelo: row.car_model?.trim() || "—",
    precio: row.car_price ?? row.total ?? null,
    subTotal: row.sub_total,
    total: row.total,
    terms: row.terms,
    incoterms: row.incoterms,
    estado: row.car_status,
    invoiceDate: row.invoice_date,
    clienteNombre: customer?.customer_name?.trim() || null,
    clienteNit: customer?.customer_nit?.trim() || null,
    clienteDireccion: customer?.customer_address?.trim() || null,
  };
}
