-- ========================
--  CLEAR EXISTING DATA
-- ========================
TRUNCATE TABLE role_privilege, patient_history, results, patient_analysis, patient_appointment, notes, appointments, forums, familiars, doctors, laboratorists, patients, users, privileges, roles, analysis, questions_history, options, user_reports, notifications, devices, messages, likes, users_forums RESTART IDENTITY CASCADE;

-- ========================
-- 🧩 ROLES
-- ========================

INSERT INTO roles (role_name) VALUES
('Admin'),
('Doctor'),
('Paciente'),
('Laboratorista'),
('Familiar'),
('Secretaria');

-- ========================
-- 🧩 PRIVILEGIOS
-- ========================
INSERT INTO privileges (description) 
VALUES
('VIEW_USERS'),
('CREATE_USERS'),
('UPDATE_USERS'),
('DELETE_USERS'),
('VIEW_ROLES'),
('CREATE_ROLES'),
('UPDATE_ROLES'),
('DELETE_ROLES'),
('VIEW_PATIENTS'),
('CREATE_PATIENTS'),
('UPDATE_PATIENTS'),
('DELETE_PATIENTS'),
('VIEW_APPOINTMENTS'),
('CREATE_APPOINTMENTS'),
('UPDATE_APPOINTMENTS'),
('DELETE_APPOINTMENTS'),
('VIEW_ANALYSIS'),
('CREATE_ANALYSIS'),
('UPDATE_ANALYSIS'),
('DELETE_ANALYSIS'),
('VIEW_FORUMS'),
('CREATE_FORUMS'),
('UPDATE_FORUMS'),
('DELETE_FORUMS'),
('VIEW_HISTORY_QUESTIONS'),
('CREATE_HISTORY_QUESTIONS'),
('UPDATE_HISTORY_QUESTIONS'),
('DELETE_HISTORY_QUESTIONS'),
('VIEW_REPORTS'),
('ADD_USER_TO_FORUM'),
('CREATE_CLINICAL_HISTORY'),
('VIEW_CLINICAL_HISTORY'),
('UPDATE_CLINICAL_HISTORY'),
('DELETE_CLINICAL_HISTORY'),
('VIEW_MEDICAL_RECORD'),
('CREATE_DOCTOR'),
('MANAGE_ANALYSIS_TYPES'),
('VIEW_LAB_APPOINTMENTS'),
('UPLOAD_LAB_RESULTS'),
('VIEW_LAB_RESULTS'),
('EDIT_LAB_RESULTS'),
('CREATE_NOTES'),
('VIEW_NOTES');

-- ========================
-- 🧩 ROLES - PRIVILEGIOS
-- ========================

-- Doctor (role_id = 2) - Assign common privileges
INSERT INTO role_privilege (role_id, privilege_id)
SELECT 2, privilege_id
FROM privileges
WHERE description IN (
  'VIEW_PATIENTS',
  'CREATE_PATIENTS',
  'UPDATE_PATIENTS',
  'VIEW_APPOINTMENTS',
  'CREATE_APPOINTMENTS',
  'UPDATE_APPOINTMENTS',
  'VIEW_ANALYSIS',
  'CREATE_ANALYSIS',
  'UPDATE_ANALYSIS',
  'VIEW_FORUMS',
  'CREATE_FORUMS',
  'UPDATE_FORUMS',
  'DELETE_FORUMS',
  'VIEW_HISTORY_QUESTIONS',
  'CREATE_HISTORY_QUESTIONS',
  'UPDATE_HISTORY_QUESTIONS',
  'DELETE_HISTORY_QUESTIONS',
  'VIEW_REPORTS',
  'ADD_USER_TO_FORUM',
  'CREATE_CLINICAL_HISTORY',
  'VIEW_CLINICAL_HISTORY',
  'UPDATE_CLINICAL_HISTORY',
  'VIEW_MEDICAL_RECORD',
  'VIEW_LAB_RESULTS',
  'EDIT_LAB_RESULTS',
  'CREATE_NOTES',
  'VIEW_NOTES'
);

-- Admin (role_id = 1): full privileges
INSERT INTO role_privilege (role_id, privilege_id)
SELECT 1, privilege_id 
FROM privileges;

