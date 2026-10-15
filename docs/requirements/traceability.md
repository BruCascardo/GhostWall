# Trazabilidad requisito → prueba

La columna *Estado* indica si la prueba está implementada (con su ubicación), si puede escribirse con los requisitos actuales o si depende de una ambigüedad abierta. Los niveles de prueba se definen en [../testing.md](../testing.md).

Cuando se implemente una prueba, su nombre o descripción debe incluir el ID (por ejemplo `T-001`) y el requisito que verifica, para poder rastrearla desde esta tabla.

| Prueba | Requisitos | Nivel | Qué verifica | Estado |
|---|---|---|---|---|
| T-001 | RF-001 | Unitaria + integración | Validación del CUIT (formato y dígito verificador); un CUIT duplicado se rechaza | **Implementada** (2026-10-14): `apps/api/src/modules/empresas/domain/cuit.spec.ts` y `apps/api/test/integration/empresa.int-spec.ts`. Falta la validación en el caso de uso de alta, que todavía no existe. El caso "cálculo = 10" depende de AMB-37 |
| T-002 | RF-007, RF-008 | Unitaria + integración | Transiciones válidas e inválidas del estado de la empresa | **Parcial:** la base acepta solo los 3 estados documentados (`empresa.int-spec.ts`). Las transiciones están sin implementar |
| T-003 | RF-011 | Unitaria | Descuentos y ejemplos de D4 §6.2.3 (120 / 1.296 / 800 / 8.640 / 4.200 / 45.360 USD) y prorrateo | Bloqueada parcialmente (AMB-31) |
| T-004 | RF-015, RNF-002 | Unitaria + seguridad | Ni el email ni el nombre aparecen en texto plano en la base de datos ni en los logs | Lista para especificar (AMB-20 resuelta por ADR 0015) |
| T-005 | RF-016, RF-017, RF-018, RNF-006 | Integración | Token con firma inválida o vencido, cuenta suspendida, MFA requerido | Bloqueada parcialmente (AMB-18; AMB-02 resuelta por ADR 0008) |
| T-006 | RF-020, RF-058 | Integración | Matriz de autorización: cada rol contra cada operación | Lista para especificar |
| T-007 | RF-023 | Unitaria | Se rechaza una campaña sin técnica MITRE válida | Lista para especificar |
| T-008 | RF-025 a RF-028 | Unitaria (reloj simulado) | Estados del intento; IGNORO exactamente a las 72 h | Bloqueada (AMB-10) |
| T-009 | RF-026, RNF-018 | Seguridad | La credencial ingresada en la simulación nunca se persiste ni se registra en logs | Bloqueada (AMB-09) |
| T-010 | RF-036 | Unitaria | Un falso positivo no modifica el score de quien reporta | Lista para especificar |
| T-011 | RF-039, RF-041 | Unitaria + propiedades | Suma de pesos = 1; rango de cada factor; más fallos ⇒ score mayor o igual; capacitación aprobada ⇒ score menor o igual | Bloqueada (AMB-13) |
| T-012 | RF-040, RNF-001 | Integración | La empresa A no puede leer ni afectar datos de la empresa B | Lista para especificar |
| T-013 | RF-045 | Unitaria | La reducción por capacitación se aplica una sola vez por módulo | Bloqueada parcialmente (magnitud) |
| T-014 | RF-049 a RF-053 | Integración (proveedor de identidad simulado) | Disparo de acciones, alarma si el proveedor rechaza la orden, orden respecto del ledger | Bloqueada (AMB-14, AMB-15) |
| T-015 | RF-055 a RF-059 | Integración | No se puede modificar ni borrar un registro; el hash del reporte exportado verifica | Bloqueada parcialmente (AMB-16; AMB-17 resuelta por ADR 0013) |
| T-016 | RF-060, RF-061, RA-001 | End-to-end | El dashboard muestra indicadores calculados a partir de datos sembrados conocidos | Lista para especificar |
| T-017 | RNF-010 | Evaluación de modelo | F1 ≥ 0,90 y falsos positivos < 5 % sobre un conjunto de prueba retenido | Bloqueada (P11: dataset) |
| T-018 | RNF-011 | Pipeline de CI | SAST y escaneo de imágenes obligatorios para aceptar cambios | Pendiente de la fase de CI |
| T-019 | RNF-003, RNF-004 | Configuración | Se rechaza TLS menor a 1.3; las columnas críticas están cifradas | Depende del despliegue (P3) |
| T-020 | ADR 0012 | Unitaria | `api` valida su configuración al arrancar (puerto por defecto, límites 1 y 65535, valores inválidos) | **Implementada:** `apps/api/src/config.spec.ts` |
| T-021 | ADR 0012 | Unitaria | `ml` valida su configuración y no lee archivos `.env` del disco | **Implementada:** `services/ml/tests/test_config.py` |
| T-022 | [api.md](../api.md#errores) | HTTP | Los errores responden en formato `problem+json` con un `code` estable | Pendiente: hoy `api` responde los errores con el formato por defecto de NestJS (comprobado: 404 en `test/http/health.http-spec.ts`) |

## Requisitos sin prueba automatizada prevista

| Requisitos | Motivo |
|---|---|
| RNF-008, RNF-009, RNF-022 | Dependen de infraestructura productiva; no son verificables en el prototipo. Pueden cubrirse parcialmente con pruebas de estrés si el alcance lo incluye (P3). |
| OBJ-001 a OBJ-003 | Objetivos de negocio. |
| RA-003, RA-005 | Entregables académicos; se verifican por revisión. |
