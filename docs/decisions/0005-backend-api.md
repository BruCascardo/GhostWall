# ADR 0005 — Backend `api` con NestJS y módulos por capas

- **Estado:** Recomendada
- **Fecha:** 2026-10-14
- **Requisitos:** RF-020, RNF-005, RNF-013

## Contexto

D4 asigna a Node.js con TypeScript los servicios transaccionales. Tres estudiantes, con asistencia de Claude Code, necesitan producir código con una estructura uniforme: módulos, control de acceso por rol y documentación de la API.

## Alternativas

| Alternativa | Ventajas | Desventajas |
|---|---|---|
| Express | Muy conocido, mínimo | Sin estructura: cada persona organiza a su modo |
| Fastify | Rápido, buen tipado | Hay que definir la estructura y la inyección de dependencias a mano |
| **NestJS 12** | Módulos, inyección de dependencias, *guards* para RBAC, integración con OpenAPI y utilidades de testing | Más conceptos para aprender (decoradores, DI) |

Verificado en npm el 2026-10-14: `@nestjs/core` 12.1.3. Según las notas de la v12.0.0, requiere Node ≥ 20.19 o ≥ 22.12, compatible con [ADR 0002](0002-versiones-de-runtime.md).

## Decisión

NestJS 12. Cada módulo de negocio se organiza en capas: `domain` (reglas puras, sin frameworks), `application` (casos de uso), `infrastructure` (persistencia y clientes externos) y `http` (controladores y DTOs). Las dependencias apuntan hacia `domain`. Más detalle en [../architecture.md](../architecture.md).

## Reversibilidad

Costo alto una vez que exista código. Si `domain` y `application` no dependen de NestJS, migrar se limita a la capa `http`.
