-- ========================
-- 🔄 MIGRATION: Update Privileges to Match Code
-- ========================
-- This script updates the privilege names from Spanish to English
-- to match the Privilege enum in rbac.types.ts
--
-- Run this AFTER seeding the database or as a standalone migration
-- ========================

BEGIN;

-- Update existing privileges to match the code
UPDATE privileges SET description = 'CREATE_USERS' WHERE description = 'Crear usuario';
UPDATE privileges SET description = 'UPDATE_USERS' WHERE description = 'Editar usuario';
UPDATE privileges SET description = 'DELETE_USERS' WHERE description = 'Eliminar usuario';
UPDATE privileges SET description = 'VIEW_REPORTS' WHERE description = 'Ver reportes';
UPDATE privileges SET description = 'CREATE_APPOINTMENTS' WHERE description = 'Asignar citas';

-- Handle forum privileges (might be 'Administrar foros' in old seed)
UPDATE privileges SET description = 'CREATE_FORUMS' WHERE description = 'Administrar foros';

-- Insert missing forum privileges if they don't exist
INSERT INTO privileges (description) 
VALUES ('VIEW_FORUMS')
ON CONFLICT DO NOTHING;

INSERT INTO privileges (description) 
VALUES ('CREATE_FORUMS')
ON CONFLICT DO NOTHING;

INSERT INTO privileges (description) 
VALUES ('UPDATE_FORUMS')
ON CONFLICT DO NOTHING;

INSERT INTO privileges (description) 
VALUES ('DELETE_FORUMS')
ON CONFLICT DO NOTHING;

-- Ensure Admin (role_id = 1) has all privileges
INSERT INTO role_privilege (role_id, privilege_id)
SELECT 1, privilege_id 
FROM privileges 
WHERE NOT EXISTS (
  SELECT 1 FROM role_privilege 
  WHERE role_id = 1 AND role_privilege.privilege_id = privileges.privilege_id
);

COMMIT;

-- ========================
-- ✅ Verify the changes
-- ========================
-- Run this to confirm:
-- SELECT * FROM privileges ORDER BY privilege_id;
-- SELECT rp.*, p.description 
-- FROM role_privilege rp 
-- JOIN privileges p ON rp.privilege_id = p.privilege_id 
-- WHERE rp.role_id = 1;
