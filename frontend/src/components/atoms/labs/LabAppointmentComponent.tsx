// src/components/atoms/labs/LabAppointmentComponent.tsx
import type { FC, ReactElement } from "react";
import { BsPerson } from "react-icons/bs";
import { MdPendingActions } from "react-icons/md";
import { GoVerified } from "react-icons/go";
import { FiAlertTriangle } from "react-icons/fi";
import { PiFlaskLight } from "react-icons/pi";
import { NavLink } from "react-router-dom";
import { LabAppointment } from "../../../types/labAppointment";
import { ANALYSIS_STATUS } from "../../../types/Analysis_status";

interface Props {
    appointment: LabAppointment;
}

const StatusIcon: Record<ANALYSIS_STATUS, ReactElement> = {
    [ANALYSIS_STATUS.SENT]: <GoVerified className="text-green-600" />,
    [ANALYSIS_STATUS.LAB]: <PiFlaskLight className="text-red-600" />,
    [ANALYSIS_STATUS.PENDING]: <FiAlertTriangle className="text-orange-400" />,
    [ANALYSIS_STATUS.REQUESTED]: <MdPendingActions className="text-yellow-400" />,
};

const LabAppointmentComponent: FC<Props> = ({ appointment }) => {
    const date = new Date(appointment.date);
    const parsedDate =
        date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

    return (
        <NavLink
            to={appointment.id.toString()}
            className={({ isActive }) =>
                [
                    "rounded-lg drop-shadow-md shadow-md border-2 flex bg-white items-center justify-between py-2 px-4 hover:shadow-xl transition-colors",
                    isActive ? "bg-slate-100 border-blue-500" : "border-light-blue",
                ].join(" ")
            }
        >
            <div className="flex items-center">
                <BsPerson className="text-3xl mr-5" />
                <div>
                    <p className="text-lg">{appointment.patientName}</p>
                    <p className="text-sm">{appointment.analysisName}</p>
                    <p className="text-xs text-slate-600">{parsedDate}</p>
                </div>
            </div>
            <div className="text-3xl">{StatusIcon[appointment.status]}</div>
        </NavLink>
    );
};

export default LabAppointmentComponent;