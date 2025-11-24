import PendingLabAppointmentsList from "@/components/organism/lab/PendingLabAppointmentsList";
import LabAppointmentUpload from "@/components/organism/lab/LabAppointmentUpload";

function LabAppointmentPage() {
    return (
        <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
            <PendingLabAppointmentsList />
            <div className="flex-1 h-full overflow-y-auto">
                <LabAppointmentUpload />
            </div>
        </div>
    );
}

export default LabAppointmentPage;