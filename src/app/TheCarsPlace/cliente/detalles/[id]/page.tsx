import { Suspense } from "react";
import { ModuleRouteSuspenseFallback } from "@/components/ui/module-page-loading";
import { VerDetalleCliente } from "@/components/(base)/clientes/VerDetalleCliente";

type ClienteDetallePageProps = {
  params: Promise<{ id: string }>;
};

export default async function ClienteDetallePage({ params }: ClienteDetallePageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<ModuleRouteSuspenseFallback />}>
      <VerDetalleCliente customerId={id} />
    </Suspense>
  );
}
