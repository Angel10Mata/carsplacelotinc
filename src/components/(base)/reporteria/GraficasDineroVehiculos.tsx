"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TCPL_BRAND_RED } from "@/lib/brand-colors";
import { formatMonedaUsd } from "./lib/helpers";
import { ReporteriaCard, ReporteriaKpiCard } from "./lib/reporteria-ui";
import type { DineroMesPunto } from "./lib/zod";

const COLOR_COMPRA_SALIDA = TCPL_BRAND_RED.primary;

function DineroTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: DineroMesPunto }>;
}) {
  if (!active || !payload?.[0]) return null;
  const punto = payload[0].payload;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <p className="text-xs font-bold uppercase tracking-widest text-brand dark:text-brand-bright">
        {punto.label}
      </p>
      <p className="mt-1 text-sm font-semibold text-foreground">
        {punto.vendido <= 0
          ? "Sin compras"
          : `Compra de: ${formatMonedaUsd(punto.vendido)}`}
      </p>
      {punto.vehiculos.length > 0 ? (
        <ul className="mt-2 space-y-1">
          {punto.vehiculos.map((vehiculo) => (
            <li
              key={vehiculo.id}
              className="text-xs font-medium text-muted-foreground"
            >
              <span className="font-bold text-foreground">{vehiculo.factura}</span>
              {" · "}
              {vehiculo.titulo}
              {" · "}
              {formatMonedaUsd(vehiculo.monto)}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

type GraficasDineroVehiculosProps = {
  puntos: DineroMesPunto[];
  vendido: number;
  unidadesVendidas: number;
};

export function GraficasDineroVehiculos({
  puntos,
  vendido,
  unidadesVendidas,
}: GraficasDineroVehiculosProps) {
  return (
    <ReporteriaCard title="Montos de compra">
      <div className="px-4 py-4 md:px-6">
        <ReporteriaKpiCard
          label={`Con salida · ${unidadesVendidas}`}
          value={formatMonedaUsd(vendido)}
        />
      </div>

      <div className="h-[22rem] w-full px-1 pb-4 md:px-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={puntos}
            margin={{ top: 16, right: 18, left: 8, bottom: 8 }}
          >
            <CartesianGrid
              strokeDasharray="4 6"
              className="stroke-zinc-200 dark:stroke-zinc-700"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fontWeight: 600 }}
              className="fill-muted-foreground"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={72}
              tickFormatter={(value: number) =>
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  notation: "compact",
                  maximumFractionDigits: 1,
                }).format(value)
              }
              tick={{ fontSize: 11, fontWeight: 600 }}
              className="fill-muted-foreground"
            />
            <Tooltip
              cursor={{ fill: "rgb(24 24 27 / 0.06)" }}
              content={<DineroTooltip />}
            />
            <Bar
              dataKey="vendido"
              fill={COLOR_COMPRA_SALIDA}
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ReporteriaCard>
  );
}
