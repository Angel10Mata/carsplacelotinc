"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, type IconNode } from "lucide";
import { Loader2 } from "lucide-react";
import { normalizarFechaCalendario } from "@/lib/fechas-gt";
import {
  ModalShell,
  ModalForm,
  ModalField,
  ModalLabel,
  ModalInput,
  ModalTextarea,
  ModalFechaCalendario,
  ModalFooter,
  ModalCancelButton,
  ModalSubmit,
  toast,
  modalActionMessage,
} from "@/components/ui/general-modal";
import {
  VehiculoActionError,
  vehiculoActionErrorMessage,
} from "../lib/action-errors";
import { SigetActionButton, sigetAccent } from "@/components/ui/siget-action-button";
import { cn } from "@/lib/utils";
import { allocateCarStorageFolderAction } from "../lib/actions";
import { useActualizarCar, useCarForEdit } from "../lib/hooks";
import {
  DEFAULT_CAR_INCOTERMS,
  DEFAULT_CAR_STATUS,
  DEFAULT_CAR_TERMS,
  formatMarcaModeloDisplay,
  parseMarcaModeloInput,
} from "../lib/helpers";
import { BuscarClienteField } from "./BuscarClienteField";
import {
  removeCarImageFromStorage,
  VehiculoFotosGaleria,
} from "./VehiculoFotosGaleria";
import type { CustomerRow } from "@/components/(base)/clientes/lib/zod";
import {
  vehiculosWizardFormClass,
  vehiculosWizardModalContentClass,
  vehiculosWizardStepBodyClass,
} from "../lib/vehiculos-wizard-ui";

const WIZARD_STEPS = 2 as const;

type EditarVehiculoModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  carId: string | null;
};

function SectionTitle({ children }: { children: string }) {
  return (
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand dark:text-brand-bright">
      {children}
    </p>
  );
}

function WizardProgress({ step }: { step: number }) {
  return (
    <div className="shrink-0 space-y-1.5">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Paso {step} de {WIZARD_STEPS} ·{" "}
        {step === 1 ? "Datos del vehículo" : "Imágenes"}
      </p>
      <div className="flex gap-1.5">
        {Array.from({ length: WIZARD_STEPS }, (_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              i + 1 <= step ? "bg-brand dark:bg-brand-bright" : "bg-zinc-200 dark:bg-zinc-700",
            )}
            aria-hidden
          />
        ))}
      </div>
    </div>
  );
}

function validateStep1(input: {
  invoiceNumber: string;
  invoiceDate: string;
  marcaModelo: string;
  total: string;
  terms: string;
}): boolean {
  if (!input.invoiceNumber.trim()) {
    toast.warn("Indica el número de factura.");
    return false;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.invoiceDate)) {
    toast.warn("Indica una fecha de factura válida.");
    return false;
  }
  if (!input.marcaModelo.trim()) {
    toast.warn("Indica la marca o modelo del vehículo.");
    return false;
  }
  if (input.total === "" || Number(input.total) < 0) {
    toast.warn("Indica un total válido.");
    return false;
  }
  if (!input.terms.trim()) {
    toast.warn("Indica los términos de venta.");
    return false;
  }
  return true;
}

