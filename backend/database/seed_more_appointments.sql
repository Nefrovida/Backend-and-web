-- Add more REQUESTED patient appointments for secretary testing
-- Run this with: cat database/seed_more_appointments.sql | npx prisma db execute --stdin --schema prisma/schema.prisma

INSERT INTO patient_appointment (patient_id, appointment_id, date_hour, duration, appointment_type, place, appointment_status)
SELECT 
  p.patient_id,
  1, -- appointment_id (assumes at least 1 appointment exists)
  NULL, -- date_hour is null for REQUESTED status
  30, -- duration in minutes
  'PRESENCIAL',
  NULL,
  'REQUESTED'
FROM patients p
LIMIT 5;

-- Add a few more with VIRTUAL type
INSERT INTO patient_appointment (patient_id, appointment_id, date_hour, duration, appointment_type, link, appointment_status)
SELECT 
  p.patient_id,
  1,
  NULL,
  30,
  'VIRTUAL',
  'https://meet.google.com/pending-appointment',
  'REQUESTED'
FROM patients p
LIMIT 3;
