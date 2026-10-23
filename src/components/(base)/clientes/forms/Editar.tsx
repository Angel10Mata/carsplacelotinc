"use client";

import { useEffect, useState } from "react";
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
import { useActualizarCustomer } from "../lib/hooks";
import type { ClienteListRow } from "../lib/zod";

type EditarClienteModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cliente: ClienteListRow | null;
};

export default function EditarClienteModal({
  open,
  onOpenChange,
  cliente,
}: EditarClienteModalProps) {
  const actualizar = useActualizarCustomer();
  const [customerName, setCustomerName] = useState("");
  const [customerNit, setCustomerNit] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  useEffect(() => {
    if (!open || !cliente) return;
    setCustomerName(cliente.nombre);
    setCustomerNit(cliente.nit ?? "");
    setCustomerAddress(cliente.direccion ?? "");
  }, [open, cliente]);

  const handleClose = () => {
    if (actualizar.isPending) return;
    onOpenChange(false);
  };

  return (
    <ModalShell
      open={open}
      onClose={handleClose}
      title="Editar cliente"
      maxWidth="max-w-lg"
    >
      <ModalForm
        onSubmit={async (e) => {
          e.preventDefault();
          if (!cliente) return;
          if (!customerName.trim()) {
            toast.warn("Indica el nombre del cliente.");
            return;
          }
          try {
            await actualizar.mutateAsync({
              id: cliente.id,
              customer_name: customerName,
              customer_nit: customerNit || undefined,
              customer_address: customerAddress || undefined,
            });
            toast.success("Cliente actualizado.");
            handleClose();
          } catch (err) {
            const code = err instanceof Error ? err.message : "DB_ERROR";
            toast.error(
              modalActionMessage(code, "No se pudo actualizar el cliente."),
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
          <ModalCancelButton onClick={handleClose} disabled={actualizar.isPending} />
          <ModalSubmit disabled={actualizar.isPending} label="Guardar" />
        </ModalFooter>
      </ModalForm>
    </ModalShell>
  );
}
