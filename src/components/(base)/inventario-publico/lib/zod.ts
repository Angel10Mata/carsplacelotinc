import { z } from "zod";

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
});

export type PublicInventoryItem = z.infer<typeof publicInventoryItemSchema>;
