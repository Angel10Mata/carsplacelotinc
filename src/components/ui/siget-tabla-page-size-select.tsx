"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SigetTablaPageSizeValue = 15 | 30 | 45 | "all";

export const SIGET_TABLA_PAGE_SIZE_OPTIONS: {
  value: SigetTablaPageSizeValue;
  label: string;
}[] = [
  { value: 15, label: "15" },
  { value: 30, label: "30" },
  { value: 45, label: "45" },
  { value: "all", label: "Todos" },
];

export function SigetTablaPageSizeSelect({
  value,
  onChange,
}: {
  value: SigetTablaPageSizeValue;
  onChange: (value: SigetTablaPageSizeValue) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const currentLabel =
    SIGET_TABLA_PAGE_SIZE_OPTIONS.find((opt) => opt.value === value)?.label ??
    String(value);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Filas por página"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex h-9 min-w-[5.25rem] cursor-pointer items-center justify-between gap-2 rounded-lg border border-zinc-200/80 bg-white px-2.5 text-sm font-bold text-foreground transition-colors",
          "hover:border-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/25",
          "dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600 dark:focus-visible:ring-brand-bright/30",
          open &&
            "border-brand/40 ring-2 ring-brand/20 dark:border-brand-bright/40 dark:ring-brand-bright/25",
        )}
      >
        <span className="tabular-nums">{currentLabel}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-brand transition-transform dark:text-brand-bright",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label="Filas por página"
          className={cn(
            "absolute bottom-full left-0 z-[200] mb-1.5 min-w-full overflow-hidden rounded-xl border border-zinc-200/80 bg-white py-1 opacity-100 shadow-lg",
            "dark:border-zinc-700 dark:bg-zinc-900",
          )}
        >
          {SIGET_TABLA_PAGE_SIZE_OPTIONS.map((opt) => {
            const selected = value === opt.value;
            return (
              <button
                key={String(opt.value)}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between gap-2 px-3 py-2 text-left text-sm font-bold transition-colors",
                  selected
                    ? "bg-brand/10 text-brand dark:bg-brand-bright/10 dark:text-brand-bright"
                    : "text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800",
                )}
              >
                <span className="tabular-nums">{opt.label}</span>
                {selected ? (
                  <Check
                    className="size-4 shrink-0 text-brand dark:text-brand-bright"
                    aria-hidden
                  />
                ) : (
                  <span className="size-4 shrink-0" aria-hidden />
                )}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
