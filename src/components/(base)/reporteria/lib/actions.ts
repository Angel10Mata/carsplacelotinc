"use server";

import { customerRowSchema, type CustomerRow } from "@/components/(base)/clientes/lib/zod";
import { createClient } from "@/utils/supabase/server";
import { reporteriaVehiculoRowSchema } from "./zod";

export async function listReporteriaVehiculosAction() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false as const, code: "UNAUTHORIZED" };

    const { data, error } = await supabase
      .from("cars")
      .select(
        "id, created_at, invoice_date, invoice_number, car_title, car_model, car_status, car_price, total, customer_id",
      )
      .order("created_at", { ascending: true });

    if (error) {
      console.error("listReporteriaVehiculos:", error.message);
      return { ok: false as const, code: "DB_ERROR" };
    }

    const rawCars = data ?? [];
    const customerIds = [
      ...new Set(
        rawCars
          .map((row) =>
            typeof row.customer_id === "string" ? row.customer_id : null,
          )
          .filter((id): id is string => Boolean(id)),
      ),
    ];

    const customerById = new Map<string, CustomerRow>();
    if (customerIds.length > 0) {
      const { data: customerRows, error: customerError } = await supabase
        .from("customers")
        .select("id, customer_name, customer_nit, customer_address, created_at")
        .in("id", customerIds);

      if (customerError) {
        console.error("listReporteriaVehiculos customers:", customerError.message);
      } else {
        for (const row of customerRows ?? []) {
          const parsed = customerRowSchema.safeParse(row);
          if (parsed.success) customerById.set(parsed.data.id, parsed.data);
        }
      }
    }

    const rows = rawCars
      .map((row) => {
        const customer =
          typeof row.customer_id === "string"
            ? customerById.get(row.customer_id)
            : undefined;
        return reporteriaVehiculoRowSchema.safeParse({
          ...row,
          clienteNombre: customer?.customer_name ?? null,
          clienteNit: customer?.customer_nit ?? null,
        });
      })
      .filter((parsed) => parsed.success)
      .map((parsed) => parsed.data);

    return { ok: true as const, data: rows };
  } catch {
    return { ok: false as const, code: "UNKNOWN" };
  }
}
