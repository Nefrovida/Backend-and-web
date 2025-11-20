import React, { useState, useEffect } from "react";
import { 
  clinicalHistoryService, 
  Question, 
  Option 
} from "../../../services/clinicalHistory.service";
import { ClinicalHistoryAnswer } from "../../../types/expediente.types";

interface Props {
  patientId?: string;
  data: ClinicalHistoryAnswer[];
  onChange: (data: ClinicalHistoryAnswer[]) => void;
}

const QUESTIONS_PER_PAGE = 5;

const ClinicalHistoryFormSection: React.FC<Props> = ({ 
  patientId, 
  data, 
  onChange 
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchQuestionsAndOptions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [questionsData, optionsData] = await Promise.all([
          clinicalHistoryService.getRiskQuestions(),
          clinicalHistoryService.getRiskOptions(),
        ]);
        
        setQuestions(questionsData);
        setOptions(optionsData);

        // If editing and we have a patientId, fetch existing answers
        if (patientId) {
          try {
            const response = await clinicalHistoryService.getRiskFormAnswers(patientId);
            if (response.data && response.data.length > 0) {
              const existingAnswers: ClinicalHistoryAnswer[] = response.data.map(item => ({
                question_id: item.question_id,
                answer: item.answer,
              }));
              onChange(existingAnswers);
            }
          } catch (err) {
            // If no answers exist yet, that's okay - we'll start with empty form
            console.log("No existing answers found, starting fresh");
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading questions");
        console.error("Error fetching questions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionsAndOptions();
  }, [patientId]);

  const handleAnswerChange = (questionId: number, answer: string) => {
    const updatedAnswers = [...data];
    const existingIndex = updatedAnswers.findIndex(a => a.question_id === questionId);
    
    if (existingIndex >= 0) {
      updatedAnswers[existingIndex] = { question_id: questionId, answer };
    } else {
      updatedAnswers.push({ question_id: questionId, answer });
    }
    
    onChange(updatedAnswers);
  };

  const getAnswerForQuestion = (questionId: number): string => {
    const answer = data.find(a => a.question_id === questionId);
    return answer?.answer || "";
  };

  const getOptionsForQuestion = (questionId: number): Option[] => {
    return options.filter(opt => opt.question_id === questionId);
  };

  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const startIndex = currentPage * QUESTIONS_PER_PAGE;
  const endIndex = startIndex + QUESTIONS_PER_PAGE;
  const currentQuestions = questions.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando preguntas del historial clínico...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 text-lg font-semibold mb-2">Error</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-primary">Historial Clínico</h3>
        <p className="text-sm text-gray-600 mt-1">
          Por favor responda las siguientes preguntas sobre el historial médico del paciente
        </p>
        {totalPages > 1 && (
          <p className="text-sm text-gray-500 mt-2">
            Página {currentPage + 1} de {totalPages}
          </p>
        )}
      </div>

      <div className="space-y-4">
        {currentQuestions.map((question) => {
          const questionOptions = getOptionsForQuestion(question.question_id);
          const currentAnswer = getAnswerForQuestion(question.question_id);

          return (
            <div key={question.question_id} className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {question.description}
              </label>

              {/* If question has options, show as radio buttons or select */}
              {questionOptions.length > 0 ? (
                <div className="space-y-2">
                  {questionOptions.map((option) => (
                    <label
                      key={option.option_id}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`question_${question.question_id}`}
                        value={option.description}
                        checked={currentAnswer === option.description}
                        onChange={(e) =>
                          handleAnswerChange(question.question_id, e.target.value)
                        }
                        className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                      />
                      <span className="text-gray-700">{option.description}</span>
                    </label>
                  ))}
                </div>
              ) : (
                /* If no options, show text input */
                <input
                  type="text"
                  value={currentAnswer}
                  onChange={(e) =>
                    handleAnswerChange(question.question_id, e.target.value)
                  }
                  placeholder="Ingrese su respuesta"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              )}
            </div>
          );
        })}
      </div>

      {questions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No hay preguntas disponibles en el sistema
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
              currentPage === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Anterior
          </button>

          <span className="text-sm text-gray-600">
            {currentPage + 1} / {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
              currentPage === totalPages - 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Siguiente
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ClinicalHistoryFormSection;
