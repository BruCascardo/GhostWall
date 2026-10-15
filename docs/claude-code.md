# Configuración compartida de Claude Code

Configuración versionada para que los tres integrantes trabajen con Claude Code de la misma forma. Está basada en la documentación oficial (code.claude.com/docs, consultada el 2026-10-14) y se verificó con Claude Code 2.1.293 en Windows.

## Inventario

| Archivo | Propósito | Cómo se usa |
|---|---|---|
| `CLAUDE.md` | Instrucciones generales: estado, fuentes de verdad, comandos, seguridad, procedimiento, informe obligatorio y prohibiciones | Se carga en cada sesión iniciada en la raíz |
| `.claude/rules/api.md` | Reglas de `apps/api/src/**` | Se carga sola cuando Claude lee o edita archivos que coinciden con `paths` |
| `.claude/rules/database.md` | Esquema y migraciones de Drizzle | Ídem |
| `.claude/rules/web.md` | `apps/web/**` | Ídem |
| `.claude/rules/ml.md` | `services/ml/**` | Ídem |
| `.claude/rules/testing.md` | Archivos de prueba de las tres apps | Ídem |
| `.claude/rules/infra-ci.md` | `.github/`, `infra/`, `.env.example`, `.claude/settings.json` y hooks | Ídem |
| `.claude/skills/analyze-requirements/SKILL.md` | Requisitos, AMB, ADR y pruebas que afecta un cambio. Solo lectura | `/analyze-requirements <cambio o ID>`; Claude también puede usarla sola |
| `.claude/skills/implement-feature/SKILL.md` | Analizar → plan → **aprobación** → implementar → verificar | Solo manual: `/implement-feature <ID o descripción>` |
| `.claude/skills/run-tests/SKILL.md` | Elige las suites según los archivos cambiados, las ejecuta e informa | `/run-tests [rutas \| todo]` |
| `.claude/skills/review-changes/SKILL.md` | Revisión del diff con la checklist del proyecto. Solo lectura | `/review-changes [rama \| rutas]` |
| `.claude/settings.json` | Permisos (`allow`/`ask`/`deny`), bloqueo del modo *bypass* y el hook | Se aplica solo al abrir el proyecto, después de confiar en la carpeta |
| `.claude/hooks/bloquear-operaciones-git.mjs` | Hook `PreToolUse` que bloquea git de publicación o reescritura, publicación y despliegue | Lo ejecuta Claude Code antes de cada comando de Bash o PowerShell |
| `.claude/hooks/bloquear-operaciones-git.test.mjs` | Pruebas del hook (casos bloqueados, permitidos y contrato por stdin) | `npm run test:hooks` (también lo ejecutan `npm run verify` y la CI) |

**Evaluado y descartado:**

- **Agentes especializados:** no se crearon. `/review-changes` cubre la revisión de solo lectura en la conversación principal, y para búsquedas amplias ya existen los agentes integrados `Explore` y `Plan`. Un agente más duplicaría instrucciones sin un beneficio demostrado. Se reconsidera si las revisiones empiezan a superar el contexto de una sesión.
- **Hook de formateo automático:** no se agregó. El equipo eligió hooks que verifican sin modificar archivos (lint-staged, [ADR 0012](decisions/0012-calidad-configuracion-ci.md)). Para corregir el formato, `npm run format` y `npm run ml:format`.

## Permisos compartidos (`.claude/settings.json`)

| Tipo | Reglas | Efecto |
|---|---|---|
| `allow` | `npm run verify`, `lint`, `format:check`, `typecheck`, `build`, `test:unit`, `test:integration`, `test:e2e`, `ml:test`, `ml:lint`, `ml:typecheck`, `ml:format:check`, `git status`, `git diff`, `git log` (Bash y PowerShell) | Se ejecutan sin preguntar. **Ejecutan código del repositorio**, así que un cambio malicioso en un script o una prueba correría sin aviso. Revisá los cambios de otros antes de pedir que se ejecuten |
| `ask` | `npm install`/`i`/`uninstall`/`update`, `npm audit fix`, `uv add`/`remove`, `docker volume rm`, `docker system prune`, `docker compose … down -v` | Siempre piden confirmación, aunque el usuario las haya aprobado antes ("no volver a preguntar" no gana sobre un `ask` del proyecto) |
| `deny` | `git commit/push/merge/rebase/cherry-pick/pull/am/revert/clean`, `git reset --hard`, `gh pr create/merge`, `gh release`, `gh workflow run`, `npm publish`, `docker push` (Bash y PowerShell); `Read(./.env)`, que también bloquea editarlo; `Edit` sobre los documentos originales de `docs/` | Se rechazan siempre. Un `allow` personal no las habilita |
| `disableBypassPermissionsMode` | `"disable"` | No se puede usar el modo que saltea todos los permisos. El modo *auto* sigue disponible |

Todo lo demás sigue el comportamiento normal de Claude Code. Las lecturas dentro del proyecto no piden permiso. Las ediciones y el resto de los comandos sí, según el modo elegido.

## Límites de las protecciones

Ninguna capa es una garantía absoluta. Se combinan tres:

