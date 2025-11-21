// frontend/src/components/organism/lab/EditAnalysisModal.tsx
import ModalBase from "@/components/molecules/AnalysisTypeModal";
import React, { useEffect, useState } from "react";
import { AnalysisResponse, UpdateAnalysisData } from "@/types/add.analysis.types";

interface Props {
    isOpen: boolean;
    analysis: AnalysisResponse | null;
    onClose: () => void;
    onConfirm: (data: UpdateAnalysisData) => void;
    externalError?: string;
}
const MAX_COST = 5_000_000;

const EditAnalysisModal: React.FC<Props> = ({
    isOpen,
    analysis,
    onClose,
    onConfirm,
    externalError,
}) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [previousRequirements, setPreviousRequirements] = useState("");
    const [generalCost, setGeneralCost] = useState<number | "">("");
    const [communityCost, setCommunityCost] = useState<number | "">("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (analysis) {
            setName(analysis.name.trim());
            setDescription(analysis.description.trim());
            setPreviousRequirements(analysis.previousRequirements.trim());
            setGeneralCost(Number(analysis.generalCost));
            setCommunityCost(Number(analysis.communityCost));
            setError("");
        }
    }, [analysis]);

    useEffect(() => {
        if (externalError) setError(externalError);
    }, [externalError]);

    if (!analysis) return null;

    const handleConfirm = () => {
        setError("");

        if (!name || name.trim().length < 3)
            return setError("El nombre debe tener al menos 3 caracteres");
        if (name.trim().length > 50)
            return setError("El nombre no puede exceder 50 caracteres");
        if (description.trim().length === 0)
            return setError("La descripción es obligatoria");
        if (description.trim().length > 500)
            return setError("La descripción no puede exceder 500 caracteres");
        if (previousRequirements.trim().length === 0)
            return setError("Los requisitos previos son obligatorios");
        if (previousRequirements.trim().length > 500)
            return setError("Los requisitos previos no pueden exceder 500 caracteres");

        const parsedGeneral = Number(generalCost);
        const parsedCommunity = Number(communityCost);

        if (generalCost === "")
            return setError("Ingresa el costo general");
        if (Number.isNaN(parsedGeneral))
            return setError("El costo general debe ser un número válido");
        if (parsedGeneral <= 0)
            return setError("El costo general debe ser mayor que 0");
        if (parsedGeneral > MAX_COST)
            return setError(`El costo general no puede exceder ${MAX_COST}`);

        if (communityCost === "")
            return setError("Ingresa el costo comunitario");
        if (Number.isNaN(parsedCommunity))
            return setError("El costo comunitario debe ser un número válido");
        if (parsedCommunity <= 0)
            return setError("El costo comunitario debe ser mayor que 0");
        if (parsedCommunity > MAX_COST)
            return setError(`El costo comunitario no puede exceder ${MAX_COST}`);

        const payload: UpdateAnalysisData = {
            name: name.trim(),
            description: description.trim(),
            previousRequirements: previousRequirements.trim(),
            generalCost: parsedGeneral,
            communityCost: parsedCommunity,
        };

        onConfirm(payload);
    };

    return (
        <ModalBase isOpen={isOpen} onClose={onClose} title="Editar examen">
            {error && (
                <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
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
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 rounded-lg border"
                    rows={2}
                    maxLength={500}
                />
            </div>

            <div className="mb-3">
                <label className="block text-sm font-medium">Requisitos previos</label>
                <textarea
                    value={previousRequirements}
                    onChange={(e) => setPreviousRequirements(e.target.value)}
                    className="w-full p-2 rounded-lg border"
                    rows={2}
                    maxLength={500}
                />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                    <label className="block text-sm font-medium">Costo general</label>
                    <input
                        type="number"
                        value={generalCost}
                        onChange={(e) =>
                            setGeneralCost(e.target.value === "" ? "" : Number(e.target.value))
                        }
                        className="w-full p-2 rounded-lg border"
                        min={0}
                        max={MAX_COST}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Costo comunitario</label>
                    <input
                        type="number"
                        value={communityCost}
                        onChange={(e) =>
                            setCommunityCost(e.target.value === "" ? "" : Number(e.target.value))
                        }
                        className="w-full p-2 rounded-lg border"
                        min={0}
                        max={MAX_COST}
                    />
                </div>
            </div>

            <div className="flex justify-center gap-4">
                <button onClick={onClose} className="px-6 py-2 rounded-lg bg-white">
                    Cancelar
                </button>
                <button
                    onClick={handleConfirm}
                    className="px-6 py-2 rounded-lg bg-blue-500 text-white"
                >
                    Guardar cambios
                </button>
            </div>
        </ModalBase>
    );
};

export default EditAnalysisModal;