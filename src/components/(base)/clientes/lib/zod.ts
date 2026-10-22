import { z } from "zod";

export const customerRowSchema = z.object({
  id: z.string().uuid(),
  customer_name: z.string(),
  customer_nit: z.string().nullable(),
  customer_address: z.string().nullable(),
  created_at: z.string(),
});

export type CustomerRow = z.infer<typeof customerRowSchema>;

export const crearCustomerSchema = z.object({
  customer_name: z.string().trim().min(1, "Nombre del cliente requerido"),
  customer_nit: z.string().trim().optional(),
  customer_address: z.string().trim().optional(),
});

export type CrearCustomerInput = z.infer<typeof crearCustomerSchema>;

export type ClienteListRow = {
  id: string;
  nombre: string;
  nit: string | null;
  direccion: string | null;
};
