import React, { useEffect, useState } from "react";
import Button from "@/components/atoms/Button";
import FeedbackModal from "@/components/molecules/FeedbackModal";
import ConfirmModal from "@/components/molecules/ConfirmModal";

import { authService } from "@/services/auth.service";
import { appointmentTypeService } from "@/services/appointments.service";

import {
  AppointmentTypeResponse,
  CreateAppointmentTypeData,
  UpdateAppointmentTypeData,
} from "@/types/add.appointment.types";

import CreateAppointmentTypeModal from "@/components/organism/appointments/CreateAppointmentTypeModal";
import EditAppointmentTypeModal from "@/components/organism/appointments/EditAppointmentTypeModal";

const AppointmentTypeManager: React.FC = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [types, setTypes] = useState<AppointmentTypeResponse[]>([]);
  const [editingType, setEditingType] =
    useState<AppointmentTypeResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] =
    useState<AppointmentTypeResponse | null>(null);

  const currentUser = authService.getCurrentUser();

  // ==============================
  // CARGAR SERVICIOS
  // ==============================
  const load = async () => {
    try {
      setLoading(true);
      const services = await appointmentTypeService.getAll(); // devuelve lista mapeada
      setTypes(services);
    } catch (err) {
      console.error(err);
      setFeedback({
        type: "error",
        message: "Error al cargar servicios de citas.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  // ==============================
  // DELETE
  // ==============================
  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;

    try {
      await appointmentTypeService.delete(deleteTarget.appointmentId);
      await load();
      setDeleteTarget(null);
      setFeedback({
        type: "success",
        message: "Servicio eliminado correctamente.",
      });
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: "Error al eliminar el servicio.",
      });
      setDeleteTarget(null);
    }
  };

  // ==============================
  // RENDER
  // ==============================
  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-lg p-6 shadow">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Servicios médicos ofrecidos</h1>

          {currentUser && (
            <Button
              variant="primary"
              onClick={() => setIsCreateOpen(true)}
              className="px-3 py-1 text-sm rounded-lg"
            >
              Crear servicio
            </Button>
          )}
        </div>

        {loading && (
          <p className="text-gray-500 text-sm mb-2">Cargando servicios…</p>
        )}

        {/* LISTA */}
        <div className="grid grid-cols-1 gap-3">
          {types.length === 0 ? (
            <p className="text-gray-600">No hay servicios registrados.</p>
          ) : (
            types.map((svc) => (
              <div
                key={svc.appointmentId}
                className="flex justify-between items-start border p-3 rounded-lg bg-slate-50 gap-4 w-full overflow-hidden"
              >
                <div className="max-w-[70%] w-full overflow-hidden">
                  <div className="font-semibold break-words">
                    {svc.name.trim()}
                  </div>

                  <div className="text-xs text-gray-600 mt-1 flex flex-wrap gap-4">
                    <span>Costo: ${svc.cost}</span>
                    {typeof svc.communityCost === "number" && (
                      <span>Comunitario: ${svc.communityCost}</span>
                    )}
                  </div>
                </div>

                {currentUser && (
                  <div className="flex flex-col gap-2 shrink-0">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setEditingType(svc);
                        setIsEditOpen(true);
                      }}
                      className="px-3 py-1 rounded text-sm border border-gray-300"
                    >
                      Editar
                    </Button>

                    <Button
                      variant="danger"
                      onClick={() => setDeleteTarget(svc)}
                      className="px-3 py-1 rounded text-sm"
                    >
                      Eliminar
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* CREATE */}
      <CreateAppointmentTypeModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        externalError={""}
        onConfirm={async (data: CreateAppointmentTypeData) => {
          try {
            await appointmentTypeService.create(data);
            await load();
            setIsCreateOpen(false);
            setFeedback({
              type: "success",
              message: "Servicio creado correctamente.",
            });
          } catch (err: any) {
            setFeedback({
              type: "error",
              message: "Error al crear servicio",
            });
          }
        }}
      />

      {/* EDIT */}
      <EditAppointmentTypeModal
        isOpen={isEditOpen}
        appointmentType={editingType}
        onClose={() => {
          setIsEditOpen(false);
          setEditingType(null);
        }}
        onConfirm={async (data: UpdateAppointmentTypeData) => {
          if (!editingType) return;
          try {
            await appointmentTypeService.update(editingType.appointmentId, data);
            await load();
            setIsEditOpen(false);
            setEditingType(null);
            setFeedback({
              type: "success",
              message: "Servicio actualizado correctamente.",
            });
          } catch (err: any) {
            setFeedback({
              type: "error",
              message: "Error al actualizar servicio",
            });
          }
        }}
      />

      {/* FEEDBACK */}
      <FeedbackModal
        isOpen={feedback !== null}
        title={feedback?.type === "error" ? "Error" : "Éxito"}
        variant={feedback?.type === "error" ? "error" : "success"}
        message={feedback?.message || ""}
        onClose={() => setFeedback(null)}
      />

      {/* CONFIRM DELETE */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Eliminar servicio"
        message={
          deleteTarget
            ? `¿Seguro que deseas eliminar "${deleteTarget.name}"?`
            : ""
        }
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        variant="danger"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  );
};

export default AppointmentTypeManager;