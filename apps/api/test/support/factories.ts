// Factories de datos de prueba deterministas: el mismo número de secuencia produce siempre el mismo
// registro. Solo datos sintéticos (docs/testing.md); los CUIT son válidos en formato pero ficticios.
import { calcularDigitoVerificadorCuit } from '../../src/modules/empresas/domain/cuit';
import type { empresa } from '../../src/db/schema';

export const FECHA_FIJA = new Date('2026-01-01T00:00:00.000Z');

/** Devuelve un CUIT válido determinista para `secuencia` (prefijo 30, persona jurídica). */
export function cuitDePrueba(secuencia: number): string {
  for (let n = secuencia; ; n++) {
    const primerosDiez = `30${String(n).padStart(8, '0')}`;
    const digito = calcularDigitoVerificadorCuit(primerosDiez);
    if (digito !== null) return `${primerosDiez}${digito}`;
  }
}

export function construirEmpresa(
  secuencia: number,
  cambios: Partial<typeof empresa.$inferInsert> = {},
): typeof empresa.$inferInsert {
  return {
    cuit: cuitDePrueba(secuencia),
    razonSocial: `Empresa de Prueba ${secuencia} S.A.`,
    fechaAlta: FECHA_FIJA,
    ...cambios,
  };
}
