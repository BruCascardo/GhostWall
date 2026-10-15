# ADR 0012 — Pruebas, calidad de código, configuración y CI

- **Estado:** Recomendada
- **Fecha:** 2026-10-14
- **Requisitos:** RA-002, RA-003, RNF-011

## Decisión

| Área | Elección | Alternativas descartadas y motivo |
|---|---|---|
| Pruebas en TypeScript | **Vitest 5**. En `api` **no** hizo falta el plugin SWC: se verificó (2026-10-14) que la inyección de dependencias por constructor de NestJS funciona con el transformador por defecto de Vitest 5 | Jest: más lento |
| Integración con servicios reales | **Testcontainers** (PostgreSQL y Redis reales y descartables) | Base compartida: estado residual entre pruebas |
| End-to-end | **Playwright** | Cypress: más pesado |
| Python | **pytest**, **Ruff** (lint y formato) y **mypy** | — |
| Lint y formato en TypeScript | **ESLint 10 + typescript-eslint + Prettier** | Biome: menos integración con Next.js y NestJS |
| Hooks locales | **husky + lint-staged**, solo con verificaciones rápidas | Sin hooks: los errores llegan recién a la CI |
| Configuración | `.env.example` versionado; variables validadas al arrancar (Zod / pydantic-settings); `.env` nunca se versiona | — |
| CI | GitHub Actions: lint, typecheck, pruebas, build, CodeQL (SAST), Trivy (imágenes), gitleaks (secretos) y Dependabot. DAST con OWASP ZAP en una etapa posterior | — |

Los niveles de prueba y sus criterios están en [../testing.md](../testing.md).

## Consecuencias

- El repositorio es público (verificado el 2026-10-14). Por eso, el uso de CodeQL **debería** ser gratuito; se confirmará al configurar la CI.
- La protección de la rama `main` se configura desde la web de GitHub y la hace el equipo. La configuración recomendada está en [testing.md](../testing.md#protección-de-la-rama-main).
- **CI implementada (2026-10-14):** `.github/workflows/ci.yml` tiene los jobs `verify` (formato, lint, tipos, build y unitarias), `integracion` y `e2e` ([testing.md](../testing.md#integración-continua)). Las acciones se fijan por SHA y la versión de cada SHA se verificó contra los tags de los repositorios oficiales: `actions/checkout` v7.0.1, `actions/setup-node` v7.1.0, `actions/upload-artifact` v7.0.2 y `astral-sh/setup-uv` v10.3.0. **Pendientes de esta decisión:** CodeQL, Trivy, gitleaks y Dependabot.
- npm 11.19 bloquea por defecto los scripts de instalación. Quedaron bloqueados `esbuild` (postinstall), `protobufjs` (postinstall) y `ssh2` (install, compila un módulo nativo opcional). **No se aprobaron**: drizzle-kit, Vitest y Testcontainers funcionan sin ellos (verificado al ejecutar las suites el 2026-10-14).
- **Vulnerabilidad conocida (2026-10-14):** `npm audit` informa 4 alertas *high* por `braces@3.0.3` (GHSA-vfj7-8cjw-p6xm, denegación de servicio con patrones anidados). La cadena es `@next/eslint-plugin-next@16.4.1 → fast-glob@3.3.1 → micromatch@4.0.8 → braces`. Afecta solo a herramientas de desarrollo: `npm audit --omit=dev` informa 0 vulnerabilidades. La única corrección propuesta (`npm audit fix --force`) degrada el plugin a la 14.2.35, de una versión mayor sin soporte, así que **no se aplica**. El riesgo es bajo porque el plugin solo procesa patrones definidos en nuestra configuración. Se revisa cuando el plugin publique una versión que lo resuelva.
- **Vulnerabilidad conocida (2026-10-14):** 4 alertas *moderate* por `esbuild <=0.24.2` (GHSA-67mh-4wv8-2f99: el servidor de desarrollo de esbuild acepta solicitudes de cualquier sitio), a través de `drizzle-kit@0.31.11 → @esbuild-kit/esm-loader → @esbuild-kit/core-utils → esbuild`. Solo afecta a herramientas de desarrollo. drizzle-kit no inicia el servidor de desarrollo de esbuild, que es donde está la vulnerabilidad. La corrección propuesta degrada drizzle-kit a la 0.18.1, así que **no se aplica**.

## Reversibilidad

Costo bajo para cada herramienta.
