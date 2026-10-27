"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TCPL_BRAND_RED } from "@/lib/brand-colors";
import { formatMonedaUsd } from "./lib/helpers";
import { ReporteriaCard, ReporteriaKpiCard } from "./lib/reporteria-ui";
import type { DineroMesPunto } from "./lib/zod";

const COLOR_VENDIDO = "#16a34a";
const COLOR_LOTE = TCPL_BRAND_RED.primary;

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
      <p className="mt-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
        Vendido {formatMonedaUsd(punto.vendido)}
      </p>
      <p className="text-sm font-semibold text-brand dark:text-brand-bright">
        En lote {formatMonedaUsd(punto.lote)}
      </p>
    </div>
  );
}

type GraficasDineroVehiculosProps = {
  puntos: DineroMesPunto[];
  vendido: number;
  lote: number;
  unidadesVendidas: number;
  unidadesLote: number;
  descripcion: string;
};

export function GraficasDineroVehiculos({
  puntos,
  vendido,
  lote,
  unidadesVendidas,
  unidadesLote,
  descripcion,
}: GraficasDineroVehiculosProps) {
  return (
    <ReporteriaCard title="Dinero" description={descripcion}>
      <div className="grid grid-cols-1 gap-3 px-4 py-4 sm:grid-cols-2 md:px-6">
        <ReporteriaKpiCard
          label={`Vendido · ${unidadesVendidas}`}
          value={formatMonedaUsd(vendido)}
        />
        <ReporteriaKpiCard
          label={`En lote · ${unidadesLote}`}
          value={formatMonedaUsd(lote)}
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
            <Legend
              wrapperStyle={{ fontSize: 12, fontWeight: 700 }}
              formatter={(value) => (value === "vendido" ? "Vendido" : "En lote")}
            />
            <Bar dataKey="vendido" fill={COLOR_VENDIDO} radius={[8, 8, 0, 0]} />
            <Bar dataKey="lote" fill={COLOR_LOTE} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ReporteriaCard>
  );
}
