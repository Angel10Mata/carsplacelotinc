"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  clientesTablaAccentBarClass,
  clientesTablaAddOutlineButtonClass,
  clientesTablaBodyRowClass,
  clientesTablaCardShellClass,
  clientesTablaCellDividerClass,
  clientesTablaHeadRowClass,
  clientesTablaPaginationBarClass,
  clientesTablaPaginationControlClass,
  clientesTablaSearchInputClass,
  clientesTablaToolbarButtonsClass,
  clientesTablaToolbarButtonsMobileGridClass,
  clientesTablaToolbarFiltersClass,
  clientesTablaToolbarGridClass,
  clientesTablaToolbarSectionClass,
} from "./lib/tabla-clientes-ui";
import CrearClienteModal from "./forms/Crear";
import { useCustomers } from "./lib/hooks";

const cellPad = "px-3 py-3";
const PAGE_SIZE_OPTIONS = [5, 10, 15] as const;

export function ClientesTabla() {
  const { data: clientes, isLoading, isError } = useCustomers();
  const [crearOpen, setCrearOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const filtered = useMemo(() => {
    const list = clientes ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (row) =>
        row.nombre.toLowerCase().includes(q) ||
        (row.nit ?? "").toLowerCase().includes(q) ||
        (row.direccion ?? "").toLowerCase().includes(q),
    );
  }, [clientes, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const rowOffset = (pageSafe - 1) * pageSize;
  const pageItems = filtered.slice(rowOffset, rowOffset + pageSize);

  return (
    <>
      <CrearClienteModal open={crearOpen} onOpenChange={setCrearOpen} />
      <div
        className={cn(
          "flex w-full min-w-0 flex-col shrink-0",
          clientesTablaCardShellClass,
        )}
      >
        <div className={clientesTablaAccentBarClass} aria-hidden />
        <div className="flex min-h-0 flex-1 flex-col bg-card dark:bg-zinc-900/40">
          <div className={clientesTablaToolbarSectionClass}>
            <div className={clientesTablaToolbarGridClass}>
              <div
                className={cn(
                  clientesTablaToolbarFiltersClass,
                  "max-lg:flex-col max-lg:items-stretch",
                )}
              >
                <div className="relative min-w-0 w-full lg:flex-1">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                  <input
                    type="search"
                    placeholder="Buscar por nombre, NIT o dirección..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className={clientesTablaSearchInputClass}
                  />
                </div>
              </div>
              <div
                className={cn(
                  clientesTablaToolbarButtonsClass,
                  clientesTablaToolbarButtonsMobileGridClass,
                  "min-w-0 w-full max-lg:col-span-full",
                )}
              >
                <button
                  type="button"
                  className={clientesTablaAddOutlineButtonClass}
                  onClick={() => setCrearOpen(true)}
                >
                  <Plus className="size-4 shrink-0" aria-hidden />
                  Añadir
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <p className="flex items-center justify-center gap-2 px-4 py-14 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Cargando clientes…
            </p>
          ) : null}

          {isError ? (
            <p className="px-4 py-14 text-center text-sm font-semibold text-muted-foreground">
              No se pudo cargar la lista. Verifica la tabla{" "}
              <code className="text-xs">customers</code> en Supabase.
            </p>
          ) : null}

          {!isLoading && !isError ? (
            <div className="w-full min-w-0 overflow-x-auto">
              <table className="w-full table-fixed border-collapse text-sm">
                <thead>
                  <tr className={clientesTablaHeadRowClass}>
                    <th className={cn(cellPad, clientesTablaCellDividerClass, "w-[8%] text-center")}>
                      No.
                    </th>
                    <th className={cn(cellPad, clientesTablaCellDividerClass, "w-[32%] text-left")}>
                      Nombre
                    </th>
                    <th className={cn(cellPad, clientesTablaCellDividerClass, "w-[20%] text-center")}>
                      NIT
                    </th>
                    <th className={cn(cellPad, "w-[40%] text-left")}>Dirección</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-14 text-center text-sm font-semibold text-muted-foreground"
                      >
                        {search.trim()
                          ? "Sin coincidencias con la búsqueda."
                          : "Sin clientes. Usa Añadir para registrar uno."}
                      </td>
                    </tr>
                  ) : (
                    pageItems.map((row, idx) => (
                      <tr key={row.id} className={clientesTablaBodyRowClass}>
                        <td
                          className={cn(
                            cellPad,
                            clientesTablaCellDividerClass,
                            "text-center tabular-nums font-medium text-muted-foreground",
                          )}
                        >
                          {rowOffset + idx + 1}
                        </td>
                        <td
                          className={cn(
                            cellPad,
                            clientesTablaCellDividerClass,
                            "font-semibold text-foreground",
                          )}
                        >
                          {row.nombre}
                        </td>
                        <td
                          className={cn(
                            cellPad,
                            clientesTablaCellDividerClass,
                            "text-center font-mono text-xs",
                          )}
                        >
                          {row.nit ?? "—"}
                        </td>
                        <td className={cn(cellPad, "text-muted-foreground")}>
                          {row.direccion ?? "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : null}

          {!isLoading && !isError && filtered.length > 0 ? (
            <div className={clientesTablaPaginationBarClass}>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="h-9 rounded-lg border border-border bg-background px-2 text-xs font-semibold dark:border-zinc-700"
                aria-label="Filas por página"
              >
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n} / pág.
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={pageSafe <= 1}
                className={clientesTablaPaginationControlClass}
                aria-label="Página anterior"
              >
                <ChevronLeft className="size-5" />
              </button>
              <span className="min-w-[4rem] text-center text-xs font-bold tabular-nums">
                {pageSafe}/{totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={pageSafe >= totalPages}
                className={clientesTablaPaginationControlClass}
                aria-label="Página siguiente"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
