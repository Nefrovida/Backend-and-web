// frontend/src/components/organism/appointments/EditAppointmentTypeModal.tsx
import React, { useEffect, useRef, useState } from "react";
import ModalBase from "@/components/molecules/AnalysisTypeModal";
import Button from "@/components/atoms/Button";
import {
  AppointmentTypeResponse,
  UpdateAppointmentTypeData,
} from "@/types/add.appointment.types";

interface Props {
  isOpen: boolean;
  appointmentType: AppointmentTypeResponse | null;
  onClose: () => void;
  onConfirm: (data: UpdateAppointmentTypeData) => void;
  externalError?: string;
}

const MAX_COST = 5_000_000;

const EditAppointmentTypeModal: React.FC<Props> = ({
  isOpen,
  appointmentType,
  onClose,
  onConfirm,
  externalError,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState<number | "">("");
  const [communityCost, setCommunityCost] = useState<number | "">("");
  const [active, setActive] = useState(true);
  const [error, setError] = useState("");

  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

  const autoResize = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = "auto";
    const content = el.scrollHeight;
    el.style.height = `${content}px`;
  };

  // Load initial values
  useEffect(() => {
    if (appointmentType) {
      setName(appointmentType.name.trim());
      setCost(Number(appointmentType.cost));
      setCommunityCost(
        appointmentType.communityCost !== null
          ? Number(appointmentType.communityCost)
          : ""
      );
      setError("");

      setTimeout(() => autoResize(descriptionRef.current), 0);
    }
  }, [appointmentType]);

  useEffect(() => {
    if (externalError) setError(externalError);
  }, [externalError]);

  useEffect(() => {
    autoResize(descriptionRef.current);
  }, [description]);

  if (!appointmentType) return null;

  // ==============================
  // VALIDACIONES
  // ==============================
  const handleConfirm = () => {
    setError("");

    if (!name.trim() || name.trim().length < 3)
      return setError("El nombre debe tener mínimo 3 caracteres");
    if (name.trim().length > 50)
      return setError("El nombre no puede exceder 50 caracteres");

    if (!description.trim())
      return setError("La descripción es obligatoria");
    if (description.trim().length > 500)
      return setError("La descripción no puede exceder 500 caracteres");

    if (cost === "")
      return setError("Ingresa el costo");
    const parsedCost = Number(cost);
    if (Number.isNaN(parsedCost))
      return setError("El costo debe ser un número válido");
    if (parsedCost <= 0)
      return setError("El costo debe ser mayor a 0");
    if (parsedCost > MAX_COST)
      return setError(`El costo no puede exceder ${MAX_COST}`);

    const parsedCommunity =
      communityCost === "" ? null : Number(communityCost);

    if (parsedCommunity !== null) {
      if (Number.isNaN(parsedCommunity))
        return setError("El costo comunitario debe ser un número válido");
      if (parsedCommunity <= 0)
        return setError("El costo comunitario debe ser mayor a 0");
      if (parsedCommunity > MAX_COST)
        return setError(`El costo comunitario no puede exceder ${MAX_COST}`);
    }

    onConfirm({
      name: name.trim(),
      description: description.trim(),
      cost: parsedCost,
      communityCost: parsedCommunity,
      active,
    });
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Editar tipo de cita">
      {error && (
        <div className="mb-3 p-2 bg-red-100 border border-red-500 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <div className="mb-3">
        <label className="block text-sm font-medium">Nombre</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 rounded-lg border"
          maxLength={50}
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium">Descripción</label>
        <textarea
          ref={descriptionRef}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            autoResize(e.target);
          }}
          className="w-full p-2 rounded-lg border resize-none overflow-hidden"
          rows={2}
          maxLength={500}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-sm font-medium">Costo</label>
          <input
            type="number"
            value={cost}
            onChange={(e) =>
              setCost(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="w-full p-2 rounded-lg border"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Costo comunitario</label>
          <input
            type="number"
            value={communityCost}
            onChange={(e) =>
              setCommunityCost(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            className="w-full p-2 rounded-lg border"
          />
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
        />
        <span className="text-sm text-gray-600">Activo</span>
      </div>

      <div className="flex justify-center gap-4">
        <Button onClick={onClose} variant="secondary">Cancelar</Button>
        <Button onClick={handleConfirm} variant="primary">Guardar cambios</Button>
      </div>
    </ModalBase>
  );
};

export default EditAppointmentTypeModal;