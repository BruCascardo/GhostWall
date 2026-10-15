# Estrategia de pruebas

Herramientas justificadas en [ADR 0012](decisions/0012-calidad-configuracion-ci.md). Relación requisito → prueba en [requirements/traceability.md](requirements/traceability.md).

## Niveles y suites

| Nivel | Dónde | Herramienta | Dependencias externas | Comando (desde la raíz) |
|---|---|---|---|---|
| Unitaria | `apps/api/src/**/*.spec.ts`, `apps/api/test/support/**/*.spec.ts` | Vitest (proyecto `unit`) | Ninguna | `npm run test:unit` |
| HTTP en memoria | `apps/api/test/http/**/*.http-spec.ts` | Vitest (proyecto `http`) + `@nestjs/testing` + supertest | Ninguna | `npm run test:unit` |
| Unitaria y HTTP (Python) | `services/ml/tests/` | pytest + `TestClient` de FastAPI | Ninguna | `npm run test:unit` o `npm run ml:test` |
| Hook de Claude Code | `.claude/hooks/*.test.mjs` | `node:test` | Ninguna | `npm run test:unit` o `npm run test:hooks` |
| Integración | `apps/api/test/integration/**/*.int-spec.ts` | Vitest (proyecto `integration`) + Testcontainers | **Docker en ejecución** | `npm run test:integration` |
| End-to-end | `apps/web/e2e/**/*.spec.ts` | Playwright (Chromium) | Navegador de Playwright instalado | `npm run test:e2e` |

- `npm test` es igual a `npm run test:unit`. `npm run test:all` ejecuta las tres suites.
- `npm run verify` incluye `test:unit`, pero **no** integración ni end-to-end, porque requieren Docker y un navegador.
- Modo observador de las unitarias de `api`: `npm run test:watch --workspace @ghostwall/api`.

## Base de datos de pruebas

Las pruebas de integración **nunca** usan la base de desarrollo del `docker compose`.

1. **Inicialización** (`apps/api/test/integration/global-setup.ts`): Testcontainers crea un contenedor nuevo de `postgres:18.6` (la misma imagen que en desarrollo) con la base `ghostwall_test`, en un puerto aleatorio. Sobre esa base se aplican **todas las migraciones desde cero** (`apps/api/drizzle/`).
2. **Protección** (`asegurarBaseDePruebas` en `apps/api/test/support/test-database.ts`): antes de cualquier operación destructiva se verifica que la base se llame `ghostwall_test`, que el host sea local y que la URL no coincida con `DATABASE_URL`. Si alguna condición falla, la prueba se detiene. Esta protección tiene sus propias pruebas unitarias.
3. **Limpieza entre pruebas**: antes de cada prueba se vacían todas las tablas del esquema `public` (`TRUNCATE … RESTART IDENTITY CASCADE`). No se usa rollback de transacciones, porque algunas pruebas verifican errores de PostgreSQL que abortan la transacción.
4. **Finalización**: al terminar la suite, el contenedor se detiene y se elimina. Testcontainers también ejecuta su contenedor de limpieza (Ryuk), que elimina los contenedores huérfanos si el proceso se interrumpe.
5. Los archivos de integración se ejecutan **en serie** (comparten un único contenedor).

## Datos de prueba

- **Factories deterministas** (`apps/api/test/support/factories.ts`): `construirEmpresa(n)` devuelve siempre los mismos datos para el mismo `n`, con un CUIT sintácticamente válido pero ficticio (`cuitDePrueba(n)`) y una fecha fija (`2026-01-01T00:00:00Z`). Se pueden sobrescribir campos puntuales: `construirEmpresa(1, { estado: 'SUSPENDIDO' })`.
- Solo **datos sintéticos**: nunca datos personales reales, ni siquiera de los integrantes.
- Ninguna prueba depende de registros que existan previamente en una máquina ni del archivo `.env` local. La configuración de `ml` se lee solo del entorno del proceso (ver `services/ml/tests/test_config.py`).
- Los valores esperados del CUIT se calcularon con una implementación independiente y se contrastaron con ejemplos publicados; no se derivaron del código bajo prueba.

## Criterios

