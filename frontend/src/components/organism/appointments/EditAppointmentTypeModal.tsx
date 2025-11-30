import React, { useState, useEffect } from "react";
import ModalBase from "@/components/molecules/AnalysisTypeModal";
import Button from "@/components/atoms/Button";
import { AppointmentTypeResponse, UpdateAppointmentTypeData } from "@/types/add.appointment.types";

interface Props {
  isOpen: boolean;
  appointmentType: AppointmentTypeResponse | null;
  onClose: () => void;
  onConfirm: (data: UpdateAppointmentTypeData) => void;
}

const EditAppointmentTypeModal: React.FC<Props> = ({
  isOpen,
  appointmentType,
  onClose,
  onConfirm,
}) => {
  const [name, setName] = useState("");
  const [general, setGeneral] = useState("");
  const [community, setCommunity] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (appointmentType) {
      setName(appointmentType.name);
      setGeneral(String(appointmentType.cost));
      setCommunity(String(appointmentType.communityCost ?? ""));
      setImage(appointmentType.imageUrl);
    }
  }, [appointmentType]);

    const submit = () => {
    if (!appointmentType) return;

    onConfirm({
        appointmentId: appointmentType.appointmentId,
        doctorId: appointmentType.doctorId,
        name,
        cost: Number(general),
        communityCost: community ? Number(community) : undefined,
        imageUrl: image,
    });
    };

  if (!appointmentType) return null;

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Editar servicio">
      <div className="mb-3">
        <label>Nombre</label>
        <input className="w-full border p-2 rounded" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="mb-3">
        <label>Imagen URL</label>
        <input className="w-full border p-2 rounded" value={image} onChange={(e) => setImage(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label>Costo General</label>
          <input className="w-full border p-2 rounded" value={general} onChange={(e) => setGeneral(e.target.value)} />
        </div>
        <div>
          <label>Costo Comunitario</label>
          <input className="w-full border p-2 rounded" value={community} onChange={(e) => setCommunity(e.target.value)} />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" onClick={submit}>Guardar</Button>
      </div>
    </ModalBase>
  );
};

export default EditAppointmentTypeModal;