import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const envPath = path.join(root, ".env.local");
const sqlPath = path.join(root, "db", "storage-cars.sql");

function loadEnv(file) {
  if (!fs.existsSync(file)) return {};
  return Object.fromEntries(
    fs
      .readFileSync(file, "utf8")
      .split(/\r?\n/)
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const i = line.indexOf("=");
        return [line.slice(0, i), line.slice(i + 1)];
      }),
  );
}

const env = loadEnv(envPath);
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url) {
  console.error("Falta NEXT_PUBLIC_SUPABASE_URL en .env.local");
  process.exit(1);
}

console.log("Bucket requerido: cars-images");
console.log("");
console.log(
  "La forma más fiable es ejecutar el SQL en el panel de Supabase:",
);
console.log("  Dashboard → SQL Editor → New query");
console.log("");
console.log(fs.readFileSync(sqlPath, "utf8"));
console.log("");

if (!serviceKey || serviceKey.startsWith("sb_publishable_")) {
  console.warn(
    "SUPABASE_SERVICE_ROLE_KEY no parece la service role (JWT largo).",
  );
  console.warn(
    "Obtén la clave en Project Settings → API → service_role y vuelve a intentar, o usa solo el SQL de arriba.",
  );
  process.exit(0);
}

const base = url.replace(/\/$/, "");
const headers = {
  Authorization: `Bearer ${serviceKey}`,
  apikey: serviceKey,
  "Content-Type": "application/json",
};
const bucketBody = {
  id: "cars-images",
  name: "cars-images",
  public: true,
  file_size_limit: 5242880,
};

const res = await fetch(`${base}/storage/v1/bucket`, {
  method: "POST",
  headers,
  body: JSON.stringify(bucketBody),
});

const body = await res.text();
if (res.ok) {
  console.log(
    "Bucket cars-images creado (límite 5 MB). Ejecuta las políticas RLS del SQL en el editor.",
  );
  process.exit(0);
}

if (body.includes("already exists") || body.includes("Duplicate")) {
  const patch = await fetch(`${base}/storage/v1/bucket/cars-images`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      public: true,
      file_size_limit: 5242880,
    }),
  });
  const patchBody = await patch.text();
  if (patch.ok) {
    console.log(
      "Bucket cars-images actualizado: público y límite 5 MB. Ejecuta db/storage-cars.sql para las políticas RLS.",
    );
    process.exit(0);
  }
  console.warn("No se pudo actualizar el límite por API:", patch.status, patchBody);
  console.log(
    "Ejecuta db/storage-cars.sql en Supabase SQL Editor (actualiza file_size_limit).",
  );
  process.exit(0);
}

console.error("No se pudo crear el bucket por API:", res.status, body);
console.error("Ejecuta db/storage-cars.sql en Supabase SQL Editor.");
