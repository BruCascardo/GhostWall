# Base de datos

> **Fuente de verdad del modelo:** D4 §8.2–8.3 y el DER (D8); ver [requirements/README.md](requirements/README.md). Este documento resume el modelo, registra las discrepancias y define la estrategia técnica.

**Estado actual:** el esquema (`apps/api/src/db/schema.ts`) contiene solo la tabla `empresa`, con una migración (`apps/api/drizzle/0000_empresa.sql`), necesaria para la infraestructura de pruebas. Decisiones de implementación de esa tabla: `fecha_alta` usa `timestamp with time zone` (D4 dice "TIMESTAMP"; se guarda en UTC); `razon_social` es obligatoria (CUU01 la exige); `estado` vale `ACTIVO` por defecto (diccionario de datos de CUU01, paso 2).

## Motor y herramientas

PostgreSQL 18, Drizzle ORM y drizzle-kit ([ADR 0006](decisions/0006-persistencia.md)). El servicio `api` es el único dueño del esquema.

## Entidades (según D4)

| Entidad | Clave primaria | Relaciones principales | Origen en D4 |
|---|---|---|---|
| `empresa` | `cuit` | — | §8.2.1 |
| `usuario` | `hash_identidad` | → `empresa` (`cuit`) | §8.2.1 |
| `campaña` | `id_campana` | → `empresa` | §8.2.1 |
| `perfil_riesgo` | `hash_identidad` | 1:1 con `usuario` | §8.2.2 (capa Feast, ver [ADR 0014](decisions/0014-feature-store.md)) |
| `contrato` | `id_contrato` | → `empresa` | §8.3.3 |
| `plan` | `id_plan` | — | §8.3.3 |
| `suscripcion` | `id_suscripcion` | → `contrato`, → `plan` | §8.3.3 |
| `factura` | `id_factura` | → `suscripcion` | §8.3.3 |
| `intento` | `id_intento` | → `usuario`, → `campaña` | §8.3.3 |
| `curso` | `id_curso` | — | §8.3.3 |
| `avance` | (`hash_identidad`, `id_curso`) | → `usuario`, → `curso` | §8.3.3 |
| `incidente` | `id_incidente` | → `usuario`, → `empresa` | §8.3.3 |
| `protocolo_respuesta` | (`cuit`, `nombre`) | → `empresa` | §8.3.3 |
| `registro_auditoria` | `id_transaccion` | → `empresa`, → `usuario` (opc.), → `protocolo_respuesta` (opc.) | §8.2.3 (capa ledger, ver [ADR 0013](decisions/0013-registro-de-auditoria.md)) |

Los campos, tipos y valores permitidos se consultan en D4 §8.2–8.3 y en los diccionarios de datos de cada caso de uso (D4 §8.4). No se replican aquí para evitar que las copias se desincronicen.

## Restricciones documentadas

| Restricción | Fuente |
|---|---|
| CUIT único (PK de `empresa`) | CUU01 RN1 |
| `empresa.estado` ∈ {ACTIVO, SUSPENDIDO, INACTIVO} | D4 §8.2.1 |
| `usuario.rol` ∈ {ADMINISTRADOR_SEGURIDAD, EMPLEADO, AUDITOR, EJECUTIVO_VENTAS}; `score_riesgo` es NULL si el rol no es EMPLEADO | D4 §8.2.1 |
| `campaña.tipo_ataque` ∈ {PHISHING_EMAIL, VISHING_VOICE, SMS_SMISHING}; `tecnica_mitre` obligatoria | D4 §8.2.1; CUU02 RN1 |
| `suscripcion.modalidad_pago` ∈ {MENSUAL, ANUAL_PREPAGA, BIANUAL}; `estado` ∈ {ACTIVA, CANCELADA, EN_PRUEBA} | D4 §8.3.3 |
| `avance.estado` ∈ {PENDIENTE, EN_CURSO, COMPLETADO} | D4 §8.3.3 |
| `incidente.estado` ∈ {ABIERTO, ESCALADO, CERRADO} | D4 §8.3.3 |
| `registro_auditoria` no admite modificación ni borrado | CUU07 RN1 |
| No se persisten nombre ni email en texto plano | CUU08 RN3 |

## Discrepancias y huecos

Detalle completo en [requirements/ambiguities.md](requirements/ambiguities.md). Afectan al esquema:

| ID | Tema |
|---|---|
| AMB-25 | Tipos de ID (`serial` en D8, `UUID` en D4), `usuario.rol` ausente en D8, nombre `campania`/`campaña`, formato del CUIT (11 frente a 13 caracteres) |
| AMB-10 | Valores de `intento.resultado` (2 en D4 §8.3.3; 4 en CUU02) |
| AMB-18 | `usuario` no tiene estado |
| AMB-19 | Personal de GhostWall sin empresa cliente |
| AMB-20 (resuelta) | Dónde se guarda el email — resuelta por [ADR 0015](decisions/0015-seudonimizacion.md): tabla `contacto_empleado` con el email cifrado |
| AMB-08 | Valores de `factura.estado` |
| AMB-21 | `incidente` mezcla reportes de phishing y tickets de soporte |

**Regla:** mientras una discrepancia no se resuelva, el esquema no debe implementar una interpretación sin registrarla en el ADR o en la resolución correspondiente.

## Nombres en el esquema

- Tablas y columnas en `snake_case`, en español y sin tildes ni ñ: `campana` en lugar de `campaña`, para evitar problemas de codificación en herramientas y clientes SQL. Adoptado por la regla del equipo del 2026-10-14; el cambio de nombre respecto de D4 figura en [decisions/cambios-a-la-documentacion.md](decisions/cambios-a-la-documentacion.md). El resto de AMB-25 sigue abierto.
- Valores enumerados en MAYÚSCULAS, tal como aparecen en D4.

## Estrategia de migraciones

1. El esquema se define en TypeScript dentro de `apps/api`. drizzle-kit genera **migraciones SQL versionadas** en el repositorio.
2. Una migración aplicada nunca se edita: los cambios se hacen con una migración nueva.
3. Toda migración se revisa en el PR y se aplica en las pruebas de integración sobre una base descartable (Testcontainers; ver [testing.md](testing.md)).
4. Los datos de prueba (*seeds*) son sintéticos y nunca contienen datos personales reales.
5. El aislamiento por empresa se refuerza con Row-Level Security en las tablas que tienen `cuit`.

**Comandos:** `npm run db:generate --workspace @ghostwall/api` genera una migración nueva a partir del esquema, sin conectarse a ninguna base. Las pruebas de integración aplican todas las migraciones a una base descartable ([testing.md](testing.md#base-de-datos-de-pruebas)). Todavía **no** hay un comando para aplicar migraciones a la base de desarrollo: se agregará cuando `api` se conecte a la base.
