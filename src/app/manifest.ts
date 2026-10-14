import { MetadataRoute } from "next";
import { APP_BASE_PATH, APP_LOGO_PATH, APP_NAME } from "@/lib/app-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_NAME,
    short_name: "TCPL",
    description: "The Car Place Lot Inc — gestión vehicular",
    start_url: APP_BASE_PATH,
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: APP_LOGO_PATH,
        sizes: "64x64 192x192 512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: APP_LOGO_PATH,
        sizes: "64x64 192x192 512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
