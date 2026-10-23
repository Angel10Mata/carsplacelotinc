import type { CarRow } from "@/components/(base)/vehiculos/lib/zod";
import type { ClienteListRow, ClienteVehiculoItem, CustomerRow } from "./zod";

export function mapCustomerToListRow(row: CustomerRow): ClienteListRow {
  return {
    id: row.id,
    nombre: row.customer_name,
    nit: row.customer_nit?.trim() || null,
    direccion: row.customer_address?.trim() || null,
  };
}

export function mapCarRowToClienteVehiculoItem(row: CarRow): ClienteVehiculoItem {
  return {
    id: row.id,
    placa: row.invoice_number,
    marca: row.car_title,
    modelo: row.car_model?.trim() || "—",
    vin: row.car_vin?.trim() || null,
    estado: row.car_status?.trim() || null,
  };
}
