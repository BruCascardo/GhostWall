---
paths:
  - 'apps/api/test/**'
  - 'apps/api/src/**/*.spec.ts'
  - 'apps/api/vitest.config.mts'
  - 'apps/web/e2e/**'
  - 'apps/web/playwright.config.ts'
  - 'services/ml/tests/**'
---

# Reglas de las pruebas

Detalle en [docs/testing.md](../../docs/testing.md).

- Cada prueba cita el ID que verifica (`T-xxx`, `RF-xxx`, `RNF-xxx`) en su nombre o comentario. Al agregar o cambiar una prueba, actualizar `docs/requirements/traceability.md`.
- Los valores esperados salen de los requisitos o de un cálculo independiente, nunca del código bajo prueba.
- Se usan las factories deterministas de `apps/api/test/support/factories.ts` y solo datos sintéticos.
- Las pruebas de integración usan solo la base descartable de Testcontainers. `asegurarBaseDePruebas` no se desactiva ni se esquiva.
- Las pruebas unitarias no usan red, disco ni reloj real.
- Si una prueba revela una contradicción con los requisitos, se informa. No se cambia la lógica de negocio solo para que pase la prueba.
