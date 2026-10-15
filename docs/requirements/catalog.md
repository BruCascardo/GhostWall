# Catálogo de requisitos

Convenciones, fuentes (D1–D17) y estados: ver [README.md](README.md). Las ambigüedades citadas están en [ambiguities.md](ambiguities.md).

## Restricciones académicas (RA)

| ID | Requisito | Fuente | Estado |
|---|---|---|---|
| RA-001 | El sistema debe incluir herramientas para la toma de decisiones: indicadores, gráficos o reportes basados en datos del sistema, para gerentes o administradores | D1 p.3 (a) | C |
| RA-002 | El sistema debe aplicar buenas prácticas de seguridad | D1 p.3 (b) | C |
| RA-003 | Última entrega: prototipo; codificación (justificación del lenguaje y de las herramientas de decisión); prueba; manuales de usuario; cronograma de capacitación; seguridad | D1 p.4 | C |
| RA-004 | Fecha límite del prototipo: 18/12/2026 | D1 p.1 | C |
| RA-005 | La documentación respeta la Ord. 1825: encabezado (título y apellidos), pie (etapa y página), citas APA y versión anterior adjunta en las entregas parciales | D1 p.1–2 | C |

## Requisitos funcionales (RF)

### Comercial y empresas cliente

| ID | Requisito | Fuente | Estado |
|---|---|---|---|
| RF-001 | Dar de alta una empresa con CUIT y razón social; rechazar un CUIT inválido o duplicado | CUU01 p1–2, 2.a, RN1 | C |
| RF-002 | Crear un entorno aislado por empresa (multi-tenant) | CUU01 p2; D4 §8.1 | C |
| RF-003 | Seleccionar plan Starter, Profesional o Enterprise | CUU01 p3 | C/A (AMB-05) |
| RF-004 | Generar el contrato (fecha de firma, plazo, jurisdicción Rosario) y la suscripción con modalidad MENSUAL, ANUAL_PREPAGA o BIANUAL | CUU01 p4, RN3–4; D4 §7.1 | C/A (AMB-07) |
| RF-005 | La cantidad de usuarios debe ser mayor o igual al mínimo del plan | CUU01 RN2; D4 §6.2.2 | C/A (AMB-06) |
| RF-006 | Emitir y enviar por correo la primera factura y las facturas periódicas | CUU01 p5; D4 §10.2.2 | C/A (AMB-08) |
| RF-007 | Si el pago es rechazado, la empresa pasa a SUSPENDIDO, se envía un aviso de regularización y se conservan los datos | CUU01 5.a, RN5 | C |
| RF-008 | Estados de la empresa ACTIVO, SUSPENDIDO e INACTIVO, con las transiciones del diagrama de estados | D4 §8.2.1, §14.3; D9 | C |
| RF-009 | Cancelación con preaviso de 30 días; penalidad del 20 % del saldo en contratos prepagos | D4 §6.3.3 | C |
| RF-010 | Habilitar módulos según el plan contratado | D4 §6.2.2; D8 (`plan`) | C/A (AMB-23) |
| RF-011 | Reglas de precio: valor por usuario por mes, 10 % de descuento anual, 15 % bianual, prorrateo de altas, bajas desde el período siguiente, prueba de 30 días (Starter, 15 usuarios) y facturación en ARS | D4 §6.1–6.3 | C/A (AMB-31) |

### Identidad y acceso

| ID | Requisito | Fuente | Estado |
|---|---|---|---|
| RF-012 | Invitar al primer Administrador de Seguridad y vincular su identidad vía OAuth2/OIDC | CUU08 p1–4 | C/A (AMB-02) |
| RF-013 | Sincronizar empleados vía SCIM/LDAP con rol EMPLEADO | CUU08 *.a | C |
| RF-014 | El Administrador da de alta Auditores con permiso de solo lectura | CUU08 *.b | C |
| RF-015 | Generar `hash_identidad` (SHA-256); no persistir nombre ni email en texto plano | CUU08 RN3; D4 §8.2.1 | C/A (AMB-20) |
| RF-016 | Login delegado al proveedor de identidad (Authorization Code Flow), validación de firma y vigencia del token y sesión con alcance según el rol | CUU09 p1–5 | C |
| RF-017 | Exigir MFA para acciones de alto privilegio (exportar evidencia, recuperar acceso) | CUU09 4.a | C |
| RF-018 | Rechazar el acceso de cuentas suspendidas o inexistentes y notificar al Administrador | CUU09 4.b | C/A (AMB-18) |
| RF-019 | Registrar en auditoría los intentos fallidos de autenticación que superen un umbral configurado | CUU09 RN3 | C/A (umbral no definido) |
| RF-020 | Control de acceso por roles (RBAC) con los roles ADMINISTRADOR_SEGURIDAD, EMPLEADO, AUDITOR y EJECUTIVO_VENTAS | D4 §8.2.1; CUU08 RN2 | C/A (AMB-19) |

