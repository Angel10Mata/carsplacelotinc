import { ModuleHeaderBackButton } from "@/components/(base)/layout/ModuleHeaderBackButton";
import { cn } from "@/lib/utils";
import { modulePageShellClass } from "@/lib/module-layout";
import { VehiculosTabla } from "@/components/(base)/vehiculos/VehiculosTabla";

export function VerVehiculos() {
  return (
    <div
      className={cn(
        modulePageShellClass,
        "min-h-0 pt-3 pb-8 md:pt-2 mt-0",
      )}
    >
      <header className="mb-4 md:mb-5">
        <div className="flex items-start gap-3 sm:items-center">
          <ModuleHeaderBackButton className="mt-0.5 sm:mt-0" />
          <div className="min-w-0 flex-1 py-1">
            <h1 className="text-2xl font-black uppercase tracking-tight text-foreground sm:text-3xl md:text-4xl leading-[1.05]">
              Gestión de vehículos
            </h1>
          </div>
        </div>
      </header>

      <VehiculosTabla />
    </div>
  );
}
