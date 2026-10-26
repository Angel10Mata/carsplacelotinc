"use server";

import { createClient } from "@/utils/supabase/server";
import { carRowSchema } from "@/components/(base)/vehiculos/lib/zod";
import { mapCarRowToPublicInventoryItem } from "./helpers";
import { publicInventoryItemSchema } from "./zod";

export async function listPublicInventoryAction() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("cars")
      .select("*")
      .order("invoice_date", { ascending: false });

    if (error) {
      console.error("listPublicInventory:", error.message);
      return { ok: false as const, code: "DB_ERROR" };
    }

    const items = (data ?? [])
      .map((row) => {
        const parsedRow = carRowSchema.safeParse(row);
        if (!parsedRow.success) return null;
        return mapCarRowToPublicInventoryItem(parsedRow.data);
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .map((item) => {
        const parsedItem = publicInventoryItemSchema.safeParse(item);
        return parsedItem.success ? parsedItem.data : null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    return { ok: true as const, data: items };
  } catch {
    return { ok: false as const, code: "UNKNOWN" };
  }
}
