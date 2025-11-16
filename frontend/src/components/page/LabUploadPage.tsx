// src/components/page/LabUploadPage.tsx
import { Outlet } from "react-router";
import PendingLabAppointmentsList from "../organism/lab/PendingLabAppointmentsList";

function LabUploadPage() {
    return (
        <section className="flex w-full">
            <PendingLabAppointmentsList />
            <Outlet />
        </section>
    );
}

export default LabUploadPage;