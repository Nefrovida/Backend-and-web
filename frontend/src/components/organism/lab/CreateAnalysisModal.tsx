import React, { useEffect, useState } from "react";
import { CreateAnalysisData } from "../../../types/add.analysis.types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: CreateAnalysisData) => void;
  externalError?: string;
}

const CreateAnalysisModal: React.FC<Props> = ({ isOpen, onClose, onConfirm, externalError }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [previousRequirements, setPreviousRequirements] = useState("");
  const [generalCost, setGeneralCost] = useState<number | "">("");
  const [communityCost, setCommunityCost] = useState<number | "">("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (externalError) setError(externalError);
  }, [externalError]);

  if (!isOpen) return null;

  const reset = () => {
    setName("");
    setDescription("");
    setPreviousRequirements("");
    setGeneralCost("");
    setCommunityCost("");
    setError("");
  };

  const handleConfirm = () => {
    setError("");

    if (!name || name.trim().length < 3) return setError("El nombre debe tener al menos 3 caracteres");
    if (generalCost === "" || Number.isNaN(Number(generalCost))) return setError("Ingresa el costo general");
    if (communityCost === "" || Number.isNaN(Number(communityCost))) return setError("Ingresa el costo comunitario");

    onConfirm({
      name: name.trim(),
      description: description.trim(),
      previousRequirements: previousRequirements.trim(),
      generalCost: Number(generalCost),
      communityCost: Number(communityCost),
    });

    reset();
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#CFE6ED] rounded-3xl shadow-2xl p-6 w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Crear nuevo examen</h2>

        {error && <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{error}</div>}

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 rounded-lg border" placeholder="Ejemplo: Hemograma" />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 rounded-lg border" rows={2} />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Requisitos previos</label>
          <textarea value={previousRequirements} onChange={(e) => setPreviousRequirements(e.target.value)} className="w-full p-2 rounded-lg border" rows={2} />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Costo general</label>
            <input type="number" value={generalCost} onChange={(e) => setGeneralCost(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-2 rounded-lg border" placeholder="Ej: 120.50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Costo comunitario</label>
            <input type="number" value={communityCost} onChange={(e) => setCommunityCost(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-2 rounded-lg border" placeholder="Ej: 60.25" />
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button onClick={handleCancel} className="px-6 py-2 rounded-lg bg-white">Cancelar</button>
          <button onClick={handleConfirm} className="px-6 py-2 rounded-lg bg-blue-500 text-white">Crear</button>
        </div>
      </div>
    </div>
  );
};

export default CreateAnalysisModal;
