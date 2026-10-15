# Cambios pendientes en la documentación aprobada

Índice de las secciones de las entregas que quedaron desactualizadas por decisiones técnicas o por resoluciones de ambigüedades. **Ningún documento original fue modificado.** Este índice permite que el equipo los actualice después, con la justificación de cada ADR o resolución.

El detalle de cada cambio está en la sección *Impacto en la documentación aprobada* del ADR, o en la columna *Resolución* de [../requirements/ambiguities.md](../requirements/ambiguities.md). Aquí solo se listan las secciones afectadas, para no duplicar el contenido.

## Por decisiones técnicas (ADR)

| Sección de D4 (3ª entrega) | Origen |
|---|---|
| §1.2 (objetivo de auditoría 100 % blockchain) | [ADR 0013](0013-registro-de-auditoria.md) |
| §4.1, §5.2.1 (stack de frontend) | [ADR 0004](0004-frontend.md), [ADR 0003](0003-forma-de-la-arquitectura.md) |
| §5.2.3 (alta disponibilidad) | [ADR 0011](0011-entorno-docker-compose.md) |
| §6.2.2 (fila "Auditoría inmutable (Blockchain)") | [ADR 0013](0013-registro-de-auditoria.md) — decisión comercial del equipo |
| §8.1, §8.2.3 (capa de inmutabilidad) | [ADR 0013](0013-registro-de-auditoria.md) |
| §8.2.1 (`hash_identidad`), §8.3 y DER (D8) (`contacto_empleado`) | [ADR 0015](0015-seudonimizacion.md) |
| §8.2.2 (capa analítica / Feast) | [ADR 0014](0014-feature-store.md) |
| §8.4.6 CUU04 (precondición Feast) | [ADR 0014](0014-feature-store.md) |
| §8.4.8 CUU06, §13.3 (destino de la revocación y el MFA) | [ADR 0008](0008-identidad-y-autorizacion.md) |
| §8.4.9 CUU07 (precondiciones Fabric y `incluye_blockchain`) | [ADR 0013](0013-registro-de-auditoria.md) |
| §8.4.10 CUU08 (proveedor de identidad, SCIM, RN3) | [ADR 0008](0008-identidad-y-autorizacion.md), [ADR 0015](0015-seudonimizacion.md) |
| §8.4.11 CUU09 (proveedor de identidad) | [ADR 0008](0008-identidad-y-autorizacion.md) |
| §10.4 (GSC "Procesamiento distribuido"; revisión opcional) | [ADR 0003](0003-forma-de-la-arquitectura.md) |
| §11 (T5.1 "Pruebas de estrés en Kubernetes") | [ADR 0011](0011-entorno-docker-compose.md) |
| §12 (R3, "seudonimización irreversible") | [ADR 0015](0015-seudonimizacion.md) |
| §13.1, §14.2 y diagrama de despliegue (D9) | [ADR 0003](0003-forma-de-la-arquitectura.md), [0004](0004-frontend.md), [0008](0008-identidad-y-autorizacion.md), [0011](0011-entorno-docker-compose.md), [0013](0013-registro-de-auditoria.md), [0014](0014-feature-store.md) |

## Por resoluciones de ambigüedades

| Sección | Origen |
|---|---|
| D5 y D7 (artefactos de casos de uso): quedan superados por D4 §8.4 | AMB-05, AMB-36 |
| D13 (Abstract), D14: lista de gatillos psicológicos; se usa la de D4 §13.2.1 | AMB-32 |
| D4 §8.2.1 (nombre de la tabla `campania`/`campaña`) | Propuesta de nombre en [../database.md](../database.md#nombres-en-el-esquema) |
