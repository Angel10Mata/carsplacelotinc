import type { CSSProperties } from "react";

export type VehiculosTablaColAncho = {
  width?: string;
  minWidth?: string;
  maxWidth?: string;
};

export function vehiculosTablaColAnchoStyle(
  def: VehiculosTablaColAncho,
): CSSProperties {
  return {
    width: def.width,
    minWidth: def.minWidth,
    maxWidth: def.maxWidth,
  };
}

export const vehiculosTablaAnchoNo: VehiculosTablaColAncho = {
  width: "3rem",
  maxWidth: "3rem",
};

export const vehiculosTablaAnchoFactura: VehiculosTablaColAncho = {
  width: "148px",
  minWidth: "148px",
  maxWidth: "148px",
};

export const vehiculosTablaAnchoCliente: VehiculosTablaColAncho = {
  width: "1%",
};

export const vehiculosTablaAnchoVin: VehiculosTablaColAncho = {
  width: "10.75rem",
  minWidth: "10.25rem",
  maxWidth: "11rem",
};

export const vehiculosTablaAnchoFoto: VehiculosTablaColAncho = {
  width: "5rem",
  maxWidth: "5rem",
};

export const vehiculosTablaAnchoMarcaModelo: VehiculosTablaColAncho = {
  width: "15.5rem",
  minWidth: "11rem",
  maxWidth: "16.5rem",
};

export const vehiculosTablaAnchoAcciones: VehiculosTablaColAncho = {
  width: "3rem",
  maxWidth: "3rem",
};

export const vehiculosTablaDesktopTableWrapClass =
  "hidden w-full min-w-0 overflow-x-auto overflow-y-visible lg:block";

export const vehiculosTablaMobileCardsWrapClass = "flex w-full flex-col lg:hidden";

export const vehiculosTablaAccentBarClass = "h-1 w-full shrink-0 bg-brand";

export const vehiculosTablaCardShellClass =
  "overflow-hidden rounded-2xl border border-border bg-card shadow-sm dark:border-zinc-700 dark:bg-zinc-900/40";

export const vehiculosTablaToolbarSectionClass =
  "w-full shrink-0 border-b border-border p-4 dark:border-zinc-700";

export const vehiculosTablaToolbarGridClass =
  "flex w-full min-w-0 flex-col gap-2 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-3";

export const vehiculosTablaToolbarFiltersClass =
  "flex min-w-0 w-full flex-col gap-2 sm:flex-row sm:items-center";

export const vehiculosTablaToolbarButtonsClass =
  "flex w-full min-w-0 flex-row flex-wrap items-center justify-end gap-1 max-lg:flex-col max-lg:items-stretch max-lg:gap-2 max-lg:[&>*]:w-full [&_button]:w-auto max-lg:[&_button]:w-full";

export const vehiculosTablaToolbarButtonsMobileGridClass =
  "max-lg:!grid max-lg:!w-full max-lg:grid-cols-2 max-lg:gap-2 max-lg:[&>*]:min-w-0 max-lg:[&>*]:w-full";

export const vehiculosTablaSearchInputClass =
  "h-11 w-full rounded-xl border border-border/60 bg-background/80 pl-10 pr-3 text-base text-foreground outline-none shadow-sm backdrop-blur-sm transition-colors placeholder:text-muted-foreground focus:border-brand/50 focus:ring-2 focus:ring-brand/20 dark:border-zinc-700 dark:bg-zinc-900/50 dark:focus:border-brand-bright/50 dark:focus:ring-brand-bright/20";

export const vehiculosTablaAddOutlineButtonClass =
  "inline-flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-brand bg-transparent px-4 text-sm font-bold text-brand shadow-none transition-colors hover:bg-brand/10 dark:border-brand-bright dark:text-brand-bright dark:hover:bg-brand-bright/10 max-lg:w-full max-lg:text-base";

export const vehiculosTablaHeadRowClass =
  "border-b border-border bg-zinc-100 text-xs font-bold uppercase tracking-widest text-brand dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-brand-bright";

export const vehiculosTablaBodyRowClass =
  "border-b border-border transition-colors last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/40";

export const vehiculosTablaCellDividerClass =
  "border-r border-border dark:border-zinc-800";

export const vehiculosTablaPaginationBarClass =
  "flex h-[3.5625rem] shrink-0 flex-wrap items-center justify-center gap-3 border-t border-border px-4 text-muted-foreground dark:border-zinc-700";

export const vehiculosTablaAccentTextClass =
  "text-brand dark:text-brand-bright";

export const vehiculosTablaFotoThumbClass =
  "relative mx-auto flex size-14 items-center justify-center overflow-hidden rounded-xl border border-border bg-zinc-50 transition-colors hover:border-brand/40 dark:border-zinc-600 dark:bg-zinc-800/80 dark:hover:border-brand-bright/40";

export const vehiculosTablaPaginationControlClass =
  "inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border-0 text-brand transition-colors hover:bg-brand/10 disabled:cursor-not-allowed disabled:opacity-40 dark:text-brand-bright dark:hover:bg-brand-bright/10";
