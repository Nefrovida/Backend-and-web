import { Request, Response } from 'express';
import { PrismaClient } from '../../prisma/database/prisma/client.js';
const prisma = new PrismaClient();

export default class Analysis {
    Analysis() {

    }

    static async getAnalysisByDate(dateString: string) {

        if (!/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
        throw new Error("Format must be DD/MM/YYYY");
        }

        const [day, month, year] = dateString.split('-').map(Number);

        const startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
        const endDate   = new Date(Date.UTC(year, month - 1, day + 1, 0, 0, 0));

        return prisma.patient_analysis.findMany({
        where: {
            analysis_date: {
            gte: startDate,
            lt: endDate
            }
        },
        select: {
            patient_analysis_id: true,
            analysis_date: true,

            patient: {
            select: {
                patient_id: true,
                user: {
                select: {
                    name: true,
                    parent_last_name: true,
                    maternal_last_name: true,
                }
                }
            }
            },

            analysis: {
            select: {
                analysis_id: true,
                name: true,
            }
            }
        }
        });
    }
}