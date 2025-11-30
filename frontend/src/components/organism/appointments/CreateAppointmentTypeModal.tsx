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

  useEffect(() => {
    if (isOpen) {
      setDoctorId("");
      setName("");
      setGeneralCost("");
      setCommunityCost("");
      setImageUrl("");
    }
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm({
      doctorId,
      name,
      cost: Number(generalCost),
      communityCost: communityCost ? Number(communityCost) : undefined,
      imageUrl,
    });
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Nuevo Servicio Médico">

      <div className="mb-3">
        <label>Doctor</label>
        <select
          className="w-full p-2 border rounded"
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
      </div>

      <div className="mb-3">
        <label>Nombre</label>
        <input className="w-full p-2 border rounded" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="mb-3">
        <label>Imagen URL</label>
        <input className="w-full p-2 border rounded" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label>Costo</label>
          <input className="w-full p-2 border rounded" value={generalCost} onChange={(e) => setGeneralCost(e.target.value)} />
        </div>
        <div>
          <label>Comunitario</label>
          <input className="w-full p-2 border rounded" value={communityCost} onChange={(e) => setCommunityCost(e.target.value)} />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" onClick={handleConfirm}>Crear</Button>
      </div>
    </ModalBase>
  );
};

export default CreateAppointmentTypeModal;