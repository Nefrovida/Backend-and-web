# Nefrovida Backend and web implementation

## Descripción

Servidor y aplicación web para Nefrovida, solución para manejar información de pacientes, comunidad, y laboratorio.

## Tabla de Contenidos

- [Instalación](#instalación)
- [Uso](#uso)
- [Estándares de Commits](#estándares-de-commits)
- [Estrategia de Branching](#estrategia-de-branching)
- [Contribución](#contribución)
- [Changelog](#changelog)

## Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd Backend-and-web

# Instalación de dependencias backend
cd backend
npm install

# Instalación de dependencias frontend
cd ../frontend
npm install
```

## Uso

```bash
# Iniciar servidor
cd backend
npm start

# Iniciar servidor frontend
cd frontend
npm start
```

## Crear base de datos
```bash
# Iniciar servidor
cd backend
npx prisma generate
npx prisma db push

# Si hacen cambios
npx prisma db migrate
npx prisma db push

# Actualizar typescript con los tipos de la base de datos
npx prisma generate
```

## Estándares de Commits

Este proyecto sigue [Conventional Commits](https://www.conventionalcommits.org/).

Para detalles completos, consulta [CONTRIBUTING.md](CONTRIBUTING.md#estándares-de-commits).

**Formato básico:**

```
<type>[optional scope]: <description>
```

**Tipos principales:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Ejemplos:**

```bash
git commit -m "feat: add user authentication"
git commit -m "fix(api): resolve timeout error"
git commit -m "docs: update installation guide"
```

## Estrategia de Branching

Este proyecto utiliza **Git Flow**.

Para detalles completos, consulta [CONTRIBUTING.md](CONTRIBUTING.md#estrategia-de-branching).

**Branches principales:**

- `main` - Producción
- `develop` - Integración

**Branches de soporte:**

- `feature/<name>` - Nuevas funcionalidades
- `bugfix/<name>` - Corrección de bugs
- `hotfix/<name>` - Fixes urgentes en producción
- `release/<version>` - Preparación de releases

**Workflow básico:**

```bash
git checkout develop
git checkout -b feature/my-feature
git commit -m "feat: implement my feature"
git push origin feature/my-feature
# Crear Pull Request
```

## Changelog

Ver [CHANGELOG.md](CHANGELOG.md) para la lista completa de cambios por versión.


## arquitectura

(esta es mi interpretación de MVC + clean architecture, cámbienla como lo vean necesario)
Controllers (src/controller/)

Handle HTTP requests/responses
Validate input (or delegate to middleware)
Call services
Return appropriate HTTP status codes
No business logic, no database access

Services (src/service/)

All business logic lives here
Orchestrate Prisma operations
Handle transactions
Enforce business rules (e.g., "can't delete role if users have it")
Reusable across different controllers
This is where Prisma client gets used

Middleware (src/middleware/)

Authentication, authorization
Request validation
Error handling

Utils (src/util/)

Pure helper functions (JWT, password hashing, date formatting)
No business logic, no database access