# ADR 0014 — Postergar Feast

- **Estado:** Aceptada (2026-10-14; ver [Aprobación](#aprobación))
- **Fecha:** 2026-10-14
- **Requisitos:** RF-038; RNF-014

## Contexto

D4 almacena `perfil_riesgo` en el Feast Feature Store con Redis. Feast 0.67.0 (PyPI, 2026-10-13) solo declara compatibilidad con Python 3.10, mientras que el proyecto usa 3.13 ([ADR 0002](0002-versiones-de-runtime.md)). El volumen de datos de un prototipo no justifica su infraestructura.

## Decisión

`perfil_riesgo` es una tabla de PostgreSQL, con Redis como caché opcional, detrás de una interfaz `FeatureRepository`. Feast se podrá incorporar después como otra implementación de esa interfaz.

## Aprobación

Se adoptó la opción recomendada según la regla del equipo del 2026-10-14 (ver [README.md](README.md#estados)).

**Motivo:** evita una dependencia con compatibilidad declarada dudosa y una infraestructura extra que no mejora ningún requisito verificable del prototipo.

## Impacto en la documentación aprobada

| Documento | Qué cambia |
|---|---|
| D4 §8.2.2 (capa analítica) | `perfil_riesgo` se almacena en PostgreSQL en el prototipo |
| D4 §13.1 y diagrama de despliegue (D9) | Se elimina el nodo Feast; Redis se mantiene |
| CUU04 (D4 §8.4.6) | La precondición de sistema "Feature Store (Feast) operativo" pasa a "almacén de features operativo" |
