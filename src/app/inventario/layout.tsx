import { AppPageBackground } from "@/components/(base)/layout/AppPageBackground";

export default function InventarioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppPageBackground>{children}</AppPageBackground>;
}
