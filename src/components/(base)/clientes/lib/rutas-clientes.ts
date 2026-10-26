import { APP_BASE_PATH } from "@/lib/app-config";

export function clienteDetallePath(customerId: string): string {
  return `${APP_BASE_PATH}/cliente/detalles/${customerId}`;
}
