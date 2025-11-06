import React from "react";
import Title from "../../atoms/Title";
import LabResultComponent from "../../molecules/lab/LabResultComponent";

function ListaResultados() {
  return (
    <div className="w-1/3 p-2">
      <Title>Resultados de laboratorio</Title>
      <ul className="flex flex-col gap-2">
        {Array.from({ length: 8 }).map((idx) => (
          <LabResultComponent />
        ))}
      </ul>
    </div>
  );
}

export default ListaResultados;
