# ADR 0008 — Identidad y autorización

- **Estado:** Aceptada (2026-10-14; ver [Aprobación](#aprobación))
- **Fecha:** 2026-10-14
- **Requisitos:** RF-012 a RF-020, RF-053, RNF-005, RNF-006; AMB-02, P4

## Contexto

CUU08 y CUU09 delegan toda la autenticación en el proveedor de identidad corporativo del cliente, y CUU09 RN1 prohíbe almacenar contraseñas. D4 §10.5 (mitigación R4) difiere las integraciones con M365, Google, Okta y Entra hasta después de la defensa.

## Alternativas

| Alternativa | Ventajas | Desventajas |
|---|---|---|
| Proveedor real (Entra ID o Google Workspace) | Máxima fidelidad a D4 | Requiere cuentas, tenants y credenciales externas; no se verificó que haya acceso gratuito para desarrollo |
| **Keycloak local** (`quay.io/keycloak/keycloak`, 26.8.1 al 2026-10-14) | Proveedor OIDC estándar; cumple CUU09 RN1; MFA con OTP; corre en Docker | Consume memoria; no ofrece SCIM nativo |
| Usuarios y contraseñas propios | Lo más simple | Viola CUU09 RN1 |

## Decisión

1. **Keycloak** como proveedor OIDC de desarrollo y demo, con un *realm* versionado y usuarios de prueba ficticios.
2. **web**: login con Authorization Code + PKCE del lado del servidor y sesión en una cookie `httpOnly`. La librería se elige después de una prueba corta: Better Auth (authjs.dev indica que Auth.js "ahora es parte de Better Auth") u `openid-client`.
3. **api**: valida el JWT con `jose` contra el JWKS de Keycloak. Un *guard* de NestJS aplica rol, empresa (`cuit`) y exigencia de MFA en las operaciones sensibles (RF-017).
4. La sincronización masiva de CUU08 *.a se reemplaza por una importación, porque Keycloak no ofrece SCIM nativo.

## Aprobación

Se adoptó la opción recomendada según la regla del equipo del 2026-10-14 (ver [README.md](README.md#estados)). Resuelve P4 y AMB-02.

**Motivo:** cumple la mitigación R4 de D4 §10.5 y la regla de no almacenar contraseñas (CUU09 RN1), sin depender de cuentas externas.

## Impacto en la documentación aprobada

| Documento | Qué cambia |
|---|---|
| CUU08 (D4 §8.4.10) | Precondición de sistema y camino *.a: en el prototipo, el proveedor es Keycloak y la sincronización SCIM/LDAP se reemplaza por importación |
| CUU09 (D4 §8.4.11) | El proveedor de identidad del prototipo es Keycloak; el flujo OIDC no cambia |
| CUU06 (D4 §8.4.8) y §13.3 | Las acciones de revocación y MFA se ejecutan contra Keycloak, no contra M365, Google u Okta |
| Diagrama de despliegue (D9) | El nodo «external» de plataformas de identidad pasa a ser Keycloak |
