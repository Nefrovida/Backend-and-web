import { prisma } from '../util/prisma'; 

/*
 * Formats raw database data into the desired structure for analysis results into frontend
 *
 */
const formatAnalysisResults = (dbData: any[]): any[] => {
  return dbData.map(analysis => {
    
    
    const result = analysis.results; 
    const analysisInfo = analysis.analysis;

    const date = new Date(analysis.analysis_date);
    const formattedDate = date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    return {
      id: analysis.patient_analysis_id,
      name: analysisInfo.name, 
      date: formattedDate,
      pdfUrl: result?.path || null 
    };
  });
};


export const getAnalysisResultsForPatient = async (userId: string) => {
  try {
    
    const patient = await prisma.patients.findFirst({
      where: { user_id: userId }
    });

    if (!patient) {
      return []; 
    }

    const dbData = await prisma.patient_analysis.findMany({
      where: { patient_id: patient.patient_id },
      orderBy: {
        analysis_date: 'desc' 
      },
      include: {
        analysis: true, 
       
        results: true
      }
    });

    return formatAnalysisResults(dbData);

  } catch (error) {
    console.error("Error en el servicio getAnalysisResultsForPatient:", error);
    throw error;
  }
};