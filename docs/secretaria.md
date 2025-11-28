# Documentación - Secretaria

## Módulo de Gestión de Análisis

### Historias de Usuario 28, 29 y 30

Este capítulo documenta todas las rutas necesarias para implementar, probar y mantener las funciones de Secretaria relacionadas con la gestión del catálogo de tipos de análisis clínicos (crear, eliminar, modificar).

Corresponde a las historias de usuario:

- US28 - Secretaria crea un análisis
- US29 - Secretaria elimina un análisis
- US30 - Secretaria modifica un análisis

Incluye rutas de backend (API), rutas de frontend, flujos funcionales y detalles RBAC para asegurar que otros miembros del equipo puedan integrarlo fácilmente en futuras vistas y dashboards.

# 1. Rol Secretaria

La secretaria tiene los siguientes privilegios según seed.sql y el middleware RBAC:

```
VIEW_ANALYSIS
CREATE_ANALYSIS
UPDATE_ANALYSIS
DELETE_ANALYSIS
```

Esto habilita:

- Ver catálogo de análisis
- Crear nuevos análisis
- Editar análisis existentes
- Eliminar análisis existentes

# 2. Rutas Backend - API REST

A continuación, se documentan todas las rutas relevantes para las US28/29/30. Todas requieren autenticación (authenticate) y permisos RBAC, ya incluidos en los controladores actuales.

## 2.1. GET - Obtener lista de análisis

### US28 / US29 / US30 - Listado general

```
GET /api/analysis
```

### Ejemplo de respuesta:

```
[
  {
    "analysis_id": 1,
    "name": "Biometría Hemática",
    "description": "Análisis general de sangre",
    "previous_requirements": "Ayuno de 8 horas",
    "general_cost": "250",
    "community_cost": "150"
  },
  ...
]
```

### Uso:

- Dashboard inicial del módulo
- Selección de análisis para editar (US30)
- Selección de análisis para eliminar (US29)

## 2.2. POST - Crear un análisis

### US28 - Secretaria crea análisis

```
POST /api/analysis
```

### Body (JSON):

```
{
  "name": "Nuevo análisis",
  "description": "Descripción",
  "previous_requirements": "Requisitos previos",
  "general_cost": "300",
  "community_cost": "200"
}
```

### Respuesta esperada:

```
{
  "success": true,
  "analysis_id": 7
}
```

## 2.3. DELETE - Eliminar un análisis

### US29 - Secretaria elimina análisis

```
DELETE /api/analysis/:id
```

### Ejemplo:

```
DELETE /api/analysis/3
```

### Respuesta:

```
{ "success": true }
```

## 2.4. PUT - Actualizar un análisis

### US30 - Secretaria modifica análisis

```
PUT /api/analysis/:id
```

### Body (solo lo que se desea modificar):

```
{
  "name": "Nuevo nombre",
  "description": "Descripción actualizada",
  "previous_requirements": "Nuevos requisitos",
  "general_cost": "400",
  "community_cost": "250"
}
```

### Respuesta:

```
{ "success": true }
```

# 3. Rutas Frontend - React Router

Estas rutas están declaradas en:

```
frontend/src/routes/analisis.routes.tsx
```

## 3.1 Vista principal del catálogo de análisis

### US28 / US29 / US30

```
/analisis
```

Incluye:

- Lista de análisis
- Botón "Crear análisis"
- Botón "Editar" en cada fila
- Botón "Eliminar" en cada fila

## 3.2 Crear análisis

### US28

```
/analisis + botón "Crear análisis"
```

Componentes típicos:

- Formulario de creación
- Validación básica
- Botón "Crear" -> Llama POST /api/analysis

## 3.3 Editar análisis

### US30

```
/analisis + botón "Editar"
```

Flujo:

1. cargar datos con GET /api/analysis/:id
2. mostrar formulario con valores actuales
3. al guardar -> PUT /api/analysis/:id

## 3.4 Eliminar análisis

### US29

Accesible desde /analisis:

- Botón "Eliminar"
- Confirmación OK
- Acción final -> DELETE /api/analysis/:id

# 4. Flujos completos (US28 / US29 / US30)

## 4.1. Flujo US28 - Crear análisis

