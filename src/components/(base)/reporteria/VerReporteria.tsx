"use client";

import { useEffect, useMemo, useState } from "react";
import { ModuleHeaderBackButton } from "@/components/(base)/layout/ModuleHeaderBackButton";
import { ModuleDataLoadingPanel } from "@/components/ui/module-page-loading";
import { cn } from "@/lib/utils";
import { modulePageShellClass } from "@/lib/module-layout";
import { GraficasDineroVehiculos } from "./GraficasDineroVehiculos";
import { GraficasIngresosVehiculos } from "./GraficasIngresosVehiculos";
import { RankingClientesReporteria } from "./RankingClientesReporteria";
import { ReporteriaFiltros } from "./ReporteriaFiltros";
import {
  buildDineroPorMes,
  buildIngresosVehiculosSerie,
  buildRankingClientes,
  etiquetaFiltroCalendario,
  filasEnPeriodo,
  filtroCalendarioInicial,
  resolverRangoCalendario,
  resumenDineroVehiculos,
  resumenIngresosVehiculos,
} from "./lib/helpers";
import { useReporteriaVehiculos } from "./lib/hooks";
import type { ReporteriaCampoFecha, ReporteriaFiltroCalendario } from "./lib/zod";

export function VerReporteria() {
  const [mounted, setMounted] = useState(false);
  const [filtro, setFiltro] = useState<ReporteriaFiltroCalendario | null>(null);
  const [campo, setCampo] = useState<ReporteriaCampoFecha>("factura");
  const { data = [], isPending, isError } = useReporteriaVehiculos();

  useEffect(() => {
    setFiltro(filtroCalendarioInicial());
    setMounted(true);
  }, []);

  const rango = useMemo(
    () => (mounted && filtro ? resolverRangoCalendario(filtro) : null),
    [filtro, mounted],
  );

  const filas = useMemo(
    () =>
      mounted && rango
        ? filasEnPeriodo(data, campo, rango.inicio, rango.fin)
        : [],
    [campo, data, mounted, rango],
  );

  const ingresos = useMemo(() => {
    if (!rango) {
      return {
        puntos: [],
        vehiculos: 0,
        diasConIngreso: 0,
        ultimoFechaLabel: "—",
      };
    }
    const puntos = buildIngresosVehiculosSerie(
      filas,
      campo,
      rango.inicio,
      rango.fin,
    );
    return { puntos, ...resumenIngresosVehiculos(puntos) };
  }, [campo, filas, rango]);

  const dinero = useMemo(() => {
    if (!rango) {
      return {
        puntos: [],
        vendido: 0,
        lote: 0,
        unidadesVendidas: 0,
        unidadesLote: 0,
      };
    }
    return {
      puntos: buildDineroPorMes(filas, campo, rango.inicio, rango.fin),
      ...resumenDineroVehiculos(filas),
    };
  }, [campo, filas, rango]);

  const clientes = useMemo(
    () => (mounted ? buildRankingClientes(filas) : []),
    [filas, mounted],
  );

  const periodoLabel = filtro ? etiquetaFiltroCalendario(filtro) : "";
  const campoLabel = campo === "factura" ? "fecha de factura" : "fecha de registro";

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
              Reportería
            </h1>
          </div>
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
            diasConIngreso={ingresos.diasConIngreso}
            ultimoFechaLabel={ingresos.ultimoFechaLabel}
            descripcion={`${periodoLabel} por ${campoLabel}. El punto marca cada día o mes con unidades.`}
          />

          <GraficasDineroVehiculos
            puntos={dinero.puntos}
            vendido={dinero.vendido}
            lote={dinero.lote}
            unidadesVendidas={dinero.unidadesVendidas}
            unidadesLote={dinero.unidadesLote}
            descripcion={`${periodoLabel} por ${campoLabel}. Vendido frente a valor en lote, mes a mes.`}
          />

          <RankingClientesReporteria
            clientes={clientes}
            descripcion={`${periodoLabel} por ${campoLabel}. Unidades y monto por cliente.`}
          />
        </div>
      ) : null}
    </div>
  );
}
