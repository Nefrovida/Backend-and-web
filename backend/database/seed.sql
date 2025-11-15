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
-- 🧩 PRIVILEGIOS
-- ========================
INSERT INTO privileges (description) VALUES
('Crear usuario'),
('Editar usuario'),
('Eliminar usuario'),
('Ver reportes'),
('Administrar foros'),
('Asignar citas');

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
INSERT INTO questions_history (description, type) VALUES
-- DATOS GENERALES
('Nombre', 'text'),
('Teléfono', 'text'),
('Género', 'choice'),
('Edad', 'number'),
('Fecha de nacimiento', 'date'),
('Estado de nacimiento', 'text'),

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
