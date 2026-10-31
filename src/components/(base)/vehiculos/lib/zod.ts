import { z } from "zod";

const carImagesSchema = z
  .unknown()
  .transform((val): string[] => {
    if (!Array.isArray(val)) return [];
    return val.filter((item): item is string => typeof item === "string");
  });

export const carRowSchema = z.object({
  id: z.string().uuid(),
  invoice_number: z.string(),
  invoice_date: z.string(),
  has_signed_receipt: z.boolean(),
  customer_id: z.string().uuid().nullable(),
  car_id: z.string().nullable(),
  car_title: z.string(),
  car_status: z.string().nullable(),
  car_model: z.string().nullable(),
  car_vin: z.string().nullable(),
  car_price: z
    .union([z.number(), z.string()])
    .nullable()
    .transform((v) => {
      if (v === null || v === "") return null;
      const n = typeof v === "number" ? v : Number(v);
      return Number.isFinite(n) ? n : null;
    }),
  car_images: carImagesSchema,
  sub_total: z.union([z.number(), z.string()]).transform((v) => Number(v)),
  total: z.union([z.number(), z.string()]).transform((v) => Number(v)),
  terms: z.string(),
  incoterms: z.string().nullable(),
  registered_by: z.string(),
  created_at: z.string(),
});

export type CarRow = z.infer<typeof carRowSchema>;

export const crearCarSchema = z.object({
  invoice_number: z.string().trim().min(1, "Número de factura requerido"),
  invoice_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha de factura inválida"),
  has_signed_receipt: z.boolean(),
  customer_id: z.string().uuid().optional(),
  car_id: z.string().trim().optional(),
  car_title: z.string().trim().min(1, "Título del vehículo requerido"),
  car_model: z.string().trim().optional(),
  car_vin: z.string().trim().optional(),
  car_status: z.string().trim().optional(),
  car_price: z.coerce.number().min(0).optional(),
  car_image_urls: z.array(z.string()).optional(),
  sub_total: z.coerce.number().min(0),
  total: z.coerce.number().min(0),
  terms: z.string().trim().min(1),
  incoterms: z.string().trim().optional(),
});

export type CrearCarInput = z.infer<typeof crearCarSchema>;

export const actualizarCarSchema = crearCarSchema.extend({
  id: z.string().uuid(),
});

export type ActualizarCarInput = z.infer<typeof actualizarCarSchema>;

export type VehiculoListRow = {
  id: string;
  placa: string;
  vin: string | null;
  fotoUrl: string | null;
  imageUrls: string[];
  hasUploadedPdf: boolean;
  marca: string;
  modelo: string;
  precio: number | null;
  subTotal: number;
  total: number;
  terms: string;
  incoterms: string | null;
  estado: string | null;
  invoiceDate: string;
  createdAt: string;
  numeroRegistro: number;
  clienteNombre: string | null;
  clienteNit: string | null;
  clienteDireccion: string | null;
};
