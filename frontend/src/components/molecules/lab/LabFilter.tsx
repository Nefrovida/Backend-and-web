import React, { FC, useEffect, useState } from "react";
import analysisInfo from "../../../types/analysisInfo";
import { GoVerified } from "react-icons/go";
import { PiFlaskLight } from "react-icons/pi";
import { FiAlertTriangle } from "react-icons/fi";
import { MdPendingActions } from "react-icons/md";

interface Props {
  onChange: (
    startDate: Date | null,
    endDate: Date | null,
    analysis: number[],
    status: {
      sent: boolean;
      pending: boolean;
      lab: boolean;
    }
  ) => void;
}

const LabFilter: FC<Props> = ({ onChange }) => {
  const [analysis, setAnalysis] = useState<analysisInfo[]>([]);
  const [inputs, setInputs] = useState({});
  const [date, setDate] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [status, setStatus] = useState<{
    sent: boolean;
    pending: boolean;
    lab: boolean;
  }>({ sent: false, pending: false, lab: false });

  function handleFilter() {
    const selected = (
      Object.values(inputs) as { selected: boolean; value: number }[]
    )
      .filter((v) => v.selected)
      .map((v) => v.value);
    onChange(date.start, date.end, selected, status);
  }

  function deleteFilter() {
    onChange(null, null, [], { sent: false, pending: false, lab: false });
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    setInputs((values) => ({
      ...values,
      [name]: { selected: value, value: target.value },
    }));
  };

  const handleChangeStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    setStatus((values) => ({ ...values, [name]: value }));
  };

  useEffect(() => {
    fetch("/api/laboratory/analysis", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setAnalysis(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="absolute top-[6.2rem] -translate-x-28 bg-white rounded-md h-[30rem] w-80 z-10 drop-shadow-xl shadow-lg p-2">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-lg font-semibold">Filtro</h1>
      </div>

      <h2 className="text-lg">Rango de fechas</h2>
      <div className="flex gap-2 w-fit flex-wrap my-1">
        <span>De</span>
        <input
          type="date"
          className="bg-gray-200 text-sm"
          onChange={(e) =>
            setDate((prev) => ({
              ...prev,
              start: new Date(e.target.value),
            }))
          }
        />
        <span>al</span>
        <input
          type="date"
          className="bg-gray-200 text-sm"
          onChange={(e) =>
            setDate((prev) => ({
              ...prev,
              end: new Date(e.target.value),
            }))
          }
        />
      </div>

      <h2 className="mt-2 text-lg">Estatus</h2>
      <div>
        <label htmlFor="pending" className="flex gap-1 items-center">
          <input
            className="flex items-center hover:underline"
            onChange={handleChangeStatus}
            type="checkbox"
            name="pending"
            value="pending"
            id="pending"
          />
          <FiAlertTriangle className="text-orange-400" />
          Agendado
        </label>

        <label htmlFor="lab" className="flex gap-1 items-center">
          <input
            className="flex items-center hover:underline"
            onChange={handleChangeStatus}
            type="checkbox"
            name="lab"
            value="lab"
            id="lab"
          />
          <PiFlaskLight className="text-red-600" />
          En laboratorio
        </label>

        <label htmlFor="requested" className="flex gap-1 items-center">
          <input
            className="flex items-center hover:underline"
            onChange={handleChangeStatus}
            type="checkbox"
            name="requested"
            value="requested"
            id="requested"
          />
          <MdPendingActions className="text-yellow-400" />
          Pendiente
        </label>

        <label htmlFor="sent" className="flex gap-1 items-center">
          <input
            className="flex items-center hover:underline"
            onChange={handleChangeStatus}
            type="checkbox"
            name="sent"
            value="sent"
            id="sent"
          />
          <GoVerified className="text-green-600" />
          Enviado
        </label>
      </div>

      <h2 className="mt-2 text-lg">Tipo de examen</h2>
      <div className="flex flex-col overflow-scroll h-40">
        {analysis.map((a, idx) => (
          <label
            htmlFor={"analysis_" + a.analysis_id}
            className="flex gap-2 items-center"
            key={idx}
          >
            <input
              type="checkbox"
              id={"analysis_" + a.analysis_id}
              name={a.name}
              value={a.analysis_id}
              onChange={handleChange}
            />
            {a.name}
          </label>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          className="bg-gray-300 hover:bg-gray-200 rounded-md w-1/2 py-1"
          onClick={deleteFilter}
        >
          Borrar
        </button>
        <button
          className="bg-success hover:bg-hover-success rounded-md w-1/2 py-1"
          onClick={handleFilter}
        >
          Buscar
        </button>
      </div>
    </div>
  );
};

export default LabFilter;
