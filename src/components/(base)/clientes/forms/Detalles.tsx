"use client";

import { Ban as BanNode, X } from "lucide";
import { Loader2 } from "lucide-react";
import {
  ModalShell,
  ModalFooter,
  modalAccentClass,
  modalFieldClass,
} from "@/components/ui/general-modal";
import { SigetActionButton, sigetAccent } from "@/components/ui/siget-action-button";
import { cn } from "@/lib/utils";
import { clientesTablaAccentBarClass } from "../lib/tabla-clientes-ui";
import { useClienteVehiculos } from "../lib/hooks";
import type { ClienteListRow, ClienteVehiculoItem } from "../lib/zod";

type DetalleClienteModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cliente: ClienteListRow | null;
};

function DetalleLabel({ children }: { children: string }) {
  return (
    <dt className={cn("text-xs font-bold uppercase tracking-widest", modalAccentClass)}>
      {children}
    </dt>
  );
}

function ClienteVehiculoCard({ vehiculo }: { vehiculo: ClienteVehiculoItem }) {
  const estado = vehiculo.estado?.trim().toUpperCase() ?? null;

  return (
    <li
      className={cn(
        "flex flex-col gap-2 overflow-hidden rounded-xl border border-border bg-card p-3 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900/50 dark:hover:bg-zinc-800/60",
      )}
    >
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-lg bg-zinc-100 px-3 py-1.5 text-sm font-black uppercase tracking-wider text-foreground dark:bg-zinc-700">
          {vehiculo.placa}
        </span>
        <div className="min-w-0 shrink rounded-lg border-2 border-zinc-300 bg-zinc-100 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wide dark:border-zinc-600 dark:bg-zinc-800">
          <span className={modalAccentClass}>VIN </span>
          <span className="text-foreground">{vehiculo.vin ?? "—"}</span>
        </div>
        {estado ? (
          <span className="ml-auto shrink-0 rounded-md bg-red-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-700 dark:bg-red-950/50 dark:text-red-300">
            {estado}
          </span>
        ) : null}
      </div>
      <p className="text-base font-black capitalize leading-tight text-foreground">
        {vehiculo.marca}
        {vehiculo.modelo !== "—" ? (
          <span className="font-semibold text-muted-foreground"> · {vehiculo.modelo}</span>
        ) : null}
      </p>
    </li>
  );
}

export default function DetalleClienteModal({
  open,
  onOpenChange,
  cliente,
}: DetalleClienteModalProps) {
  const handleClose = () => onOpenChange(false);
  const { data: vehiculos, isLoading, isError } = useClienteVehiculos(
    cliente?.id ?? null,
    open && cliente !== null,
  );

  const vehiculoCount = vehiculos?.length ?? 0;

  return (
    <ModalShell
      open={open}
      onClose={handleClose}
      title="Detalles del cliente"
      maxWidth="max-w-4xl"
      className="md:!h-auto md:max-h-none"
      contentClassName="!flex-none !overflow-y-visible p-4 md:p-6"
    >
      {cliente ? (
        <div className="space-y-4">
          <section
            className={cn(
              "overflow-hidden rounded-2xl border border-border bg-zinc-50 shadow-sm dark:border-zinc-700 dark:bg-zinc-800/40",
            )}
          >
            <div className={clientesTablaAccentBarClass} aria-hidden />
            <div className="space-y-3 p-4 md:p-5">
              <h3 className="text-lg font-black uppercase leading-tight tracking-tight text-foreground md:text-xl">
                {cliente.nombre}
              </h3>
              <dl className="flex flex-wrap items-baseline gap-x-6 gap-y-1 text-base">
                <div className="flex shrink-0 flex-wrap items-baseline gap-x-2">
                  <DetalleLabel>NIT</DetalleLabel>
                  <dd className="m-0 font-mono tabular-nums text-foreground">
                    {cliente.nit?.trim() || "—"}
                  </dd>
                </div>
                <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2">
                  <DetalleLabel>Dirección</DetalleLabel>
                  <dd className="m-0 min-w-0 leading-snug text-muted-foreground">
                    {cliente.direccion?.trim() || "—"}
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          <section className="space-y-3">
            <h4 className={cn("text-sm font-bold uppercase tracking-widest", modalAccentClass)}>
              Vehículos
            </h4>

            {isLoading ? (
              <p className="flex items-center justify-center gap-2 py-8 text-base text-muted-foreground">
                <Loader2 className="size-5 animate-spin" aria-hidden />
                Cargando vehículos…
              </p>
            ) : null}

            {isError ? (
              <p className="rounded-2xl border border-border bg-zinc-50 py-10 text-center text-base font-semibold text-muted-foreground dark:border-zinc-700 dark:bg-zinc-900/40">
                No se pudo cargar los vehículos de este cliente.
              </p>
            ) : null}

            {!isLoading && !isError && vehiculoCount === 0 ? (
              <p
                className={cn(
                  "rounded-2xl py-12 text-center text-base font-semibold text-muted-foreground",
                  modalFieldClass,
                )}
              >
                Sin vehículos asignados a este cliente.
              </p>
            ) : null}

            {!isLoading && !isError && vehiculoCount > 0 ? (
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                {vehiculos?.map((vehiculo) => (
                  <ClienteVehiculoCard key={vehiculo.id} vehiculo={vehiculo} />
                ))}
              </ul>
            ) : null}
          </section>
        </div>
      ) : null}
      <ModalFooter>
        <SigetActionButton
          label="Cerrar"
          accentColor={sigetAccent.cancelar}
          morphFrom={X}
          morphTo={BanNode}
          className="w-auto shrink-0"
          onClick={handleClose}
          ariaLabel="Cerrar detalles"
        />
      </ModalFooter>
    </ModalShell>
  );
}
