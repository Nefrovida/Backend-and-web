// frontend/src/components/organism/lab/LabAppointmentUpload.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { LabAppointment } from "../../../types/labAppointment";
import Button from "@/components/atoms/Button";
import FeedbackModal from "@/components/molecules/FeedbackModal";
import { ANALYSIS_STATUS } from "@/types/Analysis_status";

interface PresignResponse {
    url: string; // DO NOT CHANGE url TO UploadURL OR uploadUrl
}

type FeedbackState =
    | {
        type: "success" | "error";
        message: string;
    }
    | null;

const MAX_FILE_SIZE_MB = 20;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

function LabAppointmentUpload() {
    const params = useParams<{ resultadoId: string }>();
    const [appointment, setAppointment] = useState<LabAppointment | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [feedback, setFeedback] = useState<FeedbackState>(null);
    const [inlineError, setInlineError] = useState<string | null>(null);

    const id = params.resultadoId ? Number(params.resultadoId) : null;

    useEffect(() => {
        async function load() {
            try {
                if (!id) return;
                const res = await fetch("/api/laboratory/lab-appointments", {
                    credentials: "include",
                });
                if (!res.ok) throw new Error("No se pudieron cargar las citas");
                const data: LabAppointment[] = await res.json();
                const found = data.find((a) => a.id === id) ?? null;
                setAppointment(found);

                if (!found) {
                    setInlineError("No se encontró la cita seleccionada.");
                } else {
                    setInlineError(null);
                    setSuccess(false);
                    setFile(null);
                }
            } catch (err: any) {
                setInlineError(err.message ?? "Error al cargar la cita.");
            }
        }

        void load();
    }, [id]);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0];
        if (!f) return;

        // Reset states
        setInlineError(null);
        setFeedback(null);
        setSuccess(false);

        if (f.type !== "application/pdf") {
            setFile(null);
            setInlineError("Solo se permiten archivos en formato PDF.");
            return;
        }

        if (f.size > MAX_FILE_SIZE_BYTES) {
            setFile(null);
            setInlineError(
                `El archivo supera el límite de ${MAX_FILE_SIZE_MB} MB. ` +
                "Por favor selecciona un PDF más ligero."
            );
            return;
        }

        setFile(f);
    }

    async function handleUpload() {
        if (!appointment || !file || !id) return;

        // Only allow uploading results when the study is already in the laboratory (LAB)
        if (appointment.status !== ANALYSIS_STATUS.LAB) {
            setFeedback({
                type: "error",
                message:
                    "Solo puedes subir resultados para estudios que ya están en laboratorio.",
            });
            return;
        }

        try {
            setUploading(true);
            setInlineError(null);
            setFeedback(null);
            setSuccess(false);

            // 1) Request presign from the backend
            const presignRes = await fetch(
                `/api/laboratory/lab-appointments/${id}/presign`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        mime: file.type || "application/pdf",
                        size: file.size,
                    }),
                }
            );

            if (!presignRes.ok) {
                let message = "No se pudo generar la URL de carga.";
                try {
                    const body = await presignRes.json();
                    message =
                        body?.error?.message || body?.message || body?.error || message;
                } catch {
                    // ignore if no JSON
                }
                throw new Error(message);
            }

            const presignData: PresignResponse = await presignRes.json();
            const uploadUrl = presignData.url; // DO NOT CHANGE url TO UploadURL OR uploadUrl

            // 2) Upload file to the file server
            const putRes = await fetch(uploadUrl, {
                method: "PUT",
                body: file,
                headers: {
                    "Content-Type": file.type || "application/pdf",
                },
            });

            if (!putRes.ok) {
                throw new Error(
                    "Ocurrió un problema al subir el archivo. Intenta de nuevo o verifica el tamaño del PDF."
                );
            }

            // 3) Confirm upload in the backend
            const confirmRes = await fetch(
                `/api/laboratory/lab-appointments/${id}/result`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        uri: uploadUrl,
                    }),
                }
            );

            if (!confirmRes.ok) {
                let message = "Error al confirmar la subida de resultados.";
                try {
                    const body = await confirmRes.json();
                    message =
                        body?.error?.message || body?.message || body?.error || message;
                } catch {
                    // ignore if no JSON
                }
                throw new Error(message);
            }

            // Success
            setSuccess(true);
            setFile(null);

            // Update appointment in memory to reflect that it has been sent
            setAppointment((prev) =>
                prev
                    ? {
                        ...prev,
                        status: ANALYSIS_STATUS.SENT,
                        resultURI: uploadUrl,
                    }
                    : prev
            );

            setFeedback({
                type: "success",
                message:
                    "Resultados subidos correctamente. La cita ha sido actualizada y ya no podrás cambiar el archivo desde esta pantalla.",
            });
        } catch (err: any) {
            setSuccess(false);
            setFeedback({
                type: "error",
                message: err?.message ?? "Error al subir resultados.",
            });
        } finally {
            setUploading(false);
        }
    }

    // Close the feedback modal
    const handleFeedbackClose = () => {
        if (feedback?.type === "success") {
            setFeedback(null);
            window.location.reload();
        } else {
            setFeedback(null);
        }
    };

    if (!appointment && !inlineError) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-slate-500">
                    Selecciona una cita de la lista.
                </p>
            </div>
        );
    }

    const canUpload = appointment?.status === ANALYSIS_STATUS.LAB;
    const uploadDisabled = !file || uploading || success || !canUpload;
    const inputDisabled = uploading || success || !canUpload;

    return (
        <div className="flex-1 p-6 flex flex-col gap-4">
            {appointment && (
                <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
                    <p className="text-lg font-semibold text-slate-900">
                        {appointment.patientName}
                    </p>
                    <p className="text-sm text-slate-700">{appointment.analysisName}</p>
                    <p className="text-xs text-slate-500 mt-1">
                        {new Date(appointment.date).toLocaleString("es-MX")}
                    </p>
                </div>
            )}

            {inlineError && (
                <div className="rounded-2xl bg-red-50 border border-red-200 p-3 text-sm text-red-800 max-w-md">
                    {inlineError}
                </div>
            )}

            {canUpload ? (
                // === CARD for uploading results ===
                <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100 flex flex-col gap-3 max-w-md">
                    <p className="text-sm font-semibold text-slate-900">
                        Subir resultados (PDF)
                    </p>

                    <p className="text-xs text-slate-500">
                        Solo se aceptan archivos PDF, con un tamaño máximo de{" "}
                        {MAX_FILE_SIZE_MB} MB.
                    </p>

                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        disabled={inputDisabled}
                        className={`text-sm mt-1 ${inputDisabled ? "opacity-60 cursor-not-allowed" : ""
                            }`}
                    />

                    {file && (
                        <p className="text-xs text-slate-700 mt-1">
                            Archivo seleccionado:{" "}
                            <span className="font-mono break-all">{file.name}</span>
                        </p>
                    )}

                    <Button
                        onClick={handleUpload}
                        disabled={uploadDisabled}
                        variant="primary"
                        className="w-full rounded-full text-sm mt-2"
                    >
                        {uploading
                            ? "Subiendo…"
                            : success
                                ? "Subida completada"
                                : "Subir resultados"}
                    </Button>
                </div>
            ) : appointment ? (
                appointment.status === ANALYSIS_STATUS.SENT ? (
                    // === CARD for sent ===
                    <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100 max-w-md">
                        <p className="text-sm font-semibold text-slate-900">
                            Resultados ya enviados
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                            Este estudio ya cuenta con un archivo de resultados registrado. Si
                            necesitas corregirlo, solicita apoyo de un administrador.
                        </p>
                    </div>
                ) : (
                    // === CARD for pending (PENDING / REQUESTED / OTROS) ===
                    <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100 max-w-md">
                        <p className="text-sm font-semibold text-slate-900">
                            Resultados aún no disponibles
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                            Este estudio todavía no está listo para subir resultados desde el
                            laboratorio.
                        </p>
                    </div>
                )
            ) : null}

            <FeedbackModal
                isOpen={feedback !== null}
                variant={feedback?.type === "error" ? "error" : "success"}
                title={
                    feedback?.type === "error"
                        ? "Ocurrió un problema"
                        : "Resultados cargados"
                }
                message={feedback?.message || ""}
                onClose={handleFeedbackClose}
            />
        </div>
    );
}

export default LabAppointmentUpload;