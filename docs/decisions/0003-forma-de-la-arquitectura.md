# ADR 0003 — Forma de la arquitectura

- **Estado:** Aceptada (2026-10-14; ver [Aprobación](#aprobación))
- **Fecha:** 2026-10-14
- **Requisitos:** RNF-013, AMB-03, P3

## Contexto

D4 §13.1 y el diagrama de despliegue definen 4 microservicios (Tenants & RBAC en Node.js, NLP en FastAPI, Risk Scoring en Python y Auditoría en Node.js con el SDK de Fabric) sobre Kubernetes. Las restricciones relevadas son:

- quedan unas 9 semanas hasta RA-004 (18/12/2026) y el repositorio no tiene código;
- la máquina relevada tiene 7,9 GB de RAM, un Intel i3-7020U de 2 núcleos y no tiene GPU dedicada.

## Alternativas

| | A. Lo que dice D4 | B. Recomendada | C. Un solo backend en Python |
|---|---|---|---|
| Descripción | 4 servicios independientes | 2 servicios: `api` (Node: módulos de tenants, RBAC, auditoría y demás) y `ml` (Python: NLP y scoring) | Todo en FastAPI |
| Fidelidad a D4 | Total | Mantiene lenguajes y responsabilidades; cada servicio de D4 pasa a ser un módulo | Abandona Node.js + TypeScript |
| Complejidad | Alta (red, despliegues, trazas distribuidas) | Media | Baja |
| Costo de evolucionar | — | Medio: un módulo con límites claros se separa como servicio | Alto |

## Decisión

**B.** Dentro de cada servicio, los módulos se comunican solo mediante interfaces públicas o eventos, nunca accediendo a las tablas de otro módulo. Esto preserva la posibilidad de extraer los microservicios de D4. Las reglas de dependencia están en [../architecture.md](../architecture.md).

## Aprobación

Se adoptó la opción recomendada según la regla del equipo del 2026-10-14 (ver [README.md](README.md#estados)).

**Motivo:** con el plazo y el hardware disponibles, 4 servicios independientes multiplican el costo de despliegue, prueba y depuración sin aportar funcionalidad evaluable. La opción B conserva la separación lógica que propone D4.

## Impacto en la documentación aprobada

| Documento | Qué cambia |
|---|---|
| D4 §13.1 (Diseño arquitectónico detallado) | Pasa de "microservicios" a "dos servicios con módulos internos"; los 4 microservicios se vuelven módulos |
| D4 §14.2 y diagrama de despliegue (D9, página "Despliegue") | Dos nodos de aplicación en lugar de cuatro |
| D4 §5.2.1 (Stack) | Se mantienen los lenguajes; cambia la granularidad del despliegue |
| D4 §10.4 (GSC "Procesamiento distribuido" = 5) | El valor podría revisarse. No se modifica sin decisión del equipo, porque cambia el cálculo de puntos de función |
