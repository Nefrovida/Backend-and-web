import * as historyModel from '../model/history.model';
import { NotFoundError, ConflictError } from '../util/errors.util';

export const listQuestions = async (page = 1, limit = 10, search?: string) => {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    historyModel.findAll(skip, limit, search),
    historyModel.count(search),
  ]);

  return { items, total, page, limit };
};

export const getQuestionById = async (questionId: number) => {
  const question = await historyModel.findById(questionId);
  if (!question) throw new NotFoundError('Question not found');
  return question;
};

export const createQuestion = async (description: string, type: string) => {
  // Prevent duplicate descriptions
  const existing = await historyModel.findByDescription(description);
  if (existing) throw new ConflictError('Question with same description already exists');
  return await historyModel.create({ description, type });
};

export const updateQuestion = async (questionId: number, data: { description?: string; type?: string }) => {
  const question = await historyModel.findById(questionId);
  if (!question) throw new NotFoundError('Question not found');

  // If description provided, ensure no other question has same description
  if (data.description) {
    const other = await historyModel.findDuplicateDescription(data.description, questionId);
    if (other) throw new ConflictError('Another question with same description exists');
  }

  return await historyModel.update(questionId, data);
};

export const deleteQuestion = async (questionId: number) => {
  const question = await historyModel.findById(questionId);
  if (!question) throw new NotFoundError('Question not found');

  // Optionally check referential integrity: patient_history references questions_history; cascade will handle it if set
  await historyModel.deleteById(questionId);
};

export default {};
