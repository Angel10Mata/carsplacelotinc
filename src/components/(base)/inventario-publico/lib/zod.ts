import { z } from "zod";

export const publicInventoryInvoiceRowSchema = z.object({
  id: z.string().uuid(),
  placa: z.string(),
  vin: z.string().nullable(),
  fotoUrl: z.string().nullable(),
  imageUrls: z.array(z.string()),
  hasUploadedPdf: z.boolean(),
  marca: z.string(),
  modelo: z.string(),
  precio: z.number().nullable(),
  subTotal: z.number(),
  total: z.number(),
  terms: z.string(),
  incoterms: z.string().nullable(),
  estado: z.string().nullable(),
  invoiceDate: z.string(),
  createdAt: z.string().optional().default(""),
  numeroRegistro: z.number().optional().default(0),
  clienteNombre: z.string().nullable(),
  clienteNit: z.string().nullable(),
  clienteDireccion: z.string().nullable(),
});

export const publicInventoryItemSchema = z.object({
  id: z.string().uuid(),
  invoiceNumber: z.string(),
  title: z.string(),
  status: z.string(),
  vin: z.string().nullable(),
  priceLabel: z.string(),
  invoiceDateLabel: z.string(),
  coverImageUrl: z.string().nullable(),
  imageUrls: z.array(z.string()),
  invoiceRow: publicInventoryInvoiceRowSchema,
});

export type PublicInventoryItem = z.infer<typeof publicInventoryItemSchema>;
