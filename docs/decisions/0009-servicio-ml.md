# ADR 0009 — Servicio `ml` con FastAPI, sin estado y con proveedores intercambiables

- **Estado:** Recomendada. La elección del proveedor de LLM real sigue pendiente (P10).
- **Fecha:** 2026-10-14
- **Requisitos:** RF-022, RF-033, RF-037 a RF-039, RNF-010; AMB-13, AMB-27

## Contexto

D4 asigna a Python (FastAPI) el triage NLP y el motor de scoring. La máquina relevada no tiene GPU, por lo que entrenar BERT/RoBERTa localmente no es práctico. El proveedor de LLM no está definido.

## Decisión

- **FastAPI + Pydantic v2**, con dependencias gestionadas por uv ([ADR 0001](0001-monorepo-y-gestores.md)).
- **Sin estado:** `ml` no accede a la base de datos. Recibe datos de `api` y devuelve clasificaciones, scores o contenido generado. Así hay un solo dueño del esquema ([ADR 0006](0006-persistencia.md)).
- **Proveedores detrás de interfaces:** `TextGenerator` (generación de simulaciones) y `Classifier` (triage). Cada una tiene una implementación **falsa y determinista** para pruebas y demos sin red. Las implementaciones reales se agregan cuando se resuelvan P10 y P11.
- Las dependencias pesadas (`torch`, `transformers`) se agregan recién cuando empiece el trabajo de ML.

## Reversibilidad

Costo bajo: las interfaces aíslan el proveedor.
