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

  // ==================
  // LOAD
  // ==================
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

  useEffect(() => { void loadAll(); }, []);

  // ==================
  // CREATE
  // ==================
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

  // ==================
  // UPDATE
  // ==================
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

  // ==================
  // DELETE
  // ==================
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
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Servicios Médicos</h2>
        <Button onClick={() => setIsCreate(true)} variant="primary">
          Nuevo
        </Button>
      </div>

      {loading && <p>Cargando...</p>}

      <div className="space-y-2">
        {services.map((s) => (
          <div
            key={s.appointmentId}
            className="p-3 bg-slate-50 flex justify-between border rounded-md"
          >
            <div>
              <p className="font-semibold">{s.name}</p>
              <p className="text-sm text-gray-500">General: ${s.cost}</p>
              {s.communityCost && (
                <p className="text-sm text-gray-500">
                  Comunitario: ${s.communityCost}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setEditing(s);
                  setIsEdit(true);
                }}
              >
                Editar
              </Button>

              <Button
                variant="danger"
                onClick={() => setDeleteTarget(s)}
              >
                Eliminar
              </Button>
            </div>
          </div>
        ))}
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
        message={`¿Seguro que deseas eliminar "${deleteTarget?.name}"?`}
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