-- Laboratorista (role_id = 4)
INSERT INTO role_privilege (role_id, privilege_id)
SELECT 4, privilege_id
FROM privileges
WHERE description IN (
  'VIEW_APPOINTMENTS',
  'UPDATE_APPOINTMENTS',
  'VIEW_ANALYSIS',
  'VIEW_LAB_APPOINTMENTS',
  'UPLOAD_LAB_RESULTS',
  'VIEW_PATIENTS'
);

-- Paciente (role_id = 3)
INSERT INTO role_privilege (role_id, privilege_id)
SELECT 3, privilege_id
FROM privileges
WHERE description IN (
  'VIEW_FORUMS',
  'VIEW_APPOINTMENTS',
  'CREATE_APPOINTMENTS'
);

-- Secretaria (role_id = 6)
INSERT INTO role_privilege (role_id, privilege_id)
SELECT 6, privilege_id 
FROM privileges 
WHERE description IN (
    'VIEW_ANALYSIS', 
    'CREATE_ANALYSIS', 
    'UPDATE_ANALYSIS', 
    'DELETE_ANALYSIS',
    'MANAGE_ANALYSIS_TYPES',
    'VIEW_APPOINTMENTS',
    'CREATE_APPOINTMENTS',
    'UPDATE_APPOINTMENTS',
    'DELETE_APPOINTMENTS',
    'VIEW_FORUMS',
    'VIEW_PATIENTS'
);

-- ========================
-- 👥 USUARIOS
-- ========================

-- Admin
INSERT INTO users (user_id, name, parent_last_name, maternal_last_name, active, phone_number, username, password, birthday, gender, first_login, role_id)
VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Carlos', 'Ramírez', 'González', true, '7711234567', 'testAdmin1', '$2b$10$f9x27.PRkO.oCMQVkRBXSOWgIARKlXdeIq2fuYIL.HJcs3gIsFFBG', '1985-03-15', 'MALE', false, 1);

