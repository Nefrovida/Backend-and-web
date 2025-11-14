import Title from "../../atoms/Title";
import Filter from "../../atoms/Filter";
import Search from "../../atoms/Search";
import LabResultsList from "../../molecules/lab/LabResultsList";
import useLabResults from "../../../hooks/useLabResults";
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

  const { results, scrollRef, error, handleSearch, handleFilter } =
    useLabResults<patientLabResults>(
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
      <Title>Resultados de laboratorio</Title>
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
      {error ? (
        <div>{error.toString()}</div>
      ) : (
        <Suspense fallback={<Loading />}>
          <LabResultsList scrollRef={scrollRef} labResults={results} />
        </Suspense>
      )}
    </div>
  );
}

export default ListResult;
