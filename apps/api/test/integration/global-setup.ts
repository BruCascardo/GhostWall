// Inicializa la base de pruebas: un PostgreSQL descartable (Testcontainers) con la misma imagen que
// el entorno local, sobre el que se aplican todas las migraciones desde cero. Al terminar, se destruye.
import { join } from 'node:path';
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import type { TestProject } from 'vitest/node';
import { asegurarBaseDePruebas, NOMBRE_BASE_PRUEBAS } from '../support/test-database';

const IMAGEN_POSTGRES = 'postgres:18.6';

declare module 'vitest' {
  export interface ProvidedContext {
    urlBasePruebas: string;
  }
}

let contenedor: StartedPostgreSqlContainer | undefined;

export async function setup(project: TestProject): Promise<void> {
  contenedor = await new PostgreSqlContainer(IMAGEN_POSTGRES)
    .withDatabase(NOMBRE_BASE_PRUEBAS)
    .withUsername('ghostwall_test')
    .withPassword('ghostwall_test')
    .start();

  const url = contenedor.getConnectionUri();
  asegurarBaseDePruebas(url);

  const pool = new Pool({ connectionString: url });
  try {
    await migrate(drizzle(pool), { migrationsFolder: join(project.config.root, 'drizzle') });
  } finally {
    await pool.end();
  }

  project.provide('urlBasePruebas', url);
}

export async function teardown(): Promise<void> {
  await contenedor?.stop();
}
