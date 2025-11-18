-- ========================================================================================
-- SEED PARA FUNCIONALIDAD DE EXPEDIENTE MÉDICO
-- ========================================================================================
-- Este seed crea datos de prueba para la funcionalidad de expediente médico
-- PREREQUISITOS: Debe ejecutarse DESPUÉS del seed principal que crea roles, usuarios básicos
-- ========================================================================================

-- ========================
-- 🔐 AGREGAR PRIVILEGIO DE EXPEDIENTE (si no existe)
-- ========================
INSERT INTO privileges (description) 
VALUES ('VIEW_MEDICAL_RECORD')
ON CONFLICT DO NOTHING;

-- ========================
-- 🔐 ASIGNAR TODOS LOS PERMISOS NECESARIOS POR ROL
-- ========================

-- ============================================
-- ADMIN (role_id = 1) - Acceso completo
-- ============================================
INSERT INTO role_privilege (role_id, privilege_id)
SELECT 1, p.privilege_id
FROM privileges p
WHERE p.description IN (
  'VIEW_MEDICAL_RECORD',
  'VIEW_PATIENTS',
  'VIEW_APPOINTMENTS',
  'CREATE_APPOINTMENTS',
  'UPDATE_APPOINTMENTS',
  'VIEW_NOTES',
  'CREATE_NOTES',
  'UPDATE_NOTES',
  'VIEW_ANALYSIS',
  'CREATE_ANALYSIS',
  'UPDATE_ANALYSIS',
  'VIEW_CLINICAL_HISTORY',
  'CREATE_CLINICAL_HISTORY',
  'UPDATE_CLINICAL_HISTORY',
  'VIEW_REPORTS'
)
ON CONFLICT DO NOTHING;

-- ============================================
-- DOCTOR (role_id = 2) - Permisos para manejar expedientes de sus pacientes
-- ============================================
INSERT INTO role_privilege (role_id, privilege_id)
SELECT 2, p.privilege_id
FROM privileges p
WHERE p.description IN (
  -- Expediente
  'VIEW_MEDICAL_RECORD',       -- Ver expediente completo
  
  -- Pacientes
  'VIEW_PATIENTS',              -- Ver lista de pacientes
  
  -- Citas
  'VIEW_APPOINTMENTS',          -- Ver citas
  'CREATE_APPOINTMENTS',        -- Crear citas (opcional, depende del flujo)
  'UPDATE_APPOINTMENTS',        -- Actualizar citas
  
  -- Notas clínicas
  'VIEW_NOTES',                 -- Ver notas
  'CREATE_NOTES',               -- Crear notas (esencial para doctor)
  'UPDATE_NOTES',               -- Actualizar notas
  
  -- Análisis
  'VIEW_ANALYSIS',              -- Ver análisis de laboratorio
  
  -- Historial clínico
  'VIEW_CLINICAL_HISTORY',      -- Ver historial clínico del paciente
  'CREATE_CLINICAL_HISTORY',    -- Crear/editar historial clínico del paciente
  'UPDATE_CLINICAL_HISTORY',    -- Actualizar historial clínico del paciente
  
  -- Reportes
  'VIEW_REPORTS'                -- Ver reportes/resultados
)
ON CONFLICT DO NOTHING;

-- ============================================
-- PACIENTE (role_id = 3) - Ver su propio expediente
-- ============================================
INSERT INTO role_privilege (role_id, privilege_id)
SELECT 3, p.privilege_id
FROM privileges p
WHERE p.description IN (
  -- Expediente
  'VIEW_MEDICAL_RECORD',       -- Ver su propio expediente
  
  -- Citas
  'VIEW_APPOINTMENTS',          -- Ver sus citas
  
  -- Notas
  'VIEW_NOTES',                 -- Ver notas de sus consultas
  
  -- Análisis
  'VIEW_ANALYSIS',              -- Ver sus análisis
  
  -- Historial clínico
  'VIEW_CLINICAL_HISTORY',      -- Ver su historial clínico
  'CREATE_CLINICAL_HISTORY',    -- Llenar su historial clínico
  
  -- Reportes
  'VIEW_REPORTS'                -- Ver sus resultados
)
ON CONFLICT DO NOTHING;

