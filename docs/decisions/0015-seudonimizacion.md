# ADR 0015 — Seudonimización con HMAC-SHA-256 por empresa y contacto cifrado

- **Estado:** Aceptada (2026-10-14; ver [Aprobación](#aprobación))
- **Fecha:** 2026-10-14
- **Requisitos:** RF-015, RF-062, RNF-002, RNF-004; AMB-20, P7

## Contexto

D4 §8.2.1 define `hash_identidad` como un SHA-256 del nombre o el email. Un SHA-256 sin clave aplicado a emails se puede revertir probando direcciones probables (ataque de diccionario). Además, el sistema necesita contactar a los empleados (envío de simulaciones y notificaciones), y la documentación no define dónde se guarda el email (AMB-20).

## Decisión

1. `hash_identidad = HMAC-SHA-256(clave_secreta_de_la_empresa, identificador normalizado)`. Sigue siendo SHA-256, pero no puede revertirse sin conocer la clave.
2. Tabla `contacto_empleado` con el email cifrado (AES-256-GCM, coherente con RNF-004), accesible solo desde el módulo de notificaciones.
3. Las claves se gestionan como secretos y nunca se versionan.

## Aprobación

Se adoptó la opción recomendada según la regla del equipo del 2026-10-14 (ver [README.md](README.md#estados)). Resuelve P7 y AMB-20.

**Motivo:** cierra el hueco de contacto y fortalece la seudonimización exigida por la Ley 25.326 sin cambiar el concepto documentado.

## Impacto en la documentación aprobada

| Documento | Qué cambia |
|---|---|
| D4 §8.2.1 (`usuario.hash_identidad`) | "Token SHA-256" pasa a "HMAC-SHA-256 con clave secreta por empresa" |
| D4 §8.3 y DER (D8) | Nueva entidad `contacto_empleado` (email cifrado, 1:1 con `usuario`) |
| CUU08 RN3 (D4 §8.4.10) | Se agrega que el email se conserva solo cifrado y para notificaciones |
| D4 §12 (R3) | "Seudonimización irreversible": irreversible sin la clave; con la clave, el sistema puede volver a calcular el hash a partir del identificador |
