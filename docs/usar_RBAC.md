Hola amigos, el RBAC y la auth son cosas que se van a usar cada vez que se agregue una nueva feature, entonces para que no se hagan bolas este documento explica cómo funciona el sistema de autenticación y autorización en el backend, y cómo debe utilizarse al agregar nuevas rutas y funcionalidades.

---

## Arquitectura General

El sistema de seguridad está compuesto por dos capas:

1. **Authentication**: Verifica que el usuario esté identificado (tiene una sesión válida)
2. **Autorización (RBAC)**: Verifica que el usuario tenga los permisos necesarios para realizar una acción

```
Request → authenticate → requirePrivileges → Controller → Response
          └─ Verifica      └─ Verifica           └─ Ejecuta
             token JWT        privilegios           lógica
```

---

## Sistema de Autenticación

### ¿Cómo Funciona?

El sistema utiliza JWT almacenados en cookies httpOnly para mantener las sesiones de usuario.
Esto es más seguro que guardarlos en localStorage

#### Flujo de Login/Register

1. Usuario envía credenciales al endpoint `/auth/login` o `/auth/register`
2. Backend valida credenciales y genera dos tokens:
   - **Access Token**: Válido por 15 minutos (usado para autenticar requests)
   - **Refresh Token**: Válido por 7 días (usado para renovar el access token)
3. Los tokens se envían al cliente como **cookies httpOnly**:
   ```typescript
   res.cookie('accessToken', token, {
     httpOnly: true,        // No accesible desde JavaScript
     secure: true,          // Solo HTTPS en producción
     sameSite: 'strict',    // Protección CSRF
     maxAge: 15 * 60 * 1000 // 15 minutos
   });
   ```

#### Middleware `authenticate`

Este middleware:
1. Extrae el token de las cookies (`req.cookies.accessToken`)
2. Si no hay token en cookies, intenta leerlo del header `Authorization: Bearer <token>` (fallback)
3. Verifica y decodifica el token JWT
4. Adjunta la información del usuario a `req.user`:
   ```typescript
   req.user = {
     userId: string,
     roleId: number,
     privileges: string[]
   }
   ```

**Uso**:
```typescript
router.get("/protected", authenticate, controller);
```

---

### Estructura de la Base de Datos

```
users → roles → role_privilege ← privileges
  └─ role_id    └─ Tabla intermedia
```

### Roles Disponibles

| ID | Rol            | Descripción                        |
|----|----------------|------------------------------------|
| 1  | Admin          | Acceso completo al sistema         |
| 2  | Doctor         | Gestión de pacientes y consultas   |
| 3  | Paciente       | Acceso a su información médica     |
| 4  | Laboratorista  | Gestión de análisis de laboratorio |
| 5  | Familiar       | Acceso limitado a info del paciente|

### Privilegios Definidos

Los privilegios están definidos en `backend/src/types/rbac.types.ts`, esto es para usarlo como interfaces de typescript, entonces si los cambiamos en db tienen que cambiarse aquí también:

```typescript
export enum Privilege {
  // Gestión de usuarios
  VIEW_USERS = 'VIEW_USERS',
  CREATE_USERS = 'CREATE_USERS',
  UPDATE_USERS = 'UPDATE_USERS',
  DELETE_USERS = 'DELETE_USERS',
  
  // Gestión de roles
  VIEW_ROLES = 'VIEW_ROLES',
  CREATE_ROLES = 'CREATE_ROLES',
  UPDATE_ROLES = 'UPDATE_ROLES',
  DELETE_ROLES = 'DELETE_ROLES',
  
  // Gestión de pacientes
  VIEW_PATIENTS = 'VIEW_PATIENTS',
  CREATE_PATIENTS = 'CREATE_PATIENTS',
  UPDATE_PATIENTS = 'UPDATE_PATIENTS',
  DELETE_PATIENTS = 'DELETE_PATIENTS',
  
  // Gestión de citas
  VIEW_APPOINTMENTS = 'VIEW_APPOINTMENTS',
  CREATE_APPOINTMENTS = 'CREATE_APPOINTMENTS',
  UPDATE_APPOINTMENTS = 'UPDATE_APPOINTMENTS',
  DELETE_APPOINTMENTS = 'DELETE_APPOINTMENTS',
  
  // Gestión de análisis
  VIEW_ANALYSIS = 'VIEW_ANALYSIS',
  CREATE_ANALYSIS = 'CREATE_ANALYSIS',
  UPDATE_ANALYSIS = 'UPDATE_ANALYSIS',
  DELETE_ANALYSIS = 'DELETE_ANALYSIS',
  
  // Gestión de foros
  VIEW_FORUMS = 'VIEW_FORUMS',
  CREATE_FORUMS = 'CREATE_FORUMS',
  UPDATE_FORUMS = 'UPDATE_FORUMS',
  DELETE_FORUMS = 'DELETE_FORUMS',
}
```

