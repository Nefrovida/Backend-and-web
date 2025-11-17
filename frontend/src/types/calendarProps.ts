export type CalendarProps = {
    events: any[];
    viewType: string;
    minTime?: string;
    maxTime?: string;
    onDatesSet?: (arg: any) => void;
    onEventClick?: (eventInfo: any) => void;
}