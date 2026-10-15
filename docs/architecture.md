# Arquitectura

> **Estado:** aceptada ([ADR 0003](decisions/0003-forma-de-la-arquitectura.md)). Se aparta del diseño de D4 §13.1 (ver [requirements/README.md](requirements/README.md)). Las versiones y la justificación de cada tecnología están en [decisions/](decisions/README.md); este documento no las repite.

## Estado actual del repositorio (2026-10-14)

Existen el entorno de desarrollo configurado ([development.md](development.md)) y esqueletos de `api`, `web` y `ml` con un endpoint o página de verificación. **Ninguna funcionalidad de negocio está implementada.** Los documentos originales en `docs/` no se versionan ([ADR 0016](decisions/0016-documentos-en-repo-publico.md)).

## Restricciones relevadas

- Fecha límite del prototipo: 18/12/2026 (RA-004).
- Máquina relevada: 7,9 GB de RAM, Intel i3-7020U (2 núcleos), sin GPU dedicada; Docker Desktop instalado. No se relevaron las máquinas de los otros dos integrantes.
- El repositorio de GitHub es público.

## Componentes

```
                    ┌─────────────────────────────┐
  Navegador ─HTTPS─▶│ web (Next.js)               │── login OIDC ──▶ Proveedor de identidad
                    │ Dashboard CISO/SOC · Portal │                  (Keycloak, ADR 0008)
                    └──────────────┬──────────────┘
                                   │ REST + JWT (cliente generado desde OpenAPI)
                    ┌──────────────▼──────────────────────────────────────┐
                    │ api (NestJS, monolito modular)                      │
                    │ módulos de negocio · workers de colas               │
                    │ puertos: AuditLedger · IdentityProvider · Mailer ·  │
                    │          FeatureRepository                          │
                    └──┬──────────────┬───────────────┬──────────────┬────┘
                       │ SQL          │ colas         │ HTTP         │ SMTP
                  PostgreSQL        Redis      ┌──────▼─────┐   Mailpit (dev)
                                               │ ml (FastAPI)│
                                               │ NLP·scoring │
                                               │ ·generación │
                                               └─────────────┘
```

| Componente | Responsabilidad | Equivalente en D4 §13.1 |
|---|---|---|
| `web` | Dashboard CISO/SOC (RF-060 a RF-064), portal de capacitación (RF-047), pantallas de simulación y feedback (RF-029) | Capa de presentación |
| `api` | Reglas de negocio, persistencia, autorización, orquestación de colas | Microservicios de Tenants & RBAC y de Auditoría |
| `ml` | Triage NLP (RF-033), cálculo del score (RF-039), generación de contenido (RF-022). Sin estado | Microservicios de NLP y de Risk Scoring |
| PostgreSQL | Datos transaccionales y registro de auditoría encadenado ([ADR 0013](decisions/0013-registro-de-auditoria.md)) | PostgreSQL + Hyperledger Fabric |
| Redis | Colas ([ADR 0010](decisions/0010-tareas-asincronas.md)) y caché | Redis / Feast |
| Proveedor de identidad | Autenticación y MFA ([ADR 0008](decisions/0008-identidad-y-autorizacion.md)) | Plataformas de identidad corporativa |

### Módulos previstos de `api`

Derivados de los casos de uso de D4 §8.4. Están sujetos a P3 (alcance).

| Módulo | Casos de uso y requisitos |
|---|---|
| `empresas` (tenants y comercial) | CUU01; RF-001 a RF-011 |
| `identidad` (usuarios, roles, sesiones) | CUU08, CUU09; RF-012 a RF-020 |
| `simulaciones` (campañas, intentos) | CUU02; RF-021 a RF-031 |
| `incidentes` (reportes y triage) | CUU03; RF-032 a RF-036 |
| `riesgo` (perfil y score) | CUU04; RF-037 a RF-043 |
| `capacitacion` (cursos, avance) | CUU05; RF-044 a RF-048 |
| `respuesta` (protocolos, acciones) | CUU06; RF-049 a RF-054 |
| `auditoria` | CUU07; RF-055 a RF-059 |
| `notificaciones` | Envío de correos y avisos transversales |

