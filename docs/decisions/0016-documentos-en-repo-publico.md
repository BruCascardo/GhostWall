# ADR 0016 — Documentación original en un repositorio público

- **Estado:** Aceptada (2026-10-14; ver [Aprobación](#aprobación))
- **Fecha:** 2026-10-14

## Contexto

`github.com/BruCascardo/GhostWall` es público (verificado el 2026-10-14). Las entregas originales en `docs/` contienen nombres completos, remuneraciones, proyecciones financieras y el contrato modelo, y pesan entre 5 y 13 MB cada una. Al momento de este ADR esos archivos **no están versionados** en Git.

## Alternativas

| Alternativa | Consecuencia |
|---|---|
| a) Versionar los originales | Todo su contenido queda público; los binarios agrandan el historial (se puede mitigar con Git LFS, que está instalado) |
| b) Versionar solo la documentación en Markdown y excluir los originales con `.gitignore` | Los enlaces de [../requirements/README.md](../requirements/README.md) solo funcionan en las copias locales que tienen los archivos |
| c) Hacer privado el repositorio | Los costos de las herramientas de seguridad de GitHub pueden cambiar (a verificar) |

## Decisión

**b)** Se versiona solo la documentación técnica en Markdown. Las carpetas originales (`docs/1er Entrega/`, `docs/2da Entrega/`, `docs/3er Entrega/`, `docs/Artefactos/`, `docs/Cosas Generales/`) se excluyen con `.gitignore`. Ese archivo se crea en la fase de configuración; **hasta entonces, nadie debe hacer `git add docs/`**. El equipo comparte los originales por otro medio.

## Aprobación

Se adoptó la opción recomendada según la regla del equipo del 2026-10-14 (ver [README.md](README.md#estados)).

**Motivo:** evita publicar información personal y financiera sin perder la trazabilidad de los requisitos.

## Impacto en la documentación aprobada

Ninguno sobre el contenido de las entregas. Los enlaces a los originales desde [../requirements/README.md](../requirements/README.md) no funcionarán en GitHub.
