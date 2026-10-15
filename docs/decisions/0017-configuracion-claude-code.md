# ADR 0017 — Configuración compartida de Claude Code

- **Estado:** Recomendada
- **Fecha:** 2026-10-14
- **Requisitos:** RA-002 (buenas prácticas de seguridad)

## Contexto

Los tres integrantes usan Claude Code en el repositorio. Las reglas del equipo prohíben que Claude haga commit, push, merge, rebase, publicaciones o despliegues, y que ejecute comandos destructivos. Hasta ahora esas reglas solo estaban escritas en `CLAUDE.md`, que es contexto y no una restricción. Según la documentación oficial (code.claude.com/docs, consultada el 2026-10-14):

- las reglas `deny` de Bash comparan el texto del comando, así que no detectan variantes como `git -C . push` ni `sh -c '…'`;
- un hook `PreToolUse` falla abierto, salvo con `onFailure: "block"`, que requiere Claude Code 2.1.295; la versión relevada es la 2.1.293;
- el sandbox de archivos y red no está disponible en Windows nativo.

## Decisión

| Área | Elección | Alternativas descartadas y motivo |
|---|---|---|
| Instrucciones | `CLAUDE.md` con lo general y `.claude/rules/*.md` con `paths` por área | Todo en `CLAUDE.md`: carga reglas de todas las áreas en cada sesión |
| Prohibiciones | Tres capas: instrucción, reglas `deny` en `.claude/settings.json` y un hook `PreToolUse` en Node que analiza el comando completo, con pruebas | Solo `deny`: se elude con otras formas del comando |
| Permisos | `allow` limitado a los scripts de verificación y a `git status/diff/log`; `ask` para instalaciones y volúmenes de Docker; modo *bypass* deshabilitado | `allow` amplio (`Bash(npm *)`): incluye `npm install` y scripts arbitrarios |
| Skills | `analyze-requirements`, `implement-feature` (solo manual, con aprobación del plan), `run-tests` y `review-changes`, sin `allowed-tools` | `allowed-tools`: concedería permisos sin preguntar |
| Agentes | Ninguno propio; se usan `Explore` y `Plan`, que ya vienen integrados | Agentes de arquitectura, seguridad o trazabilidad: duplicarían las Skills sin un beneficio demostrado |
| Hooks de formato | Ninguno | Formatear en cada edición contradice la política de "verificar sin modificar" de ADR 0012 |

El detalle de uso, el inventario y los límites están en [../claude-code.md](../claude-code.md).

## Consecuencias

- La protección de `main` sigue dependiendo de la protección de rama en GitHub. Las capas locales reducen el riesgo, pero no lo eliminan.
- Cada integrante debe tener `node` en el PATH y aceptar la confianza en la carpeta.
- Con Claude Code 2.1.295 o posterior se agrega `onFailure: "block"` al hook.

## Impacto en la documentación aprobada

Ninguno. Es una herramienta de trabajo del equipo y no cambia requisitos ni diseño.

## Reversibilidad

Costo bajo: borrar o editar los archivos de `.claude/`.
