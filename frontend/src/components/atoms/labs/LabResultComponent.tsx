import React, { FC } from "react";
import { BsPerson } from "react-icons/bs";
import { FiAlertTriangle } from "react-icons/fi";
import {GoVerified} from "react-icons/go";
import { PiFlaskLight } from "react-icons/pi";

interface Props {
  status: "sent" | "pending" | "lab"
}

const Status = {
  sent: <GoVerified className="text-green-600"/>,
  pending: <FiAlertTriangle className="text-yellow-400"/>,
  lab: <PiFlaskLight className="text-red-600"/>
}

const LabResultComponent: FC<Props> = ({status}) => {
  return (
    <div className="rounded-lg drop-shadow-md shadow-md border-2 border-light-blue flex bg-white items-center justify-between py-2 px-4 hover:shadow-xl bg-6" >
      <div className="flex items-center">
        <BsPerson className="text-3xl mr-5" />
        <div>
          <p className="text-lg">Name</p>
          <p className="text-sm">date/date/date</p>
        </div>
      </div>
      <div className="text-3xl">
        {Status[status]}
      </div>
    </div>
  );
}

export default LabResultComponent;
