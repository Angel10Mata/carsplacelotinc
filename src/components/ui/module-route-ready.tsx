"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useIsFetching } from "@tanstack/react-query";
import { ModulePageLoading } from "@/components/ui/module-page-loading";

const SETTLE_MS = 50;

export function ModuleRouteReady({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const fetching = useIsFetching();
  const fetchingRef = useRef(fetching);
  fetchingRef.current = fetching;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
  }, [pathname]);

  useEffect(() => {
    if (ready) return;
    const id = window.setTimeout(() => {
      if (fetchingRef.current === 0) {
        setReady(true);
      }
    }, SETTLE_MS);
    return () => window.clearTimeout(id);
  }, [pathname, fetching, ready]);

  return (
    <>
      {ready ? null : <ModulePageLoading />}
      <div className={ready ? "contents" : "hidden"} aria-hidden={!ready}>
        {children}
      </div>
    </>
  );
}
