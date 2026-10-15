# GhostWall

Plataforma SaaS de ciberseguridad centrada en el factor humano: simulaciones de phishing generadas con IA, triage de correos reportados, scoring de riesgo por empleado, capacitación adaptativa, respuesta automatizada y auditoría inmutable.

Proyecto final de Ingeniería en Sistemas de Información (UTN FRRO, 2026) de Cascardo, Giacomelli y Munné.

> **Estado:** entorno, pruebas y CI configurados. `api`, `web` y `ml` son esqueletos; todavía no hay funcionalidades de negocio. El prototipo se entrega el 18/12/2026.

## Estructura

| Carpeta         | Contenido                                                                |
| --------------- | ------------------------------------------------------------------------ |
| `apps/web`      | Next.js: dashboard y portal                                              |
| `apps/api`      | NestJS: reglas de negocio, persistencia y autorización                   |
| `services/ml`   | FastAPI con uv: triage, scoring y generación de contenido                |
| `infra/compose` | PostgreSQL, Redis, Keycloak y Mailpit para desarrollo                    |
| `docs`          | Requisitos, decisiones (ADR), arquitectura, base de datos, API y pruebas |

## Inicio rápido

Requisitos: Node 24.x (24.15 o superior), uv 0.13.x, Docker Desktop y Git. El detalle está en [docs/development.md](docs/development.md).

```bash
git clone https://github.com/BruCascardo/GhostWall.git
cd GhostWall
npm install
npm run ml:sync
```

1. Copiar `.env.example` a `.env` y reemplazar cada `CAMBIAR` por una contraseña local inventada. `.env` no se versiona.
2. Abrir Docker Desktop y levantar los servicios con `npm run infra:up`. Comprobarlos con `npm run infra:ps`.
3. Ejecutar `npm run verify`: formato, lint, tipos, build y pruebas unitarias. Tiene que terminar sin errores.
4. Con Docker abierto, ejecutar `npm run test:integration`.
5. Para las pruebas end-to-end: `npx playwright install chromium` dentro de `apps/web`, y después `npm run test:e2e`.

Los comandos `npm run dev:api`, `dev:web` y `dev:ml` inician cada servicio en modo desarrollo. La lista completa de comandos está en [docs/development.md](docs/development.md#comandos).

## Cómo trabajar

- Requisitos y preguntas abiertas: [docs/requirements/](docs/requirements/README.md). Las decisiones técnicas están en [docs/decisions/](docs/decisions/README.md).
- Pruebas, CI y protección de `main`: [docs/testing.md](docs/testing.md).
- Claude Code: instrucciones en [CLAUDE.md](CLAUDE.md), y configuración compartida y Skills en [docs/claude-code.md](docs/claude-code.md).
- Solo se usan datos de prueba sintéticos. Nunca se versionan secretos ni los documentos originales de las entregas ([ADR 0016](docs/decisions/0016-documentos-en-repo-publico.md)).
