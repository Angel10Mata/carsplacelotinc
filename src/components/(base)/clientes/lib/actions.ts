"use server";

import { revalidatePath } from "next/cache";
import { APP_BASE_PATH } from "@/lib/app-config";
import { createClient } from "@/utils/supabase/server";
import { crearCustomerSchema, customerRowSchema, type CustomerRow } from "./zod";

function revalidateCustomerPaths() {
  revalidatePath(`${APP_BASE_PATH}/clientes`);
  revalidatePath(`${APP_BASE_PATH}/vehiculos`);
}

export async function listCustomersAction(search?: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false as const, code: "UNAUTHORIZED" };

    const term = search?.trim() ?? "";
    if (term.length > 0 && term.length < 3) {
      return { ok: true as const, data: [] as CustomerRow[] };
    }

    let query = supabase
      .from("customers")
      .select("*")
      .order("customer_name", { ascending: true })
      .limit(term.length >= 3 ? 25 : 500);

    if (term.length >= 3) {
      const pattern = `%${term.replace(/[%_,]/g, "")}%`;
      query = query.or(
        `customer_name.ilike.${pattern},customer_nit.ilike.${pattern}`,
      );
    }

    const { data, error } = await query;
    if (error) {
      console.error("listCustomers:", error.message);
      return { ok: false as const, code: "DB_ERROR" };
    }

    const parsed = (data ?? [])
      .map((row) => customerRowSchema.safeParse(row))
      .filter((r) => r.success)
      .map((r) => r.data);

    return { ok: true as const, data: parsed };
  } catch {
    return { ok: false as const, code: "UNKNOWN" };
  }
}

export async function crearCustomerAction(raw: unknown) {
  const parsed = crearCustomerSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false as const, code: "VALIDATION" };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false as const, code: "UNAUTHORIZED" };

    const payload = {
      customer_name: parsed.data.customer_name,
      customer_nit: parsed.data.customer_nit?.trim() || null,
      customer_address: parsed.data.customer_address?.trim() || null,
    };

    const { data, error } = await supabase
      .from("customers")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      console.error("crearCustomer:", error.message);
      return { ok: false as const, code: "DB_ERROR" };
    }

    const row = customerRowSchema.safeParse(data);
    if (!row.success) {
      return { ok: false as const, code: "DB_ERROR" };
    }

    revalidateCustomerPaths();
    return { ok: true as const, data: row.data };
  } catch {
    return { ok: false as const, code: "UNKNOWN" };
  }
}
