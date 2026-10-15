# Ambigüedades, contradicciones y preguntas abiertas

Este documento registra diferencias y huecos detectados en las fuentes. Cada fila queda abierta hasta que el equipo o el profesor la decidan, y la decisión se registra en la columna *Resolución*.

Cuando existía una opción propuesta, se aplicó la regla del equipo del 2026-10-14 (ver [../decisions/README.md](../decisions/README.md#regla-del-equipo-2026-10-14)). Las secciones de las entregas afectadas están en [../decisions/cambios-a-la-documentacion.md](../decisions/cambios-a-la-documentacion.md).

Fuentes y convenciones: ver [README.md](README.md).

## Bloque A — Afectan el alcance y la arquitectura

| ID | Qué dicen las fuentes | Interpretación 1 → consecuencia | Interpretación 2 → consecuencia | Resolución |
|---|---|---|---|---|
| AMB-01 | No se sabe qué entregas están aprobadas. D4 vence el 26/10/2026 (D1), pero se declara "Versión Final 08/09/2026". | D4 aprobada → es la fuente principal. | D4 no aprobada → solo D2 y D3 son fuente; RF-012 y siguientes quedan en revisión. | Pendiente (P1) |
| AMB-02 | D4 §10.5 (mitigación R4) difiere la integración con M365, Google, Okta y Entra y la facturación multimoneda "a una etapa posterior a la defensa". CUU06, CUU08 y CUU09 dependen de un proveedor de identidad externo, y CUU09 RN1 prohíbe almacenar contraseñas. | Proveedor de identidad real → requiere un tenant de prueba y credenciales externas. | Se respeta R4 → hace falta un proveedor de identidad sustituto (propuesta: [ADR 0008](../decisions/0008-identidad-y-autorizacion.md)). | Resuelta: [ADR 0008](../decisions/0008-identidad-y-autorizacion.md) |
| AMB-03 | El Gantt preliminar (D11) promete para la entrega final Kubernetes, Fabric, LLM y TTS, integraciones con AD, M365, SIEM e IAM y pruebas de estrés. El plan de D4 §11 ubicaba la construcción desde junio; el repositorio no tiene código. | Alcance completo → alto riesgo de no cumplir RA-004. | MVP acotado → hay que acordar qué es real y qué se simula. | Parcial: la forma técnica se fijó en los ADR 0003, 0011, 0013 y 0014; el alcance funcional sigue abierto (P3) |
| AMB-15 | CUU06 RN1 exige registrar en el ledger **antes** de considerar ejecutada la acción. CRE RN3 y el diagrama de actividad la describen como **asíncrona**; D4 §12 (R2) propone colas y un respaldo en Redis. | Escritura síncrona → el bloqueo depende de que el ledger esté disponible. | Escritura asíncrona → contradice CUU06 RN1. | Pendiente (P5) |
| AMB-16 | D4 §12 (R3) prevé un "borrado lógico selectivo (derecho al olvido)". CUU07 RN1 dice que ningún registro puede eliminarse, y CUU04 RN3 que el historial no se elimina. | Prevalece la inmutabilidad → riesgo frente a la Ley 25.326. | Prevalece el derecho al olvido → el ledger solo guarda referencias o hashes. | Pendiente (P5) |
| AMB-17 | CUR RN3 exige auditar todas las acciones, pero el plan Starter no incluye blockchain (precondición de CUU07). | Starter audita en PostgreSQL → dos mecanismos distintos. | Starter no audita → contradice CUR RN3. | Resuelta: [ADR 0013](../decisions/0013-registro-de-auditoria.md) (mismo mecanismo para todos los planes) |
| AMB-26 | Elastic Stack, S3/MinIO y Kafka/RabbitMQ aparecen en D4 §5.2.1, §5.4.1 y §12, pero no en el diseño (§13.1) ni en el diagrama de despliegue. | El diseño define el alcance → se omiten. | La factibilidad también obliga → más infraestructura. | Parcial: Kafka/RabbitMQ → BullMQ ([ADR 0010](../decisions/0010-tareas-asincronas.md)); Elastic y S3/MinIO siguen abiertos (P3) |
| AMB-27 | El proveedor de LLM figura como API de OpenAI en D4 §5.4.1 y como modelos open source en §5.2.1. | API comercial → requiere clave y presupuesto. | Modelo local → no es viable en el hardware relevado (ver [../architecture.md](../architecture.md)). | Pendiente (P10) |

## Bloque B — Afectan el modelo de datos y las reglas

| ID | Contradicción o hueco | Resolución |
|---|---|---|
| AMB-04 | CUR p1 dice que el Administrador de Seguridad inscribe a la empresa; en CUU01 lo hace el Ejecutivo de Ventas, y CUU08 crea al Administrador recién después del alta. | Pendiente (P6) |
| AMB-05 | En CUU01 p3, D5 fija el plan "Enterprise"; D4 (posterior) permite elegir cualquiera. Propuesta: prevalece D4. | Resuelta (regla del equipo 2026-10-14): prevalece D4 |
| AMB-06 | CUU01 RN2 valida el mínimo de usuarios al registrar la empresa, pero los usuarios se crean después (CUU08). ¿Contra qué cantidad se valida? | Pendiente |
| AMB-07 | CUU01 p4 dice "ciclo de suscripción mensual", pero también existen las modalidades anual y bianual. | Pendiente |
| AMB-08 | No hay pasarela de pago definida: no se sabe cómo se detecta un pago rechazado ni qué valores toma `factura.estado`. | Pendiente (P13) |
| AMB-09 | CUU02 p5 dice "el sistema captura este dato" (credenciales), mientras que RN2 prohíbe recolectar datos reales. A: se registra solo el evento. B: se guarda la credencial (riesgo frente a la Ley 25.326 y el art. 153 bis del Código Penal). | Pendiente (P8) |
| AMB-10 | CUU02 5.a: hay un clic (COMPROMETIDO_PARCIAL) y después un cierre (RESISTIO). ¿Es uno o dos intentos? D4 §8.3.3 define 2 resultados para `intento`; CUU02 usa 4. | Pendiente (P8) |
| AMB-11 | ¿La campaña es por área (dato de entrada) o por empleado (meta de CUU02)? ¿Es continua y automática (CUR) o la dispara el Administrador (CUU02)? ¿Con qué frecuencia? | Pendiente |
| AMB-12 | Vishing y smishing aparecen en el diccionario de datos y en el mapa de calor, pero no tienen flujo. El smishing no figura en los planes (§6.2.2) ni en §4.4. | Pendiente (P3) |
| AMB-13 | No se define cómo se calculan A, S, P y E ni los pesos ("calibrados por regresión"). Con −w₃·P el score puede ser negativo. No se definen la función de decaimiento ni el "incremento exponencial" de S. | Pendiente (P9) |
| AMB-14 | Umbrales: el texto de D4 §13.3 dice "ej. RiskScore >= 85"; la figura de §13.3 dice "> 85" (MFA, revocación, notificar al SOC) y agrega "> 70" (aislar sesión de correo, encolar microcontenido), que no está en el texto. CUU05 no define su umbral. Además, `protocolo_respuesta.umbral_riesgo` es configurable por empresa. | Pendiente (P9) |
| AMB-18 | La tabla `usuario` no tiene estado, pero CUU08 habla de "estado activo", CUU09 de "cuenta suspendida" y CUU06 bloquea usuarios. | Pendiente (P6) |
| AMB-19 | El Ejecutivo de Ventas es personal de GhostWall, pero `usuario.cuit` es una FK obligatoria a una empresa cliente. No está modelado el personal de la plataforma. | Pendiente (P6) |
| AMB-20 | Todo se almacena con un hash irreversible (D4 §12, R3), pero el sistema necesita escribirle al empleado y el Administrador necesita identificar a quién apoyar. No se define dónde vive la relación hash → email. | Resuelta: [ADR 0015](../decisions/0015-seudonimizacion.md) |
| AMB-21 | `incidente` mezcla los reportes de phishing con los tickets de soporte y asigna áreas internas de GhostWall ("Inteligencia Artificial", "Arquitectura de Microservicios") a incidentes del cliente. | Pendiente (P14) |
| AMB-22 | Requisitos sin caso de uso: configurar playbooks, gestionar el contenido de los cursos, ver el dashboard, facturación recurrente, tickets de soporte, programación de campañas. | Pendiente (P12) |
| AMB-23 | CUU05 exige que "el plan incluya el módulo adaptativo", pero según §6.2.2 todos los planes lo incluyen (Starter con rutas predefinidas). | Pendiente |
| AMB-25 | D8 no coincide con D4: IDs `serial` contra `UUID`; falta `usuario.rol` en D8; la tabla se llama `campania` o `campaña` según el lugar; el CUIT es VARCHAR(11), pero el ejemplo de §8.2.3 usa "20-12345678-9" (13 caracteres). | Pendiente |
| AMB-28 | Método de MFA: "celular" en CUU06 p3; "token de hardware o biométrico" en D4 §13.3. | Pendiente |
| AMB-29 | La meta de CUU06 es "aislar al empleado junto a su dispositivo", pero ninguna acción de D4 §13.3 aísla dispositivos. | Pendiente |
| AMB-30 | El monitoreo de logs e inicios de sesión de D13 y el factor A(u,t), que analiza el lenguaje del propio empleado en correos internos, no tienen caso de uso y tienen implicancias de privacidad. | Pendiente |
| AMB-31 | D4 §6.1 prevé un reajuste trimestral por IPC; §6.3.2, una actualización mensual por variación cambiaria. Además, "sin compromiso de permanencia (mínimo 3 meses)". | Pendiente (P13) |
| AMB-32 | La lista de gatillos psicológicos varía: 3 en D13, 4 en D14 y 5 en D4 §13.2.1. Propuesta: usar los 5 de D4. | Resuelta (regla del equipo 2026-10-14): se usan los 5 gatillos de D4 §13.2.1 |
| AMB-33 | No se define el efecto en el score cuando el correo reportado era una simulación de GhostWall. | Pendiente (P14) |
| AMB-34 | "Tiempo real" y "baja latencia" no están cuantificados, por lo que no se pueden probar. | Pendiente |
| AMB-37 | Validación del CUIT cuando el cálculo módulo 11 da 10: según una fuente, AFIP reasigna el prefijo 23; según otra, el dígito pasa a 9. No se encontró una fuente oficial. Además, el ejemplo de D4 §8.2.3 ("20-12345678-9") tiene un dígito verificador incorrecto (corresponde 6). Implementación actual: ese caso se rechaza, por ser lo más conservador. | Pendiente (consultar una fuente oficial de ARCA) |

## Bloque C — Solo documentales

| ID | Descripción | Resolución |
|---|---|---|
| AMB-24 | D4 §14.1 asigna actores distintos a los del diagrama (CUU05, CUU06, CUU07, CUU08/09) y cita al CRE como "Sección 8.4.9" (es §8.4.2). | Pendiente |
| AMB-35 | Propuesta de excluir D6, D14 y D17 como fuentes. | Resuelta (regla del equipo 2026-10-14): D6, D14 y D17 excluidas |
| AMB-36 | Propuesta: D4 prevalece sobre D5 y D7. | Resuelta (regla del equipo 2026-10-14): D4 prevalece |

## Preguntas abiertas

"Bloquea" indica si hace falta la respuesta antes de diseñar la parte afectada.

| ID | Pregunta | Para | Bloquea | Estado |
|---|---|---|---|---|
| P1 | ¿Qué documentos están aprobados? ¿La 3ª entrega ya fue aprobada? (AMB-01) | Equipo | Sí | Abierta |
| P2 | ¿Se excluyen D6, D14 y D17? ¿D4 prevalece sobre D5 y D7? (AMB-05, AMB-35, AMB-36) | Equipo | Sí | Resuelta (regla del equipo 2026-10-14) |
| P3 | Alcance del prototipo para el 18/12: ¿qué debe funcionar realmente y qué puede simularse? (AMB-03, AMB-12, AMB-26) | Equipo y profesor | Sí | Abierta |
| P4 | ¿Se acepta un proveedor de identidad local en lugar de M365, Google u Okta? (AMB-02) | Profesor | Sí | Resuelta: ADR 0008 |
| P5 | ¿Ledger síncrono o asíncrono? ¿Derecho al olvido? ¿Cómo se audita el plan Starter? (AMB-15, AMB-16, AMB-17) | Equipo | Antes del diseño de datos | Abierta |
| P6 | ¿Quién da de alta las empresas? ¿Cómo se modela el personal de GhostWall? ¿Estado del usuario? (AMB-04, AMB-18, AMB-19) | Equipo | Antes del diseño de datos | Abierta |
| P7 | ¿Dónde se guarda la relación hash → email? (AMB-20) | Equipo | Antes del diseño de datos | Resuelta: ADR 0015 |
| P8 | Semántica de los intentos y de la captura de credenciales (AMB-09, AMB-10) | Equipo | Antes del módulo de simulación | Abierta |
| P9 | Detalle de la fórmula del score y de los umbrales (AMB-13, AMB-14) | Equipo | Antes del módulo de scoring | Abierta |
| P10 | Proveedor de LLM, presupuesto y credenciales (AMB-27) | Equipo | Antes del módulo de simulación | Abierta |
| P11 | ¿Hay un dataset en español etiquetado para entrenar y evaluar el triage (RNF-010)? | Equipo | Antes del trabajo de ML | Abierta |
| P12 | ¿Los casos de uso faltantes (AMB-22) se incorporan a la documentación o se tratan como requisitos derivados? | Equipo y profesor | No | Abierta |
| P13 | Facturación: ¿pasarela real o simulada? ¿Reajuste por IPC o por variación cambiaria? (AMB-08, AMB-31) | Equipo | No | Abierta |
| P14 | ¿Se separan los tickets de soporte de los reportes de phishing? ¿Qué pasa al reportar una simulación? (AMB-21, AMB-33) | Equipo | No | Abierta |
