import { useCallback, useEffect, useRef, useState } from "react";

// route = /api/laboratory/results?
async function fetchResults(route: string, params: string) {
  const res = await fetch(`${route + "?" + params}`, {
    credentials: "include", // Include cookies in request
  });
  if (!res.ok) throw new Error("Fallo al cargar resultados");
  return { data: await res.json(), status: res.status };
}

// Hook que automáticamente hace consultas de la nueva búsqueda al llegar al
// final de un scroll
// @route: ruta base de la API / debe tener un parámetro en page que empieze en 0
// @watch: variables que pueden ir cambiando en el tiempo y que pueden afectar
//    cuando se recarga los resultados / volver a page=0
// @filterFunction: función genérica que recibe la página actual para mantener
//    el filtro en búsquedas continuas, y regresa el string de la ruta con los
//    queries
// @setName: en caso de que se quiera filtrar por nombre, depende de la función
//    filterFunction
export default function useInfiniteScroll<T>(
  route: string,
  watch: unknown[],
  filterFunction: (page: number) => string
) {
  const [results, setResults] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLUListElement>(null);

  // Use refs to avoid stale closures
  const filterFunctionRef = useRef(filterFunction);
  const routeRef = useRef(route);

  useEffect(() => {
    filterFunctionRef.current = filterFunction;
    routeRef.current = route;
  }, [filterFunction, route]);

  // Fetches new results, and handle error
  const loadMoreResults = useCallback(
    async (page: number) => {
      if (loading) return;

      setLoading(true);
      fetchResults(routeRef.current, filterFunctionRef.current(page))
        .then(({ data, status }) => {
          if (status == 400) {
            return;
          }
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
    },
    [loading, currentPage, filterFunction]
  );

  // Fetches new results when getting to the bottom of the list
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || loading || !hasMore) return;

    const isBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
    if (isBottom) loadMoreResults(currentPage);
  }, [loading, hasMore, loadMoreResults, currentPage]);

  // Updates context to search with patient name
  const handleSearch = useCallback(() => {
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
    loadMoreResults(0);
  }, [...watch]);

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
