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
      <div className="flex flex-col gap-1 mb-2">
        <div className="flex items-center gap-3">
          <ModuleHeaderBackButton />
          <h1 className="text-lg md:text-xl font-black uppercase tracking-tight text-foreground">
            Gestión de vehículos
          </h1>
        </div>
      </div>

      <VehiculosTabla />
    </div>
  );
}
