"use client";

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { ModalFechaInput } from "@/components/ui/general-modal";
import { formatFechaManualGt } from "@/lib/fechas-gt";
import { cn } from "@/lib/utils";
import {
  cambiarVistaFiltro,
  etiquetaMesLargo,
  moverFiltroCalendario,
  opcionesSemanaMes,
} from "./lib/helpers";
import type {
  ReporteriaCampoFecha,
  ReporteriaFiltroCalendario,
  ReporteriaSemana,
  ReporteriaVista,
} from "./lib/zod";

const VISTAS: Array<{ value: ReporteriaVista; label: string }> = [
  { value: "dia", label: "Día" },
  { value: "mes", label: "Mes" },
  { value: "rango", label: "Rango" },
];

const CAMPOS: Array<{ value: ReporteriaCampoFecha; label: string }> = [
  { value: "factura", label: "Factura" },
  { value: "registro", label: "Registro" },
];

type ReporteriaFiltrosProps = {
  filtro: ReporteriaFiltroCalendario;
  campo: ReporteriaCampoFecha;
  onFiltro: (value: ReporteriaFiltroCalendario) => void;
  onCampo: (value: ReporteriaCampoFecha) => void;
};

export function ReporteriaFiltros({
  filtro,
  campo,
  onFiltro,
  onCampo,
}: ReporteriaFiltrosProps) {
  const semanas = opcionesSemanaMes(filtro.mes);

  return (
    <section className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
      <div className="inline-flex w-full min-w-0 flex-wrap items-center gap-1 rounded-full border border-zinc-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-900 lg:w-auto">
        {VISTAS.map((vista) => (
          <button
            key={vista.value}
            type="button"
            onClick={() => onFiltro(cambiarVistaFiltro(filtro, vista.value))}
            className={cn(
              "cursor-pointer rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
              filtro.vista === vista.value
                ? "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
                : "bg-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100",
            )}
          >
            {vista.label}
          </button>
        ))}

        {filtro.vista === "rango" ? (
          <div className="flex min-w-0 flex-wrap items-center gap-2 px-2 py-0.5">
            <ModalFechaInput
              value={filtro.rangoInicio}
              onChange={(rangoInicio) =>
                onFiltro({ ...filtro, rangoInicio: rangoInicio || filtro.rangoInicio })
              }
              className="h-8 w-[7.5rem] rounded-full border-zinc-200 bg-zinc-50 px-3 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            />
            <span className="text-zinc-400">–</span>
            <ModalFechaInput
              value={filtro.rangoFin}
              onChange={(rangoFin) =>
                onFiltro({ ...filtro, rangoFin: rangoFin || filtro.rangoFin })
              }
              className="h-8 w-[7.5rem] rounded-full border-zinc-200 bg-zinc-50 px-3 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            />
          </div>
        ) : (
          <div className="flex items-center gap-1 px-1">
            <NavChevron
              label="Anterior"
              onClick={() => onFiltro(moverFiltroCalendario(filtro, -1))}
            />
            <p className="min-w-[8.5rem] text-center text-sm font-semibold text-zinc-800 dark:text-zinc-100">
              {filtro.vista === "dia"
                ? formatFechaManualGt(filtro.dia)
                : etiquetaMesLargo(filtro.mes)}
            </p>
            <NavChevron
              label="Siguiente"
              onClick={() => onFiltro(moverFiltroCalendario(filtro, 1))}
            />
          </div>
        )}

        {filtro.vista === "mes" ? (
          <div className="relative min-w-[11rem]">
            <select
              value={String(filtro.semana)}
              onChange={(e) => {
                const raw = e.target.value;
                const semana: ReporteriaSemana =
                  raw === "all" ? "all" : Number(raw);
                onFiltro({ ...filtro, semana });
              }}
              className="h-9 w-full cursor-pointer appearance-none rounded-full bg-transparent px-3 pr-8 text-sm font-semibold text-zinc-700 outline-none dark:text-zinc-100"
            >
              {semanas.map((opcion) => (
                <option key={String(opcion.value)} value={String(opcion.value)}>
                  {opcion.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
              aria-hidden
            />
          </div>
        ) : null}
      </div>

      <div className="inline-flex w-full items-center gap-1 rounded-full border border-zinc-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-900 lg:w-auto">
        {CAMPOS.map((opcion) => (
          <button
            key={opcion.value}
            type="button"
            onClick={() => onCampo(opcion.value)}
            className={cn(
              "cursor-pointer rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
              campo === opcion.value
                ? "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
                : "bg-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100",
            )}
          >
            {opcion.label}
          </button>
        ))}
      </div>
    </section>
  );
}

function NavChevron({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  const Icon = label === "Anterior" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-8 cursor-pointer items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
    >
      <Icon className="size-4" aria-hidden />
    </button>
  );
}
