# Entorno de desarrollo

Guía para que cada integrante replique el entorno. Las razones de cada herramienta están en [decisions/](decisions/README.md).

## Requisitos previos

| Herramienta | Versión | Cómo verificar |
|---|---|---|
| Node.js | **24.x, 24.15.0 o superior** (`.nvmrc`, `engines` en `package.json`) | `node --version` |
| npm | 11 o superior (incluido con Node) | `npm --version` |
| uv | 0.13.x | `uv --version` |
| Docker Desktop | Con Docker Compose v2 | `docker compose version` |
| Git | Cualquier versión reciente | `git --version` |

Python **no** hace falta instalarlo aparte: uv descarga la versión fijada en `services/ml/.python-version` (3.13).

**Instalar uv:** según la documentación oficial de uv, con `winget install --id=astral-sh.uv -e` o `pip install --user uv`. Si se instala con pip, el ejecutable puede quedar fuera del PATH. En la máquina relevada quedó en `%APPDATA%\Python\Python314\Scripts`, y esa carpeta hay que agregarla al PATH del usuario. Este comando se ejecuta **en PowerShell**, no en Git Bash, porque Bash interpreta `$env` antes de pasárselo a PowerShell. Después hay que abrir una terminal nueva.

```powershell
$dir = Join-Path $env:APPDATA 'Python\Python314\Scripts'; [Environment]::SetEnvironmentVariable('Path', [Environment]::GetEnvironmentVariable('Path','User').TrimEnd(';') + ';' + $dir, 'User')
```

**Node anterior a 24.15:** `npm install` falla con un error `EBADENGINE`/`notsup`. Hay que actualizar Node a la última versión 24 LTS desde nodejs.org (ver [ADR 0002](decisions/0002-versiones-de-runtime.md)).

## Primera configuración

Desde la raíz del repositorio:

1. `npm install` — instala las dependencias de JavaScript/TypeScript según `package-lock.json` y activa los hooks de Git (husky).
2. `npm run ml:sync` — crea `services/ml/.venv` exactamente según `services/ml/uv.lock` (y descarga Python 3.13 si hace falta).
3. Copiar `.env.example` a `.env` y reemplazar cada `CAMBIAR` por una contraseña local inventada. `.env` no se versiona.
4. Abrir Docker Desktop y ejecutar `npm run infra:up`.
5. `npm run verify` — debe terminar sin errores.
6. Opcional, para las suites que lo necesitan: `npx playwright install chromium` dentro de `apps/web` (end-to-end). Para la suite de integración basta con tener Docker Desktop abierto ([testing.md](testing.md#preparación-en-una-máquina-nueva)).

## Comandos

Todos se ejecutan desde la raíz.

| Comando | Qué hace |
|---|---|
| `npm run dev:api` | `api` en modo desarrollo (puerto `API_PORT`, por defecto 3001) |
| `npm run dev:web` | `web` en modo desarrollo (http://localhost:3000) |
| `npm run dev:ml` | `ml` en modo desarrollo (http://localhost:8001) |
| `npm run build` | Build de `api` y `web` |
| `npm run typecheck` | Verificación de tipos de `api` y `web` |
| `npm run lint` / `npm run lint:fix` | ESLint (verificar / corregir) |
| `npm run format:check` / `npm run format` | Prettier (verificar / formatear) |
| `npm run ml:sync` | Sincroniza el entorno de Python con el lockfile |
| `npm run ml:lint`, `ml:format:check`, `ml:format`, `ml:typecheck` | Ruff y mypy sobre `services/ml` |
| `npm test` / `npm run test:unit` | Pruebas unitarias y HTTP en memoria de `api` y `ml`, y pruebas del hook de Claude Code (sin Docker) |
| `npm run test:hooks` | Solo las pruebas del hook de Claude Code (`.claude/hooks/`) |
| `npm run test:integration` | Pruebas de integración con un PostgreSQL descartable (**requiere Docker**) |
| `npm run test:e2e` | Build de `web` y pruebas end-to-end con Playwright |
| `npm run test:all` | Las tres suites |
| `npm run ml:test` | Solo pytest de `ml` |
| `npm run db:generate --workspace @ghostwall/api` | Genera una migración SQL nueva a partir de `apps/api/src/db/schema.ts` |
| `npm run verify` | Formato, lint, tipos, build y pruebas unitarias (`verify:js` + `verify:ml` + `test:unit`) |
| `npm run infra:up` / `infra:down` | Levanta / detiene los servicios de infraestructura (`down` **no** borra los volúmenes de datos) |
| `npm run infra:ps` / `infra:logs` / `infra:config` | Estado, logs y validación de la configuración de Compose |

Antes de cada commit, el hook de pre-commit ejecuta lint-staged sobre los archivos en stage. Solo verifica y no modifica archivos.

En GitHub, cada push y cada Pull Request hacia `main` ejecutan `verify` y las suites de integración y end-to-end ([testing.md](testing.md#integración-continua)).

## Servicios locales

| Servicio | Dirección en el host | Notas |
|---|---|---|
| PostgreSQL 18.6 | `127.0.0.1:5433` | Puerto 5433 para no chocar con instalaciones locales de PostgreSQL en el 5432 |
| Redis 8.10.2 | `127.0.0.1:6379` | |
| Keycloak 26.8.1 | http://127.0.0.1:8080 | Consola de administración con `KEYCLOAK_ADMIN_USER` / `KEYCLOAK_ADMIN_PASSWORD` de `.env`. Todavía no hay realm del proyecto |
| Mailpit v1.31.5 | SMTP `127.0.0.1:1025`, interfaz http://127.0.0.1:8025 | Captura los correos; no los envía a Internet |

Los puertos se exponen solo en `127.0.0.1` y se pueden cambiar en `.env`.

## Alcance actual

`apps/api`, `apps/web` y `services/ml` son **esqueletos** con un endpoint o página de verificación (`/health` en `api` y `ml`). Lo único del dominio implementado es la validación del CUIT y la tabla `empresa`, necesarias para probar la infraestructura de pruebas. Las suites y cómo prepararlas están en [testing.md](testing.md).