## Reglas de dependencia

1. `web` solo se comunica con `api`, nunca directamente con `ml`, la base de datos ni Redis.
2. `api` es el único componente que accede a PostgreSQL y el único dueño de las migraciones.
3. `ml` no tiene estado persistente y no accede a la base de datos.
4. Un módulo de `api` no accede a las tablas de otro módulo: lo usa a través de su interfaz pública (servicio exportado) o de eventos.
5. Dentro de cada módulo, las capas dependen hacia adentro: `http` → `application` → `domain`, e `infrastructure` → `application`/`domain`. `domain` no importa NestJS, Drizzle ni ninguna librería de infraestructura.
6. Las integraciones externas (proveedor de identidad, correo, LLM, ledger) se usan siempre a través de un puerto (interfaz) que tiene una implementación falsa para pruebas.
7. Todo acceso a datos de negocio se filtra por la empresa (`cuit`) de la sesión (RNF-001).

## Estructura del repositorio

Las carpetas marcadas con * todavía no existen.

```
GhostWall/
├─ .claude/                settings.json, rules/, skills/, hooks/ (Claude Code, ver claude-code.md)
├─ .github/
│  └─ workflows/           ci.yml (integración continua, ver testing.md)
├─ apps/
│  ├─ web/                 Next.js
│  └─ api/                 NestJS — src/modules/<modulo>/{domain,application,infrastructure,http},
│                          src/db (esquema), drizzle/ (migraciones), test/{http,integration,support}
├─ services/
│  └─ ml/                  FastAPI + uv
├─ packages/
│  ├─ contracts/*          esquemas Zod, enums compartidos, clientes OpenAPI generados
├─ infra/
│  └─ compose/             compose.yaml (el realm de Keycloak todavía no existe)
├─ docs/
│  ├─ requirements/        requisitos, ambigüedades, trazabilidad
│  ├─ decisions/           ADR
│  ├─ architecture.md · database.md · api.md · testing.md
│  └─ (documentos originales de la cátedra y de las entregas)
├─ CLAUDE.md
├─ package.json · package-lock.json · tsconfig.base.json · eslint.config.mjs
└─ .editorconfig · .gitignore · .gitattributes · .nvmrc · .npmrc · .prettierrc.json · .env.example
```

Diferencia con la estructura planificada en la fase de diseño: la configuración compartida de TypeScript y ESLint quedó en archivos de la raíz (`tsconfig.base.json`, `eslint.config.mjs`) en lugar de un paquete `packages/config`, porque un paquete aparte no aporta nada mientras haya una sola configuración. `packages/contracts` se creará cuando exista el primer contrato compartido.

## Discrepancias con D4 §13.1

| D4 | Prototipo | Registro |
|---|---|---|
| 4 microservicios | 2 servicios con módulos | [ADR 0003](decisions/0003-forma-de-la-arquitectura.md), aceptada |
| Kubernetes | Docker Compose | [ADR 0011](decisions/0011-entorno-docker-compose.md), aceptada |
| Hyperledger Fabric | Cadena de hashes en PostgreSQL detrás de `AuditLedger` | [ADR 0013](decisions/0013-registro-de-auditoria.md), aceptada |
| Feast Feature Store | Tabla + caché detrás de `FeatureRepository` | [ADR 0014](decisions/0014-feature-store.md), aceptada |
| Next.js 14 | Next.js 16 | [ADR 0004](decisions/0004-frontend.md) |
| API Gateway (Nginx/Envoy) | No previsto en el prototipo; `web` llama directamente a `api` | Sin ADR; se revisará al definir el despliegue (P3) |