1. Cada prueba verifica un requisito o una decisión documentada, y su nombre o comentario incluye el ID (`T-xxx`, `RF-xxx`).
2. Las pruebas no dependen de otras ni de un orden de ejecución.
3. Las pruebas unitarias no usan red, disco ni reloj real.
4. Las integraciones externas (proveedor de identidad, correo, LLM, ledger) se reemplazan por implementaciones falsas de sus puertos ([architecture.md](architecture.md#reglas-de-dependencia), regla 6).
5. Un error corregido incorpora primero una prueba que lo reproduce.
6. Si una prueba revela una contradicción entre el código y los requisitos, se informa; no se cambia la lógica de negocio solo para que pase.
7. **Cobertura:** todavía no se mide ni hay un umbral fijado. No se deben informar porcentajes de cobertura hasta configurarlos.

## Preparación en una máquina nueva

1. `npm install` y `npm run ml:sync` ([development.md](development.md)).
2. Para la suite de integración: abrir Docker Desktop. La primera ejecución descarga `postgres:18.6` (si no está) y la imagen de Ryuk.
3. Para la suite end-to-end: `npx playwright install chromium` dentro de `apps/web` (descarga unos 120 MB en la caché de Playwright del usuario).

## Integración continua

Workflow: [`.github/workflows/ci.yml`](../.github/workflows/ci.yml). Se ejecuta en cada `push` a cualquier rama y en cada Pull Request hacia `main`. Si llega un push nuevo a la misma rama o PR, se cancela la ejecución anterior.

| Job | Qué ejecuta | Equivale a |
|---|---|---|
| `verify` | `npm ci`, `npm run ml:sync` y `npm run verify` | Formato, lint, tipos, build, pruebas unitarias/HTTP de `api` y `ml` y pruebas del hook de Claude Code |
| `integracion` | `npm ci` y `npm run test:integration` | Suite de integración. Testcontainers crea un PostgreSQL descartable con el Docker del runner |
| `e2e` | `npm ci`, `npx playwright install --with-deps chromium` y `npm run test:e2e` | Suite end-to-end. Si falla, guarda `apps/web/test-results/` como artefacto durante 7 días |

- Los jobs usan los mismos scripts que la verificación local. Si algo pasa localmente y falla en CI, la diferencia está en el entorno (Linux, instalación limpia), no en los comandos.
- **Seguridad:** solo tiene permiso `contents: read`. No usa secretos ni hace push, publicación o despliegue. El checkout no conserva el token (`persist-credentials: false`). Las acciones se fijan por SHA de commit, con la versión en un comentario.
- `HUSKY=0` evita instalar hooks en el runner. `UV_LOCKED=1` hace fallar uv si `uv.lock` no coincide con `pyproject.toml`, igual que `npm ci` con `package-lock.json`.
- Node sale de `.nvmrc` (última 24.x). uv está fijado en 0.13.1, y Python sale de `services/ml/.python-version`.

### Comprobar la CI en GitHub

1. Subir una rama con el workflow. En **Actions → CI** tienen que aparecer y terminar en verde los tres jobs.
2. Abrir un PR hacia `main`. La CI vuelve a correr por el evento `pull_request` y los tres checks aparecen en el PR.
3. Prueba de fallo: en una rama descartable, romper el formato de un `.ts` y confirmar que `verify` falla en `npm run verify`.
4. En el log de un job, sección *Set up job*, confirmar que los permisos del `GITHUB_TOKEN` son solo `Contents: read`.

Hasta que esto se haga, la CI está **validada solo localmente**: se ejecutaron los mismos scripts, pero no el workflow en un runner de GitHub.

### Protección de la rama `main`

La configura el equipo desde la web de GitHub (*Settings → Rules → Rulesets* o *Settings → Branches*). Ni Claude Code ni la CI cambian la configuración remota. Configuración recomendada:

- Exigir un Pull Request para mergear, con al menos **1 aprobación**. Descartar las aprobaciones cuando llegan commits nuevos.
- Exigir que pasen los checks:
  - `Formato, lint, tipos, build y pruebas unitarias`
  - `Pruebas de integración (Testcontainers)`
  - `Pruebas end-to-end (Playwright)`

  Aparecen en la lista recién después de la primera ejecución de la CI.
- Exigir que la rama esté al día con `main` antes de mergear.
- Exigir que las conversaciones del PR estén resueltas.
- Bloquear los *force push* y el borrado de `main`, sin excepciones para administradores. Opcional: exigir historial lineal.
- En *Settings → Actions → General*:
  - Dejar los permisos del workflow en "Read repository contents".
  - Desactivar "Allow GitHub Actions to create and approve pull requests".
  - Exigir aprobación para los workflows de colaboradores externos, porque el repositorio es público.

## Problemas conocidos

- pytest muestra una advertencia de deprecación de Starlette (`Using httpx with starlette.testclient is deprecated; install httpx2 instead`). Viene de las dependencias, no del código del proyecto. Se revisará al actualizar FastAPI/Starlette.
- npm 11.19 bloquea los scripts de instalación de `esbuild`, `protobufjs` y `ssh2`. No se aprobaron porque las suites funcionan sin ellos (ver [ADR 0012](decisions/0012-calidad-configuracion-ci.md)).
