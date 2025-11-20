-- ========================
--  CLEAR EXISTING DATA
-- ========================
TRUNCATE TABLE role_privilege, patient_history, results, patient_analysis, patient_appointment, notes, appointments, forums, familiars, doctors, laboratorists, patients, users, privileges, roles, analysis, questions_history RESTART IDENTITY CASCADE;

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
('EDIT_LAB_RESULTS');

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
  'EDIT_LAB_RESULTS'
);

-- Give permission to edit lab results to Doctor
INSERT INTO role_privilege (role_id, privilege_id)
SELECT 2, privilege_id
FROM privileges
WHERE description = 'EDIT_LAB_RESULTS'
  AND NOT EXISTS (
    SELECT 1 FROM role_privilege rp
    JOIN privileges p ON rp.privilege_id = p.privilege_id
    WHERE rp.role_id = 2 AND p.description = 'EDIT_LAB_RESULTS'
  );

-- Admin (role_id = 1): full privileges
INSERT INTO role_privilege (role_id, privilege_id)
SELECT 1, privilege_id 
FROM privileges 
WHERE NOT EXISTS (
  SELECT 1 FROM role_privilege 
  WHERE role_id = 1 AND role_privilege.privilege_id = privileges.privilege_id
);

-- Laboratorista (role_id = 4)
INSERT INTO role_privilege (role_id, privilege_id)
SELECT 4, privilege_id
FROM privileges
WHERE description IN (
  'VIEW_APPOINTMENTS',
  'UPDATE_APPOINTMENTS',
  'VIEW_ANALYSIS',  -- only catalogue viewing
  'VIEW_LAB_APPOINTMENTS',
  'UPLOAD_LAB_RESULTS'
);


-- Paciente
INSERT INTO role_privilege (role_id, privilege_id)
SELECT 3, privilege_id
FROM privileges
WHERE description IN ('VIEW_FORUMS',
'VIEW_APPOINTMENTS',
'CREATE_APPOINTMENTS');


-- Secretaria (role_id = 6)
INSERT INTO role_privilege (role_id, privilege_id)
SELECT 6, privilege_id FROM privileges 
WHERE description IN (
    'VIEW_ANALYSIS', 
    'CREATE_ANALYSIS', 
    'UPDATE_ANALYSIS', 
    'DELETE_ANALYSIS',
    'MANAGE_ANALYSIS_TYPES'
);

-- ========================
-- 👥 USERS (DEVELOP VERSION — hashed passwords)
-- ========================
INSERT INTO users (user_id, name, parent_last_name, maternal_last_name, active, phone_number, username, password, birthday, gender, first_login, role_id)
VALUES -- passwd: 1234567890
(gen_random_uuid(), 'Carlos', 'Ramírez', 'López', true, '5551112222', 'carlosr', '$2b$10$78gwUI8tNJDco7uqgAzAlulip8F.J3PmP5OSj72gaIhbjIO9pZOcS', '1980-05-12', 'MALE', false, 6),
(gen_random_uuid(), 'María', 'Hernández', 'Gómez', true, '5552223333', 'mariah', '$2b$10$78gwUI8tNJDco7uqgAzAlulip8F.J3PmP5OSj72gaIhbjIO9pZOcS', '1992-08-22', 'FEMALE', false, 2),
(gen_random_uuid(), 'José', 'Martínez', 'Soto', true, '5553334444', 'josem', '$2b$10$78gwUI8tNJDco7uqgAzAlulip8F.J3PmP5OSj72gaIhbjIO9pZOcS', '1990-03-10', 'MALE', false, 4),
(gen_random_uuid(), 'Ana', 'García', 'Torres', true, '5554445555', 'anag', '$2b$10$78gwUI8tNJDco7uqgAzAlulip8F.J3PmP5OSj72gaIhbjIO9pZOcS', '1987-12-01', 'FEMALE', false, 5),
(gen_random_uuid(), 'Lucía', 'Pérez', 'Núñez', true, '5555556666', 'luciap', '$2b$10$78gwUI8tNJDco7uqgAzAlulip8F.J3PmP5OSj72gaIhbjIO9pZOcS', '1995-07-19', 'FEMALE', false, 3);

