import React, { useCallback, useEffect, useRef, useState } from "react";
import LabResultComponent from "../../atoms/labs/LabResultComponent";
import patientLabResults from "../../../types/patientsLabResults";

function LabResultsList() {
  const [loading, setLoading] = useState(false);
  const [labResults, setLabResults] = useState<patientLabResults[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [_error, setError] = useState<null|Error>(null)
  const [hasMore, setHasMore] = useState(true)
  
  const scrollRef = useRef<HTMLUListElement>(null);

  async function fetchResults(page: number) {
    if (loading || !hasMore) return true;
    
    setLoading(true);

    setCurrentPage(prevPage => {
      const nextPage = prevPage + 1;
      fetch(`/api/laboratory/results?page=${prevPage}`)
        .then(res => res.json())
        .then(data => {
          setLabResults(prevResults => [...prevResults, ...data]);
          if (data.length <= 0) setHasMore(false);
        })
        .catch(error => {
          setError(Error(error));
          setHasMore(false);
        })
        .finally(() => {
          setLoading(false);
        });
      return nextPage;
    });
  }

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (loading || !hasMore) return;

    const isBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 5;
    if (isBottom) {
      fetchResults(currentPage)
    }
  }, [loading, currentPage, hasMore])

  useEffect(() => {
    fetchResults(currentPage)
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);
  
  return <ul 
    className="flex flex-col gap-2 h-[90%] overflow-auto pb-10 mb-20 pr-2" 
    ref={scrollRef}
    id="lab_result_list">
        {labResults.map((patientResult: any, idx: number) => (
          <LabResultComponent patientResult={patientResult} key={idx}/>
        ))}
      </ul>;
}

export default LabResultsList;
