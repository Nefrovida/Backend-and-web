import React, { useCallback, useEffect, useRef, useState } from "react";
import Title from "../../atoms/Title";
import Filter from "../../atoms/Filter";
import Search from "../../atoms/Search";
import LabResultsList from "../../molecules/lab/LabResultsList";
import patientLabResults from "../../../types/patientsLabResults";

async function fetchLabResults(
  page: number, 
  filter: {name: string | null, date: string | null}
) {
  console.log(filter.name)
  const params = new URLSearchParams({ page: page.toString() });

  if (filter?.name) params.append("name", filter.name);
  if (filter?.date) params.append("date", filter.date);

  const res = await fetch(`/api/laboratory/results?${params.toString()}`);  
  if (!res.ok) throw new Error("Failed to fetch lab results");
  return res.json();
}

function ListaResultados() {
  const [labResults, setLabResults] = useState<patientLabResults[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string|null>(null)
  
  const scrollRef = useRef<HTMLUListElement>(null);

  // Fetches new results, and handle error
  const loadMoreResults = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    fetchLabResults(currentPage, {name, date: null})
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
  }, [loading, hasMore, currentPage, name]);

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

  // First page load
  useEffect(() => {
    loadMoreResults();
  }, []); 

  // Fetch more results when scrolling to the bottom of the list
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Fetch results with name
  useEffect(() => {
    if (name !== null) {
      loadMoreResults();
    }
  }, [name]);

  return (
    <div className="w-1/3 p-2 h-screen overflow-hidden">
      <Title>Resultados de laboratorio</Title>
      <div className="w-full flex items-end justify-end gap-5 pb-2">
        <Filter />
        <Search onChange={handleSearch}/>
      </div>
      <LabResultsList scrollRef={scrollRef} labResults={labResults} />
    </div>
  );
}

export default ListaResultados;
