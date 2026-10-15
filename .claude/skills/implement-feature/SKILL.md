---
name: implement-feature
description: Flujo completo para implementar una funcionalidad de GhostWall a partir de un requisito, en cuatro pasos (analizar, proponer un plan y esperar la aprobación, implementar con pruebas, verificar e informar). Solo se invoca manualmente.
argument-hint: '[ID de requisito o descripción]'
disable-model-invocation: true
---

# Implementar una funcionalidad

Aplica el "Procedimiento de trabajo" de `CLAUDE.md` a **$ARGUMENTS**. Esta Skill no concede permisos adicionales: cada comando sigue sujeto a `.claude/settings.json` y a las aprobaciones de Claude Code.

## Fase 1 — Analizar

Ejecutar los pasos de `/analyze-requirements` sobre `$ARGUMENTS`. Si el veredicto es **Bloqueado**, presentar las preguntas y **detenerse**. No se implementa una interpretación propia.

## Fase 2 — Proponer el plan y esperar

Presentar:

- Los requisitos y las pruebas `T-xxx` que se cubrirán y las que no.
- Los archivos a crear o modificar, por capa (`domain`/`application`/`infrastructure`/`http`, `web`, `ml`, migraciones).
- Las decisiones que se adoptan por la regla del equipo y el ADR que se crea o actualiza.
- Las pruebas nuevas y su nivel (unitaria, HTTP, integración o E2E).
- Las dependencias a instalar o los comandos que modifican el entorno, con el motivo de cada uno.
- Los riesgos y lo que queda fuera del alcance.

**Detenerse y esperar la aprobación explícita del usuario.** Si el usuario cambia el alcance, actualizar el plan y volver a pedir aprobación.

## Fase 3 — Implementar

- Implementar solo el alcance aprobado, siguiendo las reglas de `.claude/rules/` del área.
- Primero las pruebas que fijan el comportamiento esperado, con los IDs citados. Los valores esperados salen de los requisitos.
- Actualizar `docs/requirements/traceability.md`, `docs/database.md` y los ADR que correspondan.
- Si aparece algo no previsto (otra AMB, una dependencia o un cambio de diseño), parar y consultar antes de seguir.

## Fase 4 — Verificar e informar

Ejecutar `/run-tests` sobre los archivos cambiados y cerrar con:

```
## Qué se hizo
## Verificaciones (tabla de /run-tests)
## Pendiente / no cubierto
## Archivos cambiados
```

Los cambios quedan **sin commitear**. El commit y el push los hace el integrante (CLAUDE.md, "Prohibido").

## Criterios de finalización

- Hubo aprobación explícita del plan antes del primer cambio de código.
- Las pruebas nuevas citan sus IDs y la trazabilidad está actualizada.
- `/run-tests` se ejecutó y su tabla figura en el informe, con todo lo que no se pudo ejecutar justificado.
- No se hizo commit, push, merge ni ninguna publicación.
