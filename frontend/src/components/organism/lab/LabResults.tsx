import React from "react";
import { useParams } from "react-router";

function LabResults() {
  const params = useParams<{ resultadoId: string }>();

  return <div>LabResults {params.resultadoId}</div>;
}

export default LabResults;
