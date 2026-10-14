"use client";

import Image from "next/image";
import { AuroraText } from "@/components/ui/aurora-text";
import {
  APP_HEADER_AURORA_COLORS,
  APP_HEADER_BRAND_MAIN,
  APP_HEADER_BRAND_SUB,
  APP_LOGO_PATH,
  APP_NAME,
} from "@/lib/app-config";
import { cn } from "@/lib/utils";

type HeaderBrandProps = {
  className?: string;
  logoClassName?: string;
  compact?: boolean;
};

export function HeaderBrand({
  className,
  logoClassName,
  compact = false,
}: HeaderBrandProps) {
  const logoSize = compact
    ? "h-12 w-12 md:h-14 md:w-14"
    : "h-14 w-14 md:h-16 md:w-16";
  const titleSize = compact
    ? "text-xl md:text-2xl"
    : "text-2xl md:text-3xl";

  return (
    <span
      className={cn(
        "flex min-w-0 items-center gap-2.5 md:gap-3 font-sans",
        className,
      )}
    >
      <span
        className={cn(
          "relative shrink-0 overflow-hidden rounded-xl border border-border/50 shadow-lg",
          logoSize,
          logoClassName,
        )}
      >
        <Image
          src={APP_LOGO_PATH}
          alt={APP_NAME}
          fill
          className="object-cover"
          sizes={compact ? "56px" : "64px"}
          priority
        />
      </span>
      <span className="flex min-w-0 flex-col leading-none text-left">
        <span
          className={cn(
            "font-black uppercase tracking-tighter text-foreground",
            titleSize,
          )}
        >
          <AuroraText colors={[...APP_HEADER_AURORA_COLORS]}>
            {APP_HEADER_BRAND_MAIN}
          </AuroraText>
        </span>
        <span className="mt-1 text-[12px] font-bold uppercase tracking-[0.2em] text-muted-foreground md:text-[13px]">
          {APP_HEADER_BRAND_SUB}
        </span>
      </span>
    </span>
  );
}
