import { Request, Response } from 'express';
import Report from '../../model/report.model';
import { ResultResponse,NoteResponse, RiskQuestionResponse, RiskOptionResponse } from '../../types/report.types';
import { NotFoundError } from '../../util/errors.util';

/**
 * Transform database result to response format
 */
const transformResultToResponse = (result: any): ResultResponse => {
  return {
    resultId: result.result_id,
    patientAnalysisId: result.patient_analysis_id,
    date: result.date.toISOString(),
    path: result.path,
    interpretation: result.interpretation,
    patientAnalysis: {
      patientAnalysisId: result.patient_analysis.patient_analysis_id,
      analysisDate: result.patient_analysis.analysis_date.toISOString(),
      resultsDate: result.patient_analysis.results_date.toISOString(),
      place: result.patient_analysis.place,
      duration: result.patient_analysis.duration,
      analysisStatus: result.patient_analysis.analysis_status,
      analysis: {
        analysisId: result.patient_analysis.analysis.analysis_id,
        name: result.patient_analysis.analysis.name,
        description: result.patient_analysis.analysis.description,
      },
    },
  };
};

const transformNoteToResponse = (note: any): NoteResponse => {
  return {
    noteId: note.note_id,
    patientAppointmentId: note.patient_appointment_id,
    patientId: note.patient_id,

    title: note.title,
    content: note.content,

    ailments: note.ailments,
    generalNotes: note.general_notes,
    prescription: note.prescription,

    visibility: note.visibility,
    createdAt: note.creation_date?.toISOString(),

    appointment: {
      appointmentId: note.patient_appointment.appointment_id,
      date: note.patient_appointment.date_hour?.toISOString(),
      duration: note.patient_appointment.duration,
      type: note.patient_appointment.appointment_type,
      place: note.patient_appointment.place,
      status: note.patient_appointment.appointment_status,
    },
  };
};

/**
 * Transform risk question to response format
 */
const transformQuestionToResponse = (question: any): RiskQuestionResponse => {
  return {
    questionId: question.question_id,
    description: question.description,
    type: question.type,
    options: question.options?.map((opt: any) => ({
      optionId: opt.option_id,
      questionId: opt.question_id,
      description: opt.description,
    })),
  };
};

/**
 * Transform risk option to response format
 */
const transformOptionToResponse = (option: any): RiskOptionResponse => {
  return {
    optionId: option.option_id,
    questionId: option.question_id,
    description: option.description,
  };
};

/**
 * Get result by patient analysis ID
 */
export const getResultById = async (patientAnalysisId: number) => {
  const result = await Report.getResult(patientAnalysisId);

  if (!result) {
    throw new NotFoundError(`No result found for patient_analysis_id ${patientAnalysisId}`);
  }

  return transformResultToResponse(result);
};

/**
 * Get results by patient user ID
 */
export const getResultsAndNotesByUserId = async (userId: string) => {
  const { results, notes } = await Report.getResultsAndNotesByUserId(userId);

  return {
    analysisResults: results.map(transformResultToResponse),
    appointmentNotes: notes.map(transformNoteToResponse),
  };
};
