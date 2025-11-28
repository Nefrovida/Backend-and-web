import { timeStamp } from "console";

export function mapAnalysisToEvents(data){
    const events = [];

    Object.keys(data).forEach((timestamp) => {
        data[timestamp].forEach((item) => {
            const fullName = 
                `${item.patient.user.name} ` +
                `${item.patient.user.parent_last_name} ` +
                `${item.patient.user.maternal_last_name ?? ""}`.trim();

            // Delete UTC to retrieve date in Mexico's zone
            const raw = item.analysis_date.replace("Z", "");
            const startDate = new Date(raw);
            const endDate = new Date(startDate.getTime() + 30 * 60 * 1000);

            events.push({
                id: item.patient_analysis_id,
                title: fullName,
                type: "Análisis",
                description: item.analysis.name.trim(),
                start: startDate,
                end: endDate,
            });
        })
    })
    return events
}