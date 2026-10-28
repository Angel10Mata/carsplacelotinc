"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AboutSection } from "@/components/(base)/(home)/about";
import { ContactSection } from "@/components/(base)/(home)/contact";
import { ServicesSection } from "@/components/(base)/(home)/services";
import { cn } from "@/lib/utils";
import { modulePageShellClass } from "@/lib/module-layout";
import { InventarioPublicoDetalle } from "./InventarioPublicoDetalle";
import { InventarioPublicoSeccion } from "./InventarioPublicoSeccion";
import { useInventarioUi } from "./lib/inventario-ui-context";
import { usePublicInventory } from "./lib/hooks";
import type { PublicInventoryItem } from "./lib/zod";

const sectionScrollMarginEmbedded =
  "[&_section[id]]:scroll-mt-[calc(var(--banner-height,0px)+var(--app-header-height,var(--header-row-height))+0.5rem)]";

export function VerInventarioGrid() {
  const searchParams = useSearchParams();
  const fromVehiculos = searchParams.get("from") === "vehiculos";
  const { data: items = [], isLoading, isError } = usePublicInventory();
  const [selected, setSelected] = useState<PublicInventoryItem | null>(null);
  const { setVehiculoDetalleAbierto } = useInventarioUi();
  const detalleAbierto = selected !== null;

  useEffect(() => {
    setVehiculoDetalleAbierto(detalleAbierto);
    return () => setVehiculoDetalleAbierto(false);
  }, [detalleAbierto, setVehiculoDetalleAbierto]);

  return (
    <div className={cn("scroll-smooth", "min-h-0 w-full")}>
      <div
        className={cn(
          modulePageShellClass,
          sectionScrollMarginEmbedded,
          "min-h-0 pt-0 pb-0 md:pt-2 md:pb-8 mt-0",
        )}
      >
        <InventarioPublicoSeccion
          embedded
          backFromVehiculos={fromVehiculos}
          items={items}
          isLoading={isLoading}
          isError={isError}
          onSelect={setSelected}
        />
        <ServicesSection />
        <AboutSection />
        <ContactSection />
      </div>

      <InventarioPublicoDetalle
        item={selected}
        isOpen={selected !== null}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
