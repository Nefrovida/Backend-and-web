import {Request, Response} from "express";
import { getAnalysisByName } from "../../service/analysis/add.analysis.service";
import * as agendaService from '../../service/agenda.service';


/**
 * Get available time slots for laboratory on a given date for a specific analysis
 */
const getAnalysisDateAvailability = async (req: Request, res: Response) => {
    try {
      const { analysisName, date } = req.query;

      if (!analysisName || !date) {
        return res.status(400).json({ error: 'analysisName and date are required' });
      }

      const analysis = await getAnalysisByName(analysisName as string);

      if (!analysis) {
        return res.status(404).json({ error: 'Analysis not found' });
      }

      // Get laboratory availability for the given date
      const availability = await agendaService.getLaboratoryAvailability(
        date as string
      );
  
      res.json(availability);
    } catch (error) {
      console.error('Error fetching laboratory availability:', error);
      res.status(500).json({ error: 'Failed to fetch laboratory availability' });
    }
  };

export default getAnalysisDateAvailability;
