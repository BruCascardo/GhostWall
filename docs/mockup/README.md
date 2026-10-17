# Mockup navegable de GhostWall

Prototipo de validación de **qué debe hacer la aplicación**, con todas las pantallas previstas y datos sintéticos. No tiene funcionalidad real: no envía correos, no usa IA, no tiene base de datos y los hashes son simulados. Sirve para acordar el alcance con el equipo y el profesor (P3) antes de implementar.

## Cómo abrirlo

Abrí [index.html](index.html) con doble clic en cualquier navegador moderno. Necesita conexión a internet solo para las tipografías (Google Fonts) y los gráficos (ECharts 5.5.1 desde jsDelivr). El estado vive en memoria: **Reiniciar datos** o recargar la página lo devuelve al inicio.

La barra negra superior es del mockup, no de la aplicación:

- **Ver como:** cambia de rol (Administrador de Seguridad, Empleado, Auditor, Ejecutivo de Ventas). Cada rol ve su propio menú.
- **Plan de la empresa:** Starter, Profesional o Enterprise. Bloquea o habilita módulos según D4 §6.2.2 (RF-010).
- **Anotaciones de requisitos:** muestra en cada pantalla los `RF`/`RNF` que cubre y las `AMB` abiertas que la afectan.
- **Guía del mockup:** recorridos sugeridos, decisiones abiertas y el mapa pantalla → requisitos.

## Qué incluye

| Rol | Pantallas |
|---|---|
| Administrador de Seguridad | Panel de riesgo (velocímetro, mapa de calor, tendencia), simulaciones (asistente con IA, detalle con embudo), reportes de phishing con triage NLP, empleados seudonimizados y perfil de riesgo, riesgo por área, capacitación, respuesta automatizada (editor de playbooks con arrastrar y soltar), auditoría, verificación de reportes, cumplimiento ISO/NIST, usuarios y accesos, integraciones, configuración, suscripción y soporte |
| Empleado | Inicio con ruta de aprendizaje, correo simulado (con una simulación y un phishing real), página falsa de la simulación y pantalla de feedback, reporte de correos, cursos con video y cuestionario, logros y ranking por áreas, mis reportes, ayuda y cuenta en cuarentena |
| Auditor | Auditoría con filtros, verificación de la cadena, exportación con MFA, verificación de un reporte exportado, cumplimiento y panel en solo lectura |
| Ejecutivo de Ventas | Empresas cliente y su ciclo de estados, alta de empresa (CUIT validado, plan, contrato, administrador), facturación, planes y calculadora, tickets de soporte |
| Todos | Ingreso por SSO (pantalla del proveedor de identidad), MFA para acciones de alto privilegio |

## Propuestas a validar

El mockup toma decisiones donde la documentación no las define. Están marcadas en cada pantalla y resumidas en la guía. Las principales:

- El empleado ve un "nivel de protección" (100 − score) en lugar de su score de riesgo (RNF-019).
- El Administrador puede revelar el contacto de un empleado con MFA, y la acción queda auditada (RF-062, ADR 0015).
- Los tickets de soporte se separan de los reportes de phishing (AMB-21).
- Reportar una simulación de GhostWall cuenta como RESISTIÓ (AMB-33).
- El formulario falso de la simulación registra solo el evento, nunca lo que se escribe (AMB-09).
- Estados de factura EMITIDA, PAGADA y RECHAZADA (AMB-08).
- ABM de cursos por el Administrador y complemento "Reportar phishing" para el cliente de correo (AMB-22).
- Matriz de permisos por rol (Usuarios y accesos → Roles y permisos).

Ninguna de estas propuestas cambia los ADR ni el catálogo de requisitos. Si el equipo las acepta, hay que registrarlas en [../requirements/ambiguities.md](../requirements/ambiguities.md) o en un ADR.

## Limitaciones

- Los valores (pesos de la fórmula, umbrales, métricas del modelo, tipo de cambio) son de ejemplo.
- El texto generado "por IA" son plantillas fijas.
- El mockup no reemplaza al diseño de `apps/web`: es un único archivo HTML con JavaScript sin dependencias de compilación, fuera de `npm run verify`.