### Middlewares de Autorización (rbac.middleware.ts)

#### 1. `requirePrivileges` (Todos los privilegios requeridos)

Requiere que el usuario tenga **TODOS** los privilegios especificados.

```typescript
requirePrivileges([Privilege.VIEW_USERS, Privilege.UPDATE_USERS])
// El usuario DEBE tener ambos privilegios
```

#### 2. `requireAnyPrivilege` (Al menos uno)

Requiere que el usuario tenga **AL MENOS UNO** de los privilegios especificados.

```typescript
requireAnyPrivilege([Privilege.VIEW_ANALYSIS, Privilege.CREATE_ANALYSIS])
// El usuario puede tener cualquiera de los dos
```

---

## 🛡️ Cómo Proteger Rutas

### Patrón Básico

```typescript
import { authenticate } from "../middleware/auth.middleware";
import { requirePrivileges } from "../middleware/rbac.middleware";
import { Privilege } from "../types/rbac.types";

// Solo autenticación (cualquier usuario logueado)
router.get("/profile", authenticate, controller);

// Autenticación + privilegio específico
router.get(
  "/users",
  authenticate,
  requirePrivileges([Privilege.VIEW_USERS]),
  controller
);

// Autenticación + múltiples privilegios
router.post(
  "/users",
  authenticate,
  requirePrivileges([Privilege.CREATE_USERS, Privilege.VIEW_USERS]),
  controller
);

// Autenticación + cualquiera de varios privilegios
router.get(
  "/analysis",
  authenticate,
  requireAnyPrivilege([Privilege.VIEW_ANALYSIS, Privilege.CREATE_ANALYSIS]),
  controller
);
```

### Ejemplos Reales del Proyecto

#### 1. Rutas de Usuarios (`users.routes.ts`)

```typescript
// Cualquier usuario autenticado puede ver su perfil
router.get("/users/profile", authenticate, usersController.getProfile);

// Solo usuarios con privilegio VIEW_USERS
router.get(
  "/users",
  authenticate,
  requirePrivileges([Privilege.VIEW_USERS]),
  usersController.getAllUsers
);

// Solo usuarios con privilegio UPDATE_USERS
router.put(
  "/users/:id",
  authenticate,
  requirePrivileges([Privilege.UPDATE_USERS]),
  usersController.updateUser
);

// Solo usuarios con privilegio DELETE_USERS
router.delete(
  "/users/:id",
  authenticate,
  requirePrivileges([Privilege.DELETE_USERS]),
  usersController.deleteUser
);
```

#### 2. Rutas de Laboratorio (`lab.routes.ts`)

```typescript
// Requiere autenticación y privilegio VIEW_ANALYSIS
router.get(
  "/results",
  authenticate,
  requirePrivileges([Privilege.VIEW_ANALYSIS]),
  getLabResults
);

// Solo requiere autenticación (lista pública de análisis)
router.get("/analysis", authenticate, getAnalysis);
```

---

## Agregar Nuevos Privilegios

### 1. Definir el Privilegio

Edita `backend/src/types/rbac.types.ts`:

