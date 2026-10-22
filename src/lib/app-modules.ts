import { APP_BASE_PATH } from "@/lib/app-config";

export interface AppModuleConfig {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  href: string;
  allowedRoles?: string[];
  requiresAdmin?: boolean;
  bento: string;
  size: "hero" | "tall" | "wide" | "compact";
  tag: string;
  cardBg: string;
  cardBorder: string;
}

const moduleCardSurface =
  "bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800/90";
const moduleCardBorder = "border-zinc-200 dark:border-zinc-800";

export const APP_MODULES: AppModuleConfig[] = [
  {
    id: "vehiculos",
    title: "Vehículos",
    subtitle: "",
    desc: "Inventario de vehículos, estatus en lote, documentación y ubicación.",
    href: `${APP_BASE_PATH}/vehiculos`,
    allowedRoles: ["super", "admin", "user"],
    bento: "col-span-1 row-span-2 md:col-span-2 md:row-span-2",
    size: "hero",
    tag: "Vehículos · Lote",
    cardBg: moduleCardSurface,
    cardBorder: moduleCardBorder,
  },
  {
    id: "clientes",
    title: "Clientes",
    subtitle: "",
    desc: "Directorio de clientes, NIT, dirección y datos de contacto.",
    href: `${APP_BASE_PATH}/clientes`,
    allowedRoles: ["super", "admin", "user"],
    bento: "col-span-1 row-span-1 md:col-start-3 md:row-start-1",
    size: "compact",
    tag: "Directorio · Contacto",
    cardBg: moduleCardSurface,
    cardBorder: moduleCardBorder,
  },
  {
    id: "reporteria",
    title: "Reportería",
    subtitle: "",
    desc: "Reportes operativos, exportaciones y métricas del negocio.",
    href: `${APP_BASE_PATH}/reporteria`,
    allowedRoles: ["super", "admin", "user"],
    bento: "col-span-1 row-span-1 md:col-start-3 md:row-start-2",
    size: "compact",
    tag: "KPIs · Exportar",
    cardBg: moduleCardSurface,
    cardBorder: moduleCardBorder,
  },
];

export const ADMIN_MENU_ITEMS = [
  {
    id: "dispositivos",
    href: `${APP_BASE_PATH}/admin/dispositivos`,
    title: "Dispositivos",
    desc: "Autorizar o rechazar solicitudes de acceso por dispositivo.",
  },
  {
    id: "usuarios",
    href: `${APP_BASE_PATH}/admin/usuarios`,
    title: "Usuarios",
    desc: "Gestionar cuentas de usuario, roles y permisos.",
  },
  {
    id: "configuraciones",
    href: `${APP_BASE_PATH}/admin/configuraciones`,
    title: "Configuraciones",
    desc: "Ajustes generales del sistema y seguridad.",
  },
] as const;
