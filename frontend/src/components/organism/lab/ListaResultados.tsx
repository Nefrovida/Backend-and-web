import React from "react";
import Title from "../../atoms/Title";
import LabResultComponent from "../../atoms/labs/LabResultComponent";

function ListaResultados() {
  return (
    <div className="w-1/3 p-2">
      <Title>Resultados de laboratorio</Title>
      <div className="w-full flex items-end justify-end gap-10">
        
      </div>
      <ul className="flex flex-col gap-2">
        {Array.from({ length: 8 }).map((idx) => (
          <LabResultComponent />
        ))}
      </ul>
    </div>
  );
}

export default ListaResultados;
