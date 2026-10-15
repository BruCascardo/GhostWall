# API

> **Estado:** convenciones para una API que todavía no existe. Cuando exista, **el contrato OpenAPI generado por cada servicio será la fuente de verdad** de rutas y esquemas, y este documento conservará solo las convenciones transversales ([ADR 0007](decisions/0007-validacion-errores-contratos.md)).

## Convenciones generales

| Tema | Convención |
|---|---|
| Estilo | REST sobre HTTPS, cuerpos JSON |
| Versionado | Prefijo `/api/v1` en `api`. Un cambio incompatible requiere `/api/v2` |
| Nombres | Recursos en plural, en español y en `kebab-case` (por ejemplo `/api/v1/protocolos-respuesta`); campos en `camelCase` en JSON |
| Fechas | ISO 8601 en UTC (`2026-10-14T12:00:00Z`) |
| Identificadores | Opacos para el cliente; nunca se exponen nombres ni emails de empleados (RNF-002) |
| Paginación | `?page=` y `?pageSize=`, con tope máximo definido por el servidor |
| Contrato | OpenAPI 3.1 generado por NestJS (`api`) y FastAPI (`ml`); clientes TypeScript generados en `packages/contracts` |

## Autenticación y autorización

Según [ADR 0008](decisions/0008-identidad-y-autorizacion.md).

- Cada solicitud a `api` lleva un token de acceso emitido por el proveedor de identidad.
- `api` valida la firma, la vigencia, el emisor y la audiencia del token.
- Cada endpoint declara los **roles** permitidos (RF-020) y si exige **MFA reciente** (RF-017).
- La empresa (`cuit`) se toma **siempre de la sesión**, nunca de un parámetro enviado por el cliente (RNF-001).
- `ml` no está expuesto a `web` ni a Internet; solo lo invoca `api`.

## Validación

- Toda entrada se valida en el borde (controlador) con los esquemas Zod de `packages/contracts`. En `ml` se usa Pydantic.
- Se rechazan los campos desconocidos.
- Las reglas de negocio (por ejemplo el CUIT duplicado de CUU01 RN1) se validan en la capa `application`/`domain`, no en el controlador.

## Errores

Formato `application/problem+json` (RFC 9457):

```json
{
  "type": "https://ghostwall.local/errores/cuit-duplicado",
  "title": "El CUIT ya está registrado",
  "status": 409,
  "code": "CUIT_DUPLICADO",
  "detail": "Ya existe una empresa con ese CUIT.",
  "instance": "/api/v1/empresas"
}
```

| Estado HTTP | Uso |
|---|---|
| 400 | Entrada con formato inválido |
| 401 | Sin token o token inválido |
| 403 | Rol insuficiente, empresa ajena o falta de MFA |
| 404 | Recurso inexistente **o perteneciente a otra empresa** (para no revelar su existencia) |
| 409 | Conflicto con una regla de negocio |
| 422 | Entrada válida en formato pero rechazada por una regla de negocio |
| 500 | Error inesperado: sin detalles internos, se registra en el log con un ID de correlación |

- Los mensajes de error **nunca** incluyen datos personales, tokens, trazas de pila ni consultas SQL.
- El campo `code` es estable y forma parte del contrato. El catálogo de códigos se mantendrá en `packages/contracts` cuando exista.

## Endpoints

Todavía no se definieron. Se derivarán de los casos de uso (ver la tabla de módulos en [architecture.md](architecture.md#módulos-previstos-de-api)) y quedarán documentados en el OpenAPI generado.
