import { CalendarEventCard } from "../atoms/CalendarEventCard";

export function CalendarEventContent(eventInfo: any) {
    const p = eventInfo.event;

    return (
        <CalendarEventCard 
        title={p.title}
        type={p.extendedProps.type}
        description={p.extendedProps.description}
        />
    )
}