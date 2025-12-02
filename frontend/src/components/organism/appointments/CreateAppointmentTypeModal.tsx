import React, { useEffect, useState } from "react";
import ModalBase from "@/components/molecules/AnalysisTypeModal";
import Button from "@/components/atoms/Button";
import { CreateAppointmentTypeData } from "@/types/add.appointment.types";

interface Props {
  isOpen: boolean;
  doctors: any[];
  onClose: () => void;
  onConfirm: (data: CreateAppointmentTypeData) => void;
}

const CreateAppointmentTypeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  doctors,
  onConfirm,
}) => {
  const [doctorId, setDoctorId] = useState("");
  const [name, setName] = useState("");
  const [generalCost, setGeneralCost] = useState("");
  const [communityCost, setCommunityCost] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setDoctorId("");
      setName("");
      setGeneralCost("");
      setCommunityCost("");
      setImageUrl("");
      setErrors({});
    }
  }, [isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!doctorId.trim()) newErrors.doctorId = "Selecciona un doctor";

    if (!name.trim()) newErrors.name = "El nombre es obligatorio";
    else if (name.trim().length < 3)
      newErrors.name = "Debe tener mínimo 3 caracteres";

    if (!generalCost.trim()) newErrors.generalCost = "El costo es obligatorio";
    else if (isNaN(Number(generalCost)))
      newErrors.generalCost = "Debe ser un número";
    else if (Number(generalCost) <= 0)
      newErrors.generalCost = "Debe ser mayor a 0";

    if (!communityCost.trim()) newErrors.communityCost = "El costo es obligatorio";
    else if (isNaN(Number(communityCost)))
      newErrors.communityCost = "Debe ser un número";
    else if (Number(communityCost) <= 0)
      newErrors.communityCost = "Debe ser mayor a 0";

    if (imageUrl.trim()) {
      try {
        new URL(imageUrl);
      } catch (_) {
        newErrors.imageUrl = "Debe ser una URL válida";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = () => {
    if (!validate()) return;

    onConfirm({
      doctorId,
      name: name.trim(),
      cost: Number(generalCost),
      communityCost: communityCost ? Number(communityCost) : undefined,
      imageUrl: imageUrl || undefined,
    });
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Nuevo Servicio Médico">

      {/* DOCTOR */}
      <div className="mb-3">
        <label className="font-semibold">Doctor</label>
        <select
          className={`w-full p-2 border rounded ${
            errors.doctorId ? "border-red-500" : ""
          }`}
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
        >
          <option value="">Selecciona doctor</option>
          {doctors.map((d) => (
            <option key={d.doctor_id} value={d.doctor_id}>
              {d.user.name} {d.user.parent_last_name}
            </option>
          ))}
        </select>
        {errors.doctorId && (
          <p className="text-red-500 text-sm">{errors.doctorId}</p>
        )}
      </div>

      {/* NAME */}
      <div className="mb-3">
        <label className="font-semibold">Nombre</label>
        <input
          className={`w-full p-2 border rounded ${
            errors.name ? "border-red-500" : ""
          }`}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name}</p>
        )}
      </div>

      {/* IMAGE */}
      <div className="mb-3">
        <label className="font-semibold">Imagen URL (opcional)</label>
        <input
          className={`w-full p-2 border rounded ${
            errors.imageUrl ? "border-red-500" : ""
          }`}
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        {errors.imageUrl && (
          <p className="text-red-500 text-sm">{errors.imageUrl}</p>
        )}
      </div>

      {/* COST */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="font-semibold">Costo General</label>
          <input
            className={`w-full p-2 border rounded ${
              errors.generalCost ? "border-red-500" : ""
            }`}
            value={generalCost}
            onChange={(e) => setGeneralCost(e.target.value)}
            inputMode="decimal"
          />
          {errors.generalCost && (
            <p className="text-red-500 text-sm">{errors.generalCost}</p>
          )}
        </div>

        <div>
          <label className="font-semibold">Costo Comunitario</label>
          <input
            className={`w-full p-2 border rounded ${
              errors.communityCost ? "border-red-500" : ""
            }`}
            value={communityCost}
            onChange={(e) => setCommunityCost(e.target.value)}
            inputMode="decimal"
          />
          {errors.communityCost && (
            <p className="text-red-500 text-sm">{errors.communityCost}</p>
          )}
        </div>
      </div>

      {/* BUTTON */}
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Crear
        </Button>
      </div>
    </ModalBase>
  );
};

export default CreateAppointmentTypeModal;