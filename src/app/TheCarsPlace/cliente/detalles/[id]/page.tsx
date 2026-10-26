import { Suspense } from "react";
import { VerDetalleCliente } from "@/components/(base)/clientes/VerDetalleCliente";

type ClienteDetallePageProps = {
  params: Promise<{ id: string }>;
};

export default async function ClienteDetallePage({ params }: ClienteDetallePageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={null}>
      <VerDetalleCliente customerId={id} />
    </Suspense>
  );
}
