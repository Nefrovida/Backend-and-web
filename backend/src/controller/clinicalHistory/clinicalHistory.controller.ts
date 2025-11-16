import { type Request, type Response } from "express";
import * as CHS from "../../service/clinicalHistory/clinicalHistory.service"



export const getRiskQuestions = async (req: Request, res: Response) => {
    try {
        
        const questions = await CHS.getRiskQuestions(req, res);

        res.status(200).json(questions);

    }
    catch (error) {
        res.status(500).json("Internal Server Error");
        console.log(error);
    }
}

export const getRiskOptions = async (req: Request, res: Response) => {
    try {
        const options = await CHS.getRiskOptions(req, res);

        res.status(200).json(options);
    } catch (error) {
        res.status(500).json("Internal Server Error");
        console.log(error);
    }
}

export const submitRiskForm = async (req:Request, res:Response) => {
  try {
    const id = req.params.id;
    const { answers } = req.body;

    const result = await CHS.submitRiskForm(id, answers);

    res.status(200).json({
      message: `Form submitted correctly`,
      data: result
    });

  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};

export const getRiskFormAnswersById = async (req:Request, res:Response) => {
  try {
    const id = req.params.id;

    const answers = await CHS.getRiskFormAnswersById(id);

    res.status(200).json({
      data: answers
    });

  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};
