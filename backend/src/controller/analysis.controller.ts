import { Request, Response } from 'express';
import { getAnalysisResultsForPatient } from '../service/analysis.service';

/*
Defining the structure of the JWT payload 
*/

interface JwtPayload {
  
  userId: string;
  roleId: number;
  privileges: string[]; 

  id: string; 
  
  [key: string]: any; 
}

/*
Extends the Express Request interface to include the 'user' property
 */
interface AuthRequest extends Request {
  user?: JwtPayload; 
}

/*Controller for obtaining analysis results for the authenticated patient
 */
export const getMyAnalysisResultsController = async (req: AuthRequest, res: Response) => {
  try {

    if (!req.user || !req.user.id) {

      return res.status(401).json({ message: 'Usuario no autenticado correctamente.' });
    }

    const userId = req.user.id;

    
    const analysisData = await getAnalysisResultsForPatient(userId);

    res.status(200).json(analysisData);

  } catch (error) {
    const e = error as Error;
    res.status(500).json({ message: 'Error al obtener los resultados de análisis', error: e.message });
  }
};