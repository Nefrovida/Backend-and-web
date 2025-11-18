import React from "react";
import { MedicalHistoryFormData } from "../../../types/expediente.types";

interface Props {
  data: MedicalHistoryFormData;
  onChange: (data: Partial<MedicalHistoryFormData>) => void;
}

const MedicalHistorySection: React.FC<Props> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Antecedentes Médicos</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alergias*
          </label>
          <input
            type="text"
            value={data.allergies}
            onChange={(e) => onChange({ allergies: e.target.value })}
            placeholder="Ninguna conocida"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enfermedades Previas*
          </label>
          <input
            type="text"
            value={data.previous_illnesses}
            onChange={(e) => onChange({ previous_illnesses: e.target.value })}
            placeholder="Ninguna"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cirugías Previas*
          </label>
          <input
            type="text"
            value={data.previous_surgeries}
            onChange={(e) => onChange({ previous_surgeries: e.target.value })}
            placeholder="Ninguna"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hospitalizaciones Previas*
          </label>
          <input
            type="text"
            value={data.previous_hospitalizations}
            onChange={(e) => onChange({ previous_hospitalizations: e.target.value })}
            placeholder="Ninguna"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Medicamentos Previos*
          </label>
          <input
            type="text"
            value={data.previous_medications}
            onChange={(e) => onChange({ previous_medications: e.target.value })}
            placeholder="Ninguno"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Medicamentos Actuales*
          </label>
          <input
            type="text"
            value={data.current_medications}
            onChange={(e) => onChange({ current_medications: e.target.value })}
            placeholder="Ninguno"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Consumo Drogas*
          </label>
          <input
            type="text"
            value={data.drug_consumption}
            onChange={(e) => onChange({ drug_consumption: e.target.value })}
            placeholder="Ninguno"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Otro (campo)*
          </label>
          <input
            type="text"
            value={data.other_conditions}
            onChange={(e) => onChange({ other_conditions: e.target.value })}
            placeholder="Ninguno"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default MedicalHistorySection;
