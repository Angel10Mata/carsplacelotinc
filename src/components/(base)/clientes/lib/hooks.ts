"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mapCustomerToListRow } from "./helpers";
import {
  actualizarCustomerAction,
  crearCustomerAction,
  listCarsByCustomerAction,
  listCustomersAction,
} from "./actions";
import type { ActualizarCustomerInput, CrearCustomerInput } from "./zod";

export const customersQueryKey = ["clientes", "list"] as const;
export const customersSearchQueryKey = ["clientes", "search"] as const;

export function clienteVehiculosQueryKey(customerId: string) {
  return ["clientes", "vehiculos", customerId] as const;
}

export function useCustomersSearch(query: string, enabled: boolean) {
  const term = query.trim();
  return useQuery({
    queryKey: [...customersSearchQueryKey, term],
    queryFn: async () => {
      const res = await listCustomersAction(term);
      if (!res.ok) throw new Error(res.code);
      return res.data;
    },
    enabled: enabled && term.length >= 3,
  });
}

export function useCustomers() {
  return useQuery({
    queryKey: customersQueryKey,
    queryFn: async () => {
      const res = await listCustomersAction();
      if (!res.ok) throw new Error(res.code);
      return res.data.map(mapCustomerToListRow);
    },
  });
}

export function useCrearCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CrearCustomerInput) => {
      const res = await crearCustomerAction(input);
      if (!res.ok) throw new Error(res.code);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: customersQueryKey });
      qc.invalidateQueries({ queryKey: customersSearchQueryKey });
    },
  });
}

export function useClienteVehiculos(customerId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: customerId
      ? clienteVehiculosQueryKey(customerId)
      : (["clientes", "vehiculos", "none"] as const),
    queryFn: async () => {
      if (!customerId) return [];
      const res = await listCarsByCustomerAction(customerId);
      if (!res.ok) throw new Error(res.code);
      return res.data;
    },
    enabled: enabled && customerId !== null,
  });
}

export function useActualizarCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ActualizarCustomerInput) => {
      const res = await actualizarCustomerAction(input);
      if (!res.ok) throw new Error(res.code);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: customersQueryKey });
      qc.invalidateQueries({ queryKey: customersSearchQueryKey });
    },
  });
}
