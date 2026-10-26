import { redirect } from "next/navigation";
import { APP_BASE_PATH, PUBLIC_CATALOG_PATH } from "@/lib/app-config";
import { createClient } from "@/utils/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(APP_BASE_PATH);
  }

  redirect(PUBLIC_CATALOG_PATH);
}