-- Admin user
INSERT INTO users (user_id, name, parent_last_name, maternal_last_name, active, phone_number, username, password, birthday, gender, first_login, role_id)
VALUES -- passwd: 1234567890
(gen_random_uuid(), 'Administrador', 'Sistema', 'Admin', true, '5550000000', 'admin', '$2b$10$/aYCozNwvUh8qt41J1diPOwDqeW50wg8nWf76NvAQ9plWjngrj4yS', '1980-01-01', 'MALE', false, 1),
(gen_random_uuid(), 'Ian', 'Hernández', 'Díaz', true, '5550000001', 'ian', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '1990-01-15', 'MALE', false, 1),
(gen_random_uuid(), 'Leonardo', 'García', 'Martínez', true, '5550000002', 'leonardo', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '1988-03-20', 'MALE', false, 1),
(gen_random_uuid(), 'Mateo', 'López', 'Rodríguez', true, '5550000003', 'mateo', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '1992-07-10', 'MALE', false, 1);


-- ========================
-- 👨‍⚕️ DOCTORS
-- ========================
INSERT INTO doctors (doctor_id, user_id, specialty, license)
SELECT gen_random_uuid(), u.user_id, 'Cardiología', 'LIC-' || floor(random()*10000)::text
FROM users u WHERE u.role_id = 2;  -- DOCTOR

-- ========================
-- 🧪 LABORATORISTAS
-- ========================
INSERT INTO laboratorists (laboratorist_id, user_id)
SELECT gen_random_uuid(), u.user_id
FROM users u WHERE u.role_id = 4;  -- LABORATORISTA

-- ========================
-- 🧍 PACIENTES
-- ========================
INSERT INTO patients (patient_id, user_id, curp)
SELECT gen_random_uuid(), u.user_id, 'CURP' || floor(random()*1000000)::text
FROM users u WHERE u.role_id = 3;  -- PACIENTE

-- ========================
-- 👪 FAMILIARES
-- ========================
INSERT INTO familiars (familiar_id, user_id, patient_id)
SELECT gen_random_uuid(), f.user_id, p.patient_id
FROM users f
JOIN patients p ON p.user_id <> f.user_id
WHERE f.role_id = 5  -- FAMILIAR
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
CROSS JOIN (SELECT user_id FROM users WHERE role_id = 3 LIMIT 1) u;

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
  'PRESENCIAL'::"Type",
  'PROGRAMMED'::"Status"
FROM (
  SELECT patient_id, ROW_NUMBER() OVER () AS rn FROM patients
) p
JOIN (
  SELECT appointment_id, ROW_NUMBER() OVER () AS rn FROM appointments
) a ON p.rn = a.rn
LIMIT 2;

-- Solicitudes de citas pendientes (REQUESTED)
INSERT INTO patient_appointment (patient_id, appointment_id, date_hour, duration, appointment_type, appointment_status)
SELECT 
  p.patient_id,
  a.appointment_id,
  NOW() + (interval '1 day'),
  CASE 
    WHEN (ROW_NUMBER() OVER ()) % 3 = 0 THEN 30
    WHEN (ROW_NUMBER() OVER ()) % 3 = 1 THEN 45
    ELSE 60
  END,
  CASE 
    WHEN (ROW_NUMBER() OVER ()) % 2 = 0 THEN 'PRESENCIAL'::"Type"
    ELSE 'VIRTUAL'::"Type"
  END,
  'REQUESTED'::"Status"
