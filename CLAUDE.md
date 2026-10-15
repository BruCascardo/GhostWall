# GhostWall

Plataforma SaaS de ciberseguridad centrada en el factor humano: simulaciones de phishing generadas con IA, triage semántico de correos reportados, scoring dinámico de riesgo por empleado, capacitación adaptativa, respuesta automatizada y auditoría inmutable. Es el proyecto final de Ingeniería en Sistemas de Información (UTN FRRO, 2026) de Cascardo, Giacomelli y Munné. **El prototipo se entrega el 18/12/2026.**

## Estado actual

- El entorno y las suites de pruebas están configurados. `api`, `web` y `ml` son **esqueletos**: del dominio solo existen la validación del CUIT y la tabla `empresa`.
- Las decisiones técnicas están en [docs/decisions/](docs/decisions/README.md). **Regla del equipo:** si una decisión queda pendiente y existe una opción recomendada, se adopta la recomendada y se documenta qué se eligió, por qué y qué cambia en la documentación aprobada (sección *Impacto* del ADR y [docs/decisions/cambios-a-la-documentacion.md](docs/decisions/cambios-a-la-documentacion.md)).
- Las preguntas abiertas sobre requisitos están en [docs/requirements/ambiguities.md](docs/requirements/ambiguities.md). Las que no tienen una opción recomendada no se resuelven por cuenta propia: consultá.

## Fuentes de verdad

| Tema | Dónde |
|---|---|
| Requisitos (IDs RF, RNF, RA) | [docs/requirements/catalog.md](docs/requirements/catalog.md) — los documentos originales prevalecen ([inventario](docs/requirements/README.md)) |
| Ambigüedades y preguntas | [docs/requirements/ambiguities.md](docs/requirements/ambiguities.md) |
| Arquitectura y reglas de dependencia | [docs/architecture.md](docs/architecture.md) |
| Decisiones técnicas y versiones | [docs/decisions/](docs/decisions/README.md) |
| Modelo de datos y migraciones | [docs/database.md](docs/database.md) |
| Convenciones de API y errores | [docs/api.md](docs/api.md) |
| Entorno, instalación y comandos | [docs/development.md](docs/development.md) |
| Pruebas y trazabilidad | [docs/testing.md](docs/testing.md), [docs/requirements/traceability.md](docs/requirements/traceability.md) |

## Stack

Resumen; las versiones y el estado de cada elección están en los ADR. *(R)* = Recomendada; *(A)* = Aceptada.

- **web:** Next.js 16 + React + Tailwind CSS 4 + ECharts — ADR 0004 (R)
- **api:** NestJS 12 + TypeScript 6.0 sobre Node 24 LTS — ADR 0002, 0005 (R)
- **Datos:** PostgreSQL 18 + Drizzle ORM — ADR 0006 (R)
- **ml:** Python 3.13 + FastAPI, gestionado con uv — ADR 0002, 0009 (R)
- **Colas:** BullMQ sobre Redis — ADR 0010 (R)
- **Auditoría:** cadena de hashes en PostgreSQL detrás de `AuditLedger` — ADR 0013 (A)
- **Features de riesgo:** tabla en PostgreSQL detrás de `FeatureRepository`; sin Feast — ADR 0014 (A)
- **Seudonimización:** HMAC-SHA-256 por empresa; email cifrado — ADR 0015 (A)
- **Identidad:** Keycloak como proveedor OIDC local — ADR 0008 (A)
- **Entorno:** Docker Compose, sin Kubernetes local — ADR 0011 (A)
- **Forma:** dos servicios como monolitos modulares — ADR 0003 (A)

## Estructura

