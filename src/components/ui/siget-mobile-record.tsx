"use client";

import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const sigetMobileRecordTitleClass =
  "truncate text-lg font-bold tracking-tight text-foreground";

export const sigetMobileRecordSubtitleClass = "text-sm text-muted-foreground";

export const sigetMobileRecordMetaIconClass =
  "size-4 shrink-0 text-brand dark:text-brand-bright";

export function SigetMobileRecordList({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("divide-y divide-border dark:divide-zinc-800", className)}>
      {children}
    </div>
  );
}

export function SigetMobileRecordRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "space-y-3 p-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SigetMobileRecordHeader({
  title,
  badge,
  className,
}: {
  title: ReactNode;
  badge?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-3", className)}>
      <div className="min-w-0 flex-1 text-base font-semibold leading-snug text-foreground">
        {title}
      </div>
      {badge ? <div className="shrink-0">{badge}</div> : null}
    </div>
  );
}

export function SigetMobileRecordMeta({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("space-y-2", className)}>{children}</div>;
}

export function SigetMobileRecordMetaRow({
  icon,
  children,
  subtext,
  trailing,
  className,
}: {
  icon?: ReactNode;
  children: ReactNode;
  subtext?: ReactNode;
  trailing?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex gap-2.5 text-base text-muted-foreground",
        trailing ? "items-center justify-between" : "items-start",
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-2.5">
        {icon ? <span className="mt-0.5 shrink-0">{icon}</span> : null}
        <div className="min-w-0">
          <div className="text-foreground">{children}</div>
          {subtext ? <div className="text-sm text-muted-foreground">{subtext}</div> : null}
        </div>
      </div>
      {trailing ? (
        <div className="flex shrink-0 items-center justify-end gap-1.5">
          {trailing}
        </div>
      ) : null}
    </div>
  );
}

export function SigetMobileRecordFooter({
  left,
  right,
  className,
}: {
  left?: ReactNode;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-2", className)}>
      <div className="min-w-0 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
        {left}
      </div>
      {right ? (
        <div className="flex max-w-[65%] shrink-0 flex-wrap items-center justify-end gap-1.5">
          {right}
        </div>
      ) : null}
    </div>
  );
}

export function SigetMobileRecordBadge({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
} & ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
