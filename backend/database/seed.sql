-- ========================
--  CLEAR EXISTING DATA
-- ========================
TRUNCATE TABLE role_privilege, patient_history, results, patient_analysis, patient_appointment, notes, appointments, forums, familiars, doctors, laboratorists, patients, users, privileges, roles, analysis, questions_history, options, user_reports, notifications, messages, likes, users_forums RESTART IDENTITY CASCADE;

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
('VIEW_NOTES'),
('REMOVE_USER_FROM_FORUM'),
('VIEW_FORUM_USERS'),
('UPDATE_NOTES'),
('DELETE_NOTES'),
('CREATE_ADMIN'),
('APPROVE_USERS'),
('PASS_PATTIENTS');

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
  'CREATE_APPOINTMENTS',
  'VIEW_ANALYSIS',
  'VIEW_LAB_RESULTS',
  'VIEW_NOTES',
  'VIEW_CLINICAL_HISTORY',
  'VIEW_MEDICAL_RECORD',
  'VIEW_FORUM_USERS',
  'CREATE_CLINICAL_HISTORY',
  'UPDATE_CLINICAL_HISTORY',
  'VIEW_HISTORY_QUESTIONS'
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
INSERT INTO users (user_id, name, parent_last_name, maternal_last_name, active, phone_number, username, password, birthday, gender, user_status, first_login, role_id)
VALUES 
(gen_random_uuid(), 'Oswaldo Isaias', 'Hernández', 'Santes', true, '5531122772', 'tqp', '$10$zh/j78WSZCb7lnQOK4WDmenAX7uk0O4Ebl1bV9iHJxrBOKMtMy2n2', '2005-11-26', 'MALE', 'APPROVED', false, 1);

-- ========================
-- ❓ PREGUNTAS DE FACTOR DE RIESGO (questions_history)
-- ========================

INSERT INTO questions_history (description, type)
VALUES
('¿Sus padres, hermanos o hermanas, padecen alguna enfermedad crónica como diabetes o hipertensión?', 'select'), -- 1
('¿Padece diabetes mellitus?', 'select'), -- 2
('¿Ha tenido cifras de glucosa mayor a 140 en ayunas?', 'select'), -- 3
('¿Ha sido o actualmente está siendo tratado por presión arterial alta?', 'select'), -- 4
('¿Ha tenido cifras de presión arterial mayores a 130/80?', 'select'), -- 5
('¿Tiene algún familiar que padezca ERC (Enfermedad Renal Crónica)?', 'select'), -- 6
('¿Regularmente se auto medica con analgésicos de venta libre como ibuprofeno, naproxeno, aspirinas, etc.?', 'select'), -- 7
('¿Ha padecido de litiasis renal (piedras en los riñones)?', 'select'), -- 8
('¿Padece sobrepeso u obesidad?', 'select'), -- 9
('¿Consume refrescos?', 'select'), -- 10
('¿Cuántos por semana (600 ml)?', 'select'), -- 11
('¿Agrega sal a sus alimentos en la mesa?', 'select'), -- 12
('¿Actualmente fuma o ha fumado en el pasado por más de diez años?', 'select'), -- 13
('¿Ingieren frecuentemente bebidas alcohólicas (una vez a la semana)?', 'select'), -- 14
('¿Ha padecido episodios de depresión?', 'select'); -- 15

-- ========================
-- 📌 OPCIONES DE RESPUESTA
-- ========================

-- Pregunta 1: Antecedentes familiares (Sí - ¿Cuál? - No - Lo desconoce)
INSERT INTO options (question_id, description)
VALUES
(1, 'Sí'),
(1, 'No'),
(1, 'Lo desconoce');

-- Pregunta 2: Diabetes
INSERT INTO options (question_id, description)
VALUES
(2, 'Sí'),
(2, 'No'),
(2, 'Lo desconoce');

-- Pregunta 3: Glucosa > 140
INSERT INTO options (question_id, description)
VALUES
(3, 'Sí'),
(3, 'No'),
(3, 'Lo desconoce');

-- Pregunta 4: Tratamiento para presión alta
INSERT INTO options (question_id, description)
VALUES
(4, 'Sí'),
(4, 'No'),
(4, 'Lo desconoce');

-- Pregunta 5: Presión > 130/80
INSERT INTO options (question_id, description)
VALUES
(5, 'Sí'),
(5, 'No'),
(5, 'Lo desconoce');

-- Pregunta 6: Familiar con ERC
INSERT INTO options (question_id, description)
VALUES
(6, 'Sí'),
(6, 'No'),
(6, 'Lo desconoce');

-- Pregunta 7: Automedicación
INSERT INTO options (question_id, description)
VALUES
(7, 'Sí'),
(7, 'No'),
(7, 'Lo desconoce');

-- Pregunta 8: Litiasis renal
INSERT INTO options (question_id, description)
VALUES
(8, 'Sí'),
(8, 'No'),
(8, 'Lo desconoce');

-- Pregunta 9: Sobrepeso u obesidad
INSERT INTO options (question_id, description)
VALUES
(9, 'Sí'),
(9, 'No'),
(9, 'Lo desconoce');

-- Pregunta 10: ¿Consume refrescos?
INSERT INTO options (question_id, description)
VALUES
(10, 'Sí'),
(10, 'No');

-- Pregunta 11: Cantidad de refrescos por semana
INSERT INTO options (question_id, description)
VALUES
(11, '1 a 2'),
(11, '3 a 5'),
(11, 'Más de 5');

-- Pregunta 12: Agrega sal a la comida
INSERT INTO options (question_id, description)
VALUES
(12, 'Sí'),
(12, 'No');

-- Pregunta 13: ¿Fuma?
INSERT INTO options (question_id, description)
VALUES
(13, 'Sí'),
(13, 'No');

-- Pregunta 14: Alcohol 1 vez por semana
INSERT INTO options (question_id, description)
VALUES
(14, 'Sí'),
(14, 'No');

-- Pregunta 15: Depresión
INSERT INTO options (question_id, description)
VALUES
(15, 'Sí'),
(15, 'No');

-- 1. Crear privilegios de autogestión
INSERT INTO privileges (description) VALUES 
('VIEW_OWN_PROFILE'),
('UPDATE_OWN_PROFILE');

-- 2. Asignar estos privilegios a TODOS los roles existentes (1 al 6)
-- Esto asegura que desde el Admin hasta el Paciente puedan ver/editar su perfil
INSERT INTO role_privilege (role_id, privilege_id)
SELECT r.role_id, p.privilege_id
FROM roles r
CROSS JOIN privileges p
WHERE p.description IN ('VIEW_OWN_PROFILE', 'UPDATE_OWN_PROFILE')
  AND NOT EXISTS (
    SELECT 1 FROM role_privilege rp 
    WHERE rp.role_id = r.role_id AND rp.privilege_id = p.privilege_id
  );