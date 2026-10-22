"use client";

import { useState } from "react";
import {
  ModalShell,
  ModalForm,
  ModalField,
  ModalLabel,
  ModalInput,
  ModalFooter,
  ModalCancelButton,
  ModalSubmit,
  toast,
  modalActionMessage,
} from "@/components/ui/general-modal";
import { useCrearCustomer } from "../lib/hooks";
import type { CustomerRow } from "../lib/zod";

type CrearClienteModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (customer: CustomerRow) => void;
};

export default function CrearClienteModal({
  open,
  onOpenChange,
  onCreated,
}: CrearClienteModalProps) {
  const crear = useCrearCustomer();
  const [customerName, setCustomerName] = useState("");
  const [customerNit, setCustomerNit] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  const reset = () => {
    setCustomerName("");
    setCustomerNit("");
    setCustomerAddress("");
  };

  const handleClose = () => {
    if (crear.isPending) return;
    onOpenChange(false);
    reset();
  };

  return (
    <ModalShell open={open} onClose={handleClose} title="Añadir cliente" maxWidth="max-w-lg">
      <ModalForm
        onSubmit={async (e) => {
          e.preventDefault();
          if (!customerName.trim()) {
            toast.warn("Indica el nombre del cliente.");
            return;
          }
          try {
            const created = await crear.mutateAsync({
              customer_name: customerName,
              customer_nit: customerNit || undefined,
              customer_address: customerAddress || undefined,
            });
            toast.success("Cliente registrado.");
            onCreated?.(created);
            handleClose();
          } catch (err) {
            const code = err instanceof Error ? err.message : "DB_ERROR";
            toast.error(
              modalActionMessage(code, "No se pudo guardar el cliente."),
            );
          }
        }}
      >
        <ModalField>
          <ModalLabel>Nombre</ModalLabel>
          <ModalInput
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            autoFocus
          />
        </ModalField>
        <ModalField>
          <ModalLabel>NIT</ModalLabel>
          <ModalInput value={customerNit} onChange={(e) => setCustomerNit(e.target.value)} />
        </ModalField>
        <ModalField>
          <ModalLabel>Dirección</ModalLabel>
          <ModalInput
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
          />
        </ModalField>
        <ModalFooter>
          <ModalCancelButton onClick={handleClose} disabled={crear.isPending} />
          <ModalSubmit disabled={crear.isPending} label="Guardar" />
        </ModalFooter>
      </ModalForm>
    </ModalShell>
  );
}
