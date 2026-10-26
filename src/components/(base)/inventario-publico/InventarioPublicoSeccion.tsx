"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { CarFront, ChevronLeft, ChevronRight, Filter, Loader2, Search } from "lucide-react";
import { AuroraText } from "@/components/ui/aurora-text";
import { TCPL_AURORA_COLORS, TCPL_AURORA_MUTED } from "@/lib/brand-colors";
import { cn } from "@/lib/utils";
import type { PublicInventoryItem } from "./lib/zod";

type InventarioPublicoSeccionProps = {
  embedded?: boolean;
  items: PublicInventoryItem[];
  isLoading: boolean;
  isError: boolean;
  onSelect: (item: PublicInventoryItem) => void;
};

export function InventarioPublicoSeccion({
  embedded = false,
  items,
  isLoading,
  isError,
  onSelect,
}: InventarioPublicoSeccionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showGrid, setShowGrid] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | "all">(8);

  useEffect(() => {
    if (!isLoading && items.length >= 0) {
      const t = window.setTimeout(() => setShowGrid(true), 100);
      return () => window.clearTimeout(t);
    }
    setShowGrid(false);
    return undefined;
  }, [isLoading, items.length]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.vin?.toLowerCase().includes(q) ?? false) ||
        item.invoiceNumber.toLowerCase().includes(q),
    );
  }, [items, searchTerm]);

  const totalPages =
    itemsPerPage === "all" ? 1 : Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = itemsPerPage === "all" ? 0 : (safePage - 1) * itemsPerPage;
  const endIndex =
    itemsPerPage === "all" ? filtered.length : startIndex + itemsPerPage;
  const pageItems = filtered.slice(startIndex, endIndex);

  return (
    <section
      id="inventory"
      className={cn(
        "flex w-full flex-col overflow-x-hidden bg-background",
        embedded
          ? "min-h-0 border-0 pt-0"
          : "min-h-screen snap-start border-b border-border/40 pt-24",
      )}
    >
      <div
        className={cn(
          "flex shrink-0 flex-col items-center justify-center px-6 text-center transition-all duration-1000 ease-out lg:px-12",
          showGrid ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        )}
      >
        <h1 className="max-w-4xl text-3xl font-black uppercase leading-none tracking-tighter text-foreground sm:text-5xl lg:text-6xl">
          <AuroraText colors={[...TCPL_AURORA_COLORS]}>Premium Selection</AuroraText>
          <br />
          <AuroraText className="text-muted-foreground/50" colors={[...TCPL_AURORA_MUTED]}>
            at The Cars Place.
          </AuroraText>
        </h1>

        <p className="mt-6 mb-10 max-w-lg text-sm font-medium text-muted-foreground/80 sm:text-base">
          Explore our curated inventory of vehicles. Each unit is documented and verified for
          transparency.
        </p>

        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
          <CarFront className="size-4" aria-hidden />
          Inventory 2026
        </div>

        <div className="flex w-full max-w-2xl items-center gap-2 rounded-2xl border border-border/50 bg-background/40 p-1.5 shadow-xl backdrop-blur-2xl transition-all focus-within:border-primary/50">
          <div className="flex flex-1 items-center gap-3 px-4">
            <Search className="size-4 text-muted-foreground" aria-hidden />
            <input
              type="search"
              placeholder="Search by name or VIN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent py-3 text-sm text-foreground outline-none"
            />
          </div>
          <button
            type="button"
            className="cursor-pointer rounded-xl bg-foreground px-6 py-3 text-xs font-bold text-background transition-opacity hover:opacity-90"
            aria-label="Filtros"
          >
            <Filter className="size-3.5" aria-hidden />
          </button>
        </div>
      </div>

      <div className="mt-10 flex flex-1 flex-col px-6 pb-20 lg:px-12">
        {isLoading ? (
          <p className="flex items-center justify-center gap-2 py-20 text-muted-foreground">
            <Loader2 className="size-6 animate-spin" aria-hidden />
            Loading inventory…
          </p>
        ) : null}

        {isError ? (
          <p className="py-20 text-center text-sm font-semibold text-destructive">
            Could not load inventory. Try again later.
          </p>
        ) : null}

        {!isLoading && !isError && pageItems.length === 0 ? (
          <p className="py-20 text-center text-base font-semibold text-muted-foreground">
            {searchTerm.trim() ? "No matches for your search." : "No vehicles in catalog yet."}
          </p>
        ) : null}

        {!isLoading && !isError && pageItems.length > 0 ? (
          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pageItems.map((item, idx) => {
              const statusAvailable = item.status === "AVAILABLE";
              return (
                <div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelect(item)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelect(item);
                    }
                  }}
                  className={cn(
                    "group relative flex cursor-pointer flex-col overflow-hidden rounded-4xl border border-gray-400 bg-card/30 shadow-none backdrop-blur-sm transition-all duration-700 ease-out hover:-translate-y-1 hover:border-primary/50",
                    showGrid ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0",
                  )}
                  style={{ transitionDelay: `${idx * 50}ms` }}
                >
                  <div className="relative aspect-16/11 overflow-hidden border-b border-gray-400 bg-zinc-900">
                    {item.coverImageUrl ? (
                      <Image
                        src={item.coverImageUrl}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority={idx < 4}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs font-bold uppercase text-muted-foreground">
                        No photo
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col p-5 pt-2">
                    <div className="flex w-full items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-foreground">
                        {item.invoiceDateLabel}
                      </span>
                      <span
                        className={cn(
                          "text-lg font-bold uppercase tracking-widest",
                          statusAvailable ? "text-emerald-500" : "text-rose-500",
                        )}
                      >
                        {item.status}
                      </span>
                    </div>

                    <h3 className="mt-0.5 truncate text-lg font-bold uppercase tracking-tight text-foreground">
                      {item.title}
                    </h3>

                    {item.vin ? (
                      <p className="mt-1 truncate text-[10px] font-medium uppercase text-red-500">
                        VIN:{item.vin}
                      </p>
                    ) : null}

                    <div className="my-3 h-px w-full bg-gray-400" />

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-black text-foreground">{item.priceLabel}</span>
                      <span className="rounded-xl bg-foreground px-5 py-2.5 text-[11px] font-bold uppercase text-background">
                        Details
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        {!isLoading && !isError && filtered.length > 0 ? (
          <div className="mt-12 flex w-full flex-wrap items-center justify-center gap-4">
            <div className="flex items-center rounded-xl bg-foreground px-6 py-3 text-background shadow-lg">
              <select
                value={itemsPerPage}
                onChange={(e) =>
                  setItemsPerPage(e.target.value === "all" ? "all" : Number(e.target.value))
                }
                className="cursor-pointer appearance-none bg-transparent text-center text-sm font-bold outline-none"
              >
                <option value={8} className="bg-background text-foreground">
                  8
                </option>
                <option value={16} className="bg-background text-foreground">
                  16
                </option>
                <option value="all" className="bg-background text-foreground">
                  ALL
                </option>
              </select>
            </div>

            <div className="flex items-center gap-6 rounded-xl bg-foreground px-6 py-3 text-background shadow-lg">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="flex cursor-pointer items-center justify-center transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-20"
                aria-label="Previous page"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="min-w-[3ch] select-none text-center font-mono text-sm font-bold">
                {safePage}/{totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="flex cursor-pointer items-center justify-center transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-20"
                aria-label="Next page"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
