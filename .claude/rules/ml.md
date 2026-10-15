---
paths:
  - 'services/ml/**'
---

# Reglas de `services/ml`

Decisiones en [ADR 0009](../../docs/decisions/0009-servicio-ml.md).

- Las dependencias se gestionan solo con uv: `uv add` modifica `pyproject.toml` y `uv.lock`, y requiere aprobación. No se usa `pip install`.
- El servicio no tiene estado: no accede a PostgreSQL y solo lo invoca `api`.
- La configuración se lee del entorno con pydantic-settings, nunca de un `.env` en disco (T-021).
- mypy corre en modo estricto y Ruff incluye las reglas de seguridad (`S`). No se silencian con `# noqa` ni `# type: ignore` sin explicar el motivo en un comentario.
- Verificación mínima: `npm run ml:format:check`, `npm run ml:lint`, `npm run ml:typecheck` y `npm run ml:test`, todos incluidos en `npm run verify`.
