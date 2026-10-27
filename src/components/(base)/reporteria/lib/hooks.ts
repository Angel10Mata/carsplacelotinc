"use client";

import { useQuery } from "@tanstack/react-query";
import { listReporteriaVehiculosAction } from "./actions";

export const reporteriaVehiculosQueryKey = ["reporteria", "vehiculos"] as const;

export function useReporteriaVehiculos() {
  return useQuery({
    queryKey: reporteriaVehiculosQueryKey,
    queryFn: async () => {
      const res = await listReporteriaVehiculosAction();
      if (!res.ok) throw new Error(res.code);
      return res.data;
    },
  });
}

export const useIngresosVehiculos = useReporteriaVehiculos;
