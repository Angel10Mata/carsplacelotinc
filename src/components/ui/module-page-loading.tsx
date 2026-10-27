import { Loader2 } from "lucide-react";
import { moduleContentMaxWidth } from "@/lib/module-layout";
import { cn } from "@/lib/utils";

export function ModuleDataLoadingPanel({
  className,
  minHeightClass = "min-h-[12rem]",
}: {
  className?: string;
  minHeightClass?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center rounded-2xl border border-zinc-200/80 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900",
        minHeightClass,
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label="Cargando"
    >
      <Loader2 className="size-9 animate-spin text-brand dark:text-brand-bright" />
    </div>
  );
}

export function ModulePageLoading({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex w-full flex-1 min-h-0 items-center justify-center px-3 py-8 sm:px-4 md:px-5",
        className,
      )}
    >
      <div className={cn("w-full", moduleContentMaxWidth, "mx-auto")}>
        <ModuleDataLoadingPanel minHeightClass="min-h-[min(20rem,50dvh)]" />
      </div>
    </div>
  );
}

export function ModuleRouteSuspenseFallback() {
  return <ModulePageLoading />;
}