```typescript
export enum Privilege {
  // ... privilegios existentes
  
  // Nuevos privilegios de prescripciones
  VIEW_PRESCRIPTIONS = 'VIEW_PRESCRIPTIONS',
  CREATE_PRESCRIPTIONS = 'CREATE_PRESCRIPTIONS',
  UPDATE_PRESCRIPTIONS = 'UPDATE_PRESCRIPTIONS',
  DELETE_PRESCRIPTIONS = 'DELETE_PRESCRIPTIONS',
}
```

### 2. Insertar en la Base de Datos

Crea una migración o actualiza el seed (`backend/database/seed.sql`):

```sql
-- Agregar nuevos privilegios
INSERT INTO privileges (description) VALUES
('VIEW_PRESCRIPTIONS'),
('CREATE_PRESCRIPTIONS'),
('UPDATE_PRESCRIPTIONS'),
('DELETE_PRESCRIPTIONS');

-- Asignar privilegios al rol de Doctor (role_id = 2)
INSERT INTO role_privilege (role_id, privilege_id)
SELECT 2, privilege_id 
FROM privileges 
WHERE description IN ('VIEW_PRESCRIPTIONS', 'CREATE_PRESCRIPTIONS');

-- Admin (role_id = 1) ya tiene todos los privilegios
INSERT INTO role_privilege (role_id, privilege_id)
SELECT 1, privilege_id FROM privileges
WHERE description IN ('VIEW_PRESCRIPTIONS', 'CREATE_PRESCRIPTIONS', 'UPDATE_PRESCRIPTIONS', 'DELETE_PRESCRIPTIONS');
```

### 3. Usar en Rutas

```typescript
router.post(
  "/prescriptions",
  authenticate,
  requirePrivileges([Privilege.CREATE_PRESCRIPTIONS]),
  prescriptionController.create
);
```

---

## Frontend: Envío de Credenciales

Para que las cookies se envíen automáticamente con cada petición, **TODAS** las llamadas `fetch` deben incluir `credentials: "include"`:

### Correcto

```typescript
// auth.service.ts
async login(data: LoginData) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // ✅ IMPORTANTE
    body: JSON.stringify(data)
  });
  return response.json();
}

// Peticiones protegidas
async getLabResults() {
  const response = await fetch(`${API_URL}/laboratory/results`, {
    credentials: "include" // ✅ IMPORTANTE
  });
  return response.json();
}
```

### Incorrecto

```typescript
// ❌ Sin credentials, las cookies NO se enviarán
fetch(`${API_URL}/laboratory/results`)
```

### Configuración CORS en Backend

El backend ya está configurado para aceptar credenciales:

```typescript
// backend/src/index.ts
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true // ✅ Permite cookies
}));
```

---

## Troubleshooting

### Error 401: "No token provided"

**Problema**: El middleware `authenticate` no encuentra el token.

**Soluciones**:
1. Verifica que hiciste login/register correctamente
2. Asegúrate de que el frontend envíe `credentials: "include"`
3. Verifica que las cookies estén habilitadas en el navegador
4. Revisa las DevTools → Application → Cookies para ver si `accessToken` está presente

### Error 403: "Insufficient privileges"

**Problema**: El usuario no tiene los privilegios necesarios.

**Soluciones**:
1. Verifica en la BD que el rol del usuario tenga el privilegio en la tabla `role_privilege`
2. Ejecuta el seed de la base de datos: `psql -d nefrovida -f backend/database/seed.sql`
3. Verifica que el privilegio esté correctamente escrito (case-sensitive)

### Las cookies no se envían

**Problema**: Las cookies se guardan pero no se envían en peticiones subsecuentes.

**Soluciones**:
1. Agrega `credentials: "include"` a **TODAS** las peticiones fetch
2. Verifica que frontend y backend estén en el mismo dominio o usa un proxy
3. En desarrollo, asegúrate de que `secure: false` en las cookies si usas HTTP
4. **IMPORTANTE**: Verifica la configuración de `sameSite` en las cookies:
   - En desarrollo con frontend/backend en puertos diferentes, usa `sameSite: 'lax'`
   - En producción con HTTPS, puedes usar `sameSite: 'strict'`
   ```typescript
   // auth.controller.ts - Configuración correcta para desarrollo
   res.cookie('accessToken', token, {
     httpOnly: true,
     secure: process.env.NODE_ENV === 'production',
     sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // ✅
     maxAge: 15 * 60 * 1000
   });
   ```
