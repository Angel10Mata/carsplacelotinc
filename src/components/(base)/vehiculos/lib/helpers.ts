import type { CustomerRow } from "@/components/(base)/clientes/lib/zod";
import type { CarRow, VehiculoListRow } from "./zod";
import { carImagePathToPublicUrl } from "./car-images";

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
  return {
    id: row.id,
    placa: row.invoice_number,
    vin: row.car_vin?.trim() || null,
    fotoUrl: imageUrls[0] ?? null,
    imageUrls,
    marca: row.car_title,
    modelo: row.car_model?.trim() || "—",
    precio: row.car_price ?? row.total ?? null,
    estado: row.car_status,
    invoiceDate: row.invoice_date,
    clienteNombre: customer?.customer_name?.trim() || null,
    clienteNit: customer?.customer_nit?.trim() || null,
  };
}
