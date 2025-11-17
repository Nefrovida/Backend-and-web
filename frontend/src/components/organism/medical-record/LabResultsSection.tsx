import React, { useState } from "react";
import { LabResultFormData } from "../../../types/expediente.types";

interface Props {
  data: LabResultFormData;
  onChange: (data: Partial<LabResultFormData>) => void;
}

const LabResultsSection: React.FC<Props> = ({ data, onChange }) => {
  const [fileName, setFileName] = useState<string>("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange({ file });
      setFileName(file.name);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-6">Resultados de laboratorio</h3>

      {/* File Upload Area */}
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12 bg-gray-50">
        <label className="cursor-pointer flex flex-col items-center">
          <svg
            className="w-16 h-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span className="text-blue-400 text-lg font-medium mb-2">Subir archivo</span>
          {fileName && (
            <span className="text-sm text-gray-600 mt-2">Archivo: {fileName}</span>
          )}
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Report Section */}
      <div className="mt-8">
        <h4 className="text-md font-semibold mb-4">Reporte</h4>
        <p className="text-sm text-gray-600 mb-2">Interpretación de resultados</p>
        <textarea
          value={data.interpretation}
          onChange={(e) => onChange({ interpretation: e.target.value })}
          placeholder="Los resultados muestran..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <div className="mt-6">
        <h4 className="text-md font-semibold mb-4">Recomendaciones adicionales</h4>
        <textarea
          placeholder="Los resultados muestran..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
    </div>
  );
};

export default LabResultsSection;
