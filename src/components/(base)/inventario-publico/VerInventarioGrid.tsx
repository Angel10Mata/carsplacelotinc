"use client";

import { useState } from "react";
import { AboutSection } from "@/components/(base)/(home)/about";
import { ContactSection } from "@/components/(base)/(home)/contact";
import { ServicesSection } from "@/components/(base)/(home)/services";
import { ModuleHeaderBackButton } from "@/components/(base)/layout/ModuleHeaderBackButton";
import { useUser } from "@/components/(base)/providers/UserProvider";
import { cn } from "@/lib/utils";
import { modulePageShellClass } from "@/lib/module-layout";
import { EncabezadoPublico } from "./EncabezadoPublico";
import { InventarioPublicoDetalle } from "./InventarioPublicoDetalle";
import { InventarioPublicoSeccion } from "./InventarioPublicoSeccion";
import { usePublicInventory } from "./lib/hooks";
import type { PublicInventoryItem } from "./lib/zod";

const sectionScrollMarginEmbedded =
  "[&_section[id]]:scroll-mt-[calc(var(--banner-height,0px)+var(--app-header-height,var(--header-row-height))+0.5rem)]";

const sectionScrollMarginPublic = "[&_section[id]]:scroll-mt-24";

export function VerInventarioGrid() {
  const user = useUser();
  const { data: items = [], isLoading, isError } = usePublicInventory();
  const [selected, setSelected] = useState<PublicInventoryItem | null>(null);
  const embedded = Boolean(user);

  return (
    <div className={cn("scroll-smooth", !embedded && "min-h-screen w-full")}>
      {!embedded ? <EncabezadoPublico /> : null}

      <div
        className={cn(
          embedded
            ? cn(
                modulePageShellClass,
                sectionScrollMarginEmbedded,
                "min-h-0 pt-3 pb-8 md:pt-2 mt-0",
              )
            : cn("w-full", sectionScrollMarginPublic),
        )}
      >
        {embedded ? (
          <header className="mb-2 md:mb-3">
            <div className="flex items-start gap-3 sm:items-center">
              <ModuleHeaderBackButton className="mt-0.5 sm:mt-0" />
              <div className="min-w-0 flex-1 border-l-4 border-brand py-1 pl-4 dark:border-brand-bright">
                <h1 className="text-2xl font-black uppercase tracking-tight text-foreground sm:text-3xl md:text-4xl leading-[1.05]">
                  Inventario
                </h1>
              </div>
            </div>
          </header>
        ) : null}

        <InventarioPublicoSeccion
          embedded={embedded}
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
