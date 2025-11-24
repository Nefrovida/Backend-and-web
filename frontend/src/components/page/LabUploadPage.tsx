// src/components/pages/LabAppointmentPage.tsx (o como se llame)
import PendingLabAppointmentsList from "@/components/organism/lab/PendingLabAppointmentsList";
import LabAppointmentUpload from "@/components/organism/lab/LabAppointmentUpload";

function LabAppointmentPage() {
    return (
        // si tienes navbar fijo arriba de 4rem, adapta el calc
        <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
            <PendingLabAppointmentsList />
            <div className="flex-1 h-full overflow-y-auto">
                <LabAppointmentUpload />
            </div>
        </div>
    );
}

export default LabAppointmentPage;