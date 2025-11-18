// frontend/src/components/page/AnalysisManager.tsx
import React, { useEffect, useState } from "react";
import CreateAnalysisModal from "../organism/lab/CreateAnalysisModal";
import EditAnalysisModal from "../organism/lab/EditAnalysisModal";
import { authService } from "@/services/auth.service";
import { analysisService } from "@/services/analysis.service";
import {
  CreateAnalysisData,
  AnalysisResponse,
  UpdateAnalysisData,
} from "@/types/add.analysis.types";

// Helper to extract the friendly message from the backend
const getBackendErrorMessage = (err: any, fallback: string) => {
  const backendMessage =
    err?.response?.data?.error?.message ??
    err?.response?.data?.message;

  if (typeof backendMessage === "string" && backendMessage.trim() !== "") {
    return backendMessage;
  }

  return err?.message || fallback;
};

const AnalysisManager: React.FC = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [analyses, setAnalyses] = useState<AnalysisResponse[]>([]);
  const [editingAnalysis, setEditingAnalysis] =
    useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await analysisService.getAll(1, 50);
      setAnalyses(res.data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar los exámenes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const currentUser = authService.getCurrentUser();

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-lg p-6 shadow">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Administrar tipos de análisis</h1>
          {currentUser && (
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded"
              onClick={() => setIsCreateOpen(true)}
            >
              Crear análisis
            </button>
          )}
        </div>

        {loading && (
          <p className="text-gray-500 text-sm mb-2">Cargando exámenes…</p>
        )}

        <div className="grid grid-cols-1 gap-3">
          {analyses.length === 0 ? (
            <p className="text-gray-600">No hay exámenes registrados.</p>
          ) : (
            analyses.map((a) => (
              <div
                key={a.analysisId}
                className="flex justify-between items-start border p-3 rounded-lg bg-slate-50"
              >
                <div className="max-w-[70%]">
                  <div className="font-semibold">
                    {a.name.trim() || "(Sin nombre)"}
                  </div>
                  <div className="text-xs text-gray-500 whitespace-pre-line">
                    {a.description.trim()}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    <span className="font-semibold">Requisitos: </span>
                    {a.previousRequirements.trim()}
                  </div>
                  <div className="text-xs text-gray-600 mt-1 flex gap-4">
                    <span>General: ${a.generalCost}</span>
                    <span>Comunitario: ${a.communityCost}</span>
                  </div>
                </div>

                {currentUser && (
                  <div className="flex flex-col gap-2">
                    <button
                      className="border px-3 py-1 rounded text-blue-600 text-sm"
                      onClick={() => {
                        setEditingAnalysis(a);
                        setIsEditOpen(true);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="border px-3 py-1 rounded text-red-600 text-sm"
                      onClick={async () => {
                        if (!confirm(`Eliminar "${a.name.trim()}"?`)) return;
                        try {
                          await analysisService.deleteAnalysis(a.analysisId);
                          await load();
                          alert("Análisis eliminado");
                        } catch (err: any) {
                          const msg = getBackendErrorMessage(
                            err,
                            "Error al eliminar el análisis"
                          );
                          alert(msg);
                        }
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* CREATE modal */}
      <CreateAnalysisModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        externalError={""}
        onConfirm={async (data: CreateAnalysisData) => {
          try {
            await analysisService.createAnalysis(data);
            await load();
            setIsCreateOpen(false);
            alert("Análisis creado");
          } catch (err: any) {
            const msg = getBackendErrorMessage(
              err,
              "Error al crear análisis"
            );
            alert(msg);
          }
        }}
      />

      {/* EDIT modal */}
      <EditAnalysisModal
        isOpen={isEditOpen}
        analysis={editingAnalysis}
        onClose={() => {
          setIsEditOpen(false);
          setEditingAnalysis(null);
        }}
        onConfirm={async (data: UpdateAnalysisData) => {
          if (!editingAnalysis) return;
          try {
            await analysisService.updateAnalysis(
              editingAnalysis.analysisId,
              data
            );
            await load();
            setIsEditOpen(false);
            setEditingAnalysis(null);
            alert("Análisis actualizado");
          } catch (err: any) {
            const msg = getBackendErrorMessage(
              err,
              "Error al actualizar análisis"
            );
            alert(msg);
          }
        }}
      />
    </div>
  );
};

export default AnalysisManager;