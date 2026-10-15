// Pruebas de integración de la tabla `empresa` contra PostgreSQL real (base descartable).
// Verifican que las migraciones aplicadas desde cero implementan las restricciones documentadas.
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { Pool } from 'pg';
import { afterAll, beforeAll, beforeEach, describe, expect, inject, it } from 'vitest';
import { empresa } from '../../src/db/schema';
import { construirEmpresa, FECHA_FIJA } from '../support/factories';
import { asegurarBaseDePruebas, codigoErrorPostgres, vaciarTablas } from '../support/test-database';

// Códigos SQLSTATE de PostgreSQL
const VIOLACION_UNICIDAD = '23505';
const VIOLACION_CHECK = '23514';
const VIOLACION_NOT_NULL = '23502';
const TEXTO_DEMASIADO_LARGO = '22001';

const url = inject('urlBasePruebas');
asegurarBaseDePruebas(url);
const pool = new Pool({ connectionString: url });
const db = drizzle(pool);

async function codigoAlInsertar(valores: typeof empresa.$inferInsert): Promise<string | undefined> {
  try {
    await db.insert(empresa).values(valores);
  } catch (error) {
    return codigoErrorPostgres(error);
  }
  throw new Error('Se esperaba que la inserción fallara');
}

beforeAll(async () => {
  await pool.query('select 1');
});

beforeEach(async () => {
  await vaciarTablas(pool, url);
});

afterAll(async () => {
  await pool.end();
});

describe('migraciones', () => {
  it('crean la tabla empresa con las columnas de D4 §8.2.1', async () => {
    const { rows } = await pool.query<{ column_name: string }>(
      "select column_name from information_schema.columns where table_name = 'empresa' order by column_name",
    );
    expect(rows.map((fila) => fila.column_name)).toEqual([
      'cuit',
      'estado',
      'fecha_alta',
      'razon_social',
    ]);
  });
});

describe('T-001 RF-001 alta de empresa (persistencia)', () => {
  it('persiste una empresa válida y la crea en estado ACTIVO (CUU01, diccionario de datos paso 2)', async () => {
    const datos = construirEmpresa(1);
    await db.insert(empresa).values(datos);

    const [guardada] = await db.select().from(empresa).where(eq(empresa.cuit, datos.cuit));
    expect(guardada).toEqual({ ...datos, estado: 'ACTIVO', fechaAlta: FECHA_FIJA });
  });

  it('rechaza un CUIT duplicado (CUU01 RN1)', async () => {
    await db.insert(empresa).values(construirEmpresa(1));
    const codigo = await codigoAlInsertar(
      construirEmpresa(1, { razonSocial: 'Otra razón social' }),
    );
    expect(codigo).toBe(VIOLACION_UNICIDAD);
  });

  it.each([
    ['10 dígitos', '3000000009'],
    ['con guiones', '30-00000009'],
    ['con letras', '3000000009A'],
  ])('rechaza un CUIT con formato inválido (%s)', async (_caso, cuit) => {
    expect(await codigoAlInsertar(construirEmpresa(1, { cuit }))).toBe(VIOLACION_CHECK);
  });

  it('acepta una razón social de 150 caracteres (límite de D4 §8.2.1)', async () => {
    await db.insert(empresa).values(construirEmpresa(1, { razonSocial: 'x'.repeat(150) }));
    expect(await db.$count(empresa)).toBe(1);
  });

  it('rechaza una razón social de 151 caracteres', async () => {
    expect(await codigoAlInsertar(construirEmpresa(1, { razonSocial: 'x'.repeat(151) }))).toBe(
      TEXTO_DEMASIADO_LARGO,
    );
  });

  it('rechaza una empresa sin razón social', async () => {
    const sinRazonSocial = { ...construirEmpresa(1), razonSocial: null as unknown as string };
    expect(await codigoAlInsertar(sinRazonSocial)).toBe(VIOLACION_NOT_NULL);
  });
});

describe('T-002 RF-008 estado de la empresa (persistencia)', () => {
  it.each(['ACTIVO', 'SUSPENDIDO', 'INACTIVO'] as const)('acepta el estado %s', async (estado) => {
    await db.insert(empresa).values(construirEmpresa(1, { estado }));
    const [guardada] = await db.select({ estado: empresa.estado }).from(empresa);
    expect(guardada?.estado).toBe(estado);
  });

  it('rechaza un estado no documentado', async () => {
    const codigo = await codigoAlInsertar(
      construirEmpresa(1, { estado: 'BORRADO' as unknown as 'ACTIVO' }),
    );
    expect(codigo).toBe(VIOLACION_CHECK);
  });
});

describe('aislamiento entre pruebas', () => {
  it('cada prueba comienza con la tabla vacía', async () => {
    expect(await db.$count(empresa)).toBe(0);
  });
});
