import { useCallback, useEffect, useRef, useState } from "react";
import patientLabResults from "../types/patientsLabResults";

async function fetchLabResults(
  page: number, 
  filter: {
    name: string | null, 
    start: Date | null, 
    end: Date|null, 
    analysis: number[],
    status: {
      sent: boolean,
      pending: boolean,
      lab: boolean
    }
  }
) {
  const params = new URLSearchParams({ page: page.toString() });
  if (filter?.name) params.append("name", filter.name);
  if (filter?.start) params.append("start", filter.start.toISOString());
  if (filter?.end) params.append("end", filter.end.toISOString());
  if (filter?.analysis) params.append("analysis", JSON.stringify(filter.analysis));

  const selectedStatus = Object.entries(filter.status).filter(([,v]) => v).map(([key,]) => key)

  if (selectedStatus) params.append("status", JSON.stringify(selectedStatus))

  const res = await fetch(`/api/laboratory/results?${params.toString()}`, {
    credentials: "include" // Include cookies in request
  });  
  if (!res.ok) throw new Error("Failed to fetch lab results");
  return res.json();
}

export default function useLabResults() {
  const [labResults, setLabResults] = useState<patientLabResults[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string|null>(null)
  const [date, setDate] = useState<{start: Date|null, end: Date|null}>({start: null, end: null})
  const [analysisType, setAnalysisType] = useState<number[]>([])
  const [status, setStatus] = useState<{sent: boolean, pending: boolean, lab: boolean}>(
    {
      sent: false,
      pending: false,
      lab: false
    }
  )
  
  const scrollRef = useRef<HTMLUListElement>(null);

  // Fetches new results, and handle error
  const loadMoreResults = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    fetchLabResults(currentPage, {name, start: date.start, end: date.end, analysis: analysisType, status})
      .then((data) => {
        setLabResults((prev) => [...prev, ...data]);
        setHasMore(data.length > 0);
        setCurrentPage((prev) => prev + 1);
      })
      .catch(err => {
        console.error(err);
        setError(err);
        setHasMore(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [loading, hasMore, currentPage, name, date, analysisType, status]);

  // Fetches new results when getting to the bottom of the list
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || loading || !hasMore) return;

    const isBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
    if (isBottom) loadMoreResults();
  }, [loading, hasMore, loadMoreResults]);

  // Updates context to search with patient name
  const handleSearch = useCallback((newName: string) => {
    setName(newName);
    setCurrentPage(0);
    setLabResults([]);
    setHasMore(true);
  }, []);

  const handleFilter = useCallback((
    startDate: Date|null, 
    endDate: Date|null, 
    analysis: number[],
    status: {
      sent: boolean,
      pending: boolean,
      lab: boolean,
    }
  ) => {
    setDate({start: startDate, end: endDate})
    setAnalysisType(analysis)
    setStatus(status)
    setCurrentPage(0);
    setLabResults([])
    setHasMore(true)
  }, [])

  // First page load
  // useEffect(() => {
  //   loadMoreResults();
  // }, []); 

  // Fetch more results when scrolling to the bottom of the list
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Fetch results with name
  useEffect(() => {
    if (name !== null || date !== null || analysisType !== null || status !== null) {
      loadMoreResults();
    }
  }, [name, date, analysisType, status]);

  return {
    labResults,
    loading,
    hasMore,
    error,
    scrollRef,
    handleSearch,
    handleFilter
  };
}

  