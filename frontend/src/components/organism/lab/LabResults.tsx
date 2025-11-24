import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Card, Divider, CircularProgress, Button } from "actify";
import Title from "@/components/atoms/Title";
import LabResultsNote from "@/components/molecules/lab/LabResultsNote";
import { BsPerson } from "react-icons/bs";
import useFullLabResults from "@/hooks/lab/useFullLabResults";
import { generateReport } from "@/services/lab/results.service";
import { LuRefreshCcw } from "react-icons/lu";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import Status from "@/components/atoms/Status";
import LabResultsPdf from "@/components/molecules/lab/LabResultsPdf";
import ConfirmModal from "@/components/molecules/ConfirmModal";
import FeedbackModal from "@/components/molecules/FeedbackModal";

function LabResults() {
  const { resultadoId } = useParams<{ resultadoId: string }>();
  const { isLoading, results, user, analysis, pdfIsLoading, pdf, refresh } = useFullLabResults(resultadoId);

  const [hadResults, setHadResults] = useState(false);
  const [interpretations, setInterpretations] = useState("")
  const [recommendations, setRecommendations] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleInterpretations = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInterpretations(e.target.value);
  };

  const handleRecommendations = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRecommendations(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true)
    try {
      const id = analysis?.patient_analysis_id;
      const response = await generateReport(
        id, interpretations, recommendations
      );
      if ('status' in response && response.status === 200) {
        refresh()
        setHadResults(true)
      } else if ('status' in response) {
        const err = await response.json();
        console.error("Server error:", err);
      } else {
        console.error("Validation error:", response.message);
      }
    } catch (error: any) {
      console.error("Submit report was unsuccessful: ", error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (results) {
      setInterpretations(results.interpretation || "")
      setRecommendations(results.recommendation || "")
      if (results.interpretation) {
        setHadResults(true);
      } else {
        setHadResults(false);
      }
    } else {
      // Clear when switching to a different result or when results are loading
      setInterpretations("")
      setRecommendations("")
    }
  }, [results, resultadoId])

  if (!resultadoId) 
    return <div>No se encontró el resultado</div>;

  return (
    <div className="w-2/3 px-6 py-6 bg-[#fff]">

      {/* Form that includes the interpretations and recomendations notes */}
      {isSubmitting ? (
        <CircularProgress
          isIndeterminate={true}
          value={50}
        />
      ): (
        <form onSubmit={handleSubmit}>
          {/* Patient Basic Info as Header */}
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center">
              <BsPerson className="text-3xl mr-5" />
              <div>
                <p className="text-lg">
                  {user?.user?.name + " " + user?.user?.parent_last_name + " " + user?.user?.maternal_last_name}
                </p>
                <p className="text-sm">
                  {new Date(analysis?.analysis_date).toDateString() || "fecha no recordada"}
                </p>
                <p className="text-sm">
                  <i>{analysis?.analysis?.name || "tipo de analisis no especificado"}</i>
                </p>
              </div>
            </div>

            <div className="flex justify-end items-center gap-4">
              <LuRefreshCcw
                className="cursor-pointer text-lg"
                onClick={refresh}
              />
              <Button 
                className="bg-[#fff]" 
                type="submit" 
                variant="filled" 
                isDisabled={isSubmitting || !interpretations || !pdf}>
                  {isSubmitting
                  ? "Enviando"
                  : hadResults
                  ? "Editar Reporte"
                  : "Generar Reporte"}
              </Button>
            </div>
          </div>

          <Divider className="my-4" />

          <div className="h-[80vh] overflow-y-auto mx-2">
            <Title size={"medium"}>Resultados de Laboratorio</Title>

            <LabResultsPdf 
              pdf={pdf} 
              pdfIsLoading={pdfIsLoading} 
              setIsFullscreen={setIsFullscreen} 
              isFullscreen={isFullscreen} 
            />

            <div className="flex items-center justify-between mb-2">
              <Title size={"medium"}>Notas de Reporte</Title>
              <div>
                {(results?.interpretation || results?.recommendation) ? (
                  <Status status="positive" message={`Enviado: ${new Date(results?.updated).toLocaleDateString()}`} />
                ) : (
                  <Status status="neutral" message="Sin enviar" />
                )}
              </div>
            </div>
            <Divider className="my-2" />

            <LabResultsNote
              title={"Interpretacion de Resultados"}
              subtitle={"Los resultados muestran..."}
              inputValue={interpretations}
              enabled={!!pdf}
              handleChange={handleInterpretations}
            />

            <LabResultsNote
              title={"Recomendaciones Adicionales"}
              subtitle={"Come ensalada"}
              inputValue={recommendations}
              enabled={!!pdf}
              handleChange={handleRecommendations}
            />
          </div>

        </form>
      )}

    </div>
  )
  // return <div>LabResults {params.resultadoId}</div>;
}

export default LabResults;
