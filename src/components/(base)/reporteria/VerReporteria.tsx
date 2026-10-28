"use client";

import { useEffect, useMemo, useState } from "react";
import { ModuleHeaderBackButton } from "@/components/(base)/layout/ModuleHeaderBackButton";
import { ModuleDataLoadingPanel } from "@/components/ui/module-page-loading";
import { cn } from "@/lib/utils";
import { modulePageShellClass } from "@/lib/module-layout";
import { GraficasDineroVehiculos } from "./GraficasDineroVehiculos";
import { GraficasIngresosVehiculos } from "./GraficasIngresosVehiculos";
import { ReporteriaFiltros } from "./ReporteriaFiltros";
import {
  buildDineroPorMes,
  buildIngresosVehiculosSerie,
  filasEnPeriodo,
  filtroCalendarioInicial,
  resolverRangoCalendario,
  resolverRangoGraficaCompras,
  resumenDineroVehiculos,
  resumenIngresosVehiculos,
} from "./lib/helpers";
import { useReporteriaVehiculos } from "./lib/hooks";
import type { ReporteriaCampoFecha, ReporteriaFiltroCalendario } from "./lib/zod";

export function VerReporteria() {
  const [mounted, setMounted] = useState(false);
  const [filtro, setFiltro] = useState<ReporteriaFiltroCalendario | null>(null);
  const [campo, setCampo] = useState<ReporteriaCampoFecha>("registro");
  const { data = [], isPending, isError } = useReporteriaVehiculos();

  useEffect(() => {
    setFiltro(filtroCalendarioInicial());
    setMounted(true);
  }, []);

  const rango = useMemo(
    () => (mounted && filtro ? resolverRangoCalendario(filtro) : null),
    [filtro, mounted],
  );

  const rangoGrafica = useMemo(
    () => (mounted && filtro ? resolverRangoGraficaCompras(filtro) : null),
    [filtro, mounted],
  );

  const filas = useMemo(
    () =>
      mounted && rango
        ? filasEnPeriodo(data, campo, rango.inicio, rango.fin)
        : [],
    [campo, data, mounted, rango],
  );

  const filasGrafica = useMemo(
    () =>
      mounted && rangoGrafica
        ? filasEnPeriodo(data, campo, rangoGrafica.inicio, rangoGrafica.fin)
        : [],
    [campo, data, mounted, rangoGrafica],
  );

  const ingresos = useMemo(() => {
    if (!rango || !rangoGrafica) {
      return {
        puntos: [],
        vehiculos: 0,
        ultimoFechaLabel: "—",
      };
    }
    const puntosKpi = buildIngresosVehiculosSerie(
      filas,
      campo,
      rango.inicio,
      rango.fin,
    );
    const puntos = buildIngresosVehiculosSerie(
      filasGrafica,
      campo,
      rangoGrafica.inicio,
      rangoGrafica.fin,
    );
    return { puntos, ...resumenIngresosVehiculos(puntosKpi) };
  }, [campo, filas, filasGrafica, rango, rangoGrafica]);

  const dinero = useMemo(() => {
    if (!rango || !rangoGrafica) {
      return {
        puntos: [],
        vendido: 0,
        lote: 0,
        unidadesVendidas: 0,
        unidadesLote: 0,
      };
    }
    return {
      puntos: buildDineroPorMes(
        filasGrafica,
        campo,
        rangoGrafica.inicio,
        rangoGrafica.fin,
      ),
      ...resumenDineroVehiculos(filas),
    };
  }, [campo, filas, filasGrafica, rango, rangoGrafica]);

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
            Reportería
          </h1>
        </div>
      </header>

      {!mounted || isPending ? (
        <ModuleDataLoadingPanel minHeightClass="min-h-[22rem]" />
      ) : null}

      {mounted && !isPending && isError ? (
        <p className="rounded-2xl border border-border py-14 text-center text-sm font-semibold text-destructive dark:border-zinc-700">
          No se pudieron cargar los indicadores.
        </p>
      ) : null}

      {mounted && filtro && !isPending && !isError ? (
        <div className="flex flex-col gap-6">
          <ReporteriaFiltros
            filtro={filtro}
            campo={campo}
            onFiltro={setFiltro}
            onCampo={setCampo}
          />

          <GraficasIngresosVehiculos
            puntos={ingresos.puntos}
            registrados={ingresos.vehiculos}
            ultimoFechaLabel={ingresos.ultimoFechaLabel}
            diaActivo={filtro.vista === "dia" ? filtro.dia : undefined}
          />

          <GraficasDineroVehiculos
            puntos={dinero.puntos}
            vendido={dinero.vendido}
            unidadesVendidas={dinero.unidadesVendidas}
          />
        </div>
      ) : null}
    </div>
  );
}
