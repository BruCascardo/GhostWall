# ADR 0013 — Interfaz `AuditLedger` con una cadena de hashes en PostgreSQL

- **Estado:** Aceptada (2026-10-14; ver [Aprobación](#aprobación))
- **Fecha:** 2026-10-14
- **Requisitos:** RF-050, RF-055 a RF-059, RNF-007, RNF-021, OBJ-003; AMB-15, AMB-16, AMB-17

## Contexto

D4 registra los eventos críticos en una red Hyperledger Fabric. La documentación oficial de Fabric exige WSL2 con una distribución Linux y Docker Desktop. En la máquina relevada solo existe la distribución `docker-desktop`. La última versión publicada de Fabric es la v3.1.5 (GitHub, junio de 2026).

## Alternativas

| Alternativa | Ventajas | Desventajas |
|---|---|---|
| Fabric real | Fiel a D4 | Varios contenedores (peers, orderer, CA), chaincode y alto consumo de memoria |
| **Interfaz `AuditLedger` + cadena de hashes en PostgreSQL**, con un adaptador opcional para Fabric | Integridad verificable (cada registro incluye el hash del anterior; la base de datos rechaza UPDATE y DELETE); se puede probar; sirve también para el plan Starter (AMB-17) | No es una blockchain distribuida: OBJ-003 no se cumple literalmente |
| Tabla común | Lo más simple | No ofrece inmutabilidad (incumple RNF-007) |

## Decisión

Implementar la interfaz y la cadena de hashes en PostgreSQL. El adaptador de Fabric queda como objetivo adicional, sujeto al alcance que se defina en P3.

## Aprobación

Se adoptó la opción recomendada según la regla del equipo del 2026-10-14 (ver [README.md](README.md#estados)). Resuelve AMB-17: todos los planes usan el mismo mecanismo de auditoría.

**Siguen abiertas:** AMB-15 (escritura síncrona o asíncrona) y AMB-16 (derecho al olvido). Esta decisión no las resuelve.

**Motivo:** cumple los requisitos verificables de integridad (RF-055 a RF-059) con un costo compatible con el plazo y el hardware.

## Impacto en la documentación aprobada

| Documento | Qué cambia |
|---|---|
| D4 §8.1 (punto 3) y §8.2.3 (capa de inmutabilidad) | En el prototipo, el registro inmutable es una cadena de hashes en PostgreSQL; Fabric queda como implementación objetivo |
| D4 §13.1 y diagrama de despliegue (D9) | Se elimina la red Fabric del prototipo; el microservicio de auditoría no usa el Fabric SDK |
| CUU07 (D4 §8.4.9) | La precondición "red Hyperledger Fabric operativa" pasa a "registro de auditoría operativo". La precondición de negocio `incluye_blockchain=true` deja de limitar la auditoría |
| D4 §6.2.2 (planes) | La fila "Auditoría inmutable (Blockchain)" podría describirse como "Auditoría inmutable". Es una decisión comercial del equipo |
| D4 §1.2 (OBJ-003) | El objetivo "100 % de auditorías sobre Blockchain" no se cumple en el prototipo |
