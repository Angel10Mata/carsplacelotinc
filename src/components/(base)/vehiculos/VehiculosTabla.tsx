"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  Image as ImageIcon,
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
  vehiculosTablaAccentBarClass,
  vehiculosTablaAccentTextClass,
  vehiculosTablaAddOutlineButtonClass,
  vehiculosTablaBodyRowClass,
  vehiculosTablaCardShellClass,
  vehiculosTablaCellDividerClass,
  vehiculosTablaHeadRowClass,
  vehiculosTablaFotoThumbClass,
  vehiculosTablaPaginationBarClass,
  vehiculosTablaPaginationControlClass,
  vehiculosTablaSearchInputClass,
  vehiculosTablaToolbarButtonsClass,
  vehiculosTablaToolbarFiltersClass,
  vehiculosTablaToolbarGridClass,
  vehiculosTablaToolbarSectionClass,
  vehiculosTablaAnchoAcciones,
  vehiculosTablaAnchoCliente,
  vehiculosTablaAnchoFactura,
  vehiculosTablaAnchoFoto,
  vehiculosTablaAnchoMarcaModelo,
  vehiculosTablaAnchoNo,
  vehiculosTablaAnchoVin,
  vehiculosTablaColAnchoStyle,
} from "./lib/tabla-vehiculos-ui";
import CrearVehiculoModal from "./forms/Crear";
import EditarVehiculoModal from "./forms/Editar";
import { VehiculoGaleriaViewerModal } from "./forms/VehiculoGaleriaViewerModal";
import { useCars } from "./lib/hooks";
import type { VehiculoListRow } from "./lib/zod";

const cellPad = "px-3 py-3.5";
const cellPadEstrecho = "px-1.5 py-3.5";
const marcaModeloCell = "pl-2.5 pr-4";
const PAGE_SIZE_OPTIONS = [15, 30, 45] as const;