### Simulación de ataques (CUU02)

| ID | Requisito | Fuente | Estado |
|---|---|---|---|
| RF-021 | El Administrador solicita una campaña indicando el tipo de ataque (PHISHING_EMAIL, VISHING_VOICE, SMS_SMISHING) y el área objetivo | CUU02 p1 y diccionario de datos | C/A (AMB-11, AMB-12) |
| RF-022 | La IA genera un correo contextual (organigrama, urgencia simulada) con un enlace inofensivo | CUU02 p2 | C/A (AMB-27) |
| RF-023 | Toda campaña se mapea a al menos una técnica MITRE ATT&CK válida (T1566, T1204, T1598) | CUU02 RN1; D4 §13.4 | C |
| RF-024 | Enviar el correo de la simulación al empleado | CUU02 p3 | C |
| RF-025 | Registrar el clic como intento COMPROMETIDO_PARCIAL con tiempo de respuesta | CUU02 p4 | C/A (AMB-10) |
| RF-026 | Si ingresa credenciales: resultado COMPROMETIDO, advertencia al empleado y recálculo del score | CUU02 p5 | C/A (AMB-09) |
| RF-027 | Si no interactúa en 72 h, registrar IGNORO | CUU02 4.a | C |
| RF-028 | Si identifica el engaño y cierra sin ingresar datos, registrar RESISTIO | CUU02 5.a | C/A (AMB-10) |
| RF-029 | Pantalla de feedback inmediato con las señales de alerta, sin enfoque punitivo | D4 §13.5.2 | C |
| RF-030 | Evaluación continua, sin aviso previo, según el área | CUR p2, RN2 | C/A (AMB-11) |
| RF-031 | Simulaciones de vishing (audio generado por IA) en los planes Profesional y Enterprise | D4 §4.4, §6.2.2 | C/A (AMB-12) |

### Reporte y triage (CUU03)

| ID | Requisito | Fuente | Estado |
|---|---|---|---|
| RF-032 | El empleado reporta un correo sospechoso; se crea un incidente ABIERTO y trazable (incluso si resulta falso positivo) y se informa al empleado | CUU03 p1, RN1 | C |
| RF-033 | El motor NLP clasifica el correo (sospechoso o no) y el gatillo psicológico (urgencia, autoridad, miedo, escasez, validación social) | CUU03 p2; D4 §13.2.1 | C/A (AMB-32) |
| RF-034 | Si es sospechoso: prioridad CRÍTICA, estado ESCALADO y notificación inmediata al Administrador | CUU03 p3, RN2 | C/A (AMB-21) |
| RF-035 | Si no es sospechoso: informar al empleado y cerrar como falso positivo | CUU03 1.a | C |
| RF-036 | Un falso positivo no afecta el score de quien lo reportó | CUU03 RN3 | C/A (AMB-33) |

### Scoring de riesgo (CUU04)

| ID | Requisito | Fuente | Estado |
|---|---|---|---|
| RF-037 | Recalcular el score automáticamente ante cada evento de simulación o capacitación | CUU04 RN1 | C |
| RF-038 | Actualizar el perfil de riesgo (tasa_clics, frecuencia_anomalias, cursos_completados, ultima_actividad) | CUU04 p2 | C |
| RF-039 | RiskScore(u,t) = w₁·A + w₂·S − w₃·P + w₄·E, con A, S, P, E ∈ [0,100] y w₁+w₂+w₃+w₄ = 1 | D4 §13.2.2 | C/A (AMB-13) |
| RF-040 | El score se calcula solo con datos de la propia empresa | CUU04 RN2 | C |
| RF-041 | El historial no se elimina; los eventos recientes pesan más que los antiguos | CUU04 RN3 | C/A (AMB-13, AMB-16) |
| RF-042 | Si un evento no puede procesarse, se encola para reintento | CUU04 (postcondición de fracaso) | C |
| RF-043 | Score por usuario, área, organización y tendencia temporal, según el plan | D4 §6.2.2 | C |

