# ADR 0010 — Tareas asíncronas con BullMQ sobre Redis

- **Estado:** Recomendada
- **Fecha:** 2026-10-14
- **Requisitos:** RF-027, RF-037, RF-042, RF-050

## Contexto

Varias reglas necesitan procesamiento diferido o con reintentos:

- registrar IGNORO a las 72 h (CUU02 4.a);
- recalcular el score ante cada evento (CUU04 RN1);
- reintentar cuando falla el procesamiento (postcondición de CUU04);
- escribir en el registro de auditoría (según cómo se resuelva AMB-15).

## Alternativas

| Alternativa | Comentario |
|---|---|
| RabbitMQ | Un servicio más para operar |
| pg-boss (cola sobre PostgreSQL) | Sin infraestructura extra, pero carga la base de datos |
| **BullMQ** (6.3.x en npm al 2026-10-14) | Redis ya forma parte del stack de D4; soporta trabajos diferidos (72 h) y reintentos con *backoff* |

## Decisión

BullMQ sobre Redis. Los *workers* se ejecutan dentro de `api` o como un proceso aparte con el mismo código.

## Reversibilidad

Costo medio si las colas se usan detrás de una interfaz propia.
