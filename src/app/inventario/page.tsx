import { Suspense } from "react";
import { VerInventarioGrid } from "@/components/(base)/inventario-publico";

export default function InventarioPublicoPage() {
  return (
    <Suspense fallback={null}>
      <VerInventarioGrid />
    </Suspense>
  );
}
