"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type InventarioUiContextValue = {
  vehiculoDetalleAbierto: boolean;
  setVehiculoDetalleAbierto: (open: boolean) => void;
};

const InventarioUiContext = createContext<InventarioUiContextValue | null>(null);

export function InventarioUiProvider({ children }: { children: ReactNode }) {
  const [vehiculoDetalleAbierto, setOpen] = useState(false);
  const setVehiculoDetalleAbierto = useCallback((open: boolean) => {
    setOpen(open);
  }, []);
  const value = useMemo(
    () => ({ vehiculoDetalleAbierto, setVehiculoDetalleAbierto }),
    [vehiculoDetalleAbierto, setVehiculoDetalleAbierto],
  );
  return (
    <InventarioUiContext.Provider value={value}>{children}</InventarioUiContext.Provider>
  );
}

export function useInventarioUi() {
  const ctx = useContext(InventarioUiContext);
  if (!ctx) {
    return {
      vehiculoDetalleAbierto: false,
      setVehiculoDetalleAbierto: () => undefined,
    };
  }
  return ctx;
}
