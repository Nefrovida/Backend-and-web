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

function LabResults() {
  const { resultadoId } = useParams<{ resultadoId: string }>();
  const { isLoading, results, user, analysis, pdfIsLoading, pdf, refresh } = useFullLabResults(resultadoId);

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
      console.log("trying to genreate the report")
      console.log("current interpretations: ", interpretations);
      console.log("current recommendations: ", recommendations);
      const id = analysis?.patient_analysis_id;
      const response = await generateReport(
        id, interpretations, recommendations
      );
      if ('status' in response && response.status === 200) {
        console.log("successful upload of report")
      } else if ('status' in response) {
        const err = await response.json();
        console.error("Server error:", err);
      } else {
        console.error("Validation error:", response.message);
      }
    } catch (error: any) {
      console.log("Submit report was unsuccessful: ", error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (results) {
      setInterpretations(results.interpretation || "")
      setRecommendations(results.recommendation || "")
    } else {
      // Clear when switching to a different result or when results are loading
      setInterpretations("")
      setRecommendations("")
    }
  }, [results, resultadoId])

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
              <Button className="bg-[#fff]" type="submit" variant="filled" isDisabled={isSubmitting}>
                {isSubmitting  ? "Enviando…" : "Generar Reporte"}
              </Button>
            </div>
          </div>

          <Divider className="my-4" />

          <div className="h-[80vh] overflow-y-auto mx-2">
            <Title size={"medium"}>Resultados de Laboratorio</Title>

            <Card className="w-full mb-6 overflow-hidden relative p-0" elevation={3} style={{ height: '400px', minHeight: '400px' }}>
              {pdfIsLoading ? (
                <div className="flex justify-center items-center" style={{ height: '400px' }}>
                  <CircularProgress />
                </div>
              ) : pdf ? (
                <>
                  <iframe 
                    src={pdf} 
                    className="border-0 cursor-pointer block" 
                    style={{ 
                      height: '400px', 
                      minHeight: '400px', 
                      width: '100%',
                      display: 'block'
                    }}
                    title="Lab Results PDF"
                    onClick={() => setIsFullscreen(true)}
                  />
                  <button
                    onClick={() => setIsFullscreen(true)}
                    className="absolute top-2 right-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-lg p-2 shadow-lg transition-all z-10"
                    title="Ver en pantalla completa"
                  >
                    <MdFullscreen className="text-xl text-gray-700" />
                  </button>
                </>
              ) : (
                <div className="flex items-center justify-center" style={{ height: '400px' }}>
                  <p className="text-center text-gray-500">PDF no disponible</p>
                </div>
              )}
            </Card>

            {/* Fullscreen PDF Modal */}
            {isFullscreen && pdf && (
              <div
                className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
                onClick={() => setIsFullscreen(false)}
              >
                <div
                  className="w-full h-full flex flex-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header with close button */}
                  <div className="flex justify-between items-center p-4 bg-gray-900 bg-opacity-50">
                    <h3 className="text-white text-lg font-semibold">Resultados de Laboratorio - Vista Completa</h3>
                    <button
                      onClick={() => setIsFullscreen(false)}
                      className="text-white hover:text-gray-300 text-2xl font-bold p-2 rounded-lg hover:bg-gray-800 transition-colors"
                      aria-label="Cerrar pantalla completa"
                    >
                      <MdFullscreenExit className="text-2xl" />
                    </button>
                  </div>
                  
                  {/* PDF Container */}
                  <div className="flex-1 w-full overflow-hidden">
                    <iframe 
                      src={pdf} 
                      className="w-full h-full border-0" 
                      title="Lab Results PDF - Fullscreen"
                    />
                  </div>
                </div>
              </div>
            )}

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
              handleChange={handleInterpretations}
            />

            <LabResultsNote
              title={"Recomendaciones Adicionales"}
              subtitle={"Come ensalada"}
              inputValue={recommendations}
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
