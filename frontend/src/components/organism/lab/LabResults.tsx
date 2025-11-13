import React, { useState } from "react";
import { useParams } from "react-router";
import { Card, Divider, CircularProgress, Button } from "actify";
import Title from "@/components/atoms/Title";
import LabResultsNote from "@/components/molecules/lab/LabResultsNote";
import { BsPerson } from "react-icons/bs";

function LabResults() {
  const { resultadoId } = useParams<{ resultadoId: string }>();

  const [interpretations, setInterpretations] = useState("")
  const [recommendations, setRecommendations] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInterpretations = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInterpretations(e.target.value);
  };

  const handleRecommendations = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecommendations(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // ← STOP PAGE RELOAD
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/lab/generate-report", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resultadoId,
          interpretations,
          recommendations
        })
      })

      if (response.status == 200) {
        console.log("successful upload of report")
      } else {
        const err = await response.json();
        console.error("Server error:", err);
      }


    } catch (error: any) {
      console.log("Submit report was unsuccessful: ", error.message)
    } finally {
      setIsSubmitting(false)
    }
  }


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
                  Manuel Bajos Rivera
                </p>
                <p className="text-sm">
                  12-12-2025
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="bg-[#fff]" type="submit" variant="filled" isDisabled={isSubmitting}>
                {isSubmitting ? "Enviando…" : "Generar Reporte"}
              </Button>
            </div>
          </div>

          <Divider className="my-4" />

          <div className="h-[80vh] overflow-y-auto mx-2">
            <Title size={"medium"}>Resultados de Laboratorio</Title>

            <Card
              className="w-full h-[20rem] mb-2 p-4 shadow-md-elevated-2"
              elevation={3}
              variant="elevated"
            >
              <p className="m-auto">document here</p>
            </Card>

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
