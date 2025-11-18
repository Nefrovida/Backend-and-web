import prisma from '../util/prisma'; // Importa tu cliente de Prisma

/**
Formats the data from the database into the desired structure for the API response.
 */
const formatAnalysisResults = (dbData: any[]): any[] => {
  return dbData.map(analysis => {
    const result = analysis.results[0]; 
    const analysisInfo = analysis.analysis;

    const date = new Date(analysis.analysis_date);
    const formattedDate = date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }); 

    return {
      id: analysis.patient_analysis_id,
      name: analysisInfo.name, // ej. "Evaluación Riñón"
      date: formattedDate,
      // Esta es la URL que el Android usará para ver el PDF
      pdfUrl: result?.route || null 
    };
  });
};

/**
 * Servicio para obtener todos los resultados de análisis
 * de un paciente (basado en su token de autenticación).
 */
export const getAnalysisResultsForPatient = async (userId: string) => {
  try {
    // Find patient analysis results based on user ID
    const patient = await prisma.patients.findFirst({
      where: { user_id: userId }
    });

    if (!patient) {
      //if the patient does not exist, return an empty array
      return []; 
    }

    // Search for analysis results for the found patient
    const dbData = await prisma.patient_analysis.findMany({
      where: { patient_id: patient.patient_id },
      orderBy: {
        analysis_date: 'desc' 
      },
      include: {
        analysis: true, // 
        results: { // PDF results
          take: 1 // just first calculus
        }
      }
    });

   
    return formatAnalysisResults(dbData);

  } catch (error) {
    console.error("Error en el servicio getAnalysisResultsForPatient:", error);
    throw error;
  }
};