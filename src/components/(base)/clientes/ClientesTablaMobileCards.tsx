"use client";

import type { ReactNode } from "react";
import { MapPin, IdCard } from "lucide-react";
import {
  SigetMobileRecordFooter,
  SigetMobileRecordHeader,
  SigetMobileRecordList,
  SigetMobileRecordMeta,
  SigetMobileRecordMetaRow,
  SigetMobileRecordRow,
  sigetMobileRecordMetaIconClass,
  sigetMobileRecordTitleClass,
} from "@/components/ui/siget-mobile-record";
import type { ClienteListRow } from "./lib/zod";

type ClientesTablaMobileCardsProps = {
  items: ClienteListRow[];
  rowOffset: number;
  renderAcciones: (row: ClienteListRow) => ReactNode;
};

export function ClientesTablaMobileCards({
  items,
  rowOffset,
  renderAcciones,
}: ClientesTablaMobileCardsProps) {
  return (
    <SigetMobileRecordList>
      {items.map((row, idx) => (
        <SigetMobileRecordRow key={row.id}>
          <SigetMobileRecordHeader
            title={
              <p className={`capitalize ${sigetMobileRecordTitleClass}`}>{row.nombre}</p>
            }
            badge={
              <span className="tabular-nums text-sm font-semibold text-muted-foreground">
                #{rowOffset + idx + 1}
              </span>
            }
          />

          <SigetMobileRecordMeta>
            <SigetMobileRecordMetaRow icon={<IdCard className={sigetMobileRecordMetaIconClass} />}>
              <span className="font-mono tabular-nums">{row.nit ?? "—"}</span>
            </SigetMobileRecordMetaRow>
            <SigetMobileRecordMetaRow icon={<MapPin className={sigetMobileRecordMetaIconClass} />}>
              <span className="line-clamp-3">{row.direccion ?? "—"}</span>
            </SigetMobileRecordMetaRow>
          </SigetMobileRecordMeta>

          <SigetMobileRecordFooter right={renderAcciones(row)} />
        </SigetMobileRecordRow>
      ))}
    </SigetMobileRecordList>
  );
}
