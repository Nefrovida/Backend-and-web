import Title from "../../atoms/Title";
import Filter from "../../atoms/Filter";
import Search from "../../atoms/Search";
import LabResultsList from "../../molecules/lab/LabResultsList";
import useInfiniteScroll from "../../../hooks/useInfiniteScroll";
import LabFilter from "../../molecules/lab/LabFilter";
import patientLabResults from "@/types/patientsLabResults";

import { Suspense } from "react";

import labResultsFilter from "../../../services/labResultFilter";
import useLabFilters from "@/hooks/lab/useLabFilter";
import { useState } from "react";
import Loading from "@/components/molecules/Loading";

function ListResult() {
  const [name, setName] = useState<string | null>(null);
  const { date, analysisType, status, labFilterUpdate } = useLabFilters();

  const { results, loading, scrollRef, error, handleSearch, handleFilter } =
    useInfiniteScroll<patientLabResults>(
      "/api/laboratory/results",
      [name, date, analysisType, status],
      (page: number) =>
        labResultsFilter(page, {
          name,
          start: date.start,
          end: date.end,
          analysis: analysisType,
          status,
        }),
      setName
    );

  return (
    <div className="w-1/3 p-2 h-screen overflow-hidden">
      <Title size="medium">Resultados de laboratorio</Title>
      <div className="w-full flex items-end justify-end gap-5 pb-2">
        <Filter
          show={
            <LabFilter
              onChange={(...args) => {
                labFilterUpdate(...args);
                handleFilter();
              }}
            />
          }
        />
        <Search onChange={handleSearch} />
      </div>
      {loading && <div>Cargando análisis...</div>}
      {results.length == 0 && results.length == 0 && (
        <div className="text-center text-lg">
          No se encuentra ningún análisis de este tipo
        </div>
      )}
      {results.length > 0 && !error && (
        <Suspense fallback={<Loading />}>
          <LabResultsList scrollRef={scrollRef} labResults={results} />
        </Suspense>
      )}
    </div>
  );
}

export default ListResult;
