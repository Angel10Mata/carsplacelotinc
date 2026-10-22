import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // React Compiler en dev compila mucho y suele dejar el overlay en "Compiling" minutos u horas.
  reactCompiler: isProd,
  async redirects() {
    return [
      {
        source: "/farmacia-la-salud",
        destination: "/TheCarsPlace",
        permanent: true,
      },
      {
        source: "/farmacia-la-salud/:path*",
        destination: "/TheCarsPlace/:path*",
        permanent: true,
      },
      {
        source: "/farmamuni",
        destination: "/TheCarsPlace",
        permanent: true,
      },
      {
        source: "/farmamuni/:path*",
        destination: "/TheCarsPlace/:path*",
        permanent: true,
      },
      {
        source: "/TheCarsPlace/flota-vehicular",
        destination: "/TheCarsPlace/vehiculos",
        permanent: true,
      },
      {
        source: "/TheCarsPlace/flota-vehicular/:path*",
        destination: "/TheCarsPlace/vehiculos/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
