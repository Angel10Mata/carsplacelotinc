"use client";

import Image from "next/image";
import { APP_LOGO_PATH, APP_NAME } from "@/lib/app-config";
import { cn } from "@/lib/utils";

type AppLogoProps = {
  className?: string;
  size?: number;
  priority?: boolean;
};

export function AppLogo({ className, size = 120, priority = false }: AppLogoProps) {
  return (
    <Image
      src={APP_LOGO_PATH}
      alt={APP_NAME}
      width={size}
      height={size}
      priority={priority}
      className={cn("object-contain", className)}
    />
  );
}
