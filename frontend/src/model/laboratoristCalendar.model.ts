// frontend/src/model/laboratoristCalendar.model.ts
export function mapAnalysisToEvents(data: any) {
    const events: any[] = [];

    Object.keys(data).forEach((timestamp) => {
        data[timestamp].forEach((item: any) => {
            const fullName = [
                item.patient.user.name,
                item.patient.user.parent_last_name,
                item.patient.user.maternal_last_name,
            ]
                .filter(Boolean)
                .join(" ");

            const startDate = new Date(item.analysis_date);
            const endDate = new Date(startDate.getTime() + 30 * 60 * 1000);

            events.push({
                id: item.patient_analysis_id,
                title: fullName,
                type: "Análisis",
                description: item.analysis.name.trim(),
                start: startDate,
                end: endDate,
            });
        });
    });
    return events;
}