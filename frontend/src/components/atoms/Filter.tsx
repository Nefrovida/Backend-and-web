import React, { FC, useState } from "react";
import { BsFilter, BsX } from "react-icons/bs";

interface Props {
  show: React.ReactNode;
}

const Filter: FC<Props> = ({ show }) => {
  const [modal, setModal] = useState(false);

  return (
    <>
      <div
        className={`w-24 rounded-full bg-white flex justify-between items-center px-2 cursor-pointer ${
          modal ? "bg-red-600 hover:bg-red-500" : "hover:bg-gray-100"
        }`}
        onClick={() => setModal((prev) => !prev)}
      >
        <p>Filter</p>
        {modal ? <BsX /> : <BsFilter />}
      </div>
      {modal && show}
    </>
  );
};

export default Filter;
