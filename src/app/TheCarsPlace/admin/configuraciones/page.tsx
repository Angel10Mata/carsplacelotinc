import { Suspense } from "react";
import { ModuleRouteSuspenseFallback } from "@/components/ui/module-page-loading";
import VerConfiguraciones from "@/components/(base)/(settings)/VerConfiguraciones";

// Configuración de la farmacia
export default function ConfiguracionesPage() {
  return (
    <Suspense fallback={<ModuleRouteSuspenseFallback />}>
      <VerConfiguraciones />
    </Suspense>
  );
}
