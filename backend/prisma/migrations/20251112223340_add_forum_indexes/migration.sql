-- CreateIndex
-- Índice para optimizar búsquedas por creador del foro
CREATE INDEX IF NOT EXISTS "forums_created_by_id_idx" ON "forums"("created_by_id");

-- CreateIndex
-- Índice para optimizar filtrado por visibilidad (PUBLIC/PRIVATE)
CREATE INDEX IF NOT EXISTS "forums_visibility_idx" ON "forums"("visibility");
