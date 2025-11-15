-- ========================
-- 🧩 ROLES
-- ========================
-- ========================
-- 🧼 CLEAR EXISTING DATA
-- ========================
-- Truncate child tables first and restart sequences so IDs are consistent
BEGIN;
TRUNCATE TABLE role_privilege, patient_history, results, patient_analysis, patient_appointment, notes, appointments, forums, familiars, doctors, laboratorists, patients, users, privileges, roles, analysis, questions_history RESTART IDENTITY CASCADE;
COMMIT;

INSERT INTO roles (role_name) VALUES
('Admin'),
('Doctor'),
('Paciente'),
('Laboratorista'),
('Familiar');



-- ========================
-- 🧩 ROLES - PRIVILEGIOS
-- (todos los privilegios para el admin)
-- ========================
INSERT INTO role_privilege (role_id, privilege_id)
SELECT 1, privilege_id FROM privileges;

-- ========================
-- 👥 USERS
-- ========================
INSERT INTO users (user_id, name, parent_last_name, maternal_last_name, active, phone_number, username, password, birthday, gender, first_login, role_id)
VALUES
(gen_random_uuid(), 'Carlos', 'Ramírez', 'López', true, '5551112222', 'carlosr', '12345', '1980-05-12', 'MALE', false, 2),
(gen_random_uuid(), 'María', 'Hernández', 'Gómez', true, '5552223333', 'mariah', '12345', '1992-08-22', 'FEMALE', false, 3),
(gen_random_uuid(), 'José', 'Martínez', 'Soto', true, '5553334444', 'josem', '12345', '1990-03-10', 'MALE', false, 4),
(gen_random_uuid(), 'Ana', 'García', 'Torres', true, '5554445555', 'anag', '12345', '1987-12-01', 'FEMALE', false, 5),
(gen_random_uuid(), 'Lucía', 'Pérez', 'Núñez', true, '5555556666', 'luciap', '12345', '1995-07-19', 'FEMALE', false, 3);

-- Admin explicit user (added)
INSERT INTO users (user_id, name, parent_last_name, maternal_last_name, active, phone_number, username, password, birthday, gender, first_login, role_id)
VALUES (gen_random_uuid(), 'Administrador', 'Sistema', 'Admin', true, '5550000000', 'admin', '$2b$10$/aYCozNwvUh8qt41J1diPOwDqeW50wg8nWf76NvAQ9plWjngrj4yS', '1980-01-01', 'MALE', false, 1);



-- ========================
-- 👩‍⚕️ DOCTORES
-- ========================
INSERT INTO doctors (doctor_id, user_id, specialty, license)
SELECT gen_random_uuid(), u.user_id, 'Cardiología', 'LIC-' || floor(random()*10000)::text
FROM users u WHERE u.role_id = 2;

-- ========================
-- 🧪 LABORATORISTAS
-- ========================
INSERT INTO laboratorists (laboratorist_id, user_id)
SELECT gen_random_uuid(), u.user_id
FROM users u WHERE u.role_id = 4;

-- ========================
-- 🧍 PACIENTES
-- ========================
INSERT INTO patients (patient_id, user_id, curp)
SELECT gen_random_uuid(), u.user_id, 'CURP' || floor(random()*1000000)::text
FROM users u WHERE u.role_id = 3;

-- ========================
-- 👪 FAMILIARES
-- ========================
INSERT INTO familiars (familiar_id, user_id, patient_id)
SELECT gen_random_uuid(), f.user_id, p.patient_id
FROM users f
JOIN patients p ON p.user_id <> f.user_id
WHERE f.role_id = 5
LIMIT 2;

-- ========================
-- 💬 FOROS
-- ========================
INSERT INTO forums (name, description, public_status, created_by)
SELECT 
  'Foro de salud ' || i,
  'Discusión general sobre temas médicos ' || i,
  true,
  u.user_id
FROM generate_series(1, 3) i
JOIN users u ON u.role_id = 2
LIMIT 3;

-- ========================
-- 📅 CITAS MÉDICAS
-- ========================
INSERT INTO appointments (doctor_id, name, general_cost, community_cost, image_url)
SELECT 
  d.doctor_id, 
  'Consulta general',
  '500',
  '300',
  '/images/default.png'
FROM doctors d;

-- ========================
-- 🤝 RELACIÓN PACIENTE-CITA
-- ========================
INSERT INTO patient_appointment (patient_id, appointment_id, date_hour, duration, appointment_type, appointment_status)
SELECT 
  p.patient_id,
  a.appointment_id,
  NOW() + (random() * (interval '30 days')),
  45,
  'PRESENCIAL',
  'PROGRAMMED'
FROM (
  SELECT patient_id, ROW_NUMBER() OVER () AS rn FROM patients
) p
JOIN (
  SELECT appointment_id, ROW_NUMBER() OVER () AS rn FROM appointments
) a ON p.rn = a.rn
LIMIT 5;

