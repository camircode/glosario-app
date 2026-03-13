# 📚 Glosario de Informática

Una aplicación full-stack para gestionar un glosario de términos de informática con diseño de libreta y navegación tipo carrusel.

## 🚀 Tecnologías

- **Backend**: Hono + Bun
- **Frontend**: Astro + React + TailwindCSS
- **Base de datos**: PostgreSQL
- **Autenticación**: Better-Auth
- **Despliegue**: Docker Compose

## 📋 Requisitos

- Docker y Docker Compose
- O alternativamente: Bun y pnpm instalados

## 🛠️ Instalación y Uso

### Usando Docker Compose (Recomendado)

1. Clonar el repositorio y navegar al directorio:
```bash
cd glosaio-app
```

2. Iniciar todos los servicios:
```bash
docker-compose up -d
```

3. Ejecutar migraciones de la base de datos:
```bash
docker-compose exec backend bun run db:migrate
```

4. Crear usuario administrador (primera vez):
```bash
docker-compose exec backend bun run src/scripts/create-admin.ts
```

5. Acceder a la aplicación:
   - Glosario público: http://localhost:4321
   - Panel admin: http://localhost:4321/admin
   - API: http://localhost:3000

### Desarrollo Local

#### Backend
```bash
cd backend
bun install
bun run db:migrate
bun run dev
```

#### Frontend
```bash
cd frontend
pnpm install
pnpm run dev
```

## 🔐 Credenciales por defecto

- **Email**: admin@glosario.com
- **Contraseña**: admin123

> ⚠️ **Importante**: Cambia estas credenciales en producción editando el archivo `.env`

## 🎨 Características

### Público
- 📖 Visualización de términos en orden alfabético
- 📄 Cada término en su propia página tipo libreta
- 🖼️ Soporte para imágenes
- ⌨️ Navegación con flechas del teclado
- 📱 Diseño responsive

### Administración
- 🔐 Autenticación segura
- ➕ Crear nuevos términos
- ✏️ Editar términos existentes
- 🗑️ Eliminar términos
- 🖼️ Agregar URLs de imágenes

## 🐳 Servicios Docker

| Servicio | Imagen | Puerto | Descripción |
|----------|--------|--------|-------------|
| postgres | postgres:18-alpine | 5432 | Base de datos |
| backend | oven/bun:latest | 3000 | API Hono |
| frontend | node:lts-slim | 4321 | Astro SSR |

## 📁 Estructura del proyecto

```
glosario-app/
├── docker-compose.yml
├── .env
├── backend/
│   ├── src/
│   │   ├── db/
│   │   ├── routes/
│   │   └── lib/
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── layouts/
    │   ├── pages/
    │   └── lib/
    └── package.json
```

## 🔧 Variables de entorno

### Backend (.env)
- `DATABASE_URL`: URL de conexión a PostgreSQL
- `BETTER_AUTH_SECRET`: Clave secreta para JWT
- `BETTER_AUTH_URL`: URL base del backend

### Frontend (.env)
- `PUBLIC_API_URL`: URL de la API

### Docker Compose (.env raíz)
- `DB_USER`: Usuario de PostgreSQL
- `DB_PASSWORD`: Contraseña de PostgreSQL
- `DB_NAME`: Nombre de la base de datos
- `ADMIN_EMAIL`: Email del administrador
- `ADMIN_PASSWORD`: Contraseña del administrador

## 📝 API Endpoints

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | /api/terms | Listar todos los términos | No |
| GET | /api/terms/:id | Obtener un término | No |
| POST | /api/terms | Crear término | Sí |
| PUT | /api/terms/:id | Actualizar término | Sí |
| DELETE | /api/terms/:id | Eliminar término | Sí |
| POST | /api/auth/sign-in/email | Iniciar sesión | No |
| POST | /api/auth/sign-out | Cerrar sesión | Sí |

## 🛑 Detener la aplicación

```bash
docker-compose down
```

Para eliminar también los volúmenes (⚠️ borra todos los datos):
```bash
docker-compose down -v
```