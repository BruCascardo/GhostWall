---
paths:
  - 'apps/api/src/db/**'
  - 'apps/api/drizzle/**'
  - 'apps/api/drizzle.config.ts'
---

# Reglas del esquema y las migraciones

Detalle en [docs/database.md](../../docs/database.md).

- El esquema se define en `apps/api/src/db/schema.ts`. Las migraciones se generan con `npm run db:generate --workspace @ghostwall/api` y no se escriben a mano.
- Una migración ya versionada **no se edita**: los cambios van en una migración nueva.
- Tablas y columnas en `snake_case`, en español y sin tildes ni ñ. Los valores enumerados van en MAYÚSCULAS, como en D4.
- Antes de implementar una entidad, revisar las AMB que la afectan (tabla "Discrepancias y huecos" de `docs/database.md`). Mientras una discrepancia esté abierta, no se elige una interpretación sin registrarla.
- No se guardan nombres ni emails en texto plano (RNF-002, ADR 0015). `registro_auditoria` no admite UPDATE ni DELETE (ADR 0013).
- Las migraciones se prueban solo con `npm run test:integration` (base descartable). No hay comando para aplicarlas a la base de desarrollo: no lo inventes.
- Al cambiar el esquema, actualizar `docs/database.md`.
