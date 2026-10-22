import type { CustomerRow, ClienteListRow } from "./zod";

export function mapCustomerToListRow(row: CustomerRow): ClienteListRow {
  return {
    id: row.id,
    nombre: row.customer_name,
    nit: row.customer_nit?.trim() || null,
    direccion: row.customer_address?.trim() || null,
  };
}
