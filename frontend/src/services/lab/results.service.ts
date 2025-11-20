

// route = /api/laboratory/patient-full-results
export const patientFullResultsApi = async (id: Number) => {
    const res = await fetch(`/api/laboratory/patient-full-results?patient_analysis_id=${id}`, {
        credentials: "include",
    })
    // console.log("full results: ", res);
    if (!res.ok) throw new Error("Failed to fetch patient results")
    return res.json();
};

export const resultsPDFApi = async (results_id: number) => {
  const res = await fetch(`/api/laboratory/results-pdf?results_id=${results_id}`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("Failed to fetch PDF");
  
  // Return blob URL for the PDF
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

export const generateReport = async (
    id: number,
    interpretations: string,
    recommendations: string
) => {
    const patient_analysis_id = Number(id);
    console.log("patient_analysis_id: ", patient_analysis_id);
    if (isNaN(patient_analysis_id)) return { success: false, message: "unable to make the request" }

    console.log("about to make the call")
    const response = await fetch("/api/laboratory/generate-report", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_analysis_id,
          interpretations,
          recommendations
        })
    })

    return response
}

