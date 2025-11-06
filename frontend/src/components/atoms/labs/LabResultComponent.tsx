import React from "react";
import { BsPerson } from "react-icons/bs";
import { FiAlertTriangle } from "react-icons/fi";

function LabResultComponent() {
  return (
    <div className="rounded-lg drop-shadow-md shadow-md border-2 border-light-blue flex bg-white items-center justify-between py-2 px-4 hover:shadow-xl bg-6" >
      <div className="flex items-center">
        <BsPerson className="text-3xl mr-5" />
        <div>
          <p className="text-lg">Name</p>
          <p className="text-sm">date/date/date</p>
        </div>
      </div>
      <FiAlertTriangle className="text-yellow-400 text-3xl" />
    </div>
  );
}

export default LabResultComponent;
