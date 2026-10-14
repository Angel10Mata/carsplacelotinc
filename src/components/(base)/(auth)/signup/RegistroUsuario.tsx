"use client";

import { useState } from "react";
import SignUp from "@/components/(base)/(auth)/signup/SignUp";

// Página registro
export default function RegistroUsuario() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <main className="flex flex-1 flex-col items-center justify-center w-full py-10 md:py-14">
      <SignUp
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        presentation="fullscreen"
      />
    </main>
  );
}
