"use client";

import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  Eye,
  Loader2,
  PenSquare,
  Plus,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SigetTablaPageSizeSelect,
  type SigetTablaPageSizeValue,
} from "@/components/ui/siget-tabla-page-size-select";
import {
  clientesTablaAccentBarClass,
  clientesTablaAddOutlineButtonClass,
  clientesTablaBodyRowClass,
  clientesTablaCardShellClass,
  clientesTablaCellDividerClass,
  clientesTablaHeadRowClass,
  clientesTablaAccentTextClass,
  clientesTablaPaginationBarClass,
  clientesTablaPaginationControlClass,
  clientesTablaSearchInputClass,
  clientesTablaToolbarButtonsClass,
  clientesTablaToolbarButtonsMobileGridClass,
  clientesTablaToolbarFiltersClass,
  clientesTablaToolbarGridClass,
  clientesTablaToolbarSectionClass,
  clientesTablaAnchoAcciones,
  clientesTablaAnchoNo,
  clientesTablaColAnchoStyle,
} from "./lib/tabla-clientes-ui";
import CrearClienteModal from "./forms/Crear";
import DetalleClienteModal from "./forms/Detalles";
import EditarClienteModal from "./forms/Editar";
import { useCustomers } from "./lib/hooks";
import type { ClienteListRow } from "./lib/zod";

const cellPad = "px-3 py-3";
const cellPadEstrecho = "px-1.5 py-3.5";
type PageSize = SigetTablaPageSizeValue;

function ClienteFilaMenu({
  row,
  onDetalles,
  onEditar,
}: {
  row: ClienteListRow;
  onDetalles: () => void;
  onEditar: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border bg-white text-brand transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-brand-bright dark:hover:bg-zinc-800"
          aria-label={`Acciones para ${row.nombre}`}
        >
          <EllipsisVertical className="size-5" aria-hidden />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="left"
        align="end"
        sideOffset={6}
        className="z-[200] w-auto min-w-0 border-border bg-white p-1 opacity-100 dark:border-zinc-700 dark:bg-zinc-900"
      >
        <DropdownMenuItem
          className="cursor-pointer gap-2 px-2.5 py-2 font-semibold"
          onSelect={() => onDetalles()}
        >
          <Eye className="size-4 text-brand dark:text-brand-bright" />
          Detalles
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer gap-2 px-2.5 py-2 font-semibold"
          onSelect={() => onEditar()}
        >
          <PenSquare className="size-4 text-brand dark:text-brand-bright" />
          Editar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ClientesTabla() {
  const { data: clientes, isLoading, isError } = useCustomers();
  const [crearOpen, setCrearOpen] = useState(false);
  const [editarCliente, setEditarCliente] = useState<ClienteListRow | null>(null);
  const [detalleCliente, setDetalleCliente] = useState<ClienteListRow | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(15);

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

  const showAll = pageSize === "all";
  const totalPages = showAll
    ? 1
    : Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageSafe = showAll ? 1 : Math.min(page, totalPages);
  const rowOffset = showAll ? 0 : (pageSafe - 1) * pageSize;
  const sliceSize = showAll ? filtered.length : pageSize;
  const pageItems = filtered.slice(rowOffset, rowOffset + sliceSize);

  return (
    <>
      <CrearClienteModal open={crearOpen} onOpenChange={setCrearOpen} />
      <EditarClienteModal
        open={editarCliente !== null}
        onOpenChange={(open) => {
          if (!open) setEditarCliente(null);
        }}
        cliente={editarCliente}
      />
      <DetalleClienteModal
        open={detalleCliente !== null}
        onOpenChange={(open) => {
          if (!open) setDetalleCliente(null);
        }}
        cliente={detalleCliente}
      />
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
                <colgroup>
                  <col style={clientesTablaColAnchoStyle(clientesTablaAnchoNo)} />
                  <col className="w-[32%]" />
                  <col className="w-[11%]" />
                  <col />
                  <col style={clientesTablaColAnchoStyle(clientesTablaAnchoAcciones)} />
                </colgroup>
                <thead>
                  <tr className={clientesTablaHeadRowClass}>
                    <th
                      className={cn(
                        cellPadEstrecho,
                        clientesTablaCellDividerClass,
                        "w-0 whitespace-nowrap text-center",
                      )}
                      style={clientesTablaColAnchoStyle(clientesTablaAnchoNo)}
                    >
                      No.
                    </th>
                    <th className={cn(cellPad, clientesTablaCellDividerClass, "text-center")}>
                      Nombre
                    </th>
                    <th className={cn(cellPad, clientesTablaCellDividerClass, "text-center")}>
                      NIT
                    </th>
                    <th className={cn(cellPad, clientesTablaCellDividerClass, "text-center")}>
                      Dirección
                    </th>
                    <th
                      className={cn(cellPadEstrecho, "whitespace-nowrap text-center")}
                      style={clientesTablaColAnchoStyle(clientesTablaAnchoAcciones)}
                    >
                      ACC
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
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
                            cellPadEstrecho,
                            clientesTablaCellDividerClass,
                            "w-0 whitespace-nowrap text-center tabular-nums text-sm font-medium text-muted-foreground",
                          )}
                          style={clientesTablaColAnchoStyle(clientesTablaAnchoNo)}
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
                            "text-center font-mono text-sm tabular-nums",
                          )}
                        >
                          {row.nit ?? "—"}
                        </td>
                        <td
                          className={cn(
                            cellPad,
                            clientesTablaCellDividerClass,
                            "text-muted-foreground",
                          )}
                        >
                          {row.direccion ?? "—"}
                        </td>
                        <td
                          className={cn(cellPadEstrecho, "whitespace-nowrap align-middle pr-1")}
                          style={clientesTablaColAnchoStyle(clientesTablaAnchoAcciones)}
                        >
                          <div className="flex justify-end">
                            <ClienteFilaMenu
                              row={row}
                              onDetalles={() => setDetalleCliente(row)}
                              onEditar={() => setEditarCliente(row)}
                            />
                          </div>
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
              <SigetTablaPageSizeSelect
                value={pageSize}
                onChange={(next) => {
                  setPageSize(next);
                  setPage(1);
                }}
              />
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={pageSafe <= 1}
                className={clientesTablaPaginationControlClass}
                aria-label="Página anterior"
              >
                <ChevronLeft className="size-5" />
              </button>
              <span
                className={cn(
                  "min-w-[3.5rem] text-center text-base font-bold tabular-nums",
                  clientesTablaAccentTextClass,
                )}
              >
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
