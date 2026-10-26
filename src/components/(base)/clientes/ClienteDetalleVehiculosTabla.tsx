"use client";

import { useMemo, useState } from "react";
import { Image as ImageNode, Images as ImagesNode } from "lucide";
import { ChevronLeft, ChevronRight, EllipsisVertical, Loader2, PenSquare } from "lucide-react";
import { SigetActionButton, sigetAccent } from "@/components/ui/siget-action-button";
import {
  SigetTablaPageSizeSelect,
  type SigetTablaPageSizeValue,
} from "@/components/ui/siget-tabla-page-size-select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { VehiculoListRow } from "@/components/(base)/vehiculos/lib/zod";
import {
  vehiculosTablaAccentBarClass,
  vehiculosTablaAccentTextClass,
  vehiculosTablaBodyRowClass,
  vehiculosTablaCardShellClass,
  vehiculosTablaCellDividerClass,
  vehiculosTablaColAnchoStyle,
  vehiculosTablaHeadRowClass,
  vehiculosTablaPaginationBarClass,
  vehiculosTablaPaginationControlClass,
  vehiculosTablaAnchoAcciones,
  vehiculosTablaAnchoFactura,
  vehiculosTablaAnchoFoto,
  vehiculosTablaAnchoMarcaModelo,
  vehiculosTablaAnchoNo,
  vehiculosTablaAnchoVin,
  vehiculosTablaDesktopTableWrapClass,
  vehiculosTablaMobileCardsWrapClass,
} from "@/components/(base)/vehiculos/lib/tabla-vehiculos-ui";
import { VehiculosTablaMobileCards } from "@/components/(base)/vehiculos/VehiculosTablaMobileCards";

const cellPad = "px-3 py-3.5";
const cellPadEstrecho = "px-1.5 py-3.5";
const cellPadFoto = "px-1 py-3.5";
const marcaModeloCell = "pl-2.5 pr-4";

type PageSize = SigetTablaPageSizeValue;

type ClienteDetalleVehiculosTablaProps = {
  rows: VehiculoListRow[];
  isLoading: boolean;
  isError: boolean;
  onVerGaleria: (row: VehiculoListRow) => void;
  onEditar: (row: VehiculoListRow) => void;
};

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
          className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 border-border bg-white text-brand transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-brand-bright dark:hover:bg-zinc-800"
          aria-label={`Acciones para ${row.placa}`}
        >
          <EllipsisVertical className="size-5" aria-hidden />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="left"
        align="center"
        sideOffset={6}
        className="z-[200] w-auto min-w-0 border-border bg-white p-1 opacity-100 dark:border-zinc-700 dark:bg-zinc-900"
      >
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

function FotoCell({ row, onOpen }: { row: VehiculoListRow; onOpen: () => void }) {
  return (
    <SigetActionButton
      label="Ver"
      accentColor={sigetAccent.abrir}
      morphFrom={ImageNode}
      morphTo={ImagesNode}
      onClick={onOpen}
      className="h-11 w-auto shrink-0 px-4 text-sm [&>span]:gap-0.5 [&_svg]:size-4"
      ariaLabel={`Ver fotos y factura de ${row.placa}`}
    />
  );
}

