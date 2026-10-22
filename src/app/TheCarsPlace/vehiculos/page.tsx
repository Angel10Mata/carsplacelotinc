import { Suspense } from "react";
import { VerVehiculos } from "@/components/(base)/vehiculos/VerVehiculos";

export default function VehiculosPage() {
  return (
    <Suspense fallback={null}>
      <VerVehiculos />
    </Suspense>
  );
}
