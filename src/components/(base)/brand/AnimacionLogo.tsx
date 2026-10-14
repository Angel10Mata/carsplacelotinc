"use client";

import { motion, AnimatePresence } from "framer-motion";
import { APP_LOGO_OVERLAY_TAGLINE } from "@/lib/app-config";
import { AppLogo } from "./AppLogo";

type AnimacionLogoProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AnimacionLogo({ isOpen, onClose }: AnimacionLogoProps) {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="fullscreen-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[1000000] flex items-center justify-center bg-white/70 dark:bg-background/80 backdrop-blur-[20px] cursor-pointer p-4 lg:p-12 overflow-hidden"
        >
          <motion.button
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            type="button"
            className="absolute top-8 right-8 p-3 rounded-full bg-black/10 dark:bg-white/10 text-black dark:text-white hover:bg-black/20 dark:hover:bg-white/20 transition-colors z-20"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </motion.button>

          <motion.div
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center gap-4 pointer-events-none select-none"
          >
            <AppLogo size={320} priority className="w-[min(80vw,320px)] h-auto" />
            <p className="max-w-[min(90vw,28rem)] text-center text-sm font-bold tracking-wide text-muted-foreground md:text-base">
              {APP_LOGO_OVERLAY_TAGLINE}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