export function ClienteDetalleVehiculosTabla({
  rows,
  isLoading,
  isError,
  onVerGaleria,
  onEditar,
}: ClienteDetalleVehiculosTablaProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(15);

  const showAll = pageSize === "all";
  const totalPages = showAll ? 1 : Math.max(1, Math.ceil(rows.length / pageSize));
  const pageSafe = showAll ? 1 : Math.min(page, totalPages);
  const rowOffset = showAll ? 0 : (pageSafe - 1) * pageSize;
  const sliceSize = showAll ? rows.length : pageSize;
  const pageItems = useMemo(
    () => rows.slice(rowOffset, rowOffset + sliceSize),
    [rows, rowOffset, sliceSize],
  );

  return (
    <div className={cn("flex w-full min-w-0 flex-col shrink-0", vehiculosTablaCardShellClass)}>
      <div className={vehiculosTablaAccentBarClass} aria-hidden />
      <div className="flex min-h-0 flex-1 flex-col bg-card dark:bg-zinc-900/40">
        {isLoading ? (
          <div className="flex min-h-[12rem] items-center justify-center">
            <Loader2 className="size-8 animate-spin text-brand" />
          </div>
        ) : null}

        {!isLoading && isError ? (
          <p className="px-4 py-14 text-center text-sm font-semibold text-destructive">
            No se pudo cargar los vehículos de este cliente.
          </p>
        ) : null}

        {!isLoading && !isError ? (
          <>
          <div className={vehiculosTablaDesktopTableWrapClass}>
            <table className="w-full table-auto border-collapse text-base">
              <colgroup>
                <col style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoNo)} />
                <col style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoFactura)} />
                <col style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoVin)} />
                <col style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoMarcaModelo)} />
                <col style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoFoto)} />
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
                    className={cn(
                      cellPadEstrecho,
                      vehiculosTablaCellDividerClass,
                      "whitespace-nowrap text-center",
                    )}
                    style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoFactura)}
                  >
                    Factura
                  </th>
                  <th
                    className={cn(cellPad, vehiculosTablaCellDividerClass, "text-center")}
                    style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoVin)}
                  >
                    VIN
                  </th>
                  <th
                    className={cn(
                      cellPad,
                      vehiculosTablaCellDividerClass,
                      "whitespace-nowrap text-center",
                    )}
                    style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoMarcaModelo)}
                  >
                    Marca / Modelo
                  </th>
                  <th
                    className={cn(
                      cellPadFoto,
                      vehiculosTablaCellDividerClass,
                      "whitespace-nowrap text-center",
                    )}
                    style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoFoto)}
                  >
                    Fotos
                  </th>
                  <th
                    className={cn(
                      cellPadEstrecho,
                      "whitespace-nowrap text-center",
                    )}
                    style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoAcciones)}
                  >
                    ACC
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-14 text-center text-sm font-semibold text-muted-foreground"
                    >
                      Sin vehículos asignados a este cliente.
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
                          cellPadEstrecho,
                          vehiculosTablaCellDividerClass,
                          "whitespace-nowrap text-center align-middle",
                        )}
                      >
                        <span className="inline-flex w-max max-w-full items-center justify-center whitespace-nowrap rounded-lg bg-zinc-100 px-2.5 py-1 text-sm font-black uppercase tracking-wider text-foreground dark:bg-zinc-700">
                          {row.placa}
                        </span>
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
                          "text-left align-middle",
                          marcaModeloCell,
                        )}
                        style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoMarcaModelo)}
                      >
                        <span className="inline-flex max-w-full flex-col items-start leading-snug capitalize">
                          <span className="break-words font-semibold text-foreground">
                            {row.marca}
                          </span>
                          {row.modelo !== "—" ? (
                            <span className="truncate text-base text-muted-foreground">
                              {row.modelo}
                            </span>
                          ) : null}
                        </span>
                      </td>
                      <td
                        className={cn(
                          cellPadFoto,
                          vehiculosTablaCellDividerClass,
                          "whitespace-nowrap align-middle text-center",
                        )}
                        style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoFoto)}
                      >
                        <div className="flex justify-center">
                          <FotoCell row={row} onOpen={() => onVerGaleria(row)} />
                        </div>
                      </td>
                      <td
                        className={cn(
                          cellPadEstrecho,
                          "whitespace-nowrap align-middle text-center",
                        )}
                        style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoAcciones)}
                      >
                        <div className="flex justify-center">
                          <VehiculoFilaMenu row={row} onEditar={() => onEditar(row)} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className={vehiculosTablaMobileCardsWrapClass}>
            {pageItems.length === 0 ? (
              <p className="px-4 py-14 text-center text-base font-semibold text-muted-foreground">
                Sin vehículos asignados a este cliente.
              </p>
            ) : (
              <VehiculosTablaMobileCards
                items={pageItems}
                rowOffset={rowOffset}
                showCliente={false}
                onVerGaleria={onVerGaleria}
                renderAcciones={(row) => (
                  <VehiculoFilaMenu row={row} onEditar={() => onEditar(row)} />
                )}
              />
            )}
          </div>
          </>
        ) : null}

        {!isLoading && !isError && rows.length > 0 ? (
          <div className={vehiculosTablaPaginationBarClass}>
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
  );
}
