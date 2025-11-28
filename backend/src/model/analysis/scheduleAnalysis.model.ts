import { prisma } from "#/src/util/prisma";
import { Status } from "@prisma/client";

class Analysis {
    static async createAnalysisAppointment(data: {
        patientId: string;
        laboratoristId?: string;
        analysisId: number;
        analysisDate: string;
        duration: number;
        place?: string;
    }) {
        const { patientId, laboratoristId, analysisId, analysisDate, duration, place } = data;

        const newAnalysis = await prisma.patient_analysis.create({
            data: {
                patient_id: patientId,
                laboratorist_id: laboratoristId,
                analysis_id: analysisId,
                analysis_date: new Date(analysisDate),
                results_date: null,
                duration,
                place: place || "Laboratorio",
                analysis_status: Status.REQUESTED,
            },
            include: {
                patient: {
                    include: {
                        user: true,
                    },
                },
                analysis: true,
            },
        });

        return newAnalysis;
    }

    static async getAnalysisPerDayByAnalysisId(
        targetDate: string,
        analysisId: number
    ) {
        const [year, month, day] = targetDate.split("-").map(Number);

        const start = new Date(year, month - 1, day, 0, 0, 0);
        const end = new Date(year, month - 1, day + 1, 0, 0, 0);

        const analysisAppointments = await prisma.patient_analysis.findMany({
            where: {
                analysis_date: {
                    gte: start,
                    lt: end,
                },
                analysis_id: analysisId,
            },
            include: {
                patient: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                analysis_date: "asc",
            },
        });

        return analysisAppointments.map((a) => {
            const { patient, ...rest } = a;
            const user = patient?.user;

            return {
                ...rest,
                patient_name: user?.name ?? null,
            };
        });
    }
}

export default Analysis;