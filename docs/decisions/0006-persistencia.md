# ADR 0006 — PostgreSQL 18 con Drizzle ORM y migraciones SQL

- **Estado:** Recomendada
- **Fecha:** 2026-10-14
- **Requisitos:** RF-040, RNF-001, RNF-014

## Contexto

D4 define PostgreSQL como base transaccional y un modelo de datos de 13 tablas (D4 §8.2–8.3, D8). Hace falta un mecanismo de acceso tipado, migraciones versionadas y aislamiento entre empresas.

Datos verificados el 2026-10-14:

- postgresql.org: PostgreSQL 18 (18.6) tiene soporte hasta noviembre de 2030.
- npm: la etiqueta `latest` de `prisma` apunta a `8.0.0-rc.22`, una versión candidata (la etiqueta `prev` es 7.10.0).
- npm: `drizzle-orm` 0.45.4 y `drizzle-kit` 0.31.11 siguen en versiones 0.x.

## Alternativas

| Alternativa | Ventajas | Desventajas |
|---|---|---|
| Prisma 7 | Excelente documentación y herramientas | `npm install prisma` instala hoy una versión RC; requiere generar código; RLS más trabajoso |
| **Drizzle** | Esquema en TypeScript muy cercano al SQL y al DER; migraciones SQL legibles; soporte de Row-Level Security; sin paso de generación | Sigue en 0.x: hay que fijar la versión exacta |
| TypeORM | Integración clásica con NestJS | Mantenimiento y tipado más débiles |

## Decisión

- PostgreSQL 18.
- Drizzle ORM y drizzle-kit con versiones exactas.
- El servicio `api` es el **único** dueño del esquema y de las migraciones.
- Aislamiento por empresa en la capa de aplicación, con Row-Level Security como segunda barrera.

La estrategia de migraciones está en [../database.md](../database.md).

## Reversibilidad

Costo medio. Las migraciones son SQL, así que se conservan aunque cambie el ORM.
