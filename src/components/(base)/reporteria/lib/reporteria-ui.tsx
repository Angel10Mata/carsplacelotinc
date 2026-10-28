import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ReporteriaKpiCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-xl font-black tracking-tight text-foreground">
        {value}
      </p>
    </div>
  );
}

export function ReporteriaCard({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-zinc-50 shadow-sm dark:border-zinc-700 dark:bg-zinc-800/40",
        className,
      )}
    >
      <div className="border-b border-border px-4 py-4 dark:border-zinc-700 md:px-6">
        <h2 className="text-lg font-black uppercase tracking-tight text-foreground md:text-xl">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