5. Si cambiaste la configuración de cookies, **debes hacer logout/login** para obtener nuevas cookies con la configuración actualizada

### Token expirado

**Problema**: El token tiene una vida útil de 15 minutos.

**Solución**: Implementa el refresh token flow (ya está el endpoint `/auth/refresh` disponible).

---

## Configuración para Producción

### Consideraciones Importantes

La configuración actual de cookies está optimizada para desarrollo local. Para producción, asegúrate de:

#### 1. Variables de Entorno

```env
NODE_ENV=production
FRONTEND_URL=https://tu-dominio-real.com
JWT_SECRET=tu-secreto-seguro-y-largo
```

#### 2. Configuración de Cookies

La configuración actual ya está preparada para cambiar automáticamente según el entorno:

```typescript
// auth.controller.ts - Ya está configurado correctamente
res.cookie('accessToken', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // ✅ true en producción
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // ✅
  maxAge: 15 * 60 * 1000
});
```

#### 3. Requisitos en Producción

- **HTTPS obligatorio**: La flag `secure: true` requiere que uses HTTPS
- **Mismo dominio o subdominio**: Con `sameSite: 'strict'`, frontend y backend deben estar en:
  - El mismo dominio: `https://miapp.com` (frontend y backend)
  - O subdominios: `https://app.miapp.com` y `https://api.miapp.com`

#### 4. Si Frontend y Backend están en Dominios Diferentes

Si en producción usas dominios completamente diferentes (ej: `https://frontend.com` y `https://api-backend.com`), necesitarás:

```typescript
sameSite: 'none', // Permite cookies cross-site
secure: true      // Obligatorio con sameSite: 'none'
```

Y configurar CORS correctamente:

```typescript
app.use(cors({
  origin: ['https://frontend.com', 'https://www.frontend.com'],
  credentials: true
}));
```

#### 5. Configuración CORS

Actualiza `FRONTEND_URL` en `.env` de producción con tu dominio real:

```typescript
// backend/src/index.ts
app.use(cors({
  origin: process.env.FRONTEND_URL, // Debe ser el dominio exacto de producción
  credentials: true
}));
```

### Checklist de Despliegue

- [ ] `NODE_ENV=production` configurado
- [ ] `FRONTEND_URL` apunta al dominio de producción
- [ ] HTTPS habilitado (certificado SSL válido)
- [ ] Cookies con `secure: true` y `sameSite` apropiado
- [ ] CORS configurado con el origin correcto
- [ ] `JWT_SECRET` seguro y diferente al de desarrollo

---

## Recursos Adicionales

- **JWT**: [jwt.io](https://jwt.io)
- **RBAC**: [NIST RBAC Model](https://csrc.nist.gov/projects/role-based-access-control)
- **Cookies httpOnly**: [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)

---

## Checklist para Nuevas Rutas

- [ ] ¿La ruta requiere que el usuario esté logueado?
  - Sí → Agrega `authenticate`
- [ ] ¿La ruta requiere privilegios específicos?
  - Sí → Agrega `requirePrivileges([...])` o `requireAnyPrivilege([...])`
- [ ] ¿El privilegio ya existe en `rbac.types.ts`?
  - No → Agrégalo al enum
- [ ] ¿El privilegio está en la base de datos?
  - No → Actualiza el seed o crea una migración
- [ ] ¿Los roles correctos tienen el privilegio asignado?
  - No → Inserta en la tabla `role_privilege`
- [ ] ¿El frontend envía `credentials: "include"`?
  - No → Agrégalo a la petición fetch

---

**Última actualización**: Noviembre 2025  
**Mantenido por**: Equipo Nefrovida
