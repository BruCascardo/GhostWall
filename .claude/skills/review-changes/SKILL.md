---
name: review-changes
description: Revisa los cambios locales de GhostWall (diff y archivos nuevos) contra los requisitos, las reglas de arquitectura, la seguridad y protección de datos, las pruebas y la documentación, y entrega hallazgos ordenados por severidad. Solo lectura; no corrige nada salvo que se pida después.
argument-hint: '[rama o rutas; vacío = cambios sin commitear]'
---

# Revisar cambios

**Solo lectura:** no edita archivos ni ejecuta comandos que cambien el repositorio o el entorno. Para corregir, se pide aparte.

## 1. Reunir el cambio

- Vacío: `git status --short`, `git diff` y `git diff --staged`. Los archivos nuevos (`??`) se leen completos, porque no aparecen en el diff.
- Una rama: `git diff main...<rama>` y `git log --oneline main..<rama>`.
- Rutas: `git diff -- <rutas>` más los archivos nuevos dentro de esas rutas.

Leer el contexto necesario de cada archivo tocado, no solo las líneas cambiadas.

## 2. Revisar con esta lista

1. **Requisitos:** aplicar `/analyze-requirements` (o sus pasos) sobre el cambio. Implementar una ambigüedad abierta sin decisión documentada se informa como bloqueante.
2. **Arquitectura** (`docs/architecture.md#reglas-de-dependencia` y las reglas de `.claude/rules/`):
   - `domain` sin imports de frameworks.
   - Ningún módulo accede a las tablas de otro.
   - Las integraciones van detrás de un puerto con su implementación falsa.
   - `ml` sin estado.
3. **Seguridad y datos** (CLAUDE.md, "Seguridad y datos"):
   - Nada de nombres, emails, contraseñas ni tokens en texto plano en la base o en los logs.
   - Filtro por la empresa de la sesión (RNF-001).
   - Sin secretos en archivos versionados.
   - Sin captura de credenciales de simulación (AMB-09).
   - Errores en `problem+json` sin detalles internos.
   - Workflows con permisos mínimos.
4. **Pruebas:** ¿cada comportamiento nuevo tiene una prueba que cite su ID? ¿Los valores esperados son independientes del código? ¿Se actualizó `traceability.md`? ¿Hay `.skip`, `.only` o protecciones desactivadas?
5. **Base de datos:** ¿se editó una migración existente? ¿La migración nueva se generó con `db:generate`? ¿Se actualizó `docs/database.md`?
6. **Documentación y decisiones:** si cambió una decisión técnica, ¿hay ADR? Si cambia lo aprobado, ¿se actualizó `cambios-a-la-documentacion.md`? ¿Hay comandos o rutas documentados que ya no existen?
7. **Corrección:** errores de lógica, casos límite, promesas no esperadas, manejo de errores y concurrencia.

Antes de informar un hallazgo, confirmarlo en el código: indicar el archivo y la línea, y descartar lo que no se pueda sostener.

## 3. Informar

```
## Resumen
Qué cambia, en 2 o 3 líneas.
## Hallazgos
| # | Severidad | Archivo:línea | Problema | Por qué importa (requisito/regla) | Sugerencia |
Severidades: Bloqueante (viola un requisito, una regla de seguridad o una AMB abierta) · Alta (error probable) · Media · Baja (estilo o claridad).
## Verificaciones recomendadas
Comandos de /run-tests que corresponden (esta Skill no los ejecuta salvo que se pida).
```

## Criterios de finalización

- Se revisaron todos los archivos cambiados y nuevos del alcance.
- Cada hallazgo tiene una ubicación concreta y la regla o requisito que lo sustenta. Si no hay hallazgos, se dice explícitamente.
- No se modificó ningún archivo.
