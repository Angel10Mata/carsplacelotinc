"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUserContext } from "@/components/(base)/providers/UserProvider";
import { MorphIconBox } from "@/components/ui/morph-hover-icon";
import { APP_MODULES, type AppModuleConfig } from "@/lib/app-modules";
import { moduleIconColors, moduleMorphIcons, navMorphIcons } from "@/lib/morph-icons";
import { dashboardInnerClass, dashboardOuterClass } from "@/lib/module-layout";

const DashboardHeader = () => (
  <div className="mb-4 md:mb-6 w-full px-1 text-left">
    <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-50 leading-[0.95]">
      Administración
    </h1>
  </div>
);

function ModuleMorphIcon({
  moduleId,
  size,
  hovered,
}: {
  moduleId: string;
  size: number;
  hovered?: boolean;
}) {
  const pair = moduleMorphIcons[moduleId] ?? navMorphIcons.fallback;
  const palette =
    moduleIconColors[moduleId] ?? {
      color: "#2E9BD0",
      boxClass:
        "bg-sky-50 dark:bg-sky-950/45 border-sky-200/90 dark:border-sky-800/55",
    };

  const isLarge = size >= 56;

  return (
    <MorphIconBox
      from={pair.from}
      to={pair.to}
      size={size}
      color={palette.color}
      strokeWidth={isLarge ? 2.1 : 1.85}
      spring="bouncy"
      padding={isLarge ? "md" : "sm"}
      hovered={hovered}
      boxClassName={cn(
        palette.boxClass,
        "rounded-2xl shrink-0",
        isLarge && "scale-100 group-hover/card:scale-[1.02] transition-transform duration-300",
      )}
    />
  );
}

function DashboardModuleCard({
  mod,
  index,
  onNavigate,
}: {
  mod: AppModuleConfig;
  index: number;
  onNavigate: (href: string) => void;
}) {
  const [hovered, setHovered] = useState(false);

  const iconSize =
    mod.size === "hero"
      ? 64
      : mod.size === "tall"
        ? 56
        : mod.size === "wide"
          ? 48
          : 40;

  const iconColor = moduleIconColors[mod.id]?.color ?? "#2E9BD0";

  return (
    <motion.div
      className={cn(
        "cursor-pointer w-full relative col-span-1 row-span-1 group/card",
        mod.bento,
        (mod.size === "hero" || mod.size === "tall") && "min-h-[250px] sm:min-h-0",
      )}
      id={`${mod.id}-card`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, delay: index * 0.04, ease: "easeOut" }}
    >
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onNavigate(mod.href);
          }
        }}
        className={cn(
          "w-full h-full rounded-2xl overflow-hidden cursor-pointer",
          "border",
          mod.cardBorder,
          "shadow-sm hover:shadow-md dark:shadow-none dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)]",
          "transition-[box-shadow,border-color,background-color] duration-200",
          mod.cardBg,
        )}
        onClick={() => onNavigate(mod.href)}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <span className="absolute top-4 right-4 z-20 hidden sm:inline-flex rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {mod.tag}
        </span>
        <div
          className={cn(
            "w-full h-full flex flex-col relative",
            mod.size === "compact" || mod.size === "wide" ? "justify-start md:justify-between gap-2 md:gap-0" : "justify-between",
            mod.size === "hero" || mod.size === "tall" ? "p-6 pb-6 md:p-8 md:pb-8" : "p-4 pb-3 md:p-5 md:pb-5",
          )}
        >
          <div
            className={cn(
              "relative z-10 flex flex-row items-center justify-start gap-4 w-full",
              mod.size === "compact" || mod.size === "wide" ? "md:flex-1" : "flex-1",
            )}
          >
            <ModuleMorphIcon moduleId={mod.id} size={iconSize} hovered={hovered} />

            <div className="flex-1 min-w-0 flex flex-col justify-start">
              <h3
                className="font-black tracking-tighter uppercase leading-none text-zinc-900 dark:text-zinc-100"
                style={{
                  fontSize:
                    mod.size === "hero"
                      ? "1.875rem"
                      : mod.size === "tall"
                        ? "1.5rem"
                        : mod.size === "wide"
                          ? "1.25rem"
                          : "1.125rem",
                }}
              >
                {mod.title}
                {mod.subtitle ? (
                  <>
                    <br />
                    <span className="text-zinc-800 dark:text-white transition-colors duration-500">
                      {mod.subtitle}
                    </span>
                  </>
                ) : null}
              </h3>

              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium mt-2 leading-tight line-clamp-2">
                {mod.desc}
              </p>
            </div>
          </div>

          <div
            className={cn(
              "relative z-10 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800",
              mod.size === "compact" || mod.size === "wide" ? "pt-2 md:pt-2.5 md:mt-2" : "pt-2.5 mt-2",
            )}
          >
            <div className="flex items-center justify-between mt-auto">
              <span
                className={cn(
                  "text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors inline-flex items-center gap-1.5",
                  !hovered && "text-zinc-400 dark:text-zinc-500",
                )}
                style={hovered ? { color: iconColor } : undefined}
              >
                Entrar al Módulo
                <MorphIconBox
                  from={navMorphIcons.arrowUpRight.from}
                  to={navMorphIcons.arrowUpRight.to}
                  size={14}
                  color={iconColor}
                  strokeWidth={2}
                  spring="snappy"
                  padding="xs"
                  hovered={hovered}
                  boxClassName="border-0 bg-transparent !scale-100"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DashboardEmptyModules() {
  return (
    <div className="w-full rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/50 p-10 md:p-14 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
        Sin módulos de negocio
      </p>
      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
        Los módulos anteriores fueron retirados. Agrega entradas en{" "}
        <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">src/lib/app-modules.ts</code>{" "}
        y crea cada módulo bajo{" "}
        <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">src/components/(base)/</code>.
      </p>
    </div>
  );
}

export function VerDashboard() {
  const { effectiveRole } = useUserContext();
  const router = useRouter();

  const isSuperOrAdmin = ["super", "admin"].includes(effectiveRole);
  const roleLoaded = effectiveRole !== "authenticated";

  const visibleModules = APP_MODULES.filter((mod) => {
    if (!roleLoaded) return true;
    if (mod.requiresAdmin && !isSuperOrAdmin) return false;
    if (mod.allowedRoles && !mod.allowedRoles.includes(effectiveRole))
      return false;
    return true;
  });

  const handleCardClick = (href: string) => {
    router.push(href);
  };

  const AreaLabel = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center justify-center gap-3 w-full px-1 mb-4 md:mb-5">
      <div className="h-px flex-1 max-w-24 bg-zinc-200 dark:bg-zinc-800" />
      <span className="text-[10px] font-black uppercase tracking-[0.35em] text-zinc-500 dark:text-zinc-500 shrink-0">
        {children}
      </span>
      <div className="h-px flex-1 max-w-24 bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );

  return (
    <div className={dashboardOuterClass}>
      <div className={dashboardInnerClass}>
        <DashboardHeader />
        {visibleModules.length === 0 ? (
          <DashboardEmptyModules />
        ) : (
          <div className="w-full rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-4 md:p-6 shadow-sm">
            <AreaLabel>Negocio</AreaLabel>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 auto-rows-auto sm:auto-rows-[160px]">
              {visibleModules.map((mod, index) => (
                <DashboardModuleCard
                  key={mod.id}
                  mod={mod}
                  index={index}
                  onNavigate={handleCardClick}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
