---
name: analyze-requirements
description: Identifica los requisitos de GhostWall (RF, RNF, RA), las ambigüedades (AMB) y las pruebas (T-xxx) que afecta un cambio, una funcionalidad o un conjunto de archivos, y dice si se puede implementar sin consultar al equipo. Usar antes de implementar o al revisar un cambio. Solo lectura.
argument-hint: '[descripción del cambio, ID de requisito o rutas]'
---

# Analizar requisitos afectados

Objetivo: saber qué requisitos toca **$ARGUMENTS** y si hay algo bloqueante antes de escribir código. **Solo lectura:** esta Skill no modifica archivos ni ejecuta comandos que cambien el entorno.

## Pasos

1. **Delimitar el cambio.** Si `$ARGUMENTS` está vacío, usar `git status --short` y `git diff --stat` para ver qué cambió. Si son rutas, ubicar el módulo con la tabla "Módulos previstos de api" de `docs/architecture.md`.
2. **Buscar los requisitos** en `docs/requirements/catalog.md`, por ID, por caso de uso (CUUxx) o por palabras clave del dominio. Anotar el **estado** de cada uno según las convenciones de `docs/requirements/README.md`.
3. **Buscar las ambigüedades** que citan esos IDs, entidades o casos de uso en `docs/requirements/ambiguities.md`. Separar las **abiertas** de las resueltas (y por qué ADR).
4. **Revisar decisiones:** buscar en `docs/decisions/` los ADR que afectan el área. Para las entidades, revisar también la sección "Discrepancias y huecos" de `docs/database.md`.
5. **Buscar las pruebas:** las filas de `docs/requirements/traceability.md` que cubren esos requisitos, con su estado (implementada, lista para especificar o bloqueada).
6. **Consultar los documentos originales solo si hace falta,** porque prevalecen sobre el catálogo: inventario en `docs/requirements/README.md`. Si no están en la máquina (no se versionan, ADR 0016), decirlo.

## Resultado

```
## Requisitos afectados
| ID | Resumen | Estado | Fuente |
## Ambigüedades
| AMB | Abierta/Resuelta | ¿Tiene opción recomendada? | Impacto en este cambio |
## Decisiones aplicables
- ADR xxxx — qué condiciona
## Pruebas de trazabilidad
| T-xxx | Estado | Qué habría que agregar o actualizar |
## Veredicto
Implementable / Implementable con decisión documentada / Bloqueado: requiere consulta
Preguntas para el equipo: …
```

## Criterios de finalización

- Cada requisito citado existe en el catálogo, con el ID exacto. No se inventan IDs.
- Toda AMB abierta que afecte el cambio figura en el resultado.
- Si una AMB abierta **no** tiene opción recomendada, el veredicto es "Bloqueado" y se formulan las preguntas (CLAUDE.md). Si tiene una opción recomendada, se indica que, por la regla del equipo, se adopta y se documenta en un ADR y en `docs/decisions/cambios-a-la-documentacion.md`.
- No se modificó ningún archivo.
