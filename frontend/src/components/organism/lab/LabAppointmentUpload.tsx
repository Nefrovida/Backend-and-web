// src/components/organism/lab/LabAppointmentUpload.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { LabAppointment } from "../../../types/labAppointment";

interface PresignResponse {
    uploadUrl: string;
}

function LabAppointmentUpload() {
    const params = useParams<{ resultadoId: string }>();
    const [appointment, setAppointment] = useState<LabAppointment | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
                    setError("No se encontró la cita seleccionada");
                } else {
                    setError(null);
                    setSuccess(false);
                    setFile(null);
                }
            } catch (err: any) {
                setError(err.message ?? "Error al cargar la cita");
            }
        }

        void load();
    }, [id]);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0];
        if (!f) return;
        if (f.type !== "application/pdf") {
            setError("Solo se permiten archivos PDF.");
            return;
        }
        setError(null);
        setSuccess(false);
        setFile(f);
    }

    async function handleUpload() {
        if (!appointment || !file || !id) return;

        if (appointment.status !== "REQUESTED") {
            setError("Esta cita ya tiene resultados registrados.");
            return;
        }

        try {
            setUploading(true);
            setError(null);
            setSuccess(false);

            // 1) pedir presign
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
                throw new Error("No se pudo generar la URL de carga");
            }

            const presignData: PresignResponse = await presignRes.json();
            const uploadUrl = presignData.uploadUrl;

            // 2) subir archivo al servidor de uploads
            const putRes = await fetch(uploadUrl, {
                method: "PUT",
                body: file,
                headers: {
                    "Content-Type": file.type || "application/pdf",
                },
            });

            if (!putRes.ok) {
                throw new Error("Error al subir el archivo");
            }

            // 3) confirmar subida
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
                throw new Error("Error al confirmar la subida");
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.message ?? "Error al subir resultados");
        } finally {
            setUploading(false);
        }
    }

    if (!appointment && !error) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-slate-500">
                    Selecciona una cita de la lista.
                </p>
            </div>
        );
    }

    const isRequested = appointment?.status === "REQUESTED";

    return (
        <div className="flex-1 p-6 flex flex-col gap-4">
            {appointment && (
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-lg font-semibold">{appointment.patientName}</p>
                    <p className="text-sm text-slate-700">{appointment.analysisName}</p>
                    <p className="text-xs text-slate-500 mt-1">
                        {new Date(appointment.date).toLocaleString("es-MX")}
                    </p>
                </div>
            )}

            {isRequested ? (
                <div className="rounded-2xl bg-white p-4 shadow-sm flex flex-col gap-3 max-w-md">
                    <p className="text-sm font-medium">Subir resultados (PDF)</p>

                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="text-xs"
                    />

                    {file && (
                        <p className="text-xs text-slate-600">
                            Archivo seleccionado:{" "}
                            <span className="font-mono">{file.name}</span>
                        </p>
                    )}

                    <button
                        type="button"
                        disabled={!file || uploading || success}
                        onClick={handleUpload}
                        className="mt-2 w-full rounded-full bg-blue-600 py-2 text-sm font-semibold text-white disabled:opacity-50"
                    >
                        {uploading ? "Subiendo…" : success ? "Subida completada" : "Subir resultados"}
                    </button>

                    {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
                    {success && (
                        <p className="mt-2 text-xs text-green-600">
                            Resultados subidos y cita actualizada.
                        </p>
                    )}
                </div>
            ) : (
                <div className="rounded-2xl bg-white p-4 shadow-sm max-w-md">
                    <p className="text-sm font-medium">Resultados ya enviados</p>
                    <p className="text-xs text-slate-600 mt-1">
                        Este estudio ya cuenta con un archivo de resultados registrado.
                    </p>
                </div>
            )}
        </div>
    );
}

export default LabAppointmentUpload;