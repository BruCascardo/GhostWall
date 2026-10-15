// Esquema de base de datos (Drizzle). Fuente del modelo: D4 §8.2–8.3 (ver docs/database.md).
// Por ahora solo contiene `empresa`, necesaria para validar la infraestructura de migraciones y pruebas.
import { sql } from 'drizzle-orm';
import { check, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const ESTADOS_EMPRESA = ['ACTIVO', 'SUSPENDIDO', 'INACTIVO'] as const;
export type EstadoEmpresa = (typeof ESTADOS_EMPRESA)[number];

// D4 §8.2.1: cuit VARCHAR(11) PK validado por expresión regular; razon_social VARCHAR(150);
// fecha_alta TIMESTAMP; estado VARCHAR(20) ∈ {ACTIVO, SUSPENDIDO, INACTIVO}.
// CUU01 diccionario de datos, paso 2: la empresa se crea con estado "ACTIVO".
export const empresa = pgTable(
  'empresa',
  {
    cuit: varchar('cuit', { length: 11 }).primaryKey(),
    razonSocial: varchar('razon_social', { length: 150 }).notNull(),
    fechaAlta: timestamp('fecha_alta', { withTimezone: true }).notNull().defaultNow(),
    estado: varchar('estado', { length: 20 }).$type<EstadoEmpresa>().notNull().default('ACTIVO'),
  },
  (tabla) => [
    check('empresa_cuit_formato', sql`${tabla.cuit} ~ '^[0-9]{11}$'`),
    check('empresa_estado_valido', sql`${tabla.estado} in ('ACTIVO', 'SUSPENDIDO', 'INACTIVO')`),
  ],
);
