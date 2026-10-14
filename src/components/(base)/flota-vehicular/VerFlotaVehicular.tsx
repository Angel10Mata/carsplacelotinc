import { ModuleHeaderBackButton } from "@/components/(base)/layout/ModuleHeaderBackButton";
import { modulePageShellClass } from "@/lib/module-layout";

export function VerFlotaVehicular() {
  return (
    <div className={modulePageShellClass}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <ModuleHeaderBackButton />
          <h1 className="text-3xl font-bold tracking-tighter text-foreground">
            Flota Vehicular
          </h1>
        </div>
        <p className="text-sm text-muted-foreground ml-0.5">
          Gestión de vehículos en inventario y operación del lote.
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-border/80 bg-card/80 backdrop-blur-sm p-10 md:p-14 text-center shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Módulo en preparación
        </p>
        <p className="mt-3 text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Aquí podrás registrar unidades, estados, precios y documentación. El
          catálogo y formularios se agregarán en la siguiente iteración.
        </p>
      </div>
    </div>
  );
}
