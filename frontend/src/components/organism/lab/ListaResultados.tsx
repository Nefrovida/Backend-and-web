import React from "react";
import Title from "../../atoms/Title";
import Filter from "../../atoms/Filter";
import Search from "../../atoms/Search";
import LabResultsList from "../../molecules/lab/LabResultsList";

function ListaResultados() {
  return (
    <div className="w-1/3 p-2 h-screen overflow-hidden">
      <Title>Resultados de laboratorio</Title>
      <div className="w-full flex items-end justify-end gap-5 pb-2">
        <Filter />
        <Search />
      </div>
      <LabResultsList />
    </div>
  );
}

export default ListaResultados;