export default function EditarVehiculoModal({
  open,
  onOpenChange,
  carId,
}: EditarVehiculoModalProps) {
  const actualizar = useActualizarCar();
  const { data, isLoading, isError } = useCarForEdit(carId, open);
  const initialImagePathsRef = useRef<string[]>([]);
  const [hydratedId, setHydratedId] = useState<string | null>(null);
  const [hasSignedReceipt, setHasSignedReceipt] = useState(false);
  const [step, setStep] = useState(1);
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRow | null>(
    null,
  );
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [marcaModelo, setMarcaModelo] = useState("");
  const [carVin, setCarVin] = useState("");
  const [carStatus, setCarStatus] = useState(DEFAULT_CAR_STATUS);
  const [carPrice, setCarPrice] = useState("");
  const [carImagePaths, setCarImagePaths] = useState<string[]>([]);
  const [carStorageFolderId, setCarStorageFolderId] = useState<string | null>(
    null,
  );
  const [allocatingFolder, setAllocatingFolder] = useState(false);
  const [imagesBusy, setImagesBusy] = useState(false);
  const [total, setTotal] = useState("");
  const [terms, setTerms] = useState(DEFAULT_CAR_TERMS);
  const [incoterms, setIncoterms] = useState(DEFAULT_CAR_INCOTERMS);

  useEffect(() => {
    if (!open || !data || !carId || hydratedId === carId) return;
    const { car, customer } = data;
    setHasSignedReceipt(car.has_signed_receipt);
    setCustomerSearch("");
    setSelectedCustomer(customer);
    setInvoiceNumber(car.invoice_number);
    setInvoiceDate(normalizarFechaCalendario(car.invoice_date));
    setMarcaModelo(formatMarcaModeloDisplay(car.car_title, car.car_model));
    setCarVin(car.car_vin?.trim() ?? "");
    setCarStatus(car.car_status?.trim() || DEFAULT_CAR_STATUS);
    const precio = car.car_price ?? car.total;
    setCarPrice(precio !== null ? String(precio) : "");
    setTotal(String(car.total));
    setTerms(car.terms);
    setIncoterms(car.incoterms?.trim() || DEFAULT_CAR_INCOTERMS);
    const images = [...car.car_images];
    initialImagePathsRef.current = images;
    setCarImagePaths(images);
    setCarStorageFolderId(car.car_id?.trim() || null);
    setStep(1);
    setHydratedId(carId);
  }, [open, data, carId, hydratedId]);

  useEffect(() => {
    if (!open) {
      setHydratedId(null);
      setStep(1);
    }
  }, [open]);

  useEffect(() => {
    if (open && isError) {
      toast.error(modalActionMessage("NOT_FOUND", "No se pudo cargar el vehículo."));
      onOpenChange(false);
    }
  }, [open, isError, onOpenChange]);

  const discardNewImages = () => {
    const initial = new Set(initialImagePathsRef.current);
    carImagePaths.forEach((path) => {
      if (!initial.has(path)) void removeCarImageFromStorage(path);
    });
  };

  const handleClose = () => {
    if (actualizar.isPending) return;
    discardNewImages();
    onOpenChange(false);
  };

  const pending = actualizar.isPending;
  const ready = hydratedId === carId && !!carId;

  const setPrecioTotal = (value: string) => {
    setCarPrice(value);
    setTotal(value);
  };

  const goNext = async () => {
    if (
      !validateStep1({
        invoiceNumber,
        invoiceDate,
        marcaModelo,
        total,
        terms,
      })
    ) {
      return;
    }
    if (!carStorageFolderId) {
      setAllocatingFolder(true);
      try {
        const result = await allocateCarStorageFolderAction();
        if (!result.ok) {
          toast.error("No se pudo asignar carpeta de fotos.");
          return;
        }
        setCarStorageFolderId(result.carFolderId);
      } finally {
        setAllocatingFolder(false);
      }
    }
    setStep(2);
  };

  return (
    <ModalShell
      open={open && !!carId}
      onClose={handleClose}
      title="Editar vehículo"
      maxWidth="max-w-3xl"
      contentClassName={vehiculosWizardModalContentClass}
    >
      {isLoading || !ready ? (
        <div className="flex min-h-[42rem] flex-1 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-brand" />
        </div>
      ) : (
        <ModalForm
          className={vehiculosWizardFormClass}
          onSubmit={async (e) => {
            e.preventDefault();
            if (step !== WIZARD_STEPS || !carId) return;
            try {
              const { car_title, car_model } = parseMarcaModeloInput(marcaModelo);
              await actualizar.mutateAsync({
                id: carId,
                invoice_number: invoiceNumber,
                invoice_date: invoiceDate,
                has_signed_receipt: hasSignedReceipt,
                customer_id: selectedCustomer?.id,
                car_id: carStorageFolderId ?? undefined,
                car_title,
                car_model: car_model || undefined,
                car_vin: carVin || undefined,
                car_status: carStatus.trim() || DEFAULT_CAR_STATUS,
                car_price: carPrice ? Number(carPrice) : undefined,
                car_image_urls: carImagePaths,
                sub_total: Number(carPrice) || Number(total) || 0,
                total: Number(total) || 0,
                terms,
                incoterms: incoterms || undefined,
              });
              toast.success("Vehículo actualizado.");
              initialImagePathsRef.current = [...carImagePaths];
              onOpenChange(false);
            } catch (err) {
              if (err instanceof VehiculoActionError) {
                const fallback = "No se pudo actualizar el vehículo.";
                const specific = vehiculoActionErrorMessage(
                  err.message,
                  fallback,
                  err.detail,
                );
                toast.error(
                  specific !== fallback && err.message.startsWith("DUPLICATE")
                    ? specific
                    : modalActionMessage(err.message, fallback),
                );
                return;
              }
              const code = err instanceof Error ? err.message : "DB_ERROR";
              toast.error(
                modalActionMessage(code, "No se pudo actualizar el vehículo."),
              );
            }
          }}
        >
          <WizardProgress step={step} />

          {step === 1 ? (
            <div className={vehiculosWizardStepBodyClass}>
              <SectionTitle>Factura</SectionTitle>
              <BuscarClienteField
                query={customerSearch}
                selected={selectedCustomer}
                onQueryChange={setCustomerSearch}
                onSelect={setSelectedCustomer}
                onClearSelection={() => setSelectedCustomer(null)}
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <ModalField>
                  <ModalLabel>Número de factura</ModalLabel>
                  <ModalInput
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                  />
                </ModalField>
                <ModalField>
                  <ModalLabel>Fecha de factura</ModalLabel>
                  <ModalFechaCalendario
                    value={invoiceDate}
                    onChange={setInvoiceDate}
                  />
                </ModalField>
              </div>

              <SectionTitle>Vehículo</SectionTitle>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <ModalField>
                  <ModalLabel>VIN</ModalLabel>
                  <ModalInput
                    value={carVin}
                    onChange={(e) => setCarVin(e.target.value)}
                  />
                </ModalField>
                <ModalField>
                  <ModalLabel>Marca / Modelo</ModalLabel>
                  <ModalInput
                    value={marcaModelo}
                    onChange={(e) => setMarcaModelo(e.target.value)}
                    placeholder="Marca / Modelo"
                  />
                </ModalField>
              </div>
              <ModalField className="sm:max-w-[50%]">
                <ModalLabel>Estado</ModalLabel>
                <ModalInput
                  value={carStatus}
                  onChange={(e) => setCarStatus(e.target.value)}
                  placeholder={DEFAULT_CAR_STATUS}
                />
              </ModalField>

              <SectionTitle>Totales y términos</SectionTitle>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <ModalField>
                  <ModalLabel>Precio</ModalLabel>
                  <ModalInput
                    type="number"
                    min={0}
                    step="0.01"
                    value={carPrice}
                    onChange={(e) => setPrecioTotal(e.target.value)}
                  />
                </ModalField>
                <ModalField>
                  <ModalLabel>Total</ModalLabel>
                  <ModalInput
                    type="number"
                    min={0}
                    step="0.01"
                    value={total}
                    onChange={(e) => setPrecioTotal(e.target.value)}
                  />
                </ModalField>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <ModalField>
                  <ModalLabel>Incoterms</ModalLabel>
                  <ModalInput
                    value={incoterms}
                    onChange={(e) => setIncoterms(e.target.value)}
                  />
                </ModalField>
                <ModalField>
                  <ModalLabel>Términos de venta</ModalLabel>
                  <ModalTextarea
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                    rows={1}
                    className="min-h-10 resize-y"
                  />
                </ModalField>
              </div>
            </div>
          ) : (
            <div className={cn(vehiculosWizardStepBodyClass, "gap-2.5")}>
              <SectionTitle>Fotografías del vehículo</SectionTitle>
              <p className="text-sm text-muted-foreground">
                {carStorageFolderId ? (
                  <>
                    Vehículo{" "}
                    <span className="font-bold text-foreground">
                      #{carStorageFolderId}
                    </span>
                    {" · "}
                    carpeta{" "}
                    <span className="font-mono text-xs">{carStorageFolderId}/</span>
                  </>
                ) : (
                  "Sin carpeta asignada; se creará al continuar."
                )}
              </p>
              <VehiculoFotosGaleria
                storageFolderId={carStorageFolderId}
                paths={carImagePaths}
                onChange={setCarImagePaths}
                onBusyChange={setImagesBusy}
              />
            </div>
          )}

          <ModalFooter className="shrink-0">
            {step === 1 ? (
              <>
                <ModalCancelButton onClick={handleClose} disabled={pending} />
                <SigetActionButton
                  label="Siguiente"
                  accentColor={sigetAccent.guardar}
                  morphFrom={ArrowRight as IconNode}
                  morphTo={ArrowRight as IconNode}
                  morphOnHover={false}
                  onClick={() => void goNext()}
                  disabled={allocatingFolder}
                  ariaLabel="Continuar al paso de imágenes"
                  className="w-auto shrink-0"
                />
              </>
            ) : (
              <>
                <SigetActionButton
                  label="Anterior"
                  accentColor={sigetAccent.cancelar}
                  morphFrom={ChevronLeft as IconNode}
                  morphTo={ChevronLeft as IconNode}
                  morphOnHover={false}
                  onClick={() => setStep(1)}
                  disabled={pending}
                  className="w-auto shrink-0"
                />
                <ModalCancelButton onClick={handleClose} disabled={pending} />
                <ModalSubmit
                  disabled={pending || imagesBusy || !carStorageFolderId}
                  label="Guardar"
                />
              </>
            )}
          </ModalFooter>
        </ModalForm>
      )}
    </ModalShell>
  );
}
