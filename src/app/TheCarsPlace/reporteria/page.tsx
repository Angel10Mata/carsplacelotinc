import { Suspense } from "react";
import { VerReporteria } from "@/components/(base)/reporteria/VerReporteria";

export default function ReporteriaPage() {
  return (
    <Suspense fallback={null}>
      <VerReporteria />
    </Suspense>
  );
}
