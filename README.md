# Contactship Mini

Microservicio backend para la gestión de leads.
Permite crear leads manualmente, listarlos, obtener su detalle, generar resúmenes con IA y sincronizar leads automáticamente desde una API externa.

## Stack Tecnológico

- Node.js
- NestJS
- TypeScript
- Express
- PostgreSQL
- TypeORM
- Redis
- Bull (colas de trabajo)
- Random User Generator API
- OpenAI / IA (resumen de leads)

## Arquitectura

El proyecto sigue una arquitectura modular basada en NestJS:

```bash
src/
├── app.module.ts
├── main.ts
├── common/
│   └── guards/
│       └── api-key.guard.ts
├── leads/
│   ├── dto/
│   ├── entities/
│   ├── leads.controller.ts
│   ├── leads.service.ts
│   └── leads.module.ts
├── ai/
│   └── ai.module.ts
│   └── ai.service.ts
├── sync/
│   ├── sync.module.ts
│   ├── sync.service.ts
│   └── sync.processor.ts
├── integrations/
│   └── random-user/
│       ├── random-user.module.ts
│       ├── random-user.service.ts
│       └── random-user.mapper.ts
```

## Decisiones clave

- **CRON + Cola (Bull)**
El proceso de sincronización externa se ejecuta mediante un CRON que encola jobs.
La lógica pesada se procesa en un worker desacoplado.

- **Cache Redis**
El endpoint de detalle de lead utiliza cache para reducir acceso a base de datos.

- **Deduplicación**
Se evita la creación de leads duplicados mediante restricciones únicas en base de datos y manejo de errores (23505).

## Instalación y ejecución

**Variables de entorno**

Antes de empezar, crear un archivo `.env` en la raíz del proyecto.
Definí las claves correspondientes dependiendo del entorno de ejecución que elijas.

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=contactship

REDIS_HOST=localhost
REDIS_PORT=6379

AI_ENABLED=true
AI_API_KEY=your_api_key_here

API_KEY=super-secret-key
```

1. Instalar dependencias
```bash
npm install
```

2. Levantar servicios necesarios

- PostgreSQL
- Redis

3. Ejecutar la aplicación
```bash
npm run start:dev
```

La API estará disponible en:

```bash
http://localhost:3000
```

## Endpoints

Todos los endpoints están protegidos por la API KEY definida en el `.env`.

**Crear lead manualmente**
```bash
POST /create-lead
```

**Body:**

```bash
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan.perez@example.com",
  "phone": "+5491123456789",
  "country": "Argentina"
}
```

**Listar leads**
```bash
GET /leads
```

**Obtener detalle de un lead (con cache)**
```bash
GET /leads/:id
```

**Generar resumen con IA**
```bash
POST /leads/:id/summarize
```

Genera y persiste:

- summary
- next_action

## Sincronización externa

- Se ejecuta automáticamente cada **5 minutos**
- Obtiene usuarios desde `https://randomuser.me`
- Mapea los datos a la entidad `Lead`
- Evita duplicados
- Usa cola de trabajo (Bull)

## Inteligencia Artificial

El servicio de IA genera:

- Un resumen del lead
- Una posible acción siguiente

La lógica está desacoplada en un módulo dedicado (`AiModule`).
La integración de IA soporta una flag y un fallback determinístico en caso de que el proveedor externo no esté disponible.

## Features implementadas

- CRUD de leads
- Cache Redis
- Integración con IA
- Sincronización externa automática
- CRON + Queue
- Deduplicación
- Arquitectura modular
