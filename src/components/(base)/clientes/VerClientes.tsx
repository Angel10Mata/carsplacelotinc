import { ModuleHeaderBackButton } from "@/components/(base)/layout/ModuleHeaderBackButton";
import { cn } from "@/lib/utils";
import { modulePageShellClass } from "@/lib/module-layout";
import { ClientesTabla } from "@/components/(base)/clientes/ClientesTabla";

export function VerClientes() {
  return (
    <div
      className={cn(
        modulePageShellClass,
        "min-h-0 pt-0 pb-0 md:pt-2 md:pb-8 mt-0",
      )}
    >
      <header className="mb-4 md:mb-5">
        <div className="flex items-center gap-3 pl-3 md:pl-0">
          <ModuleHeaderBackButton size="sm" className="translate-y-1" />
          <h1 className="min-w-0 translate-y-1 text-2xl font-black uppercase leading-none tracking-tight text-foreground sm:text-3xl md:text-4xl">
            Gestión de clientes
          </h1>
        </div>
      </header>

      <ClientesTabla />
    </div>
  );
}
