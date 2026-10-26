"use client";

import { useQuery } from "@tanstack/react-query";
import { listPublicInventoryAction } from "./actions";

export const publicInventoryQueryKey = ["inventario-publico", "cars"] as const;

export function usePublicInventory() {
  return useQuery({
    queryKey: publicInventoryQueryKey,
    queryFn: async () => {
      const res = await listPublicInventoryAction();
      if (!res.ok) throw new Error(res.code);
      return res.data;
    },
  });
}
