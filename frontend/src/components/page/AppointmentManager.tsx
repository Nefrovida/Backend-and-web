import React, { useEffect, useState } from "react";
import Button from "@/components/atoms/Button";
import ConfirmModal from "@/components/molecules/ConfirmModal";
import FeedbackModal from "@/components/molecules/FeedbackModal";

import { getDoctors } from "@/services/doctor.service";
import { appointmentTypeService } from "@/services/appointments.service";

import {
  AppointmentTypeResponse,
  CreateAppointmentTypeData,
  UpdateAppointmentTypeData,
} from "@/types/add.appointment.types";

import CreateAppointmentTypeModal from "@/components/organism/appointments/CreateAppointmentTypeModal";
import EditAppointmentTypeModal from "@/components/organism/appointments/EditAppointmentTypeModal";

const AppointmentTypeManager: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<AppointmentTypeResponse[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [isCreate, setIsCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteTarget, setDeleteTarget] =
    useState<AppointmentTypeResponse | null>(null);
  const [editing, setEditing] =
    useState<AppointmentTypeResponse | null>(null);

  const loadAll = async () => {
    try {
      setLoading(true);
      const list = await appointmentTypeService.getAll();
      setServices(list);

      const d = await getDoctors();
      setDoctors(d.data);
    } catch (err) {
      console.error(err);
      setFeedback({
        type: "error",
        message: "Error cargando datos",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAll();
  }, []);

  // CREATE
  const onCreate = async (data: CreateAppointmentTypeData) => {
    try {
      await appointmentTypeService.create(data);
      await loadAll();
      setIsCreate(false);
      setFeedback({
        type: "success",
        message: "Servicio creado correctamente.",
      });
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
    }
  };

  // UPDATE
  const onUpdate = async (data: UpdateAppointmentTypeData) => {
    if (!editing) return;
    try {
      await appointmentTypeService.update(editing.appointmentId, data);
      await loadAll();
      setIsEdit(false);
      setEditing(null);
      setFeedback({
        type: "success",
        message: "Servicio actualizado.",
      });
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
    }
  };

  // DELETE
  const onDelete = async () => {
    if (!deleteTarget) return;
    try {
      await appointmentTypeService.delete(deleteTarget.appointmentId);
      await loadAll();
      setDeleteTarget(null);
      setFeedback({
        type: "success",
        message: "Servicio eliminado.",
      });
    } catch {
      setFeedback({
        type: "error",
        message: "No se pudo eliminar.",
      });
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-lg p-6 shadow">
        
        {/* header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Servicios Médicos</h1>
          <Button
            variant="primary"
            onClick={() => setIsCreate(true)}
            className="px-3 py-1 text-sm rounded-lg"
          >
            Nuevo
          </Button>
        </div>

        {loading && (
          <p className="text-gray-500 text-sm mb-2">Cargando servicios…</p>
        )}

        <div className="grid grid-cols-1 gap-3">
          {services.length === 0 ? (
            <p className="text-gray-600">No hay servicios registrados.</p>
          ) : (
            services.map((s) => (
              <div
                key={s.appointmentId}
                className="flex justify-between items-start border p-3 rounded-lg bg-slate-50 gap-4 w-full"
              >
                {/* LEFT */}
                <div className="max-w-[70%] w-full overflow-hidden">
                  <div className="font-semibold break-words">
                    {s.name}
                  </div>

                  <div className="text-xs text-gray-600 mt-1 flex flex-wrap gap-4">
                    <span>General: ${s.cost}</span>
                    {s.communityCost && (
                      <span>Comunitario: ${s.communityCost}</span>
                    )}
                  </div>
                </div>

                {/* RIGHT buttons igual que análisis */}
                <div className="flex flex-col gap-2 shrink-0">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setEditing(s);
                      setIsEdit(true);
                    }}
                    className="px-3 py-1 rounded text-sm border border-gray-300"
                  >
                    Editar
                  </Button>

                  <Button
                    variant="danger"
                    onClick={() => setDeleteTarget(s)}
                    className="px-3 py-1 rounded text-sm"
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CREATE */}
      <CreateAppointmentTypeModal
        isOpen={isCreate}
        doctors={doctors}
        onConfirm={onCreate}
        onClose={() => setIsCreate(false)}
      />

      {/* EDIT */}
      <EditAppointmentTypeModal
        isOpen={isEdit}
        appointmentType={editing}
        onClose={() => setIsEdit(false)}
        onConfirm={onUpdate}
      />

      {/* FEEDBACK */}
      <FeedbackModal
        isOpen={!!feedback}
        title={feedback?.type === "error" ? "Error" : "Éxito"}
        variant={feedback?.type}
        message={feedback?.message || ""}
        onClose={() => setFeedback(null)}
      />

      {/* DELETE */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Eliminar servicio"
        message={`¿Seguro que deseas eliminar "${deleteTarget?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={onDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AppointmentTypeManager;