-- ============================================
-- LABORATORISTA (role_id = 4) - NO necesita ver expediente completo
-- ============================================
-- El laboratorista solo necesita ver análisis y citas de laboratorio
INSERT INTO role_privilege (role_id, privilege_id)
SELECT 4, p.privilege_id
FROM privileges p
WHERE p.description IN (
  'VIEW_APPOINTMENTS',          -- Ver citas de laboratorio
  'UPDATE_APPOINTMENTS',        -- Actualizar estado de análisis
  'VIEW_ANALYSIS'               -- Ver análisis pendientes
)
ON CONFLICT DO NOTHING;

-- ============================================
-- FAMILIAR (role_id = 5) - Ver expediente del paciente asignado
-- ============================================
INSERT INTO role_privilege (role_id, privilege_id)
SELECT 5, p.privilege_id
FROM privileges p
WHERE p.description IN (
  -- Expediente
  'VIEW_MEDICAL_RECORD',       -- Ver expediente del paciente asignado
  
  -- Citas
  'VIEW_APPOINTMENTS',          -- Ver citas del paciente
  
  -- Notas
  'VIEW_NOTES',                 -- Ver notas clínicas
  
  -- Análisis
  'VIEW_ANALYSIS',              -- Ver análisis
  
  -- Historial clínico
  'VIEW_CLINICAL_HISTORY',      -- Ver historial clínico
  
  -- Reportes
  'VIEW_REPORTS'                -- Ver resultados
)
ON CONFLICT DO NOTHING;

-- ============================================
-- SECRETARIA (role_id = 6) - Gestión administrativa
-- ============================================
-- Ya tiene permisos de análisis, agregar los de citas si es necesario
INSERT INTO role_privilege (role_id, privilege_id)
SELECT 6, p.privilege_id
FROM privileges p
WHERE p.description IN (
  'VIEW_APPOINTMENTS',
  'CREATE_APPOINTMENTS',
  'UPDATE_APPOINTMENTS',
  'VIEW_PATIENTS'
)
ON CONFLICT DO NOTHING;

-- ========================
-- 👥 CREAR USUARIOS DE PRUEBA PARA EXPEDIENTE
-- ========================
-- Password para todos: 1234567890 (hash bcrypt)

-- Doctor especialista
INSERT INTO users (user_id, name, parent_last_name, maternal_last_name, active, phone_number, username, password, birthday, gender, first_login, role_id)
VALUES 
('550e8400-e29b-41d4-a716-446655440001'::uuid, 'Roberto', 'Sánchez', 'Flores', true, '5551234567', 'dr.sanchez', '$2b$10$/aYCozNwvUh8qt41J1diPOwDqeW50wg8nWf76NvAQ9plWjngrj4yS', '1975-03-15', 'MALE', false, 2)
ON CONFLICT (user_id) DO NOTHING;

-- Paciente principal (con expediente completo)
INSERT INTO users (user_id, name, parent_last_name, maternal_last_name, active, phone_number, username, password, birthday, gender, first_login, role_id)
VALUES 
('550e8400-e29b-41d4-a716-446655440002'::uuid, 'Juan Carlos', 'Ramírez', 'Moreno', true, '5559876543', 'juan.ramirez', '$2b$10$/aYCozNwvUh8qt41J1diPOwDqeW50wg8nWf76NvAQ9plWjngrj4yS', '1980-06-20', 'MALE', false, 3)
ON CONFLICT (user_id) DO NOTHING;

-- Familiar del paciente
INSERT INTO users (user_id, name, parent_last_name, maternal_last_name, active, phone_number, username, password, birthday, gender, first_login, role_id)
VALUES 
('550e8400-e29b-41d4-a716-446655440003'::uuid, 'María Elena', 'Ramírez', 'Vega', true, '5558765432', 'maria.ramirez', '$2b$10$78gwUI8tNJDco7uqgAzAlulip8F.J3PmP5OSj72gaIhbjIO9pZOcS', '1982-09-10', 'FEMALE', false, 5)
ON CONFLICT (user_id) DO NOTHING;

-- Laboratorista
INSERT INTO users (user_id, name, parent_last_name, maternal_last_name, active, phone_number, username, password, birthday, gender, first_login, role_id)
VALUES 
('550e8400-e29b-41d4-a716-446655440004'::uuid, 'Pedro', 'González', 'Ruiz', true, '5557654321', 'pedro.lab', '$2b$10$/aYCozNwvUh8qt41J1diPOwDqeW50wg8nWf76NvAQ9plWjngrj4yS', '1985-12-05', 'MALE', false, 4)
ON CONFLICT (user_id) DO NOTHING;