-- Doctores
INSERT INTO users (user_id, name, parent_last_name, maternal_last_name, active, phone_number, username, password, birthday, gender, first_login, role_id)
VALUES 
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'María', 'López', 'Hernández', true, '7712345678', 'testDoctor1', '$2b$10$f9x27.PRkO.oCMQVkRBXSOWgIARKlXdeIq2fuYIL.HJcs3gIsFFBG', '1980-06-20', 'FEMALE', false, 2),
('b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'José', 'García', 'Martínez', true, '7713456789', 'testDoctor2', '$2b$10$f9x27.PRkO.oCMQVkRBXSOWgIARKlXdeIq2fuYIL.HJcs3gIsFFBG', '1975-11-10', 'MALE', false, 2),
('b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Ana', 'Rodríguez', 'Sánchez', true, '7714567890', 'testDoctor3', '$2b$10$f9x27.PRkO.oCMQVkRBXSOWgIARKlXdeIq2fuYIL.HJcs3gIsFFBG', '1988-02-28', 'FEMALE', false, 2);

-- Pacientes
INSERT INTO users (user_id, name, parent_last_name, maternal_last_name, active, phone_number, username, password, birthday, gender, first_login, role_id)
VALUES 
('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Pedro', 'Fernández', 'Morales', true, '7715678901', 'testPaciente1', '$2b$10$f9x27.PRkO.oCMQVkRBXSOWgIARKlXdeIq2fuYIL.HJcs3gIsFFBG', '1990-05-12', 'MALE', false, 3),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'Laura', 'Martínez', 'Cruz', true, '7716789012', 'testPaciente2', '$2b$10$f9x27.PRkO.oCMQVkRBXSOWgIARKlXdeIq2fuYIL.HJcs3gIsFFBG', '1995-08-25', 'FEMALE', false, 3),
('c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'Roberto', 'Sánchez', 'Flores', true, '7717890123', 'testPaciente3', '$2b$10$f9x27.PRkO.oCMQVkRBXSOWgIARKlXdeIq2fuYIL.HJcs3gIsFFBG', '1982-12-05', 'MALE', false, 3),
('c4eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 'Sofia', 'Torres', 'Ramírez', true, '7718901234', 'testPaciente4', '$2b$10$f9x27.PRkO.oCMQVkRBXSOWgIARKlXdeIq2fuYIL.HJcs3gIsFFBG', '2000-01-30', 'FEMALE', true, 3);

-- Laboratoristas
INSERT INTO users (user_id, name, parent_last_name, maternal_last_name, active, phone_number, username, password, birthday, gender, first_login, role_id)
VALUES 
('d1eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 'Luis', 'Méndez', 'Castro', true, '7719012345', 'testLaboratorista1', '$2b$10$f9x27.PRkO.oCMQVkRBXSOWgIARKlXdeIq2fuYIL.HJcs3gIsFFBG', '1987-07-18', 'MALE', false, 4),
('d2eebc99-9c0b-4ef8-bb6d-6bb9bd380aaa', 'Carmen', 'Vargas', 'Ortiz', true, '7710123456', 'testLaboratorista2', '$2b$10$f9x27.PRkO.oCMQVkRBXSOWgIARKlXdeIq2fuYIL.HJcs3gIsFFBG', '1992-04-22', 'FEMALE', false, 4);

-- Familiares
INSERT INTO users (user_id, name, parent_last_name, maternal_last_name, active, phone_number, username, password, birthday, gender, first_login, role_id)
VALUES 
('e1eebc99-9c0b-4ef8-bb6d-6bb9bd380bbb', 'Juan', 'Fernández', 'López', true, '7721234567', 'testFamiliar1', '$2b$10$f9x27.PRkO.oCMQVkRBXSOWgIARKlXdeIq2fuYIL.HJcs3gIsFFBG', '1988-09-15', 'MALE', false, 5),
('e2eebc99-9c0b-4ef8-bb6d-6bb9bd380ccc', 'Patricia', 'Martínez', 'Díaz', true, '7722345678', 'testFamiliar2', '$2b$10$f9x27.PRkO.oCMQVkRBXSOWgIARKlXdeIq2fuYIL.HJcs3gIsFFBG', '1993-11-20', 'FEMALE', false, 5);

-- Secretaria
INSERT INTO users (user_id, name, parent_last_name, maternal_last_name, active, phone_number, username, password, birthday, gender, first_login, role_id)
VALUES 
('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380ddd', 'Rosa', 'Jiménez', 'Ruiz', true, '7723456789', 'testSecretaria1', '$2b$10$f9x27.PRkO.oCMQVkRBXSOWgIARKlXdeIq2fuYIL.HJcs3gIsFFBG', '1991-03-08', 'FEMALE', false, 6);

-- ========================
-- 🩺 DOCTORES
-- ========================

INSERT INTO doctors (doctor_id, user_id, specialty, license)
VALUES 
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Cardiología', '12345678901234567890'),
('b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Medicina General', '23456789012345678901'),
('b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Pediatría', '34567890123456789012');

-- ========================
-- 🧪 LABORATORISTAS
-- ========================

INSERT INTO laboratorists (laboratorist_id, user_id)
VALUES 
('d1eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a99'),
('d2eebc99-9c0b-4ef8-bb6d-6bb9bd380aaa', 'd2eebc99-9c0b-4ef8-bb6d-6bb9bd380aaa');

-- ========================
-- 🏥 PACIENTES
-- ========================

INSERT INTO patients (patient_id, user_id, curp)
VALUES 
('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'FEMP900512HHGRNR01'),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'MACL950825MHGRZR02'),
('c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'SAFR821205HHGNLR03'),
('c4eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 'c4eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 'TORS000130MHGRRF04');

-- ========================
-- 👨‍👩‍👧 FAMILIARES
-- ========================

INSERT INTO familiars (familiar_id, user_id, patient_id)
VALUES 
('e1eebc99-9c0b-4ef8-bb6d-6bb9bd380bbb', 'e1eebc99-9c0b-4ef8-bb6d-6bb9bd380bbb', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55'),
('e2eebc99-9c0b-4ef8-bb6d-6bb9bd380ccc', 'e2eebc99-9c0b-4ef8-bb6d-6bb9bd380ccc', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a66');

-- ========================
-- 📅 CITAS (APPOINTMENTS)
-- ========================

INSERT INTO appointments (doctor_id, name, general_cost, community_cost, image_url)
VALUES 
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Consulta Cardiológica', 800.00, 500.00, 'https://example.com/cardio.jpg'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Electrocardiograma', 600.00, 400.00, 'https://example.com/ecg.jpg'),
('b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Consulta General', 500.00, 300.00, 'https://example.com/general.jpg'),
('b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Consulta Pediátrica', 600.00, 350.00, 'https://example.com/pediatria.jpg'),
('b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Control de Niño Sano', 400.00, 250.00, 'https://example.com/control.jpg');

-- ========================
-- 📋 CITAS DE PACIENTES
-- ========================

INSERT INTO patient_appointment (patient_id, appointment_id, date_hour, duration, appointment_type, link, place, appointment_status)
VALUES 
('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 1, '2025-11-25 10:00:00', 60, 'PRESENCIAL', NULL, 'Consultorio 101, Hospital Central', 'PROGRAMMED'),
('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 2, '2025-10-15 14:00:00', 30, 'PRESENCIAL', NULL, 'Consultorio 101, Hospital Central', 'FINISHED'),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 3, '2025-11-23 09:00:00', 45, 'VIRTUAL', 'https://meet.google.com/abc-defg-hij', NULL, 'PROGRAMMED'),
('c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 3, '2025-10-20 16:00:00', 45, 'PRESENCIAL', NULL, 'Consultorio 205, Clínica del Sur', 'FINISHED'),
('c4eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 4, '2025-11-28 11:00:00', 45, 'PRESENCIAL', NULL, 'Consultorio 302, Hospital Infantil', 'PROGRAMMED'),
('c4eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 5, '2025-10-10 10:00:00', 30, 'PRESENCIAL', NULL, 'Consultorio 302, Hospital Infantil', 'FINISHED');

-- ========================
-- 📝 NOTAS MÉDICAS
-- ========================

INSERT INTO notes (patient_id, patient_appointment_id, title, content, general_notes, ailments, prescription, visibility)
VALUES 
('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 2, 'Revisión Cardiológica', 'Paciente presenta ritmo cardiaco regular.', 'Presión arterial: 120/80. Frecuencia cardiaca: 72 lpm.', 'Ninguna anormalidad detectada', 'Continuar con ejercicio moderado 30 min diarios', true),
('c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 4, 'Consulta de Rutina', 'Paciente refiere molestias estomacales leves.', 'Temperatura: 36.5°C. Peso: 75 kg.', 'Gastritis leve', 'Omeprazol 20mg, 1 cada 24 hrs por 14 días', true),
('c4eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 6, 'Control Pediátrico', 'Desarrollo adecuado para la edad.', 'Peso: 18 kg. Talla: 110 cm.', 'Ninguna', 'Ninguna', true);

-- ========================
-- 🔬 ANÁLISIS (CATÁLOGO)
-- ========================

INSERT INTO analysis (name, description, previous_requirements, general_cost, community_cost, image_url)
VALUES 
('Biometría Hemática', 'Estudio de los elementos celulares de la sangre', 'Ayuno de 8 horas', 250.00, 150.00, 'https://example.com/biometria.jpg'),
('Química Sanguínea', 'Análisis de glucosa, urea, creatinina, ácido úrico', 'Ayuno de 10-12 horas', 300.00, 180.00, 'https://example.com/quimica.jpg'),
('Perfil Lipídico', 'Medición de colesterol total, HDL, LDL y triglicéridos', 'Ayuno de 12 horas', 350.00, 200.00, 'https://example.com/lipidos.jpg'),
('Examen General de Orina', 'Análisis físico, químico y microscópico de orina', 'Primera orina de la mañana', 150.00, 100.00, 'https://example.com/orina.jpg'),
('Pruebas de Función Hepática', 'TGO, TGP, bilirrubinas, fosfatasa alcalina', 'Ayuno de 8 horas', 400.00, 250.00, 'https://example.com/hepatico.jpg');

-- ========================
-- 🧪 ANÁLISIS DE PACIENTES
-- ========================

INSERT INTO patient_analysis (laboratorist_id, analysis_id, patient_id, analysis_date, results_date, place, duration, analysis_status)
VALUES 
('d1eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 1, 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', '2025-10-16 08:00:00', '2025-10-16 14:00:00', 'Laboratorio Central', 15, 'SENT'),
('d1eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 2, 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', '2025-10-16 08:15:00', '2025-10-16 16:00:00', 'Laboratorio Central', 15, 'SENT'),
('d2eebc99-9c0b-4ef8-bb6d-6bb9bd380aaa', 3, 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', '2025-11-20 07:30:00', '2025-11-21 10:00:00', 'Laboratorio del Sur', 20, 'LAB'),
('d1eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 4, 'c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', '2025-10-21 09:00:00', '2025-10-21 12:00:00', 'Laboratorio Central', 10, 'SENT'),
('d2eebc99-9c0b-4ef8-bb6d-6bb9bd380aaa', 1, 'c4eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', '2025-11-22 08:00:00', '2025-11-23 14:00:00', 'Laboratorio del Sur', 15, 'PENDING');

-- ========================
-- 📊 RESULTADOS DE ANÁLISIS
-- ========================

INSERT INTO results (patient_analysis_id, date, path, interpretation, recommendation)
VALUES 
(1, '2025-10-16 14:00:00', '/uploads/biometria_20251016.pdf', 'Valores dentro de parámetros normales. Hemoglobina: 14.5 g/dL, Leucocitos: 7,200/mm³, Plaquetas: 250,000/mm³', 'Mantener dieta balanceada y hábitos saludables'),
(2, '2025-10-16 16:00:00', '/uploads/quimica_20251016.pdf', 'Glucosa en ayuno: 95 mg/dL (normal). Creatinina: 0.9 mg/dL (normal). Urea: 28 mg/dL (normal)', 'Resultados satisfactorios, continuar con controles anuales'),
(4, '2025-10-21 12:00:00', '/uploads/orina_20251021.pdf', 'pH: 6.0, Densidad: 1.020, Sin presencia de proteínas, glucosa ni sangre', 'Examen normal, buena hidratación');

-- ========================
-- ❓ PREGUNTAS DE HISTORIAL CLÍNICO
-- ========================

INSERT INTO questions_history (description, type)
VALUES 
('¿Ha sido diagnosticado con diabetes?', 'boolean'),
('¿Ha sido diagnosticado con hipertensión?', 'boolean'),
('¿Tiene alergias a medicamentos?', 'text'),
('¿Qué tipo de sangre tiene?', 'select'),
('¿Fuma?', 'select'),
('¿Con qué frecuencia realiza ejercicio?', 'select'),
('¿Ha tenido cirugías previas?', 'text'),
('¿Tiene antecedentes familiares de enfermedades cardiacas?', 'boolean');

-- ========================
-- 📋 OPCIONES DE PREGUNTAS
-- ========================

INSERT INTO options (question_id, description)
VALUES 
(4, 'O+'),
(4, 'O-'),
(4, 'A+'),
(4, 'A-'),
(4, 'B+'),
(4, 'B-'),
(4, 'AB+'),
(4, 'AB-'),
(5, 'Sí, diariamente'),
(5, 'Ocasionalmente'),
(5, 'No fumo'),
(6, 'Diariamente'),
(6, '3-4 veces por semana'),
(6, '1-2 veces por semana'),
(6, 'Raramente'),
(6, 'Nunca');

-- ========================
-- 📝 HISTORIAL DE PACIENTES
-- ========================

INSERT INTO patient_history (question_id, patient_id, answer)
VALUES 
(1, 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'No'),
(2, 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Sí'),
(3, 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Penicilina'),
(4, 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'O+'),
(5, 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'No fumo'),
(6, 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', '3-4 veces por semana'),
(7, 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Apendicectomía en 2015'),
(8, 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Sí'),
(1, 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'No'),
(2, 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'No'),
(3, 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'Ninguna'),
(4, 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'A+'),
(5, 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'No fumo'),
(6, 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'Diariamente'),
(1, 'c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'No'),
(2, 'c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'Sí'),
(3, 'c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'Aspirina'),
(4, 'c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'B+'),
(5, 'c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'Ocasionalmente'),
(6, 'c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', '1-2 veces por semana');

-- ========================
-- 💬 FOROS
-- ========================

INSERT INTO forums (name, description, public_status, created_by, active)
VALUES 
('Diabetes y Nutrición', 'Espacio para compartir experiencias sobre el manejo de la diabetes', true, 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', true),
('Ejercicio y Salud Cardiovascular', 'Tips y rutinas para mantener un corazón saludable', true, 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', true),
('Apoyo para Padres', 'Comunidad de padres compartiendo experiencias sobre salud infantil', true, 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', true),
('Foro Privado Cardiología', 'Discusión entre profesionales sobre casos cardiológicos', false, 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', true);

-- ========================
-- 👥 USUARIOS EN FOROS
-- ========================

INSERT INTO users_forums (user_id, forum_id, forum_role)
VALUES 
('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 1, 'OWNER'),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 1, 'MEMBER'),
('c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 1, 'MEMBER'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 2, 'OWNER'),
('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 2, 'MEMBER'),
('b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 2, 'MODERATOR'),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 3, 'OWNER'),
('e2eebc99-9c0b-4ef8-bb6d-6bb9bd380ccc', 3, 'MEMBER'),
('b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 3, 'MODERATOR'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 4, 'OWNER'),
('b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 4, 'MEMBER'),
('b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 4, 'MEMBER');

-- ========================
-- 💬 MENSAJES EN FOROS
-- ========================

INSERT INTO messages (forum_id, user_id, content, publication_timestamp, parent_message_id, active)
VALUES 
-- Foro 1: Diabetes y Nutrición
(1, 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', '¡Hola a todos! Acabo de crear este foro para compartir experiencias sobre el manejo de la diabetes. ¿Qué tips de alimentación les han funcionado?', '2025-11-01 10:00:00', NULL, true),
(1, 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'Hola Pedro! A mí me ha ayudado mucho reducir los carbohidratos refinados y aumentar el consumo de verduras. También medir la glucosa regularmente.', '2025-11-01 14:30:00', 1, true),
(1, 'c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'Excelente iniciativa! Yo recomiendo llevar un diario de alimentos para identificar qué comidas afectan más los niveles de glucosa.', '2025-11-02 09:15:00', 1, true),
(1, 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Gracias Laura! Eso de medir regularmente es clave. ¿Cada cuánto lo haces?', '2025-11-02 11:00:00', 2, true),

-- Foro 2: Ejercicio y Salud Cardiovascular
(2, 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Bienvenidos al foro de salud cardiovascular. Recuerden que el ejercicio moderado es fundamental. ¿Qué rutinas siguen ustedes?', '2025-10-28 08:00:00', NULL, true),
(2, 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Buenos días doctora! Yo hago caminata rápida 30 minutos al día, 5 días a la semana. ¿Es suficiente?', '2025-10-28 10:30:00', 5, true),
(2, 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Excelente Pedro! Esa es una rutina muy adecuada. Lo importante es la constancia y que tu frecuencia cardíaca llegue a la zona objetivo.', '2025-10-28 12:00:00', 6, true),
(2, 'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Yo también recomiendo agregar ejercicios de fuerza 2-3 veces por semana. No necesariamente pesas, pueden ser ejercicios con peso corporal.', '2025-10-29 09:00:00', 5, true),

-- Foro 3: Apoyo para Padres
(3, 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', '¡Hola papás y mamás! Este es un espacio para compartir nuestras experiencias. ¿Cómo manejan las visitas al doctor con sus hijos?', '2025-11-05 16:00:00', NULL, true),
(3, 'e2eebc99-9c0b-4ef8-bb6d-6bb9bd380ccc', 'Hola Laura! Yo trato de hacerlo divertido, le explico a mi hija que vamos a ver cómo está creciendo fuerte y sana.', '2025-11-06 10:00:00', 9, true),
(3, 'b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Excelente estrategia Patricia! Como pediatra, recomiendo siempre ser honestos pero positivos. Nunca usar la visita al doctor como amenaza.', '2025-11-06 14:30:00', 10, true),

-- Foro 4: Foro Privado Cardiología
(4, 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Colegas, quiero compartir un caso interesante de arritmia que atendí esta semana.', '2025-11-10 11:00:00', NULL, true),
(4, 'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Adelante María, nos interesa conocer el caso.', '2025-11-10 13:00:00', 12, true),
(4, 'b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Sí, por favor comparte. Siempre es útil aprender de las experiencias de otros colegas.', '2025-11-10 14:00:00', 12, true);

-- ========================
-- ❤️ LIKES EN MENSAJES
-- ========================

INSERT INTO likes (message_id, user_id, date)
VALUES 
(1, 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', '2025-11-01 14:25:00'),
(1, 'c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', '2025-11-02 09:10:00'),
(2, 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', '2025-11-02 10:55:00'),
(2, 'c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', '2025-11-02 09:20:00'),
(3, 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', '2025-11-02 11:05:00'),
(5, 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', '2025-10-28 10:25:00'),
(5, 'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '2025-10-29 08:55:00'),
(7, 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', '2025-10-28 12:30:00'),
(8, 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', '2025-10-29 15:00:00'),
(9, 'e2eebc99-9c0b-4ef8-bb6d-6bb9bd380ccc', '2025-11-06 09:55:00'),
(9, 'b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', '2025-11-06 14:25:00'),
(10, 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', '2025-11-06 11:00:00'),
(11, 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', '2025-11-06 15:00:00'),
(12, 'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '2025-11-10 12:55:00'),
(12, 'b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', '2025-11-10 13:55:00');

-- ========================
-- 🚨 REPORTES DE USUARIOS
-- ========================

INSERT INTO user_reports (user_id, reported_message, cause, date, status)
VALUES 
('c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 4, 'Información médica incorrecta o engañosa', '2025-11-03 10:00:00', false),
('e2eebc99-9c0b-4ef8-bb6d-6bb9bd380ccc', 10, 'Contenido inapropiado para el foro', '2025-11-07 09:00:00', true);

-- ========================
-- 📱 DEVICES
-- ========================
-- Note: In production, devices are registered when users log in via the frontend
-- These are sample device tokens for testing purposes

INSERT INTO devices (user_id, device_token, updated)
VALUES 
('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'sample_device_token_patient1_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', NOW()),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'sample_device_token_patient2_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', NOW()),
('c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'sample_device_token_patient3_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', NOW()),
('c4eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 'sample_device_token_patient4_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', NOW()),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'sample_device_token_doctor1_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', NOW()),
('d1eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 'sample_device_token_lab1_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', NOW()),
('e1eebc99-9c0b-4ef8-bb6d-6bb9bd380bbb', 'sample_device_token_familiar1_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', NOW()),
('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380ddd', 'sample_device_token_secretary1_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', NOW());

-- ========================
-- 📬 NOTIFICACIONES
-- ========================
-- New schema: user_id, device_token, appointment_id (nullable), type, answer, title, content, status, created, sendTime, sent (nullable)

INSERT INTO notifications (user_id, device_token, appointment_id, type, answer, title, content, status, created, "sendTime", sent)
VALUES 
('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'sample_device_token_patient1_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 1, 'APPOINTMENT_CREATION', '', 'Cita Confirmada', 'Su cita con la Dra. María López ha sido confirmada para el 25 de noviembre a las 10:00 AM', 'SENT', '2025-11-24 08:00:00', '2025-11-24 08:00:00', '2025-11-24 08:00:01'),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'sample_device_token_patient2_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 2, 'APPOINTMENT_CREATION', '', 'Recordatorio de Cita', 'Recuerde su cita virtual mañana 23 de noviembre a las 9:00 AM con el Dr. José García', 'SENT', '2025-11-21 09:00:00', '2025-11-21 09:00:00', '2025-11-21 09:00:01'),
('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'sample_device_token_patient1_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', NULL, 'OTHER', '', 'Resultados Disponibles', 'Sus resultados de Biometría Hemática ya están disponibles. Puede consultarlos en su perfil.', 'SENT', '2025-10-16 14:30:00', '2025-10-16 14:30:00', '2025-10-16 14:30:01'),
('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'sample_device_token_patient1_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', NULL, 'OTHER', '', 'Resultados Disponibles', 'Sus resultados de Química Sanguínea ya están disponibles. Puede consultarlos en su perfil.', 'SENT', '2025-10-16 16:30:00', '2025-10-16 16:30:00', '2025-10-16 16:30:01'),
('c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'sample_device_token_patient3_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', NULL, 'OTHER', '', 'Resultados Disponibles', 'Sus resultados de Examen General de Orina ya están disponibles.', 'SENT', '2025-10-21 12:30:00', '2025-10-21 12:30:00', '2025-10-21 12:30:01'),
('c4eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 'sample_device_token_patient4_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 4, 'APPOINTMENT_CREATION', '', 'Recordatorio de Cita', 'Recuerde su cita con la Dra. Ana Rodríguez mañana 28 de noviembre a las 11:00 AM', 'PENDING', '2025-11-27 10:00:00', '2025-11-27 10:00:00', NULL),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'sample_device_token_patient2_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', NULL, 'OTHER', '', 'Análisis Programado', 'Su Perfil Lipídico está programado para hoy a las 7:30 AM en el Laboratorio del Sur', 'SENT', '2025-11-20 08:00:00', '2025-11-20 08:00:00', '2025-11-20 08:00:01'),
('c4eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 'sample_device_token_patient4_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', NULL, 'OTHER', '', 'Análisis Programado', 'Su Biometría Hemática está programada para hoy a las 8:00 AM en el Laboratorio del Sur', 'PENDING', '2025-11-22 07:00:00', '2025-11-22 07:00:00', NULL),
('d1eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 'sample_device_token_lab1_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', NULL, 'OTHER', '', 'Nuevo Análisis Asignado', 'Se le ha asignado un nuevo análisis: Biometría Hemática para la paciente Sofia Torres', 'PENDING', '2025-11-22 08:30:00', '2025-11-22 08:30:00', NULL),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'sample_device_token_doctor1_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', NULL, 'OTHER', '', 'Resultados Cargados', 'Se han cargado los resultados de análisis para su paciente Pedro Fernández', 'SENT', '2025-10-16 17:00:00', '2025-10-16 17:00:00', '2025-10-16 17:00:01'),
('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'sample_device_token_patient1_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', NULL, 'COMMUNITY', '', 'Nueva Respuesta en Foro', 'Laura Martínez ha respondido a tu mensaje en el foro "Diabetes y Nutrición"', 'SENT', '2025-11-01 14:35:00', '2025-11-01 14:35:00', '2025-11-01 14:35:01'),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'sample_device_token_patient2_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', NULL, 'COMMUNITY', '', 'Nueva Respuesta en Foro', 'Pedro Fernández ha respondido a tu comentario en el foro "Diabetes y Nutrición"', 'SENT', '2025-11-02 11:05:00', '2025-11-02 11:05:00', '2025-11-02 11:05:01'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'sample_device_token_doctor1_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', NULL, 'COMMUNITY', '', 'Nueva Respuesta en Foro', 'Pedro Fernández ha respondido a tu mensaje en el foro "Ejercicio y Salud Cardiovascular"', 'SENT', '2025-10-28 10:35:00', '2025-10-28 10:35:00', '2025-10-28 10:35:01'),
('e1eebc99-9c0b-4ef8-bb6d-6bb9bd380bbb', 'sample_device_token_familiar1_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', NULL, 'OTHER', '', 'Acceso a Expediente', 'Ahora tienes acceso al expediente médico de Pedro Fernández como familiar autorizado', 'SENT', '2025-10-15 15:00:00', '2025-10-15 15:00:00', '2025-10-15 15:00:01'),
('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380ddd', 'sample_device_token_secretary1_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', NULL, 'OTHER', '', 'Actualizar Catálogo', 'Se requiere actualizar los costos del catálogo de análisis para el próximo mes', 'PENDING', '2025-11-22 09:00:00', '2025-11-22 09:00:00', NULL);