FROM (
  SELECT patient_id FROM patients ORDER BY patient_id
) p
CROSS JOIN (
  SELECT appointment_id FROM appointments LIMIT 1
) a
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
INSERT INTO analysis (name, description, previous_requirements, general_cost, community_cost)
VALUES
('Biometría Hemática', 'Análisis general de sangre', 'Ayuno de 8 horas', '250', '150'),
('Examen de orina', 'Análisis de orina general', 'Recolectar muestra matutina', '200', '120');

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
INSERT INTO questions_history (description, type) VALUES
-- DATOS GENERALES
('Nombre', 'text'),
('Teléfono', 'text'),
('Género', 'choice'),
('Edad', 'number'),
('Fecha de nacimiento', 'date'),
('Estado de nacimiento', 'text'),
('Fecha del cuestionario', 'date'),

-- PREGUNTAS CLÍNICAS DEL CUESTIONARIO
('¿Sus padres o hermanos padecen enfermedades crónicas?', 'choice'),
('¿Padece diabetes mellitus?', 'choice'),
('¿Ha tenido cifras de glucosa mayores que 140 en ayunas?', 'choice'),
('¿Está en tratamiento por presión alta?', 'choice'),
('¿Cifras de presión arterial mayores que 130/80?', 'choice'),
('¿Familiar con enfermedad renal crónica (ERC), es decir 
con tratamientos de dialisis peritoneal o hemodiálisis?', 'choice'),
('¿Regularmente se auto medica con analgésicos de venta libre como ibuprofeno, 
naproxeno, aspirinas, etc?', 'choice'),
('¿Ha padecido de litiasis renal (piedras en los riñones)?', 'choice'),
('¿Tiene sobrepeso u obesidad?', 'choice'),
('¿Consume refrescos?', 'choice'),
('¿Cuántos refrescos por semana (600 ml)?', 'choice'),
('¿Agrega sal a sus alimentos?', 'choice'),
('¿Fuma o ha fumado más de 10 años?', 'choice'),
('¿Ingiere bebidas alcohólicas con frecuencia?', 'choice'),
('¿Ha tenido episodios de depresión?', 'choice');

INSERT INTO options (question_id, description)
SELECT q.question_id, v.description
FROM questions_history q
CROSS JOIN (
    VALUES ('Masculino'), ('Femenino'), ('Otro')
) v(description)
WHERE q.description = 'Género';

INSERT INTO options (question_id, description)
SELECT q.question_id, opt.description
FROM questions_history q
CROSS JOIN (
    VALUES ('Sí'), ('No'), ('Lo desconoce')
) AS opt(description)
WHERE q.description IN (
    '¿Sus padres o hermanos padecen enfermedades crónicas?',
    '¿Padece diabetes mellitus?',
    '¿Ha tenido cifras de glucosa mayores que 140 en ayunas?',
    '¿Está en tratamiento por presión alta?',
    '¿Cifras de presión arterial mayores que 130/80?',
    '¿Familiar con enfermedad renal crónica (ERC), es decir 
con tratamientos de dialisis peritoneal o hemodiálisis?',
    '¿Regularmente se auto medica con analgésicos de venta libre como ibuprofeno, 
naproxeno, aspirinas, etc?',
    '¿Ha padecido de litiasis renal (piedras en los riñones)?',
    '¿Tiene sobrepeso u obesidad?',
    '¿Consume refrescos?',
    '¿Agrega sal a sus alimentos?',
    '¿Fuma o ha fumado más de 10 años?',
    '¿Ingiere bebidas alcohólicas con frecuencia?',
    '¿Ha tenido episodios de depresión?'
);

INSERT INTO options (question_id, description)
SELECT q.question_id, v.description
FROM questions_history q
CROSS JOIN (
    VALUES 
        ('1-2 por semana'),
        ('3-5 por semana'),
        ('Más de 5 por semana')
) v(description)
WHERE q.description = '¿Cuántos refrescos por semana (600 ml)?';

INSERT INTO patient_history (question_id, patient_id, answer)
SELECT q.question_id, p.patient_id, 'Sí'
FROM questions_history q, patients p
LIMIT 3;

-- ========================
-- ✅ FIN DEL SEED
-- ========================