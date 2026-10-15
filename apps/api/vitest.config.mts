import { defineConfig } from 'vitest/config';

// Tres niveles de prueba separados (docs/testing.md):
// - unit:        lógica pura, sin red, disco ni base de datos.
// - http:        la aplicación Nest completa en memoria, sin servicios externos.
// - integration: PostgreSQL real y descartable (Testcontainers); requiere Docker en ejecución.
export default defineConfig({
  test: {
    restoreMocks: true,
    projects: [
      {
        test: {
          name: 'unit',
          include: ['src/**/*.spec.ts', 'test/support/**/*.spec.ts'],
        },
      },
      {
        test: {
          name: 'http',
          include: ['test/http/**/*.http-spec.ts'],
        },
      },
      {
        test: {
          name: 'integration',
          include: ['test/integration/**/*.int-spec.ts'],
          globalSetup: ['test/integration/global-setup.ts'],
          // Un único contenedor compartido: los archivos se ejecutan en serie para no interferir.
          fileParallelism: false,
          hookTimeout: 180_000,
          testTimeout: 30_000,
        },
      },
    ],
  },
});
