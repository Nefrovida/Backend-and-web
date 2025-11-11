import React, { FC } from "react";
import LabResultComponent from "../../atoms/labs/LabResultComponent";
import patientLabResults from "../../../types/patientsLabResults";

interface Props {
  scrollRef: React.RefObject<HTMLUListElement | null>,
  labResults: patientLabResults[]
}

const LabResultsList: FC<Props> = ({scrollRef, labResults}) => {
  return <ul 
    className="flex flex-col gap-2 h-[90%] overflow-auto pb-10 mb-20 pr-2" 
    ref={scrollRef}
    id="lab_result_list">
        {labResults.map((patientResult: any, idx: number) => (
          <LabResultComponent patientResult={patientResult} key={idx}/>
        ))}
      </ul>;
}

export default LabResultsList;