El detalle y lo que todavía no existe están en [docs/architecture.md](docs/architecture.md#estructura-del-repositorio).

```
apps/web (Next.js)   apps/api (NestJS)   services/ml (FastAPI + uv)   infra/compose   docs/
```

## Comandos

Desde la raíz (lista completa en [docs/development.md](docs/development.md#comandos)):

- `npm run verify` — formato, lint, tipos, build y pruebas unitarias de JS/TS y Python. **Ejecutalo antes de dar un cambio por terminado.**
- `npm run test:integration` (requiere Docker) y `npm run test:e2e` (requiere el Chromium de Playwright) — ejecutalos cuando el cambio afecte la base de datos o la interfaz.
- `npm run lint:fix`, `npm run format`, `npm run ml:format` — correcciones automáticas.
- `npm run dev:api` / `dev:web` / `dev:ml` — modo desarrollo.
- `npm run infra:up` / `infra:down` / `infra:ps` — servicios locales (requieren `.env` y Docker Desktop).

Para verificar, compilar y probar usá solo los scripts de `package.json`: no inventes scripts ni comandos equivalentes. Las excepciones son los comandos de preparación documentados en `docs/` (por ejemplo `npx playwright install chromium`, que requiere aprobación) y los de diagnóstico de solo lectura (`docker info`, `git status`). Los comandos `ml:*` requieren `uv` en el PATH.

**Pruebas:** las de integración solo pueden usar la base descartable de Testcontainers; nunca apuntes una prueba a la base de desarrollo ni desactives `asegurarBaseDePruebas` ([docs/testing.md](docs/testing.md#base-de-datos-de-pruebas)). Si iniciás un servidor de desarrollo para una verificación, detenelo identificándolo **por el puerto** que escucha, y comprobá que el puerto quedó libre.

## Convenciones

- **Idioma:** documentación, nombres de dominio e interfaz en español; identificadores técnicos genéricos (`domain`, `application`, `http`) en inglés.
- **Trazabilidad:** citá los IDs de requisito (`RF-xxx`) en las pruebas y en las descripciones de los cambios.
- Codificación UTF-8 y finales de línea LF ([.editorconfig](.editorconfig)).

**Reglas por área** en [.claude/rules/](.claude/rules/). Se cargan solas al tocar archivos del área:

| Regla | Cubre |
|---|---|
| [api.md](.claude/rules/api.md) | `apps/api/src/**`: capas, puertos, `problem+json`, filtro por empresa |
| [database.md](.claude/rules/database.md) | Esquema y migraciones de Drizzle |
| [web.md](.claude/rules/web.md) | `apps/web/**` |
| [ml.md](.claude/rules/ml.md) | `services/ml/**` |
| [testing.md](.claude/rules/testing.md) | Pruebas unitarias, HTTP, de integración y end-to-end |
| [infra-ci.md](.claude/rules/infra-ci.md) | `.github/`, `infra/`, `.env.example` y la configuración de Claude Code |

**Skills del proyecto:**

- `/analyze-requirements`: qué requisitos y AMB afecta un cambio.
- `/implement-feature`: flujo completo, con aprobación del plan.
- `/run-tests`: elegir y ejecutar las pruebas.
- `/review-changes`: revisar el diff.

Uso y configuración compartida en [docs/claude-code.md](docs/claude-code.md).

## Seguridad y datos

- **Nunca** persistas ni escribas en logs nombres, emails, contraseñas o tokens en texto plano (RNF-002, RNF-006). Las credenciales capturadas en una simulación no se guardan (AMB-09 sigue abierta: no implementes su captura sin una decisión).
- Todo acceso a datos se filtra por la empresa de la sesión, nunca por un parámetro del cliente (RNF-001).
- Los secretos van en `.env`, que nunca se versiona; solo se versiona `.env.example`, sin valores reales.
- Usá solo datos de prueba sintéticos.
- El repositorio de GitHub es **público**. Los documentos originales de `docs/` **no se versionan** ([ADR 0016](docs/decisions/0016-documentos-en-repo-publico.md)).
- No modifiques los documentos originales de la cátedra ni de las entregas (`docs/*Entrega/`, `docs/Artefactos/`, `docs/Cosas Generales/`).

## Procedimiento de trabajo

1. Leé el requisito y su estado en el catálogo; si tiene una ambigüedad abierta, consultá antes de implementar.
2. Explicá el plan y esperá la aprobación para cambios relevantes, instalaciones o comandos que modifiquen el entorno.
3. Implementá solo el alcance aprobado, con pruebas que citen los IDs.
4. Ejecutá las verificaciones que correspondan (`/run-tests`). Como mínimo `npm run verify`, más integración o end-to-end si el cambio toca la base o la interfaz. No afirmes que algo funciona sin haberlo ejecutado.
5. Si una decisión técnica cambia, actualizá o creá el ADR correspondiente.

**Informe al terminar (obligatorio):**

- Tabla de los comandos ejecutados, con su resultado real (cantidad de pruebas, primer error).
- Qué no se ejecutó y por qué (por ejemplo, Docker apagado).
- Qué quedó pendiente.

## Prohibido

- `git commit`, `git push`, `git merge`, `git rebase`, `git cherry-pick`, `git pull` y cualquier operación que publique, integre o reescriba la historia de Git.
- Crear Pull Requests, releases o publicaciones (`gh`, `npm publish`, `docker push`) y desplegar.
- Comandos destructivos: descartar cambios del usuario (`git reset --hard`, `git clean`, `git checkout -- .`), borrar archivos del usuario o eliminar bases de datos y volúmenes existentes.

Los integrantes del equipo hacen sus propios commits y pushes. Además de esta instrucción, [.claude/settings.json](.claude/settings.json) tiene reglas `deny` y un hook que bloquea estos comandos. Ninguna de las dos es una garantía absoluta: ver los límites en [docs/claude-code.md](docs/claude-code.md#límites-de-las-protecciones). No intentes esquivarlas con otras formas del comando, scripts o subprocesos.
