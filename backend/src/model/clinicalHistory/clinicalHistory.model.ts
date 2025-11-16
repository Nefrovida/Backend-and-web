import { prisma } from "../../util/prisma.js";

export default class CH {
  CH() {

  }

  static async getRiskQuestions() {
    return prisma.questions_history.findMany();
  }

  static async getRiskOptions() {
    return prisma.options.findMany();
  }

  static async postRiskFormAnswers(id:string, answers:any) {
    const saved = [];

    for (const item of answers) {

      const entry = await prisma.patient_history.create({
        data: {
          patient_id: id,
          question_id: item.question_id, 
          answer: item.answer
        }
      });

      saved.push(entry);
    }

    return saved;
}

    static async getRiskFormAnswersById(id:string) {
        return prisma.patient_history.findMany({
            where: {
                patient_id: id
            }
        });
    }   
}