-- ========================
-- 🧾 NOTAS DE CITAS
-- ========================
INSERT INTO notes (patient_appointment_id, title, content)
SELECT 
  pa.patient_appointment_id,
  'Nota de consulta',
  'El paciente presenta mejora significativa.'
FROM patient_appointment pa
LIMIT 3;

-- ========================
-- 🔬 ANÁLISIS
-- ========================
INSERT INTO analysis (name, description, previous_requirements, general_cost, community_cost, image_url)
VALUES
('Biometría Hemática', 'Análisis general de sangre', 'Ayuno de 8 horas', '250', '150', '/images/default.png'),
('Examen de orina', 'Análisis de orina general', 'Recolectar muestra matutina', '200', '120', '/images/default.png');

-- ========================
-- 📊 PACIENTE - ANÁLISIS
-- ========================
INSERT INTO patient_analysis (laboratorist_id, analysis_id, patient_id, analysis_date, results_date, place, duration)
SELECT 
  l.laboratorist_id,
  a.analysis_id,
  p.patient_id,
  NOW() - interval '5 days',
  NOW() - interval '1 days',
  'Laboratorio Central',
  60
FROM laboratorists l, analysis a, patients p;

-- ========================
-- 🧾 RESULTADOS
-- ========================
INSERT INTO results (patient_analysis_id, date, path)
SELECT pa.patient_analysis_id, NOW(), '/results/analysis_' || pa.patient_analysis_id || '.pdf'
FROM patient_analysis pa;

-- ========================
-- 🧠 HISTORIAL DE PACIENTE
-- ========================
INSERT INTO questions_history (description, type)
VALUES
('¿Fuma con frecuencia?', 'boolean'),
('¿Hace ejercicio?', 'boolean'),
('¿Tiene antecedentes familiares de diabetes?', 'boolean');

INSERT INTO patient_history (question_id, patient_id, answer)
SELECT q.question_id, p.patient_id, 'Sí'
FROM questions_history q, patients p
LIMIT 3;





INSERT INTO privileges (description) 
VALUES
('VIEW_USERS'),
('VIEW_ANALYSIS'),
('CREATE_USERS'),
('UPDATE_USERS'),
('DELETE_USERS'),
('VIEW_ROLES'),
('VIEW_PATIENTS'),
('VIEW_APPOINTMENTS'),
('VIEW_FORUMS'),
('CREATE_ROLES'),
('CREATE_PATIENTS'),
('CREATE_APPOINTMENTS'),
('CREATE_FORUMS'),
('UPDATE_ROLES'),
('UPDATE_PATIENTS'),
('UPDATE_APPOINTMENTS'),
('UPDATE_FORUMS'),
('DELETE_ROLES'),
('DELETE_PATIENTS'),
('DELETE_APPOINTMENTS'),
('DELETE_FORUMS'),
('VIEW_HISTORY_QUESTIONS'),
('CREATE_HISTORY_QUESTIONS'),
('UPDATE_HISTORY_QUESTIONS'),
('DELETE_HISTORY_QUESTIONS'),
('VIEW_REPORTS');
('DELETE_HISTORY_QUESTIONS');


INSERT INTO role_privilege (role_id, privilege_id)
SELECT 2, generate_series(1, 20);


INSERT INTO role_privilege (role_id, privilege_id)
SELECT 1, privilege_id 
FROM privileges 
WHERE NOT EXISTS (
  SELECT 1 FROM role_privilege 
  WHERE role_id = 1 AND role_privilege.privilege_id = privileges.privilege_id
);
INSERT INTO role_privilege (role_id, privilege_id)
VALUES (2, 27);


