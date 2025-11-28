import Laboratory from "#/src/model/lab.model";

export const generateLabReport = async (patientAnalysisId: number, interpretations: string, recommendations: string) => {
    const result = await Laboratory.generateReport(patientAnalysisId, interpretations, recommendations);
    return result;
}