1. Secretaria hace login
2. En dashboard selecciona "Análisis"
3. En /analisis, presiona "Crear análisis"
4. Formulario en /analisis/crear
5. Enviar POST -> /api/analysis
6. Ver análisis nuevo en la tabla -> /analisis

## 4.2. Flujo US29 - Eliminar análisis

1. Secretaria visita /analisis
2. Selecciona un análisis
3. Click en "Eliminar"
4. Confirmación
5. DELETE -> /api/analysis/:id
6. La tabla se actualiza

## 4.3. Flujo US30 - Modificar análisis

1. Secretaria entra a /analisis
2. Selecciona análisis a editar
3. Navega a /analisis/editar/:id
4. Edita valores
5. PUT -> /api/analysis/:id
6. Redirección a /analisis
7. Verifica que los cambios se reflejan

# 5. Recursos Técnicos

## 5.1. Archivos backend involucrados

```
backend/src/routes/routes.ts
  ↳ Sección "Analysis Routes" (define:
     POST /api/analysis
     GET  /api/analysis
     GET  /api/analysis/:id
     PUT  /api/analysis/:id
     DELETE /api/analysis/:id
     con authenticate + requirePrivileges)

backend/src/controller/analysis/add_analysis.controller.ts
  ↳ Controladores exportados para:
     - createAnalysis
     - getAllAnalysis
     - getAnalysisById
     - updateAnalysis
     - deleteAnalysis

backend/src/model/analysis.model.ts
  ↳ Operaciones generales sobre la tabla `analysis`
     (listado, búsqueda por id, etc.)

backend/src/model/analysis/add.analysis.model.ts
  ↳ Lógica específica usada por los controladores de análisis
     (creación / actualización de registros)

backend/src/service/analysis/add.analysis.service.ts
  ↳ Capa de servicio que orquesta validaciones y llamadas al modelo
     para las operaciones de análisis.

backend/src/validators/analysis/add.analysis.validator.ts
  ↳ Validación de payload para crear / actualizar análisis.

backend/src/types/analysis/add.analysis.types.ts
backend/src/types/AnalysisRecord.ts
  ↳ Tipos TypeScript usados para tipar requests/responses
     y las estructuras del catálogo de análisis.
```

## 5.2. Archivos frontend involucrados
```
frontend/src/routes/analisis.routes.tsx
  ↳ Define las rutas de React relacionadas con análisis, por ejemplo:
     - /analisis
     - /analisis/crear
     - /analisis/editar/:id
     (según se haya configurado en la rama actual)

frontend/src/components/page/AnalysisManager.tsx
  ↳ Página principal del módulo de análisis para secretaria:
     listado, hooks a modales de crear/editar, acciones de eliminar.

frontend/src/components/organism/lab/CreateAnalysisModal.tsx
  ↳ Modal de creación de análisis (US28).
     Usa el servicio de frontend para llamar a POST /api/analysis.

frontend/src/components/organism/lab/EditAnalysisModal.tsx
  ↳ Modal de edición de análisis (US30).
     Usa el servicio de frontend para llamar a PUT /api/analysis/:id.

frontend/src/services/analysis.service.ts
  ↳ Funciones de acceso a la API:
     - getAnalyses()
     - getAnalysisById(id)
     - createAnalysis(data)
     - updateAnalysis(id, data)
     - deleteAnalysis(id)

frontend/src/types/add.analysis.types.ts
frontend/src/types/analysisInfo.ts
frontend/src/types/Analysis_status.ts
  ↳ Tipos de apoyo para las estructuras de análisis que se usan
     en formularios, tablas y estados de la UI.
```

# 6. Ejemplo de Testeo en Postman

### Crear (US28)

```
POST http://localhost:3001/api/analysis
```

Body -> raw -> JSON

### Editar (US30)

```
PUT http://localhost:3001/api/analysis/2
```

### Eliminar (US29)

```
DELETE http://localhost:3001/api/analysis/2
```

### Listar

```
GET http://localhost:3001/api/analysis
```

# 7. Notas de Integración para el Equipo

- Las rutas ya están protegidas con RBAC.
- La secretaria está plenamente aislada de privilegios de Laboratorista.
- Estas US pueden integrarse directamente en un dashboard de secretaria sin modificar backend.