"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Image as ImageNode, Images as ImagesNode } from "lucide";
import {
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  Loader2,
  PenSquare,
  LayoutGrid,
  Plus,
  Search,
} from "lucide-react";
import { PUBLIC_CATALOG_FROM_VEHICULOS_PATH } from "@/lib/app-config";
import { SigetActionButton, sigetAccent } from "@/components/ui/siget-action-button";
import { ModuleDataLoadingPanel } from "@/components/ui/module-page-loading";
import { cn } from "@/lib/utils";
import {
  sigetTablaAccionesMenuBotonClass,
  sigetTablaAnchoAccionesColStyle,
  sigetTablaCeldaAccionesClass,
  sigetTablaCeldaBotonCentrarClass,
  sigetTablaCeldaBotonHeaderClass,
  sigetTablaCeldaFotosVerClass,
  sigetTablaFotosVerBotonClass,
} from "@/components/ui/siget-tabla-acciones-ui";
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
import {
  vehiculosTablaAccentBarClass,
  vehiculosTablaAccentTextClass,
  vehiculosTablaAddOutlineButtonClass,
  vehiculosTablaBodyRowClass,
  vehiculosTablaCardShellClass,
  vehiculosTablaCellDividerClass,
  vehiculosTablaHeadRowClass,
  vehiculosTablaPaginationBarClass,
  vehiculosTablaPaginationControlClass,
  vehiculosTablaSearchInputClass,
  vehiculosTablaToolbarButtonsClass,
  vehiculosTablaToolbarButtonsMobileGridClass,
  vehiculosTablaToolbarFiltersClass,
  vehiculosTablaToolbarGridClass,
  vehiculosTablaToolbarSectionClass,
  vehiculosTablaAnchoFactura,
  vehiculosTablaAnchoFotos,
  vehiculosTablaAnchoMarcaModelo,
  vehiculosTablaAnchoNo,
  vehiculosTablaAnchoVin,
  vehiculosTablaColAnchoStyle,
  vehiculosTablaDesktopTableWrapClass,
  vehiculosTablaMobileCardsWrapClass,
} from "./lib/tabla-vehiculos-ui";
import { VehiculosTablaMobileCards } from "./VehiculosTablaMobileCards";
import CrearVehiculoModal from "./forms/Crear";
import EditarVehiculoModal from "./forms/Editar";
import { VehiculoGaleriaViewerModal } from "./forms/VehiculoGaleriaViewerModal";
import { useCars } from "./lib/hooks";
import type { VehiculoListRow } from "./lib/zod";

const cellPad = "px-3 py-3.5";
const cellPadEstrecho = "px-1.5 py-3.5";
const marcaModeloCell = "pl-2.5 pr-1";
type PageSize = SigetTablaPageSizeValue;

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
          className={sigetTablaAccionesMenuBotonClass}
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

function FotoCell({
  row,
  onOpen,
}: {
  row: VehiculoListRow;
  onOpen: () => void;
}) {
  return (
    <SigetActionButton
      label="Ver"
      accentColor={sigetAccent.abrir}
      morphFrom={ImageNode}
      morphTo={ImagesNode}
      onClick={onOpen}
      className={sigetTablaFotosVerBotonClass}
      ariaLabel={`Ver fotos y factura de ${row.placa}`}
    />
  );
}

export function VehiculosTabla() {
  const { data: vehiculos, isLoading, isError } = useCars();
  const [crearOpen, setCrearOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(15);
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
                  placeholder="Buscar"
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
                vehiculosTablaToolbarButtonsMobileGridClass,
                "min-w-0 w-full max-lg:col-span-full",
              )}
            >
              <Link
                href={PUBLIC_CATALOG_FROM_VEHICULOS_PATH}
                className={vehiculosTablaAddOutlineButtonClass}
              >
                <LayoutGrid className="size-4 shrink-0" aria-hidden />
                Inventario
              </Link>
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

        {isLoading ? <ModuleDataLoadingPanel /> : null}

        {!isLoading && isError ? (
          <p className="px-4 py-14 text-center text-sm font-semibold text-destructive">
            No se pudo cargar la lista. Verifica la tabla{" "}
            <code className="text-xs">cars</code> en Supabase.
          </p>
        ) : null}

        {!isLoading && !isError ? (
          <>
          <div className={vehiculosTablaDesktopTableWrapClass}>
          <table className="w-full table-fixed border-collapse text-base">
            <colgroup>
              <col style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoNo)} />
              <col style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoFactura)} />
              <col />
              <col style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoVin)} />
              <col
                style={{
                  width: vehiculosTablaAnchoMarcaModelo.width,
                  maxWidth: vehiculosTablaAnchoMarcaModelo.maxWidth,
                }}
              />
              <col style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoFotos)} />
              <col style={sigetTablaAnchoAccionesColStyle} />
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
                >
                  Factura
                </th>
                <th
                  className={cn(
                    cellPad,
                    vehiculosTablaCellDividerClass,
                    "min-w-0 whitespace-nowrap text-center",
                  )}
                >
                  Cliente
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
                    sigetTablaCeldaBotonHeaderClass,
                    vehiculosTablaCellDividerClass,
                  )}
                  style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoFotos)}
                >
                  Fotos
                </th>
                <th
                  className={sigetTablaCeldaBotonHeaderClass}
                  style={sigetTablaAnchoAccionesColStyle}
                >
                  ACC
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
                        "min-w-0 align-middle text-left whitespace-nowrap",
                        marcaModeloCell,
                      )}
                    >
                      {row.clienteNombre ? (
                        <span className="font-semibold text-foreground">
                          {row.clienteNombre}
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
                        sigetTablaCeldaFotosVerClass,
                        vehiculosTablaCellDividerClass,
                      )}
                      style={vehiculosTablaColAnchoStyle(vehiculosTablaAnchoFotos)}
                    >
                      <div className={sigetTablaCeldaBotonCentrarClass}>
                        <FotoCell
                          row={row}
                          onOpen={() => setGaleriaRow(row)}
                        />
                      </div>
                    </td>
                    <td
                      className={sigetTablaCeldaAccionesClass}
                      style={sigetTablaAnchoAccionesColStyle}
                    >
                      <div className={sigetTablaCeldaBotonCentrarClass}>
                        <VehiculoFilaMenu
                          row={row}
                          onEditar={() => setEditarCarId(row.id)}
                        />
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
                {search.trim()
                  ? "Sin coincidencias con la búsqueda."
                  : "Sin vehículos. Usa Añadir para registrar uno."}
              </p>
            ) : (
              <VehiculosTablaMobileCards
                items={pageItems}
                rowOffset={rowOffset}
                onVerGaleria={setGaleriaRow}
                renderAcciones={(row) => (
                  <VehiculoFilaMenu row={row} onEditar={() => setEditarCarId(row.id)} />
                )}
              />
            )}
          </div>
          </>
        ) : null}

        {!isLoading && !isError && filtered.length > 0 ? (
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
    </>
  );
}
