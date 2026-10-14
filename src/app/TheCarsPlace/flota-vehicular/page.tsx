import { Suspense } from "react";
import { VerFlotaVehicular } from "@/components/(base)/flota-vehicular/VerFlotaVehicular";

export default function FlotaVehicularPage() {
  return (
    <Suspense fallback={null}>
      <VerFlotaVehicular />
    </Suspense>
  );
}
