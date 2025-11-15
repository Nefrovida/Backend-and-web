import React, { FC, JSX } from "react";
import { BsPerson } from "react-icons/bs";
import { FiAlertTriangle } from "react-icons/fi";
import {GoVerified} from "react-icons/go";
import { MdPendingActions } from "react-icons/md";
import { PiFlaskLight } from "react-icons/pi";
import patientLabResults from "../../../types/patientsLabResults";
import { ANALYSIS_STATUS } from "../../../types/Analysis_status";
import { Link } from "react-router-dom";

interface Props {
  patientResult: patientLabResults,
}

const Status: Record<ANALYSIS_STATUS, JSX.Element> = {
  [ANALYSIS_STATUS.SENT]: <GoVerified className="text-green-600" />,
  [ANALYSIS_STATUS.LAB]: <PiFlaskLight className="text-red-600" />,
  [ANALYSIS_STATUS.PENDING]: <FiAlertTriangle className="text-orange-400" />,
  [ANALYSIS_STATUS.REQUESTED]: <MdPendingActions className="text-yellow-400"/>
};

const LabResultComponent: FC<Props> = ({patientResult}) => {
  const patient = patientResult.patient.user;
  const name = patient.name + " " + patient.parent_last_name + " " + patient.maternal_last_name;
  const date = new Date(patientResult.analysis_date);

  const parsedDate = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();

  return (
    <Link 
      className="rounded-lg drop-shadow-md shadow-md border-2 border-light-blue flex bg-white items-center justify-between py-2 px-4 hover:shadow-xl" 
      to={patientResult.patient_analysis_id.toString()} >
      <div className="flex items-center">
        <BsPerson className="text-3xl mr-5" />
        <div>
          <p className="text-lg">
            {name}
          </p>
          <p className="text-sm">
            {parsedDate}
          </p>
        </div>
      </div>
      <div className="text-3xl">
        {Status[patientResult.analysis_status]}
      </div>
    </Link>
  );
}

export default LabResultComponent;
