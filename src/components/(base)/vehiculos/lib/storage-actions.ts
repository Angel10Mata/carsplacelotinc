"use server";

import { mensajeSiServiceRoleKeyInvalida } from "@/lib/supabase-service-role-env";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import {
  CARS_IMAGE_BUCKET,
  isValidCarImageStoragePath,
} from "./car-images";
import { classifyStorageError } from "./storage-messages";

async function requireAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

function storageClient() {
  if (!mensajeSiServiceRoleKeyInvalida()) {
    return createAdminClient();
  }
  return null;
}

export async function uploadCarImageStorageAction(formData: FormData) {
  const user = await requireAuthenticatedUser();
  if (!user) {
    return { ok: false as const, code: "UNAUTHORIZED" as const };
  }

  const file = formData.get("file");
  const path = formData.get("path");
  const replacePath = formData.get("replacePath");

  if (!(file instanceof Blob) || typeof path !== "string" || !path.trim()) {
    return { ok: false as const, code: "VALIDATION" as const };
  }

  if (!isValidCarImageStoragePath(path)) {
    return { ok: false as const, code: "VALIDATION" as const };
  }

  const admin = storageClient();
  const supabase = admin ?? (await createClient());

  const { error: uploadError } = await supabase.storage
    .from(CARS_IMAGE_BUCKET)
    .upload(path.trim(), file, {
      upsert: false,
      contentType: "image/jpeg",
    });

  if (uploadError) {
    console.error("uploadCarImageStorage:", uploadError.message);
    return {
      ok: false as const,
      code: classifyStorageError(uploadError.message),
      detail: uploadError.message,
    };
  }

  if (typeof replacePath === "string" && replacePath.trim()) {
    await supabase.storage
      .from(CARS_IMAGE_BUCKET)
      .remove([replacePath.trim()]);
  }

  return { ok: true as const, path: path.trim() };
}

export async function removeCarImageStorageAction(path: string) {
  const user = await requireAuthenticatedUser();
  if (!user) {
    return { ok: false as const, code: "UNAUTHORIZED" as const };
  }

  const trimmed = path.trim();
  if (!trimmed || /^https?:\/\//i.test(trimmed)) {
    return { ok: true as const };
  }

  const admin = storageClient();
  const supabase = admin ?? (await createClient());

  const { error } = await supabase.storage
    .from(CARS_IMAGE_BUCKET)
    .remove([trimmed]);

  if (error) {
    console.error("removeCarImageStorage:", error.message);
    return { ok: false as const, code: "STORAGE_ERROR" as const };
  }

  return { ok: true as const };
}
