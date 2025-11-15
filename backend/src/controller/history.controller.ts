import { Request, Response } from 'express';
import * as historyService from '../service/history.service';
import { createQuestionSchema, updateQuestionSchema, getQuestionsQuerySchema } from '../validators/history.validators';

export const listQuestions = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = getQuestionsQuerySchema.parse(req.query);
    const { page, limit, search } = parsed;
    const result = await historyService.listQuestions(page, limit, search);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const getQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const question = await historyService.getQuestionById(id);
    res.status(200).json(question);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const createQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = createQuestionSchema.parse(req.body);
    const question = await historyService.createQuestion(payload.description, payload.type);
    res.status(201).json(question);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const updateQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const payload = updateQuestionSchema.parse(req.body);
    const question = await historyService.updateQuestion(id, payload);
    res.status(200).json(question);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const deleteQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    await historyService.deleteQuestion(id);
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};
