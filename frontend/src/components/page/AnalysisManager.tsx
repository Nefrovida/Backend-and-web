import React, { useEffect, useState } from "react";
import CreateAnalysisModal from "../organism/lab/CreateAnalysisModal";
import { analysisService } from "@/services/analysis.service";
import { CreateAnalysisData } from "@/types/add.analysis.types";

const AnalysisManager = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [analyses, setAnalyses] = useState<any[]>([]);

  const load = async () => {
    try {
      const res = await fetch("/api/laboratory/analysis", { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load analyses');
      const data = await res.json();
      setAnalyses(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-lg p-6 shadow">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Administrar Exámenes</h1>
          <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => setIsOpen(true)}>Crear examen</button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {analyses.length === 0 ? (
            <p className="text-gray-600">No hay exámenes</p>
          ) : (
            analyses.map((a: any) => (
              <div key={a.analysis_id} className="flex justify-between items-center border p-2 rounded">
                <div>
                  <div className="font-semibold">{a.name}</div>
                  <div className="text-xs text-gray-500">{a.description}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="border px-3 py-1 rounded text-red-600"
                    onClick={async () => {
                      if (!confirm(`Eliminar ${a.name}?`)) return;
                      try {
                        await analysisService.deleteAnalysis(a.analysis_id);
                        await load();
                        alert('Examen eliminado');
                      } catch (err: any) {
                        alert(err?.message || 'Error al eliminar');
                      }
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <CreateAnalysisModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        externalError={""}
        onConfirm={async (data: CreateAnalysisData) => {
          try {
            await analysisService.createAnalysis(data);
            await load();
            setIsOpen(false);
            alert('Examen creado');
          } catch (err: any) {
            alert(err?.message || 'Error creating');
          }
        }}
      />
    </div>
  );
};

export default AnalysisManager;