1. **Instrucción en `CLAUDE.md`:** es contexto, no una restricción. El modelo puede no cumplirla.
2. **Reglas `deny`:** comparan el texto del comando después de separar `&&`, `;` y `|` y de quitar envoltorios como `timeout` y `nohup`. Según la documentación oficial **no** detectan otras formas del mismo programa: `git -C . push`, `git -c x=y push`, `/usr/bin/git push`, `sh -c '…'`. `Read(./.env)` no impide que un script de Node o Python abra el archivo.
3. **Hook `PreToolUse`:** analiza el texto completo del comando y detecta esas variantes (ver sus pruebas). Aun así:
   - **No ve lo que hace un script por dentro.** Por ejemplo, un `.mjs` que llame a `git push` con `child_process` no se detecta.
   - **Falla abierto.** Si `node` no está en el PATH o el script no arranca, Claude Code ejecuta el comando igual. `onFailure: "block"` resolvería esto, pero requiere Claude Code 2.1.295 o posterior y no se usa todavía porque la versión relevada es la 2.1.293.
   - **Puede bloquear de más.** Un comando que solo *menciona* `git push`, como `echo "git push"`, también se bloquea. Es preferible un falso positivo.

Además:

- Nada de esto aplica a lo que cada integrante ejecuta en su propia terminal.
- El **sandbox** de Claude Code, que restringe archivos y red a nivel del sistema operativo, no está disponible en Windows nativo, así que no se configuró.
- La protección real de `main` es la **protección de rama en GitHub**, que configura el equipo ([testing.md](testing.md#protección-de-la-rama-main)).

## Instalación y actualización (cada integrante)

1. **Instalar o actualizar Claude Code** desde la app de escritorio o el CLI. Conviene la última versión: los campos `args` del hook y las reglas de PowerShell se probaron en la 2.1.293.
2. **Tener Node 24 en el PATH**, el mismo que pide el proyecto. Sin `node`, el hook no corre y el bloqueo queda solo en las reglas `deny`.
3. **Traer los cambios:** `git pull` en tu terminal. La configuración llega con el repositorio.
4. **Abrir Claude Code en la raíz del repositorio** (`GhostWall/`). `.claude/settings.json` se lee del directorio de trabajo principal: si iniciás en una subcarpeta, no se aplica.
5. **Aceptar el diálogo de confianza en la carpeta** (*workspace trust*). Hasta que lo aceptes, Claude Code no aplica los `allow` del proyecto.
6. **Comprobar que todo se cargó:**
   - `/permissions` debe mostrar las reglas del proyecto.
   - `/hooks` debe listar el `PreToolUse` con el matcher `Bash|PowerShell`.
   - Escribí `/` y deberían aparecer las cuatro Skills.
   - `/memory` muestra `CLAUDE.md` y las reglas cargadas.
7. **Probar el hook:**
   - `npm run test:hooks` tiene que terminar con `pass 6`, `fail 0`.
   - En una sesión, pedile a Claude que ejecute `git commit --dry-run`: tiene que aparecer "Bloqueado por el hook de GhostWall". `--dry-run` no crea commits aunque se ejecute.

Para actualizar después, alcanza con hacer `git pull` y abrir una sesión nueva. Las Skills y las reglas nuevas se detectan al iniciar la sesión. Los cambios en `settings.json` se aplican también durante una sesión abierta.

## Qué tiene que aprobar cada integrante

- La **confianza en la carpeta**, una vez por clon.
- Los comandos que no están en `allow`: ediciones de archivos (según el modo), `docker`, `npx`, `uv run` fuera de los scripts, etc. Si elegís "Sí, no volver a preguntar", la regla se guarda **solo en tu** `.claude/settings.local.json`.
- Las instalaciones (`npm install`, `uv add`) y las operaciones sobre volúmenes de Docker. Las pide siempre, por las reglas `ask`.
- Las descargas de herramientas como el Chromium de Playwright o actionlint. Claude debe pedir permiso antes.

## Configuración local (no se comparte por Git)

| Archivo | Para qué | Notas |
|---|---|---|
| `.claude/settings.local.json` | Permisos y preferencias personales para este proyecto | Está en `.gitignore`. Tiene prioridad sobre el archivo compartido, pero **no** puede anular un `deny` ni un `ask` del proyecto |
| `CLAUDE.local.md` | Instrucciones personales para este proyecto | Está en `.gitignore`. Se lee después de `CLAUDE.md`. No debe contradecirlo |
| `~/.claude/settings.json`, `~/.claude/CLAUDE.md`, `~/.claude/rules/`, `~/.claude/skills/` | Configuración personal para todos los proyectos | Fuera del repositorio. El modo por defecto (`defaultMode`) se elige acá, porque `auto` y `bypassPermissions` no se pueden fijar desde el proyecto |
| `~/.claude/projects/<proyecto>/memory/` | Memoria automática de Claude | Es personal y no se sincroniza entre integrantes |
| `.claude/worktrees/` | Worktrees temporales de Claude Code | Está en `.gitignore` |

## Mantenimiento

- **Al cambiar el hook:** correr sus pruebas y agregar un caso por cada forma nueva de comando que se quiera bloquear o permitir.
- **Al cambiar `settings.json`:** validar el JSON (`npm run format:check` lo revisa con Prettier) y no debilitar las protecciones sin acuerdo del equipo ([infra-ci.md](../.claude/rules/infra-ci.md)).
- **Al pasar a Claude Code 2.1.295 o posterior:** agregar `"onFailure": "block"` al hook para que bloquee también cuando falla.
