import { Request, Response } from 'express';
import { getAnalysisResultsForPatient } from '../service/analysis.service';

interface AuthRequest extends Request {
  user?: {
    id: string; 
    [key: string]: any;
  };
}

/**
 * Controlador para obtener la lista de análisis
 * del paciente que está autenticado.
 */
export const getMyAnalysisResultsController = async (req: AuthRequest, res: Response) => {
  try {
    // El 'user.id' es añadido por tu 'auth.middleware.ts'
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Usuario no autenticado correctamente.' });
    }

    const userId = req.user.id;

    // Llama al servicio para buscar los datos
    const analysisData = await getAnalysisResultsForPatient(userId);

    res.status(200).json(analysisData);

  } catch (error) {
    const e = error as Error;
    console.error('Error en getMyAnalysisResultsController:', e.message);
    res.status(500).json({ message: 'Error al obtener los resultados de análisis', error: e.message });
  }
};