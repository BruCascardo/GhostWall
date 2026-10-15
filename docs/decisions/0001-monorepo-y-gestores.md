# ADR 0001 — Monorepo con npm workspaces y uv

- **Estado:** Recomendada
- **Fecha:** 2026-10-14

## Contexto

Un equipo de 3 personas desarrolla una web en TypeScript, una API en TypeScript y un servicio en Python que comparten contratos. Necesitan un único lugar para revisar cambios, ejecutar la CI y darle contexto a Claude Code.

## Alternativas

| Alternativa | Ventajas | Desventajas |
|---|---|---|
| Un repositorio por componente | Aislamiento | Contratos duplicados, 3 CI distintas, cambios coordinados entre repositorios |
| **Monorepo con npm workspaces** | npm ya está instalado (11.6.2); no suma herramientas | Instalación más lenta que pnpm |
| Monorepo con pnpm o Turborepo | Más rápido, caché de tareas | Una herramienta más para instalar y aprender |

Para Python: pip + venv (sin lockfile nativo), Poetry o **uv** (bloquea dependencias y gestiona la versión de Python).

## Decisión

Monorepo único. JavaScript y TypeScript con **npm workspaces**. Python con **uv** y `uv.lock`. La estructura de carpetas está en [../architecture.md](../architecture.md#estructura-del-repositorio).

## Consecuencias

- Hay que instalar uv. La documentación oficial ofrece `winget install --id=astral-sh.uv -e`, un instalador de PowerShell y `pip install uv`. En la máquina relevada se usó `pip install --user uv==0.13.1` para no aceptar acuerdos de winget; el ejecutable quedó fuera del PATH (ver [../development.md](../development.md)).
- Al instalar Python 3.13 con uv 0.13.1 en Windows apareció el error *"Missing expected target directory for Python minor version link"*. La instalación concreta (3.13.16) funciona y el entorno la usa; solo produce advertencias en `uv python list`.
- Un solo `package-lock.json` en la raíz.

## Reversibilidad

Pasar a pnpm: costo bajo. Separar en varios repositorios: costo alto.
