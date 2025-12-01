import React, { useState, useEffect } from "react";
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


  const [errorName, setErrorName] = useState("");
  const [errorGeneral, setErrorGeneral] = useState("");
  const [errorCommunity, setErrorCommunity] = useState("");

  useEffect(() => {
    if (appointmentType) {
      setName(appointmentType.name);
      setGeneral(String(appointmentType.cost));
      setCommunity(String(appointmentType.communityCost ?? ""));
      setImage(appointmentType.imageUrl);

      setErrorName("");
      setErrorGeneral("");
      setErrorCommunity("");
    }
  }, [appointmentType]);


  const validate = (): boolean => {
    let valid = true;


    if (name && name.trim().length < 3) {
      setErrorName("El nombre debe tener al menos 3 caracteres.");
      valid = false;
    } else {
      setErrorName("");
    }

    if (!general) {
      setErrorGeneral("El costo general es obligatorio.");
      valid = false;
    } else if (isNaN(Number(general))) {
      setErrorGeneral("Solo se permiten números.");
      valid = false;
    } else if (Number(general) <= 0) {
      setErrorGeneral("El costo debe ser mayor a 0.");
      valid = false;
    } else {
      setErrorGeneral("");
    }

    if (!community) {
      setErrorCommunity("El costo general es obligatorio.");
      valid = false;
    } else if (isNaN(Number(community))) {
      setErrorCommunity("Solo se permiten números.");
      valid = false;
    } else if (Number(community) <= 0) {
      setErrorCommunity("El costo debe ser mayor a 0.");
      valid = false;
    } else {
      setErrorCommunity("");
    }

    return valid;
  };

  const submit = () => {
    if (!appointmentType) return;
    if (!validate()) return;

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
      {/* NAME */}
      <div className="mb-3">
        <label>Nombre</label>
        <input
          className={`w-full border p-2 rounded ${
            errorName ? "border-red-500" : ""
          }`}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errorName && <p className="text-red-500 text-sm">{errorName}</p>}
      </div>

      {/* IMAGE URL */}
      <div className="mb-3">
        <label>Imagen URL</label>
        <input
          className="w-full border p-2 rounded"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* GENERAL COST */}
        <div>
          <label>Costo General</label>
          <input
            className={`w-full border p-2 rounded ${
              errorGeneral ? "border-red-500" : ""
            }`}
            value={general}
            onChange={(e) => setGeneral(e.target.value)}
          />
          {errorGeneral && (
            <p className="text-red-500 text-sm">{errorGeneral}</p>
          )}
        </div>

        {/* COMMUNITY COST */}
        <div>
          <label>Costo Comunitario</label>
          <input
            className={`w-full border p-2 rounded ${
              errorCommunity ? "border-red-500" : ""
            }`}
            value={community}
            onChange={(e) => setCommunity(e.target.value)}
          />
          {errorCommunity && (
            <p className="text-red-500 text-sm">{errorCommunity}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={submit}>
          Guardar
        </Button>
      </div>
    </ModalBase>
  );
};

export default EditAppointmentTypeModal;