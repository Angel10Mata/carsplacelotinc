import { Suspense } from "react";
import { ModuleRouteSuspenseFallback } from "@/components/ui/module-page-loading";
import { VerInventarioGrid } from "@/components/(base)/inventario-publico";

export default function InventarioPublicoPage() {
  return (
    <Suspense fallback={<ModuleRouteSuspenseFallback />}>
      <VerInventarioGrid />
    </Suspense>
  );
}
