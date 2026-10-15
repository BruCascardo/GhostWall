# Registro de decisiones técnicas (ADR)

Cada archivo documenta una decisión: el problema, las alternativas consideradas, la elección, sus consecuencias y el costo de revertirla.

## Estados

| Estado | Significado |
|---|---|
| **Recomendada** | Recomendación técnica que no depende de requisitos ni de condiciones del profesor. Rige para el trabajo salvo objeción del equipo. |
| **Pendiente de aprobación** | Se aparta de la documentación aprobada o depende de una decisión del equipo o del profesor. No se implementa hasta pasar a *Aceptada*. |
| **Aceptada** | Confirmada por el equipo. El ADR registra la fecha, el motivo y el impacto sobre la documentación aprobada. |
| **Reemplazada** | Sustituida por otro ADR, que se indica en el archivo. |

### Regla del equipo (2026-10-14)

Cuando una decisión está *Pendiente de aprobación* y existe una opción recomendada, **se adopta la recomendada** y el ADR pasa a *Aceptada*. Cada ADR aceptado así debe documentar:

1. qué se eligió;
2. por qué;
3. qué cambia respecto de la documentación aprobada (sección *Impacto en la documentación aprobada*).

Con esa justificación, el equipo puede actualizar después las entregas. El resumen de los cambios está en [cambios-a-la-documentacion.md](cambios-a-la-documentacion.md).

La regla **no** se aplica a las preguntas que no tienen una opción recomendada (por ejemplo P1, P3 o P9 en [../requirements/ambiguities.md](../requirements/ambiguities.md)): esas siguen requiriendo una respuesta del equipo.

## Índice

| ADR | Decisión | Estado |
|---|---|---|
| [0001](0001-monorepo-y-gestores.md) | Monorepo con npm workspaces y uv | Recomendada |
| [0002](0002-versiones-de-runtime.md) | Node 24 LTS, TypeScript 6.0.x y Python 3.13 | Recomendada |
| [0003](0003-forma-de-la-arquitectura.md) | Dos servicios (`api`, `ml`) como monolitos modulares | Aceptada |
| [0004](0004-frontend.md) | Next.js 16, Tailwind CSS 4 y ECharts | Recomendada (desvío menor de D4) |
| [0005](0005-backend-api.md) | NestJS con módulos por capas | Recomendada |
| [0006](0006-persistencia.md) | PostgreSQL 18 con Drizzle ORM y migraciones SQL | Recomendada |
| [0007](0007-validacion-errores-contratos.md) | Zod, problem+json y OpenAPI como contrato | Recomendada |
| [0008](0008-identidad-y-autorizacion.md) | Keycloak local como proveedor OIDC; RBAC y aislamiento por empresa | Aceptada |
| [0009](0009-servicio-ml.md) | Servicio `ml` con FastAPI, sin estado y con proveedores intercambiables | Recomendada (proveedor real abierto: P10) |
| [0010](0010-tareas-asincronas.md) | BullMQ sobre Redis | Recomendada |
| [0011](0011-entorno-docker-compose.md) | Docker Compose con perfiles; Kubernetes fuera del entorno local | Aceptada |
| [0012](0012-calidad-configuracion-ci.md) | Pruebas, lint, configuración validada y GitHub Actions | Recomendada |
| [0013](0013-registro-de-auditoria.md) | Interfaz `AuditLedger` con una cadena de hashes en PostgreSQL | Aceptada |
| [0014](0014-feature-store.md) | Postergar Feast | Aceptada |
| [0015](0015-seudonimizacion.md) | HMAC-SHA-256 por empresa y contacto cifrado | Aceptada |
| [0016](0016-documentos-en-repo-publico.md) | Solo se versiona la documentación en Markdown; los originales quedan fuera de Git | Aceptada |
| [0017](0017-configuracion-claude-code.md) | Configuración compartida de Claude Code: reglas, Skills, permisos y hook | Recomendada |

## Cómo agregar un ADR

1. Copiar la estructura de cualquier ADR existente y usar el siguiente número libre.
2. Estado inicial: *Recomendada* o *Pendiente de aprobación*. Si corresponde la regla del equipo, *Aceptada*, con las secciones *Aprobación* e *Impacto en la documentación aprobada*.
3. Citar los requisitos afectados con sus IDs de [../requirements/catalog.md](../requirements/catalog.md).
4. Agregar la fila a este índice y, si cambia la documentación aprobada, a [cambios-a-la-documentacion.md](cambios-a-la-documentacion.md).
