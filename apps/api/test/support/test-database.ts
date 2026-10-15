// Protecciones y utilidades para la base de datos de pruebas.
// Las pruebas de integración SOLO pueden usar una base descartable creada por Testcontainers.
import type { Pool } from 'pg';

export const NOMBRE_BASE_PRUEBAS = 'ghostwall_test';
const HOSTS_LOCALES = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);

/**
 * Lanza un error si `url` no apunta a una base de pruebas local llamada `ghostwall_test`,
 * o si coincide con la base configurada para desarrollo (`DATABASE_URL`).
 * Debe llamarse antes de cualquier operación destructiva.
 */
export function asegurarBaseDePruebas(url: string, entorno: NodeJS.ProcessEnv = process.env): void {
  let destino: URL;
  try {
    destino = new URL(url);
  } catch {
    throw new Error('URL de base de datos de pruebas inválida');
  }
  const base = destino.pathname.replace(/^\//, '');
  if (base !== NOMBRE_BASE_PRUEBAS) {
    throw new Error(
      `Se rechaza operar sobre la base "${base}": solo se permite "${NOMBRE_BASE_PRUEBAS}"`,
    );
  }
  if (!HOSTS_LOCALES.has(destino.hostname)) {
    throw new Error(
      `Se rechaza operar sobre el host "${destino.hostname}": solo se permiten hosts locales`,
    );
  }
  if (entorno.DATABASE_URL && entorno.DATABASE_URL === url) {
    throw new Error('La URL de pruebas coincide con DATABASE_URL de desarrollo');
  }
}

/** Vacía todas las tablas del esquema `public` (no toca el registro de migraciones de Drizzle). */
export async function vaciarTablas(pool: Pool, url: string): Promise<void> {
  asegurarBaseDePruebas(url);
  const { rows } = await pool.query<{ tablename: string }>(
    "select tablename from pg_tables where schemaname = 'public'",
  );
  if (rows.length === 0) return;
  const tablas = rows.map((fila) => `"public"."${fila.tablename}"`).join(', ');
  await pool.query(`truncate table ${tablas} restart identity cascade`);
}

/** Extrae el código de error de PostgreSQL (SQLSTATE), aunque Drizzle lo envuelva en `cause`. */
export function codigoErrorPostgres(error: unknown): string | undefined {
  let actual: unknown = error;
  while (actual && typeof actual === 'object') {
    if ('code' in actual && typeof actual.code === 'string') return actual.code;
    actual = 'cause' in actual ? actual.cause : undefined;
  }
  return undefined;
}