function VehiculoFilaMenu({
  row,
  onEditar,
}: {
  row: VehiculoListRow;
  onEditar: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg border border-border bg-white text-brand transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-brand-bright dark:hover:bg-zinc-800"
          aria-label={`Acciones para ${row.placa}`}
        >
          <EllipsisVertical className="size-5" aria-hidden />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="z-[200] border-border bg-white opacity-100 dark:border-zinc-700 dark:bg-zinc-900"
      >
        <DropdownMenuItem
          className="cursor-pointer font-semibold"
          onSelect={() => onEditar()}
        >
          <PenSquare className="size-4 text-brand dark:text-brand-bright" />
          Editar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function FotoCell({
  row,
  onOpen,
}: {
  row: VehiculoListRow;
  onOpen: () => void;
}) {
  const hasPhotos = row.imageUrls.length > 0;
  return (
    <button
      type="button"
      disabled={!hasPhotos}
      onClick={onOpen}
      className={cn(
        vehiculosTablaFotoThumbClass,
        "cursor-pointer border-0 bg-transparent p-0 transition-shadow",
        hasPhotos &&
          "hover:ring-2 hover:ring-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand dark:hover:ring-brand-bright/50 dark:focus-visible:ring-brand-bright",
        !hasPhotos && "cursor-default opacity-80",
      )}
      aria-label={hasPhotos ? `Ver fotos de ${row.placa}` : `Sin fotos (${row.placa})`}
    >
      {row.fotoUrl ? (
        <Image
          src={row.fotoUrl}
          alt=""
          fill
          unoptimized
          className="object-cover"
          sizes="48px"
        />
      ) : (
        <ImageIcon
          className={cn("size-5 opacity-70", vehiculosTablaAccentTextClass)}
          aria-hidden
        />
      )}
    </button>
  );
}

export function VehiculosTabla() {
  const { data: vehiculos, isLoading, isError } = useCars();
  const [crearOpen, setCrearOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(15);
  const [galeriaRow, setGaleriaRow] = useState<VehiculoListRow | null>(null);
  const [editarCarId, setEditarCarId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const list = vehiculos ?? [];
    const q = search.trim().toLowerCase();
    return list.filter((row) => {
      if (!q) return true;
      return (
        row.placa.toLowerCase().includes(q) ||
        row.marca.toLowerCase().includes(q) ||
        row.modelo.toLowerCase().includes(q) ||
        (row.vin ?? "").toLowerCase().includes(q) ||
        (row.clienteNombre ?? "").toLowerCase().includes(q) ||
        (row.clienteNit ?? "").toLowerCase().includes(q)
      );
    });
  }, [vehiculos, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const rowOffset = (pageSafe - 1) * pageSize;
  const pageItems = filtered.slice(rowOffset, rowOffset + pageSize);

  return (
    <>
      <CrearVehiculoModal open={crearOpen} onOpenChange={setCrearOpen} />
      <VehiculoGaleriaViewerModal
        row={galeriaRow}
        onClose={() => setGaleriaRow(null)}
      />
      <EditarVehiculoModal
        open={editarCarId !== null}
        carId={editarCarId}
        onOpenChange={(next) => {
          if (!next) setEditarCarId(null);
        }}
      />
      <div
        className={cn(
          "flex w-full min-w-0 flex-col shrink-0",
          vehiculosTablaCardShellClass,
        )}
      >
      <div className={vehiculosTablaAccentBarClass} aria-hidden />
      <div className="flex min-h-0 flex-1 flex-col bg-card dark:bg-zinc-900/40">
        <div className={vehiculosTablaToolbarSectionClass}>
          <div className={vehiculosTablaToolbarGridClass}>
            <div
              className={cn(
                vehiculosTablaToolbarFiltersClass,
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
                  placeholder="Buscar por factura, VIN, cliente, título o modelo..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className={vehiculosTablaSearchInputClass}
                />
              </div>
            </div>

            <div
              className={cn(
                vehiculosTablaToolbarButtonsClass,
                "min-w-0 w-full max-lg:col-span-full",
              )}
            >
              <button
                type="button"
                className={vehiculosTablaAddOutlineButtonClass}
                onClick={() => setCrearOpen(true)}
              >
                <Plus className="size-4 shrink-0" aria-hidden />
                Añadir
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-[12rem] items-center justify-center">
            <Loader2 className="size-8 animate-spin text-brand" />
          </div>
        ) : null}

        {!isLoading && isError ? (
          <p className="px-4 py-14 text-center text-sm font-semibold text-destructive">
            No se pudo cargar la lista. Verifica la tabla{" "}
            <code className="text-xs">cars</code> en Supabase.
          </p>
        ) : null}

        {!isLoading && !isError ? (
          <div className="w-full min-w-0 overflow-x-auto overflow-y-visible">
          <table className="w-full table-fixed border-collapse text-base">
            <colgroup>
              <col style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoNo)} />
              <col style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoFactura)} />
              <col style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoCliente)} />
              <col style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoVin)} />
              <col style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoFoto)} />
              <col style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoMarcaModelo)} />
              <col style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoAcciones)} />
            </colgroup>
            <thead>
              <tr className={vehiculosTablaHeadRowClass}>
                <th
                  className={cn(
                    cellPadEstrecho,
                    vehiculosTablaCellDividerClass,
                    "text-center",
                  )}
                  style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoNo)}
                >
                  No.
                </th>
                <th
                  className={cn(cellPad, vehiculosTablaCellDividerClass, "text-center")}
                  style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoFactura)}
                >
                  Factura
                </th>
                <th
                  className={cn(
                    cellPad,
                    vehiculosTablaCellDividerClass,
                    "text-center",
                  )}
                  style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoCliente)}
                >
                  <span className="inline-flex flex-col items-center leading-tight">
                    <span>Cliente</span>
                    <span className="text-xs font-semibold normal-case text-muted-foreground">
                      NIT
                    </span>
                  </span>
                </th>
                <th
                  className={cn(cellPad, vehiculosTablaCellDividerClass, "text-center")}
                  style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoVin)}
                >
                  VIN
                </th>
                <th
                  className={cn(cellPad, vehiculosTablaCellDividerClass, "pr-2.5 text-center")}
                  style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoFoto)}
                >
                  Foto
                </th>
                <th
                  className={cn(
                    cellPad,
                    vehiculosTablaCellDividerClass,
                    "text-center",
                  )}
                  style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoMarcaModelo)}
                >
                  <span className="inline-flex flex-col items-center leading-tight">
                    <span>Marca</span>
                    <span>Modelo</span>
                  </span>
                </th>
                <th
                  className={cn(cellPadEstrecho, "whitespace-nowrap text-center")}
                  style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoAcciones)}
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-14 text-center text-sm font-semibold text-muted-foreground"
                  >
                    {search.trim()
                      ? "Sin coincidencias con la búsqueda."
                      : "Sin vehículos. Usa Añadir para registrar uno."}
                  </td>
                </tr>
              ) : (
                pageItems.map((row, idx) => (
                  <tr key={row.id} className={vehiculosTablaBodyRowClass}>
                    <td
                      className={cn(
                        cellPadEstrecho,
                        vehiculosTablaCellDividerClass,
                        "whitespace-nowrap text-center align-middle tabular-nums font-medium text-muted-foreground",
                      )}
                      style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoNo)}
                    >
                      {rowOffset + idx + 1}
                    </td>
                    <td
                      className={cn(
                        cellPad,
                        vehiculosTablaCellDividerClass,
                        "whitespace-nowrap text-center align-middle",
                      )}
                      style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoFactura)}
                    >
                      <span className="inline-flex max-w-full items-center justify-center whitespace-nowrap rounded-lg bg-zinc-100 px-3 py-1 text-sm font-black uppercase tracking-wider text-foreground dark:bg-zinc-700">
                        {row.placa}
                      </span>
                    </td>
                    <td
                      className={cn(
                        cellPad,
                        vehiculosTablaCellDividerClass,
                        "align-middle text-left",
                        marcaModeloCell,
                      )}
                      style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoCliente)}
                    >
                      {row.clienteNombre ? (
                        <span className="inline-flex max-w-full flex-col items-start gap-0.5 leading-snug">
                          <span className="break-words font-semibold text-foreground">
                            {row.clienteNombre}
                          </span>
                          {row.clienteNit ? (
                            <span className="truncate text-sm tabular-nums text-muted-foreground">
                              NIT {row.clienteNit}
                            </span>
                          ) : null}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </td>
                    <td
                      className={cn(
                        cellPad,
                        vehiculosTablaCellDividerClass,
                        "whitespace-nowrap text-center align-middle text-sm font-mono uppercase tracking-tight",
                      )}
                      style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoVin)}
                    >
                      {row.vin ?? "—"}
                    </td>
                    <td
                      className={cn(
                        cellPad,
                        vehiculosTablaCellDividerClass,
                        "pr-2.5 text-center align-middle",
                      )}
                      style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoFoto)}
                    >
                      <FotoCell
                        row={row}
                        onOpen={() => setGaleriaRow(row)}
                      />
                    </td>
                    <td
                      className={cn(
                        cellPad,
                        vehiculosTablaCellDividerClass,
                        "text-left align-middle",
                        marcaModeloCell,
                      )}
                      style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoMarcaModelo)}
                    >
                      <span className="inline-flex max-w-full flex-col items-start leading-snug capitalize">
                        <span className="break-words font-semibold text-foreground">{row.marca}</span>
                        {row.modelo !== "—" ? (
                          <span className="truncate text-base text-muted-foreground">
                            {row.modelo}
                          </span>
                        ) : null}
                      </span>
                    </td>
                    <td
                      className={cn(
                        cellPadEstrecho,
                        "whitespace-nowrap text-center align-middle",
                      )}
                      style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoAcciones)}
                    >
                      <VehiculoFilaMenu
                        row={row}
                        onEditar={() => setEditarCarId(row.id)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        ) : null}

        {!isLoading && !isError && filtered.length > 0 ? (
          <div className={vehiculosTablaPaginationBarClass}>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="h-9 rounded-lg border border-border bg-background px-2 text-sm font-bold dark:border-zinc-700"
              aria-label="Filas por página"
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={pageSafe <= 1}
              className={vehiculosTablaPaginationControlClass}
              aria-label="Página anterior"
            >
              <ChevronLeft className="size-5" />
            </button>
            <span
              className={cn(
                "min-w-[3.5rem] text-center text-base font-bold tabular-nums",
                vehiculosTablaAccentTextClass,
              )}
            >
              {pageSafe}/{totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={pageSafe >= totalPages}
              className={vehiculosTablaPaginationControlClass}
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
