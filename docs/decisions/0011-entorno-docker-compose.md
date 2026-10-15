# ADR 0011 — Docker Compose con perfiles; Kubernetes fuera del entorno local

- **Estado:** Aceptada (2026-10-14; ver [Aprobación](#aprobación))
- **Fecha:** 2026-10-14
- **Requisitos:** RNF-013, RNF-022; AMB-03

## Contexto

D4 despliega todo sobre Kubernetes en AWS o Azure. La máquina relevada tiene 7,9 GB de RAM y Docker Desktop instalado (29.1.3, Compose 2.40.3), con el daemon detenido al momento del relevamiento.

## Alternativas

| Alternativa | Comentario |
|---|---|
| Kubernetes local (kind o minikube) | Fiel a D4, pero inviable junto con el resto de los servicios en 8 GB |
| **Docker Compose con perfiles** | Reproducible y liviano |
| Instalar los servicios directamente en cada máquina | No es reproducible entre los integrantes |

## Decisión

- Perfil `infra`: PostgreSQL, Redis, Keycloak y Mailpit (que captura los correos de las simulaciones sin enviarlos de verdad). Las aplicaciones corren en el host con recarga en caliente.
- Perfil `full`: también las aplicaciones en contenedores, para la demo y las pruebas end-to-end.
- Kubernetes queda como trabajo futuro documentado. Opcionalmente, manifiestos probados en una máquina con más recursos.

## Aprobación

Se adoptó la opción recomendada según la regla del equipo del 2026-10-14 (ver [README.md](README.md#estados)).

**Motivo:** con 8 GB de RAM, Kubernetes local compite con la base de datos, el proveedor de identidad y las aplicaciones. En el prototipo, Compose cubre la reproducibilidad, que es lo que se necesita.

## Impacto en la documentación aprobada

| Documento | Qué cambia |
|---|---|
| D4 §13.1 y §14.2 (despliegue) | El prototipo se despliega con Docker Compose; Kubernetes pasa a ser la arquitectura objetivo de producción |
| D4 §5.2.3 (Disponibilidad) y RNF-022 | Alta disponibilidad, auto-healing y rolling updates no se demuestran en el prototipo |
| D4 §11 (T5.1 "Pruebas de estrés en Kubernetes") | Las pruebas de estrés, si se hacen, se ejecutan sobre Compose |
| D4 §5.4.1 (costos EKS) | Sin cambios: describe la producción, no el prototipo |
