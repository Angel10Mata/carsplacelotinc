"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { PUBLIC_CATALOG_PATH } from "@/lib/app-config";

import { revalidatePath } from "next/cache";

// Cerrar sesión
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect(PUBLIC_CATALOG_PATH);
}
