import { AppPageBackground } from "@/components/(base)/layout/AppPageBackground";

export default function AuthRoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppPageBackground centered>{children}</AppPageBackground>;
}
