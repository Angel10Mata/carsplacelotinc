"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { getModuleBackHref } from "@/lib/module-back-href";

type ModuleHeaderBackButtonProps = {
  className?: string;
  size?: "sm" | "md";
  href?: string;
  ariaLabel?: string;
};

export function ModuleHeaderBackButton({
  className,
  size = "md",
  href: hrefProp,
  ariaLabel = "Regresar",
}: ModuleHeaderBackButtonProps) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const href = hrefProp ?? getModuleBackHref(pathname);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!href) return null;

  const boxClass = size === "sm" ? "size-10" : "size-12";
  const iconClass = size === "sm" ? "size-5" : "size-6";
  const shellClass = cn(
    "flex shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white",
    "text-zinc-700 transition-colors hover:bg-zinc-100",
    "dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700",
    boxClass,
    className,
  );

  if (!mounted) {
    return <div aria-hidden suppressHydrationWarning className={shellClass} />;
  }

  return (
    <button
      type="button"
      onClick={() => router.push(href)}
      aria-label={ariaLabel}
      className={cn(shellClass, "cursor-pointer")}
    >
      <ArrowLeft className={iconClass} aria-hidden />
    </button>
  );
}