-- ========================
-- 👨‍⚕️ CREAR DOCTOR
-- ========================
INSERT INTO doctors (doctor_id, user_id, specialty, license)
VALUES 
('650e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, 'Nefrología', 'LIC-987654')
ON CONFLICT (doctor_id) DO NOTHING;

-- ========================
-- 🧪 CREAR LABORATORISTA
-- ========================
INSERT INTO laboratorists (laboratorist_id, user_id)
VALUES 
('750e8400-e29b-41d4-a716-446655440004'::uuid, '550e8400-e29b-41d4-a716-446655440004'::uuid)
ON CONFLICT (laboratorist_id) DO NOTHING;

-- ========================
-- 🧍 CREAR PACIENTE
-- ========================
INSERT INTO patients (patient_id, user_id, curp)
VALUES 
('450e8400-e29b-41d4-a716-446655440002'::uuid, '550e8400-e29b-41d4-a716-446655440002'::uuid, 'RAMJ800620HDFRNN09')
ON CONFLICT (patient_id) DO NOTHING;

-- ========================
-- 👪 ASIGNAR FAMILIAR AL PACIENTE
-- ========================
INSERT INTO familiars (familiar_id, user_id, patient_id)
VALUES 
('850e8400-e29b-41d4-a716-446655440003'::uuid, '550e8400-e29b-41d4-a716-446655440003'::uuid, '450e8400-e29b-41d4-a716-446655440002'::uuid)
ON CONFLICT (familiar_id) DO NOTHING;

-- ========================
-- 🔬 CREAR TIPOS DE ANÁLISIS
-- ========================
INSERT INTO analysis (analysis_id, name, description, previous_requirements, general_cost, community_cost, image_url)
VALUES
(1001, 'Biometría Hemática Completa', 'Análisis de componentes sanguíneos completo', 'Ayuno de 8 horas', 350.00, 200.00, '/images/biometria.png'),
(1002, 'Química Sanguínea de 6 elementos', 'Análisis de glucosa, urea, creatinina, ácido úrico, colesterol y triglicéridos', 'Ayuno de 10-12 horas', 450.00, 280.00, '/images/quimica.png'),
(1003, 'Examen General de Orina', 'Análisis físico, químico y microscópico de orina', 'Primera orina de la mañana', 180.00, 120.00, '/images/orina.png'),
(1004, 'Creatinina en orina de 24 horas', 'Medición de función renal', 'Recolección de orina de 24 horas', 320.00, 200.00, '/images/creatinina24h.png')
ON CONFLICT (analysis_id) DO NOTHING;

-- ========================
-- 📅 CREAR CITAS MÉDICAS (CATÁLOGO)
-- ========================
INSERT INTO appointments (appointment_id, doctor_id, name, general_cost, community_cost, image_url)
VALUES 
(2001, '650e8400-e29b-41d4-a716-446655440001'::uuid, 'Consulta Nefrológica General', 800.00, 500.00, '/images/consulta-nefro.png'),
(2002, '650e8400-e29b-41d4-a716-446655440001'::uuid, 'Consulta de Seguimiento', 600.00, 400.00, '/images/seguimiento.png'),
(2003, '650e8400-e29b-41d4-a716-446655440001'::uuid, 'Valoración Inicial Renal', 1000.00, 700.00, '/images/valoracion.png')
ON CONFLICT (appointment_id) DO NOTHING;

-- ========================
-- 🤝 CREAR HISTORIAL DE CITAS DEL PACIENTE
-- ========================

INSERT INTO patient_appointment (patient_appointment_id, patient_id, appointment_id, date_hour, duration, appointment_type, link, place, appointment_status)
VALUES 
(3001, '450e8400-e29b-41d4-a716-446655440002'::uuid, 2003, NOW() - INTERVAL '6 months', 60, 'PRESENCIAL'::"Type", NULL, 'Consultorio 302, Torre Médica', 'FINISHED'::"Status")
ON CONFLICT (patient_appointment_id) DO NOTHING;

INSERT INTO patient_appointment (patient_appointment_id, patient_id, appointment_id, date_hour, duration, appointment_type, link, place, appointment_status)
VALUES 
(3002, '450e8400-e29b-41d4-a716-446655440002'::uuid, 2002, NOW() - INTERVAL '3 months', 45, 'PRESENCIAL'::"Type", NULL, 'Consultorio 302, Torre Médica', 'FINISHED'::"Status")
ON CONFLICT (patient_appointment_id) DO NOTHING;

INSERT INTO patient_appointment (patient_appointment_id, patient_id, appointment_id, date_hour, duration, appointment_type, link, place, appointment_status)
VALUES 
(3003, '450e8400-e29b-41d4-a716-446655440002'::uuid, 2002, NOW() - INTERVAL '1 month', 45, 'VIRTUAL'::"Type", 'https://meet.google.com/abc-defg-hij', NULL, 'FINISHED'::"Status")
ON CONFLICT (patient_appointment_id) DO NOTHING;

INSERT INTO patient_appointment (patient_appointment_id, patient_id, appointment_id, date_hour, duration, appointment_type, link, place, appointment_status)
VALUES 
(3004, '450e8400-e29b-41d4-a716-446655440002'::uuid, 2002, NOW() + INTERVAL '2 weeks', 45, 'PRESENCIAL'::"Type", NULL, 'Consultorio 302, Torre Médica', 'PROGRAMMED'::"Status")
ON CONFLICT (patient_appointment_id) DO NOTHING;

INSERT INTO patient_appointment (patient_appointment_id, patient_id, appointment_id, date_hour, duration, appointment_type, link, place, appointment_status)
VALUES 
(3005, '450e8400-e29b-41d4-a716-446655440002'::uuid, 2001, NOW() + INTERVAL '1 month', 60, 'PRESENCIAL'::"Type", NULL, NULL, 'REQUESTED'::"Status")
ON CONFLICT (patient_appointment_id) DO NOTHING;

-- ========================
-- 🧾 CREAR NOTAS CLÍNICAS
-- ========================

-- Nota de valoración inicial
INSERT INTO notes (note_id, patient_id, patient_appointment_id, title, content, general_notes, ailments, prescription, visibility, creation_date)
VALUES 
(4001, '450e8400-e29b-41d4-a716-446655440002'::uuid, 3001, 'Valoración Inicial - Enfermedad Renal Crónica', 
'Paciente masculino de 45 años acude por primera vez a consulta de nefrología. Refiere antecedentes familiares de diabetes mellitus tipo 2 e hipertensión arterial. Presenta cifras de creatinina sérica elevadas detectadas en exámenes de rutina.',
'TA: 145/92 mmHg | FC: 78 lpm | Peso: 82 kg | Talla: 1.72 m | IMC: 27.7 kg/m² | Creatinina: 1.8 mg/dL | TFG estimada: 42 mL/min/1.73m²',
'Enfermedad Renal Crónica Estadio 3b, Hipertensión Arterial Sistémica grado I, Sobrepeso',
'1. Losartán 100 mg VO cada 24 hrs\n2. Amlodipino 5 mg VO cada 24 hrs\n3. Furosemida 40 mg VO cada 24 hrs\n4. Dieta hiposódica estricta\n5. Restricción de proteínas 0.8 g/kg/día',
true, NOW() - INTERVAL '6 months')
ON CONFLICT (note_id) DO NOTHING;

-- Nota de seguimiento (3 meses)
INSERT INTO notes (note_id, patient_id, patient_appointment_id, title, content, general_notes, ailments, prescription, visibility, creation_date)
VALUES 
(4002, '450e8400-e29b-41d4-a716-446655440002'::uuid, 3002, 'Consulta de Seguimiento',
'Paciente acude a control. Refiere buena adherencia al tratamiento farmacológico y dietético. Ha presentado disminución de peso de 4 kg. Cifras tensionales controladas.',
'TA: 128/82 mmHg | FC: 72 lpm | Peso: 78 kg | IMC: 26.4 kg/m² | Creatinina: 1.7 mg/dL | TFG: 45 mL/min/1.73m²',
'ERC Estadio 3a-3b (mejoría), HAS controlada, Sobrepeso en reducción',
'1. Continuar Losartán 100 mg VO c/24h\n2. Continuar Amlodipino 5 mg VO c/24h\n3. Ajustar Furosemida a 20 mg VO c/24h\n4. Continuar dieta hiposódica\n5. Aumentar actividad física moderada',
true, NOW() - INTERVAL '3 months')
ON CONFLICT (note_id) DO NOTHING;

-- Nota de seguimiento reciente (1 mes)
INSERT INTO notes (note_id, patient_id, patient_appointment_id, title, content, general_notes, ailments, prescription, visibility, creation_date)
VALUES 
(4003, '450e8400-e29b-41d4-a716-446655440002'::uuid, 3003, 'Teleconsulta de Control',
'Paciente se conecta a teleconsulta. Refiere sentirse bien, continúa con pérdida de peso progresiva. Sin edema, sin disnea. Resultados de laboratorios recientes muestran estabilidad de función renal.',
'TA (automedición): 125/80 mmHg | Peso: 76 kg | Creatinina: 1.65 mg/dL | TFG: 47 mL/min/1.73m²',
'ERC Estadio 3a estable, HAS controlada',
'1. Continuar esquema actual sin cambios\n2. Solicitar nuevos laboratorios en 3 meses\n3. Cita de control en 1 mes',
true, NOW() - INTERVAL '1 month')
ON CONFLICT (note_id) DO NOTHING;

-- Nota general (no asociada a cita específica)
INSERT INTO notes (note_id, patient_id, patient_appointment_id, title, content, general_notes, ailments, prescription, visibility, creation_date)
VALUES 
(4004, '450e8400-e29b-41d4-a716-446655440002'::uuid, NULL, 'Observaciones Generales del Expediente',
'Paciente con diagnóstico de Enfermedad Renal Crónica en seguimiento por nefrología. Muestra excelente apego terapéutico y modificación de estilo de vida. Se recomienda vigilancia estrecha de función renal cada 3 meses.',
'Factores de riesgo: Antecedentes familiares de DM2 e HAS | Factores protectores: No tabaquismo, no alcoholismo',
NULL, NULL, true, NOW() - INTERVAL '2 weeks')
ON CONFLICT (note_id) DO NOTHING;

-- ========================
-- 📊 CREAR ANÁLISIS DE LABORATORIO DEL PACIENTE
-- ========================

-- Análisis 1: SENT (hace 6 meses - inicial)
INSERT INTO patient_analysis (patient_analysis_id, laboratorist_id, analysis_id, patient_id, analysis_date, results_date, place, duration, analysis_status)
VALUES 
(5001, '750e8400-e29b-41d4-a716-446655440004'::uuid, 1001, '450e8400-e29b-41d4-a716-446655440002'::uuid, 
NOW() - INTERVAL '6 months 2 days', NOW() - INTERVAL '6 months 1 day', 'Laboratorio Central Nefrovida', 15, 'SENT'::"ANALYSIS_STATUS")
ON CONFLICT (patient_analysis_id) DO NOTHING;

INSERT INTO patient_analysis (patient_analysis_id, laboratorist_id, analysis_id, patient_id, analysis_date, results_date, place, duration, analysis_status)
VALUES 
(5002, '750e8400-e29b-41d4-a716-446655440004'::uuid, 1002, '450e8400-e29b-41d4-a716-446655440002'::uuid, 
NOW() - INTERVAL '6 months 2 days', NOW() - INTERVAL '6 months 1 day', 'Laboratorio Central Nefrovida', 15, 'SENT'::"ANALYSIS_STATUS")
ON CONFLICT (patient_analysis_id) DO NOTHING;

INSERT INTO patient_analysis (patient_analysis_id, laboratorist_id, analysis_id, patient_id, analysis_date, results_date, place, duration, analysis_status)
VALUES  
(5003, '750e8400-e29b-41d4-a716-446655440004'::uuid, 1003, '450e8400-e29b-41d4-a716-446655440002'::uuid, 
NOW() - INTERVAL '6 months 2 days', NOW() - INTERVAL '6 months 1 day', 'Laboratorio Central Nefrovida', 10, 'SENT'::"ANALYSIS_STATUS")
ON CONFLICT (patient_analysis_id) DO NOTHING;

-- Análisis 4: SENT (hace 3 meses - seguimiento)
INSERT INTO patient_analysis (patient_analysis_id, laboratorist_id, analysis_id, patient_id, analysis_date, results_date, place, duration, analysis_status)
VALUES 
(5004, '750e8400-e29b-41d4-a716-446655440004'::uuid, 1002, '450e8400-e29b-41d4-a716-446655440002'::uuid, 
NOW() - INTERVAL '3 months 3 days', NOW() - INTERVAL '3 months 2 days', 'Laboratorio Central Nefrovida', 15, 'SENT'::"ANALYSIS_STATUS")
ON CONFLICT (patient_analysis_id) DO NOTHING;

-- Análisis 5: SENT (hace 1 mes - seguimiento reciente)
INSERT INTO patient_analysis (patient_analysis_id, laboratorist_id, analysis_id, patient_id, analysis_date, results_date, place, duration, analysis_status)
VALUES 
(5005, '750e8400-e29b-41d4-a716-446655440004'::uuid, 1002, '450e8400-e29b-41d4-a716-446655440002'::uuid, 
NOW() - INTERVAL '1 month 2 days', NOW() - INTERVAL '1 month 1 day', 'Laboratorio Central Nefrovida', 15, 'SENT'::"ANALYSIS_STATUS")
ON CONFLICT (patient_analysis_id) DO NOTHING;

-- Análisis 6: PENDING (solicitado, pendiente de toma)
INSERT INTO patient_analysis (patient_analysis_id, laboratorist_id, analysis_id, patient_id, analysis_date, results_date, place, duration, analysis_status)
VALUES 
(5006, '750e8400-e29b-41d4-a716-446655440004'::uuid, 1004, '450e8400-e29b-41d4-a716-446655440002'::uuid, 
NOW() + INTERVAL '5 days', NOW() + INTERVAL '7 days', 'Laboratorio Central Nefrovida', 30, 'PENDING'::"ANALYSIS_STATUS")
ON CONFLICT (patient_analysis_id) DO NOTHING;

-- Análisis 7: REQUESTED (apenas solicitado)
INSERT INTO patient_analysis (patient_analysis_id, laboratorist_id, analysis_id, patient_id, analysis_date, results_date, place, duration, analysis_status)
VALUES 
(5007, '750e8400-e29b-41d4-a716-446655440004'::uuid, 1001, '450e8400-e29b-41d4-a716-446655440002'::uuid, 
NOW() + INTERVAL '2 weeks', NOW() + INTERVAL '2 weeks 2 days', 'Laboratorio Central Nefrovida', 15, 'REQUESTED'::"ANALYSIS_STATUS")
ON CONFLICT (patient_analysis_id) DO NOTHING;

-- ========================
-- 🧾 CREAR RESULTADOS DE ANÁLISIS
-- ========================

-- Resultado 1: Biometría inicial
INSERT INTO results (result_id, patient_analysis_id, date, path, interpretation)
VALUES 
(6001, 5001, NOW() - INTERVAL '6 months 1 day', 'http://localhost:3001/uploads/MateoMinghi_CV.pdf',
'Hemoglobina: 12.8 g/dL (leve anemia). Leucocitos normales. Plaquetas normales.')
ON CONFLICT (result_id) DO NOTHING;

-- Resultado 2: Química sanguínea inicial
INSERT INTO results (result_id, patient_analysis_id, date, path, interpretation)
VALUES 
(6002, 5002, NOW() - INTERVAL '6 months 1 day', 'http://localhost:3001/uploads/MateoMinghi_CV.pdf',
'Glucosa: 102 mg/dL. Creatinina: 1.8 mg/dL (elevada). Urea: 45 mg/dL. Ácido úrico: 7.2 mg/dL. Colesterol total: 215 mg/dL. Triglicéridos: 180 mg/dL.')
ON CONFLICT (result_id) DO NOTHING;

-- Resultado 3: Examen de orina inicial
INSERT INTO results (result_id, patient_analysis_id, date, path, interpretation)
VALUES 
(6003, 5003, NOW() - INTERVAL '6 months 1 day', 'http://localhost:3001/uploads/MateoMinghi_CV.pdf',
'Proteinuria +. Glucosuria negativa. Sedimento: cilindros hialinos escasos.')
ON CONFLICT (result_id) DO NOTHING;

-- Resultado 4: Química seguimiento 3 meses
INSERT INTO results (result_id, patient_analysis_id, date, path, interpretation)
VALUES 
(6004, 5004, NOW() - INTERVAL '3 months 2 days', 'http://localhost:3001/uploads/MateoMinghi_CV.pdf',
'Glucosa: 95 mg/dL. Creatinina: 1.7 mg/dL (mejoría leve). Urea: 42 mg/dL. Ácido úrico: 6.8 mg/dL. Colesterol: 195 mg/dL (mejoría). Triglicéridos: 150 mg/dL (mejoría).')
ON CONFLICT (result_id) DO NOTHING;

-- Resultado 5: Química seguimiento reciente
INSERT INTO results (result_id, patient_analysis_id, date, path, interpretation)
VALUES 
(6005, 5005, NOW() - INTERVAL '1 month 1 day', 'http://localhost:3001/uploads/MateoMinghi_CV.pdf',
'Glucosa: 92 mg/dL. Creatinina: 1.65 mg/dL (estable). Urea: 40 mg/dL. Ácido úrico: 6.5 mg/dL. Colesterol: 185 mg/dL. Triglicéridos: 140 mg/dL.')
ON CONFLICT (result_id) DO NOTHING;

-- ========================
-- 🧠 CREAR PREGUNTAS DEL HISTORIAL CLÍNICO (si no existen)
-- ========================
INSERT INTO questions_history (question_id, description, type) 
VALUES
(9001, '¿Sus padres o hermanos padecen enfermedades crónicas?', 'choice'),
(9002, '¿Padece diabetes mellitus?', 'choice'),
(9003, '¿Ha tenido cifras de glucosa mayores que 140 en ayunas?', 'choice'),
(9004, '¿Está en tratamiento por presión alta?', 'choice'),
(9005, '¿Cifras de presión arterial mayores que 130/80?', 'choice'),
(9006, '¿Familiar con enfermedad renal crónica (ERC)?', 'choice'),
(9007, '¿Se automedica con analgésicos frecuentemente?', 'choice'),
(9008, '¿Ha padecido litiasis renal (piedras en los riñones)?', 'choice'),
(9009, '¿Tiene sobrepeso u obesidad?', 'choice'),
(9010, '¿Consume refrescos regularmente?', 'choice'),
(9011, '¿Cuántos refrescos por semana (600 ml)?', 'choice'),
(9012, '¿Agrega sal a sus alimentos?', 'choice'),
(9013, '¿Fuma o ha fumado más de 10 años?', 'choice'),
(9014, '¿Ingiere bebidas alcohólicas con frecuencia?', 'choice'),
(9015, '¿Ha tenido episodios de depresión?', 'choice')
ON CONFLICT (question_id) DO NOTHING;

-- Opciones para preguntas de tipo choice
INSERT INTO options (option_id, question_id, description)
VALUES
-- Opciones Sí/No/Desconoce para preguntas 9001-9010, 9012-9015
(90001, 9001, 'Sí'), (90002, 9001, 'No'), (90003, 9001, 'Lo desconoce'),
(90004, 9002, 'Sí'), (90005, 9002, 'No'), (90006, 9002, 'Lo desconoce'),
(90007, 9003, 'Sí'), (90008, 9003, 'No'), (90009, 9003, 'Lo desconoce'),
(90010, 9004, 'Sí'), (90011, 9004, 'No'), (90012, 9004, 'Lo desconoce'),
(90013, 9005, 'Sí'), (90014, 9005, 'No'), (90015, 9005, 'Lo desconoce'),
(90016, 9006, 'Sí'), (90017, 9006, 'No'), (90018, 9006, 'Lo desconoce'),
(90019, 9007, 'Sí'), (90020, 9007, 'No'), (90021, 9007, 'Lo desconoce'),
(90022, 9008, 'Sí'), (90023, 9008, 'No'), (90024, 9008, 'Lo desconoce'),
(90025, 9009, 'Sí'), (90026, 9009, 'No'), (90027, 9009, 'Lo desconoce'),
(90028, 9010, 'Sí'), (90029, 9010, 'No'), (90030, 9010, 'Lo desconoce'),
(90031, 9012, 'Sí'), (90032, 9012, 'No'), (90033, 9012, 'Lo desconoce'),
(90034, 9013, 'Sí'), (90035, 9013, 'No'), (90036, 9013, 'Lo desconoce'),
(90037, 9014, 'Sí'), (90038, 9014, 'No'), (90039, 9014, 'Lo desconoce'),
(90040, 9015, 'Sí'), (90041, 9015, 'No'), (90042, 9015, 'Lo desconoce'),
-- Opciones para pregunta 9011 (frecuencia de refrescos)
(90043, 9011, 'No consumo'), (90044, 9011, '1-2 por semana'), 
(90045, 9011, '3-5 por semana'), (90046, 9011, 'Más de 5 por semana')
ON CONFLICT (option_id) DO NOTHING;

-- ========================
-- 📝 RESPUESTAS DEL HISTORIAL CLÍNICO DEL PACIENTE
-- ========================
INSERT INTO patient_history (question_id, patient_id, answer)
VALUES
(9001, '450e8400-e29b-41d4-a716-446655440002'::uuid, 'Sí'),
(9002, '450e8400-e29b-41d4-a716-446655440002'::uuid, 'No'),
(9003, '450e8400-e29b-41d4-a716-446655440002'::uuid, 'No'),
(9004, '450e8400-e29b-41d4-a716-446655440002'::uuid, 'Sí'),
(9005, '450e8400-e29b-41d4-a716-446655440002'::uuid, 'Sí'),
(9006, '450e8400-e29b-41d4-a716-446655440002'::uuid, 'No'),
(9007, '450e8400-e29b-41d4-a716-446655440002'::uuid, 'No'),
(9008, '450e8400-e29b-41d4-a716-446655440002'::uuid, 'No'),
(9009, '450e8400-e29b-41d4-a716-446655440002'::uuid, 'Sí'),
(9010, '450e8400-e29b-41d4-a716-446655440002'::uuid, 'Sí'),
(9011, '450e8400-e29b-41d4-a716-446655440002'::uuid, '3-5 por semana'),
(9012, '450e8400-e29b-41d4-a716-446655440002'::uuid, 'Sí'),
(9013, '450e8400-e29b-41d4-a716-446655440002'::uuid, 'No'),
(9014, '450e8400-e29b-41d4-a716-446655440002'::uuid, 'No'),
(9015, '450e8400-e29b-41d4-a716-446655440002'::uuid, 'No')
ON CONFLICT DO NOTHING;

-- ========================
-- ✅ SEED DE EXPEDIENTE COMPLETADO
-- ========================
-- Datos creados:
-- - Permisos asignados a todos los roles relevantes
-- - 1 Doctor (Dr. Roberto Sánchez)
-- - 1 Paciente (Juan Carlos Ramírez) con expediente completo
-- - 1 Familiar (María Elena Ramírez)
-- - 1 Laboratorista (Pedro González)
-- - 5 Citas médicas (3 finalizadas, 1 programada, 1 solicitada)
-- - 4 Notas clínicas detalladas
-- - 7 Análisis de laboratorio (5 con resultados, 2 pendientes)
-- - 5 Resultados de laboratorio con interpretaciones
-- - 15 Respuestas del historial clínico
--
-- CREDENCIALES DE PRUEBA (password: 1234567890):
-- - Doctor: dr.sanchez / 1234567890
-- - Paciente: juan.ramirez / 1234567890
-- - Familiar: maria.ramirez / 1234567890
-- - Laboratorista: pedro.lab / 1234567890
--
-- PERMISOS ASIGNADOS POR ROL:
-- 
-- Doctor (role_id = 2):
--   - VIEW_MEDICAL_RECORD, VIEW_PATIENTS, VIEW_APPOINTMENTS, CREATE_APPOINTMENTS,
--     UPDATE_APPOINTMENTS, VIEW_NOTES, CREATE_NOTES, UPDATE_NOTES, VIEW_ANALYSIS,
--     VIEW_CLINICAL_HISTORY, VIEW_REPORTS
--
-- Paciente (role_id = 3):
--   - VIEW_MEDICAL_RECORD, VIEW_APPOINTMENTS, VIEW_NOTES, VIEW_ANALYSIS,
--     VIEW_CLINICAL_HISTORY, CREATE_CLINICAL_HISTORY, VIEW_REPORTS
--
-- Familiar (role_id = 5):
--   - VIEW_MEDICAL_RECORD, VIEW_APPOINTMENTS, VIEW_NOTES, VIEW_ANALYSIS,
--     VIEW_CLINICAL_HISTORY, VIEW_REPORTS
--
-- PARA PROBAR EL ENDPOINT:
-- GET /api/patients/450e8400-e29b-41d4-a716-446655440002/expediente
-- (autenticado como cualquiera de los usuarios anteriores)