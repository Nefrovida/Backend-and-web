export const CalendarEventCard = ({ title, type, description }) => (
  <div className="calendar-event-card">
    <div><b>Paciente:</b> {title}</div>
    <div><b>{type}:</b> {description}</div>
  </div>
);