### Capacitación (CUU05)

| ID | Requisito | Fuente | Estado |
|---|---|---|---|
| RF-044 | Asignar el curso (video y cuestionario) del gatillo en el que el empleado mostró más debilidad; el avance queda PENDIENTE | CUU05 p1, RN1 | C/A (AMB-14) |
| RF-045 | Al aprobar: avance COMPLETADO, mensaje de logro y reducción del score una sola vez por módulo | CUU05 p3, RN2 | C/A (magnitud no definida) |
| RF-046 | Al reprobar: avance EN_CURSO, sin penalización adicional, y aviso al Administrador para revisar el contenido | CUU05 3.a, RN3 | C |
| RF-047 | Ruta de aprendizaje visual personalizada | D4 §13.5.2 | C |
| RF-048 | Gamificación (logros, ranking por áreas) | D4 §5.1.3, §6.2.2 | C/A |

### Respuesta automatizada (CUU06)

| ID | Requisito | Fuente | Estado |
|---|---|---|---|
| RF-049 | Al superar el umbral de un protocolo configurado: revocar tokens y sesiones, forzar MFA y poner la cuenta en cuarentena | CUU06; D4 §13.3 | C/A (AMB-14, AMB-29) |
| RF-050 | Registrar la acción en el registro de auditoría inmutable | CUU06 RN1 | C/A (AMB-15) |
| RF-051 | Si el proveedor de identidad rechaza la orden: alarma CRÍTICA al Administrador | CUU06 2.a, RN3 | C |
| RF-052 | Notificar al Administrador que el incidente fue contenido | CUU06 p4 | C |
| RF-053 | El acceso solo se restituye mediante MFA del propio empleado | CUU06 RN2 | C |
| RF-054 | Configurar protocolos de respuesta por empresa (nombre, umbral, acción) desde una consola visual | D4 §10.2.1, §13.5.1; D8 | C/A (AMB-22) |

### Auditoría (CUU07)

| ID | Requisito | Fuente | Estado |
|---|---|---|---|
| RF-055 | Registrar los eventos críticos (qué, cuándo, acción) con `hash_contenido` | CUU07 p1; D4 §8.2.3 | C |
| RF-056 | Filtrar la evidencia (rango de fechas, tipo de evento, hash_identidad) y exportar un reporte que incluya el hash de cada evento | CUU07 p3–4, RN3 | C |
| RF-057 | El Auditor puede verificar la autenticidad del reporte contra el registro | CUU07 p5 | C |
| RF-058 | Solo el Auditor y el Administrador de Seguridad pueden exportar evidencia | CUU07 RN2 | C |
| RF-059 | Ningún registro puede modificarse ni eliminarse | CUU07 RN1 | C/A (AMB-16) |

### Toma de decisiones (dashboard)

| ID | Requisito | Fuente | Estado |
|---|---|---|---|
| RF-060 | Índice de riesgo global (velocímetro con promedio móvil) | D4 §13.5.1 | C |
| RF-061 | Mapa de calor de áreas por tipo de ataque | D4 §13.5.1 | C |
| RF-062 | El Administrador visualiza a los empleados y detecta quién necesita apoyo | CUR p5 | C/A (AMB-20) |
| RF-063 | Consulta puntual del score de un empleado | D4 §10.2.3 | C |
| RF-064 | Informes de cumplimiento ISO/NIST (básicos, completos o personalizados según el plan) | D4 §6.2.2 | C/A |

### Integraciones y soporte

| ID | Requisito | Fuente | Estado |
|---|---|---|---|
| RF-065 | Integración con SIEM (Splunk, QRadar, Elastic), Microsoft 365 / Google Workspace y logs de firewall o proxy | D4 §5.2.2 | C/A (AMB-02, AMB-30) |
| RF-066 | Tickets de soporte (consultas y fallas) con triage y escalamiento | D4 §1.5.4; tabla `incidente` | C/A (AMB-21, AMB-22) |

