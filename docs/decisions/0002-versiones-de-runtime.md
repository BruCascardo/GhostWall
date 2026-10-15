# ADR 0002 — Versiones de runtime

- **Estado:** Recomendada
- **Fecha:** 2026-10-14

## Contexto

Las versiones deben ser compatibles entre las tres máquinas del equipo y la CI. Datos verificados el 2026-10-14:

- nodejs.org: v24 "Krypton" es LTS; v26 es *Current* (todavía no es LTS).
- npm: `typescript@latest` es 7.0.2, pero `typescript-eslint` declara `typescript >=4.8.4 <6.1.0` como peer dependency.
- PyPI: torch 2.14.1, transformers 5.19.0, FastAPI 0.143.1 y Pydantic 2.14.1 publican soporte hasta Python 3.14. Feast 0.67.0 solo declara Python 3.10.

## Decisión

| Runtime | Versión | Motivo |
|---|---|---|
| Node.js | 24.x LTS, **≥ 24.15.0** | Es LTS. El mínimo 24.15.0 lo exige `@angular-devkit/core@22.2.0`, dependencia de `@nestjs/cli@12.0.8` (verificado al instalar el 2026-10-14). La máquina relevada tiene 24.12.0 y debe actualizarse |
| TypeScript | 6.0.x fijado | TypeScript 7 rompe la compatibilidad con typescript-eslint |
| Python | 3.13, gestionado con uv | Amplio soporte del ecosistema de ML. El 3.14 instalado en el sistema no se usa para el proyecto |

Las versiones están fijadas en `.nvmrc`, `package.json` (`engines`, aplicado con `engine-strict=true` en `.npmrc`) y `services/ml/.python-version`. `@nestjs/cli@12.0.8` declara `typescript ~6.0.2`, lo que confirma la elección de TypeScript 6.0.

## Reversibilidad

Costo bajo: cambiar un número de versión y regenerar los lockfiles.
