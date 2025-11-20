import { useState } from "react";

function useLabFilters() {
  const [date, setDate] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [analysisType, setAnalysisType] = useState<number[]>([]);
  const [status, setStatus] = useState<{
    sent: boolean;
    pending: boolean;
    lab: boolean;
  }>({
    sent: false,
    pending: false,
    lab: false,
  });

  function labFilterUpdate(
    startDate: Date | null,
    endDate: Date | null,
    analysis: number[],
    status: {
      sent: boolean;
      pending: boolean;
      lab: boolean;
    }
  ) {
    setDate({ start: startDate, end: endDate });
    setAnalysisType(analysis);
    setStatus(status);
  }

  return { date, analysisType, status, labFilterUpdate };
}

export default useLabFilters;
