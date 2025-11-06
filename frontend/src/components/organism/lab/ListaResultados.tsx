import React from "react";
import Title from "../../atoms/Title";
import LabResultComponent from "../../atoms/labs/LabResultComponent";
import Filter from "../../atoms/Filter";
import Search from "../../atoms/Search";

function ListaResultados() {
  return (
    <div className="w-1/3 p-2 h-screen overflow-hidden">
      <Title>Resultados de laboratorio</Title>
      <div className="w-full flex items-end justify-end gap-5 pb-2">
        <Filter />
        <Search />
      </div>
      <ul className="flex flex-col gap-2 h-full overflow-auto pb-10 pr-2">
        {Array.from({ length: 10 }).map((idx) => (
          <LabResultComponent />
        ))}
      </ul>
    </div>
  );
}

export default ListaResultados;
