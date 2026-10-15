# ADR 0007 — Validación, errores y contratos entre componentes

- **Estado:** Recomendada
- **Fecha:** 2026-10-14

## Contexto

`web`, `api` y `ml` intercambian datos. Si las validaciones o los tipos se duplican a mano, terminan desincronizándose.

## Alternativas

- Validación: class-validator (lo habitual en NestJS), **Zod** (los mismos esquemas sirven en el navegador y en el servidor) o ambos.
- Contratos: tipos escritos a mano, **OpenAPI generado por cada servicio** o gRPC.

## Decisión

- **Zod 4** en `packages/contracts`, compartido por `web` y `api`. **Pydantic v2** en `ml`.
- Errores HTTP en formato **`application/problem+json` (RFC 9457)**, con un campo `code` estable tomado de un catálogo.
- Cada servicio publica **OpenAPI 3.1**. Los clientes TypeScript se generan a partir de ese contrato, y la CI falla si el contrato cambió sin regenerar el cliente.

Las convenciones concretas están en [../api.md](../api.md).

## Reversibilidad

Costo bajo.