## Requisitos no funcionales (RNF)

| ID | Requisito | Fuente | Estado |
|---|---|---|---|
| RNF-001 | Aislamiento lógico entre empresas (multi-tenant) | D4 §8.1; CUU04 RN2 | C |
| RNF-002 | Seudonimización: no persistir identificadores directos | D4 §8.2.1; CUU02 RN4 | C/A (AMB-20) |
| RNF-003 | TLS 1.3 en tránsito | D4 §13.4 | C |
| RNF-004 | Cifrado AES-256 en reposo (volumen y columnas críticas) | D4 §13.4 | C |
| RNF-005 | Zero Trust: menor privilegio y verificación explícita de cada transacción sensible | D4 §13.4; CUU09 RN2 | C |
| RNF-006 | GhostWall no almacena contraseñas propias; la autenticación es federada | CUU09 RN1 | C |
| RNF-007 | Registro de auditoría inmutable y con no repudio (Hyperledger Fabric según D4) | D4 §8.2.3 | C/A (AMB-16, AMB-17) |
| RNF-008 | Disponibilidad del 99,5 % mensual (planes Profesional y Enterprise) | D4 §6.3.2; anexo II §7.1 | C |
| RNF-009 | RPO ≤ 24 h y RTO ≤ 4 h ("propuestos") | D4 §12 (R6) | C |
| RNF-010 | Triage semántico con F1 ≥ 0,90 y tasa de falsos positivos < 5 % | D4 §9.2 | C |
| RNF-011 | Análisis SAST/DAST sobre el 100 % de los microservicios y escaneo de imágenes Docker | D4 §9.2 | C |
| RNF-012 | Procesamiento "en tiempo real" y "de baja latencia" | D4 §10.4; CUU04 | C/A (AMB-34) |
| RNF-013 | Arquitectura de microservicios con Docker, Kubernetes y API Gateway | D4 §13.1; D9 | C/A (AMB-03, AMB-26) |
| RNF-014 | Stack documentado: Next.js 14, React, Tailwind, D3/ECharts, Node.js + TypeScript, FastAPI, PostgreSQL, Redis + Feast, Hyperledger Fabric, BERT/RoBERTa | D4 §13.1, §5.2.1 | C/A (AMB-26; ver [../decisions/](../decisions/README.md)) |
| RNF-015 | Idioma español y adaptación regional (Argentina) | D4 §5.2.4, §5.5.2 | C |
| RNF-016 | Indicadores comprensibles sin formación técnica; portales responsivos | D4 §5.1.3, §13.5 | C |
| RNF-017 | Cumplimiento de la Ley 25.326: períodos de retención definidos y eliminación segura | D4 §5.3.1 | C/A (AMB-16) |
| RNF-018 | Uso ético: enlaces y adjuntos inofensivos; no se recolectan datos reales | CUU02 RN2; anexo II §3 | C |
| RNF-019 | Los resultados no se usan con fines punitivos | CUU02 RN3; anexo II §3.2 | C |
| RNF-020 | Generar evidencia para ISO 27001 (A.6.3, A.8.15), ISO 27002 (6.3) y NIST CSF 2.0 | D4 §5.3.1 | C |
| RNF-021 | Todas las acciones del sistema quedan disponibles para auditoría, sin excepción | CUR RN3 | C/A (AMB-17) |
| RNF-022 | Escalado horizontal, múltiples réplicas y despliegues sin interrupción | D4 §5.1.4, §5.2.3 | C (no verificable en el prototipo) |

## Objetivos de negocio (OBJ)

No son verificables mediante pruebas automatizadas del prototipo.

| ID | Objetivo | Fuente |
|---|---|---|
| OBJ-001 | Reducir el MTTR un 60 % frente a métodos manuales | D4 §1.2 |
| OBJ-002 | Reducir al menos un 40 % la tasa de susceptibilidad tras el primer ciclo de entrenamiento | D4 §1.2 |
| OBJ-003 | El 100 % de las auditorías se realiza sobre infraestructura blockchain | D4 §1.2 |
