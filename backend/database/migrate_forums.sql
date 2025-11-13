-- ============================================================================
-- SCRIPT DE MIGRACIÓN COMPLETA PARA FOROS
-- ============================================================================
-- Este script asume que las migraciones anteriores ya fueron aplicadas.
-- Si no lo fueron, ejecuta primero:
--   1. La migración 20251111034500_add_forums/migration.sql
--   2. Esta migración de índices
-- ============================================================================

-- Verificar que el enum Visibility existe
DO $$ BEGIN
  CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'PRIVATE');
EXCEPTION
  WHEN duplicate_object THEN 
    RAISE NOTICE 'Enum Visibility ya existe';
END $$;

-- Verificar estructura de la tabla forums
DO $$ 
BEGIN
  -- Verificar si la columna visibility existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'forums' AND column_name = 'visibility'
  ) THEN
    RAISE EXCEPTION 'La tabla forums no tiene la estructura actualizada. Ejecuta primero la migración 20251111034500_add_forums';
  END IF;
END $$;

-- Crear índices (si no existen)
CREATE INDEX IF NOT EXISTS "forums_created_by_id_idx" ON "forums"("created_by_id");
CREATE INDEX IF NOT EXISTS "forums_visibility_idx" ON "forums"("visibility");

-- Verificar foreign keys
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'forums_created_by_id_fkey'
  ) THEN
    ALTER TABLE "forums" ADD CONSTRAINT "forums_created_by_id_fkey" 
      FOREIGN KEY ("created_by_id") REFERENCES "users"("user_id") 
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- Mostrar resumen de la estructura
SELECT 
  'forums' as tabla,
  COUNT(*) as total_registros,
  COUNT(CASE WHEN visibility = 'PUBLIC' THEN 1 END) as publicos,
  COUNT(CASE WHEN visibility = 'PRIVATE' THEN 1 END) as privados
FROM forums;

-- Verificar índices creados
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'forums'
ORDER BY indexname;

RAISE NOTICE 'Migración de foros completada exitosamente';
