"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { createGeneratedInvoiceBlobUrl } from "../lib/vehiculo-invoice-pdf-client";
import type { VehiculoListRow } from "../lib/zod";

const CarPdfInlineViewer = dynamic(
  () =>
    import("./CarPdfInlineViewer").then((m) => m.CarPdfInlineViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[14rem] flex-1 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-brand dark:text-brand-bright" />
      </div>
    ),
  },
);

type CarGeneratedInvoiceViewerProps = {
  row: VehiculoListRow;
  className?: string;
};

export function CarGeneratedInvoiceViewer({
  row,
  className,
}: CarGeneratedInvoiceViewerProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;
    setLoading(true);

    void createGeneratedInvoiceBlobUrl(row)
      .then((url) => {
        if (!active) {
          URL.revokeObjectURL(url);
          return;
        }
        objectUrl = url;
        setBlobUrl(url);
      })
      .catch((err) => {
        console.error("generated invoice pdf:", err);
        if (active) setBlobUrl(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [row]);

  if (loading || !blobUrl) {
    return (
      <div className="flex min-h-[14rem] flex-1 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-brand dark:text-brand-bright" />
      </div>
    );
  }

  return <CarPdfInlineViewer url={blobUrl} className={className} />;
}
