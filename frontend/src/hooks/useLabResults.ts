import { useCallback, useEffect, useRef, useState } from "react";

// route = /api/laboratory/results?
async function fetchLabResults(route: string, params: string) {
  const res = await fetch(`${route + "?" + params}`, {
    credentials: "include", // Include cookies in request
  });
  if (!res.ok) throw new Error("Fallo al cargar resultados");
  return res.json();
}

export default function useLabResults<T>(
  route: string,
  watch: unknown[],
  filterFunction: (page: number) => string,
  setName?: (s: string) => void
) {
  const [results, setResults] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLUListElement>(null);

  // Fetches new results, and handle error
  const loadMoreResults = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    fetchLabResults(route, filterFunction(currentPage))
      .then((data) => {
        setResults((prev) => [...prev, ...data]);
        setHasMore(data.length > 0);
        setCurrentPage((prev) => prev + 1);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
        setHasMore(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [loading, hasMore, currentPage]);

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
    setResults([]);
    setHasMore(true);
  }, []);

  const handleFilter = useCallback(() => {
    setCurrentPage(0);
    setResults([]);
    setHasMore(true);
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
    setCurrentPage(0);
    setResults([]);
    setHasMore(true);
    loadMoreResults();
  }, [...watch]);

  console.log("results: ", results)

  return {
    results,
    loading,
    hasMore,
    error,
    scrollRef,
    handleSearch,
    handleFilter,
  };
}
