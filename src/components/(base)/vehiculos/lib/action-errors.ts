export type VehiculoActionErrorCode =
  | "DUPLICATE_INVOICE"
  | "DUPLICATE_CAR_ID"
  | "DUPLICATE";

export class VehiculoActionError extends Error {
  readonly detail?: string;

  constructor(code: string, detail?: string) {
    super(code);
    this.name = "VehiculoActionError";
    this.detail = detail;
  }
}

export function codeFromPgUniqueViolation(error: {
  message?: string;
  details?: string;
}): { code: VehiculoActionErrorCode; detail?: string } {
  const details = error.details ?? "";
  const invoice = details.match(/\(invoice_number\)=\(([^)]+)\)/);
  if (invoice?.[1]) {
    return { code: "DUPLICATE_INVOICE", detail: invoice[1] };
  }
  const carId = details.match(/\(car_id\)=\(([^)]+)\)/);
  if (carId?.[1]) {
    return { code: "DUPLICATE_CAR_ID", detail: carId[1] };
  }
  const msg = (error.message ?? "").toLowerCase();
  if (msg.includes("invoice_number")) {
    return { code: "DUPLICATE_INVOICE" };
  }
  if (msg.includes("car_id")) {
    return { code: "DUPLICATE_CAR_ID" };
  }
  return { code: "DUPLICATE" };
}

export function vehiculoActionErrorMessage(
  code: string,
  fallback: string,
  detail?: string,
): string {
  if (code === "DUPLICATE_INVOICE") {
    if (detail?.trim()) {
      return `Ya hay un vehículo con el número de factura «${detail.trim()}». Búscalo en la tabla (columna No.) o usa otro número.`;
    }
    return "Ya hay un vehículo con ese número de factura. Búscalo en la tabla (columna No.) o usa otro número.";
  }
  if (code === "DUPLICATE_CAR_ID") {
    return "Ese ID de carpeta ya está asignado. Cierra el modal, ábrelo de nuevo y vuelve a subir las fotos.";
  }
  if (code === "DUPLICATE") {
    return "Este registro ya existe (dato duplicado).";
  }
  return fallback;
}
