"use client";

import type { ReactNode } from "react";
import { Image as ImageNode, Images as ImagesNode } from "lucide";
import { Hash, User } from "lucide-react";
import { SigetActionButton, sigetAccent } from "@/components/ui/siget-action-button";
import { sigetTablaFotosVerBotonClass } from "@/components/ui/siget-tabla-acciones-ui";
import {
  SigetMobileRecordFooter,
  SigetMobileRecordHeader,
  SigetMobileRecordList,
  SigetMobileRecordMeta,
  SigetMobileRecordMetaRow,
  SigetMobileRecordRow,
  sigetMobileRecordMetaIconClass,
  sigetMobileRecordSubtitleClass,
  sigetMobileRecordTitleClass,
} from "@/components/ui/siget-mobile-record";
import type { VehiculoListRow } from "./lib/zod";

type VehiculosTablaMobileCardsProps = {
  items: VehiculoListRow[];
  rowOffset: number;
  showCliente?: boolean;
  onVerGaleria: (row: VehiculoListRow) => void;
  renderAcciones: (row: VehiculoListRow) => ReactNode;
};

export function VehiculosTablaMobileCards({
  items,
  rowOffset,
  showCliente = true,
  onVerGaleria,
  renderAcciones,
}: VehiculosTablaMobileCardsProps) {
  return (
    <SigetMobileRecordList>
      {items.map((row, idx) => (
        <SigetMobileRecordRow key={row.id}>
          <SigetMobileRecordHeader
            title={
              <div className="min-w-0">
                <p className={sigetMobileRecordTitleClass}>
                  <span className="inline-flex max-w-full items-center rounded-lg bg-zinc-100 px-2.5 py-1 text-base font-black uppercase tracking-wider text-foreground dark:bg-zinc-700">
                    {row.placa}
                  </span>
                </p>
                <p className={`mt-1.5 capitalize ${sigetMobileRecordSubtitleClass}`}>
                  {row.marca}
                  {row.modelo !== "—" ? ` · ${row.modelo}` : ""}
                </p>
              </div>
            }
            badge={
              <span className="tabular-nums text-sm font-semibold text-muted-foreground">
                #{rowOffset + idx + 1}
              </span>
            }
          />

          <SigetMobileRecordMeta>
            {showCliente ? (
              <SigetMobileRecordMetaRow icon={<User className={sigetMobileRecordMetaIconClass} />}>
                {row.clienteNombre ?? "—"}
              </SigetMobileRecordMetaRow>
            ) : null}
            <SigetMobileRecordMetaRow icon={<Hash className={sigetMobileRecordMetaIconClass} />}>
              <span className="font-mono text-sm uppercase tracking-tight">
                {row.vin ?? "—"}
              </span>
            </SigetMobileRecordMetaRow>
          </SigetMobileRecordMeta>

          <SigetMobileRecordFooter
            right={
              <>
                <SigetActionButton
                  label="Ver"
                  accentColor={sigetAccent.abrir}
                  morphFrom={ImageNode}
                  morphTo={ImagesNode}
                  onClick={() => onVerGaleria(row)}
                  className={sigetTablaFotosVerBotonClass}
                  ariaLabel={`Ver fotos y factura de ${row.placa}`}
                />
                {renderAcciones(row)}
              </>
            }
          />
        </SigetMobileRecordRow>
      ))}
    </SigetMobileRecordList>
  );
}
