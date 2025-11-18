import { Request, Response } from 'express';
import { getAnalysisResultsForPatient } from '../service/analysis.service';

interface AuthRequest extends Request {
  user?: {
    id: string; 
    [key: string]: any;
  };
}


export const getMyAnalysisResultsController = async (req: AuthRequest, res: Response) => {
  try {
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Usuario no autenticado correctamente.' });
    }

    const userId = req.user.id;

   git
    const analysisData = await getAnalysisResultsForPatient(userId);

    res.status(200).json(analysisData);

  } catch (error) {
    const e = error as Error;
    console.error('Error en getMyAnalysisResultsController:', e.message);
    res.status(500).json({ message: 'Error al obtener los resultados de análisis', error: e.message });
  }
};