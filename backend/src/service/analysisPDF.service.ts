
import * as analysisModel from '../model/analysisPDF.model';  

/**
 * Transform database result to response format
 */
const transformToResponse = (dbData: any[]): any[] => {
  return dbData.map((item) => {
    const result = item.results;
    const analysisInfo = item.analysis;

    const date = new Date(item.analysis_date);
    const formattedDate = date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    return {
      id: item.patient_analysis_id,
      name: analysisInfo.name,
      date: formattedDate,
      pdfUrl: result?.path || null, 
    };
  });
};

/**
 * Get analysis results for a patient
 */
export const getAnalysisResultsForPatient = async (userId: string) => {
  
  const patient = await analysisModel.findPatientByUserId(userId);

  if (!patient) {
    return [];
  }

  // Call Model to get raw data
  const rawData = await analysisModel.findAnalysisResultsByPatientId(patient.patient_id);

  
  return transformToResponse(rawData);
};