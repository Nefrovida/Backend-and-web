// frontend/src/components/organism/appointments/CreateAppointmentTypeModal.tsx
import React, { useEffect, useState, useRef } from "react";
import ModalBase from "@/components/molecules/AnalysisTypeModal";
import Button from "@/components/atoms/Button";
import { CreateAppointmentTypeData } from "@/types/add.appointment.types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: CreateAppointmentTypeData) => void;
  externalError?: string;
}

const MAX_COST = 5_000_000;

const CreateAppointmentTypeModal: React.FC<Props> = ({
  isOpen,
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

  // ======== Auto-resize identical ========
  const autoResize = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = "auto";
    const style = window.getComputedStyle(el);
    const lineHeight = parseFloat(style.lineHeight) || 20;

    const minHeight = lineHeight * 2;
    const maxHeight = lineHeight * 6;

    const content = el.scrollHeight;
    el.style.height = `${Math.min(Math.max(content, minHeight), maxHeight)}px`;
    el.style.overflowY = content > maxHeight ? "auto" : "hidden";
  };

  // ======== Reset al abrir ========
  useEffect(() => {
    if (isOpen) {
      setName("");
      setDescription("");
      setCost("");
      setCommunityCost("");
      setActive(true);
      setError("");
      autoResize(descriptionRef.current);
    }
  }, [isOpen]);

  // ======== Error server ========
  useEffect(() => {
    if (externalError) setError(externalError);
  }, [externalError]);

  useEffect(() => {
    autoResize(descriptionRef.current);
  }, [description]);

  // ============================================
  // VALIDACIONES
  // ============================================
  const handleConfirm = () => {
    setError("");

    if (!name || name.trim().length < 3)
      return setError("El nombre debe tener al menos 3 caracteres");
    if (name.trim().length > 50)
      return setError("El nombre no puede exceder 50 caracteres");

    if (!description.trim())
      return setError("La descripción es obligatoria");
    if (description.trim().length > 500)
      return setError("La descripción no puede exceder 500 caracteres");

    if (cost === "") return setError("Ingresa el costo");
    const parsedCost = Number(cost);
    if (Number.isNaN(parsedCost)) return setError("El costo debe ser numérico");
    if (parsedCost <= 0) return setError("El costo debe ser mayor a 0");
    if (parsedCost > MAX_COST)
      return setError(`El costo no puede exceder ${MAX_COST}`);

    const parsedCommunity =
      communityCost === "" ? null : Number(communityCost);

    if (parsedCommunity !== null) {
      if (Number.isNaN(parsedCommunity))
        return setError("El costo comunitario debe ser número");
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
    });
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Crear tipo de cita">
      {error && (
        <div className="mb-3 p-2 text-sm bg-red-100 border border-red-500 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-3">
        <label className="text-sm font-medium">Nombre</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 rounded-lg border"
          placeholder="Ej: Consulta general"
          maxLength={50}
        />
      </div>

      <div className="mb-3">
        <label className="text-sm font-medium">Descripción</label>
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

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-sm font-medium">Costo</label>
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
          <label className="text-sm font-medium">Costo comunitario</label>
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
        <Button onClick={onClose} variant="secondary">
          Cancelar
        </Button>
        <Button onClick={handleConfirm} variant="primary">
          Crear
        </Button>
      </div>
    </ModalBase>
  );
};

export default CreateAppointmentTypeModal;