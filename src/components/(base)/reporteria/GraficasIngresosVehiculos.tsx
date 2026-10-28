"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TCPL_BRAND_RED } from "@/lib/brand-colors";
import { formatFechaManualGt } from "@/lib/fechas-gt";
import { ReporteriaCard, ReporteriaKpiCard } from "./lib/reporteria-ui";
import type { IngresoVehiculoPunto } from "./lib/zod";

type IngresosDotProps = {
  cx?: number;
  cy?: number;
  payload?: IngresoVehiculoPunto;
};

function IngresosDot({
  cx,
  cy,
  payload,
  diaActivo,
}: IngresosDotProps & { diaActivo?: string }) {
  if (cx == null || cy == null || !payload || payload.ingresos <= 0) {
    return null;
  }

  const activo = Boolean(diaActivo && payload.fecha === diaActivo);
  const halo = activo ? 9 : 7;
  const nucleo = activo ? 5.5 : 4.5;

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={halo}
        fill={TCPL_BRAND_RED.primary}
        fillOpacity={activo ? 0.28 : 0.18}
      />
      <circle
        cx={cx}
        cy={cy}
        r={nucleo}
        fill={TCPL_BRAND_RED.primary}
        stroke="#ffffff"
        strokeWidth={2}
      />
    </g>
  );
}

function IngresosTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: IngresoVehiculoPunto }>;
}) {
  if (!active || !payload?.[0]) return null;
  const punto = payload[0].payload;
  const tituloFecha =
    punto.fecha.length === 10
      ? formatFechaManualGt(punto.fecha)
      : punto.label;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <p className="text-xs font-bold uppercase tracking-widest text-brand dark:text-brand-bright">
        {tituloFecha}
      </p>
      <p className="mt-1 text-sm font-semibold text-foreground">
        {punto.ingresos === 0
          ? "Sin compras"
          : `${punto.ingresos} compra${punto.ingresos === 1 ? "" : "s"}`}
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
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

type GraficasIngresosVehiculosProps = {
  puntos: IngresoVehiculoPunto[];
  registrados: number;
  ultimoFechaLabel: string;
  diaActivo?: string;
};

export function GraficasIngresosVehiculos({
  puntos,
  registrados,
  ultimoFechaLabel,
  diaActivo,
}: GraficasIngresosVehiculosProps) {
  return (
    <ReporteriaCard title="Compras de vehículos">
      <div className="grid grid-cols-1 gap-3 px-4 py-4 sm:grid-cols-2 md:px-6">
        <ReporteriaKpiCard label="Comprados" value={String(registrados)} />
        <ReporteriaKpiCard label="Última compra" value={ultimoFechaLabel} />
      </div>

      <div className="h-[22rem] w-full px-1 pb-4 md:px-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={puntos}
            margin={{ top: 16, right: 18, left: 0, bottom: 8 }}
          >
            <defs>
              <linearGradient id="ingresosVehiculosFill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={TCPL_BRAND_RED.primary}
                  stopOpacity={0.32}
                />
                <stop
                  offset="100%"
                  stopColor={TCPL_BRAND_RED.primary}
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="4 6"
              className="stroke-zinc-200 dark:stroke-zinc-700"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={18}
              tick={{ fontSize: 11, fontWeight: 600 }}
              className="fill-muted-foreground"
            />
            <YAxis
              allowDecimals={false}
              domain={[0, "auto"]}
              tickLine={false}
              axisLine={false}
              width={28}
              tick={{ fontSize: 11, fontWeight: 600 }}
              className="fill-muted-foreground"
            />
            <Tooltip
              cursor={{
                stroke: TCPL_BRAND_RED.primary,
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
              content={<IngresosTooltip />}
            />
            <Area
              type="linear"
              dataKey="ingresos"
              stroke={TCPL_BRAND_RED.primary}
              strokeWidth={2.5}
              fill="url(#ingresosVehiculosFill)"
              dot={<IngresosDot diaActivo={diaActivo} />}
              activeDot={{
                r: 6,
                fill: TCPL_BRAND_RED.bright,
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ReporteriaCard>
  );
}
