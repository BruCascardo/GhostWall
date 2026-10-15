---
paths:
  - 'apps/api/src/**'
---

# Reglas de `apps/api`

Detalle en [docs/architecture.md](../../docs/architecture.md#reglas-de-dependencia) y [docs/api.md](../../docs/api.md).

- Cada módulo vive en `src/modules/<modulo>/{domain,application,infrastructure,http}`. `domain` no importa NestJS, Drizzle, `pg` ni ninguna librería de infraestructura.
- Un módulo no accede a las tablas de otro: usa su servicio exportado o eventos.
- Las integraciones externas (proveedor de identidad, correo, LLM, ledger) se usan a través de un puerto, que tiene una implementación falsa para las pruebas.
- La empresa (`cuit`) sale siempre de la sesión, nunca de un parámetro del cliente (RNF-001). Un recurso de otra empresa responde 404.
- Las entradas se validan en el controlador con Zod y se rechazan los campos desconocidos. Las reglas de negocio van en `application`/`domain`.
- Los errores HTTP se devuelven como `application/problem+json`, con un `code` estable y sin datos personales, trazas ni SQL.
- La configuración se lee solo en `config.ts` y se valida con Zod al arrancar.
- Verificación mínima: `npm run verify`. Si el cambio toca persistencia, correr también `npm run test:integration`.