INSERT INTO users (user_id, name, parent_last_name, maternal_last_name, active, phone_number, username, password, birthday, gender, first_login, role_id)
VALUES
(gen_random_uuid(), 'Carlos', 'López', 'Martínez', true, '5551112222', 'carlosl', '12345', '1990-03-15', 'MALE', false, 3),
(gen_random_uuid(), 'María', 'Fernández', 'Ruiz', true, '5553334444', 'mariaf', '12345', '1985-07-22', 'FEMALE', false, 4),
(gen_random_uuid(), 'Javier', 'Hernández', 'Gómez', true, '5556667777', 'javierh', '12345', '1992-11-09', 'MALE', false, 2),
(gen_random_uuid(), 'Lucía', 'Ramírez', 'Santos', true, '5558889999', 'luciar', '12345', '1998-05-30', 'FEMALE', false, 5),
(gen_random_uuid(), 'Andrés', 'Pérez', 'Torres', true, '5552223333', 'andresp', '12345', '1989-01-12', 'MALE', false, 1),
(gen_random_uuid(), 'Sofía', 'González', 'Morales', true, '5559998888', 'sofiag', '12345', '1995-09-17', 'FEMALE', false, 3),
(gen_random_uuid(), 'Diego', 'Castro', 'Navarro', true, '5554446666', 'diegoc', '12345', '1993-06-05', 'MALE', false, 2),
(gen_random_uuid(), 'Valeria', 'Domínguez', 'Flores', true, '5557771111', 'valeriad', '12345', '1997-10-25', 'FEMALE', false, 4),
(gen_random_uuid(), 'Ricardo', 'Sánchez', 'Vega', true, '5553339999', 'ricardos', '12345', '1988-02-08', 'MALE', false, 5),
(gen_random_uuid(), 'Elena', 'Mendoza', 'Cortés', true, '5556662222', 'elenam', '12345', '1991-04-14', 'FEMALE', false, 1),
(gen_random_uuid(), 'Mateo', 'Ortega', 'Silva', true, '5551010101', 'mateoo', '12345', '1994-08-19', 'MALE', false, 5),
(gen_random_uuid(), 'Camila', 'Rojas', 'Herrera', true, '5552020202', 'camilar', '12345', '1996-12-04', 'FEMALE', false, 5),
(gen_random_uuid(), 'Sebastián', 'Luna', 'Reyes', true, '5553030303', 'sebastianl', '12345', '1990-02-21', 'MALE', false, 5),
(gen_random_uuid(), 'Natalia', 'Cano', 'Ibáñez', true, '5554040404', 'nataliac', '12345', '1999-07-13', 'FEMALE', false, 5),
(gen_random_uuid(), 'Alejandro', 'Suárez', 'Campos', true, '5555050505', 'alejandros', '12345', '1987-03-27', 'MALE', false, 5),
(gen_random_uuid(), 'Paula', 'Mora', 'Galindo', true, '5556060606', 'paulam', '12345', '1993-05-09', 'FEMALE', false, 5),
(gen_random_uuid(), 'Tomás', 'Vargas', 'Peña', true, '5557070707', 'tomasv', '12345', '1992-09-18', 'MALE', false, 5),
(gen_random_uuid(), 'Fernanda', 'León', 'Rivas', true, '5558080808', 'fernandal', '12345', '1995-11-02', 'FEMALE', false, 5),
(gen_random_uuid(), 'Rodrigo', 'Aguilar', 'Rosales', true, '5559090909', 'rodrigoa', '12345', '1989-06-22', 'MALE', false, 5),
(gen_random_uuid(), 'Isabella', 'Castillo', 'Benítez', true, '5551212121', 'isabellac', '12345', '1997-10-01', 'FEMALE', false, 5),
(gen_random_uuid(), 'Gabriel', 'Muñoz', 'Salas', true, '5552323232', 'gabrielm', '12345', '1991-01-30', 'MALE', false, 5),
(gen_random_uuid(), 'Renata', 'Paredes', 'Quiroz', true, '5553434343', 'renatap', '12345', '1994-03-11', 'FEMALE', false, 5),
(gen_random_uuid(), 'Emilio', 'Cabrera', 'Delgado', true, '5554545454', 'emilioc', '12345', '1988-08-07', 'MALE', false, 5),
(gen_random_uuid(), 'Carolina', 'Villalobos', 'Esquivel', true, '5555656565', 'carolinav', '12345', '1996-04-28', 'FEMALE', false, 5),
(gen_random_uuid(), 'Santiago', 'Núñez', 'Valdez', true, '5556767676', 'santiagon', '12345', '1990-12-16', 'MALE', false, 5);


INSERT INTO patient_analysis (
  laboratorist_id,
  analysis_id,
  patient_id,
  analysis_date,
  results_date,
  place,
  duration,
  analysis_status
)
SELECT 
  (SELECT laboratorist_id FROM laboratorists ORDER BY RANDOM() LIMIT 1),
  (SELECT analysis_id FROM analysis ORDER BY RANDOM() LIMIT 1),
  p.patient_id,
  NOW() - (INTERVAL '5 days' * RANDOM()),
  NOW() - (INTERVAL '1 days' * RANDOM()),
  'Laboratorio Central',
  FLOOR(RANDOM() * 60 + 30),
  CASE FLOOR(RANDOM() * 4)
      WHEN 0 THEN 'LAB'::"ANALYSIS_STATUS"
      WHEN 1 THEN 'PENDING'::"ANALYSIS_STATUS"
      WHEN 2 THEN 'REQUESTED'::"ANALYSIS_STATUS"
      ELSE 'SENT'::"ANALYSIS_STATUS"
  END
FROM (
  SELECT patient_id FROM patients ORDER BY RANDOM() LIMIT 10
) p, generate_series(1, 2);

-- ========================
-- ✅ FIN DEL SEED
-- ========================