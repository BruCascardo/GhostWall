---
paths:
  - 'apps/web/**'
---

# Reglas de `apps/web`

Stack en [ADR 0004](../../docs/decisions/0004-frontend.md).

- Todo el texto de la interfaz va en español (RNF-015), y `<html lang="es">` se mantiene.
- Los datos de negocio se piden solo a `api`. `web` nunca llama a `ml` ni a la base de datos. La única otra integración es el login OIDC del lado del servidor, con una cookie `httpOnly` ([ADR 0008](../../docs/decisions/0008-identidad-y-autorizacion.md)).
- No se muestran nombres ni emails de empleados que `api` no exponga. Solo se usan datos sintéticos.
- Los gráficos de decisión (RA-001) usan ECharts.
- Verificación mínima: `npm run verify`. Si el cambio afecta páginas o navegación, correr también `npm run test:e2e`, que requiere el Chromium de Playwright.
