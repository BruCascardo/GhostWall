---
name: run-tests
description: Elige y ejecuta las verificaciones y suites de prueba de GhostWall que corresponden a los archivos cambiados (verify, integración con Testcontainers, end-to-end con Playwright, hook de Claude Code) e informa los resultados con el formato del proyecto. Usar al terminar un cambio o cuando se pide correr las pruebas.
argument-hint: '[rutas o "todo"]'
---

# Ejecutar las pruebas pertinentes

Solo se usan scripts que existen en `package.json` (CLAUDE.md). Esta Skill no instala dependencias, navegadores ni imágenes. Si falta algo, lo informa y pide aprobación.

## 1. Determinar el alcance

Si `$ARGUMENTS` trae rutas, usar esas. Si dice `todo`, ejecutar todas las filas. Si viene vacío, tomar los archivos de `git status --short`, que incluye los no versionados.

## 2. Elegir los comandos

`npm run verify` (que incluye las pruebas del hook de `.claude/hooks/`) se ejecuta **siempre**, salvo que el cambio toque solo documentación (`*.md` fuera de `.claude/`). En ese caso alcanza con `npm run format:check`.

| Si cambió…                                                                                                                                                | Agregar                                                   |
| --------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `apps/api/src/db/**`, `apps/api/drizzle/**`, `apps/api/test/integration/**`, `apps/api/test/support/**` o cualquier archivo de `apps/api` que use la base | `npm run test:integration` (requiere Docker en ejecución) |
| `apps/web/**`                                                                                                                                             | `npm run test:e2e` (requiere el Chromium de Playwright)   |
| `package.json`, `package-lock.json`, `tsconfig*.json`, `eslint.config.mjs` o `.github/workflows/**`                                                       | Todas las suites: `test:integration` y `test:e2e`         |

## 3. Comprobar los requisitos previos sin modificarlos

- **Docker:** `docker info --format '{{.ServerVersion}}'`. Si falla, no ejecutar la suite de integración y anotarla como "no ejecutada: Docker no disponible".
- **Chromium de Playwright:** si `test:e2e` falla con un mensaje de navegador no instalado, anotarlo. **No** ejecutar `npx playwright install` sin aprobación, porque descarga unos 120 MB.

## 4. Ejecutar

Los comandos van en orden y de a uno: primero `verify`, porque es más barato y detecta la mayoría de los errores. Una falla no detiene las demás suites, salvo que sea de instalación o de build. Si un comando inicia un servidor, al terminar comprobar que el puerto quedó libre (CLAUDE.md).

No se reintenta una prueba fallida para que "pase", ni se desactivan, saltean o marcan con `.skip`/`.only` pruebas, ni se toca `asegurarBaseDePruebas`.

## 5. Informar

```
## Verificaciones
| Comando | Resultado | Detalle |
|---|---|---|
| npm run verify | ✅ Pasó / ❌ Falló / ⏭️ No ejecutado | n pruebas; primer error o motivo |
## Fallas
- Archivo:línea, mensaje y causa probable (sin "arreglar" pruebas para que pasen)
## No ejecutado
- Suite: motivo y cómo ejecutarla
```

## Criterios de finalización

- Cada fila de la tabla de selección que aplica tiene su comando ejecutado o justificado como no ejecutado.
- Los resultados citan la salida real (cantidad de pruebas y primer error). Nada se da por pasado sin haberlo ejecutado.
- No quedó ningún servidor ni contenedor de prueba levantado por esta Skill.
