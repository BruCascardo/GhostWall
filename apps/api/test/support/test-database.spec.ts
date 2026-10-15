// Verifica la protección que impide que las pruebas operen sobre una base que no sea la descartable.
import { describe, expect, it } from 'vitest';
import { asegurarBaseDePruebas, codigoErrorPostgres } from './test-database';

const URL_VALIDA = 'postgres://u:p@localhost:55432/ghostwall_test';

describe('asegurarBaseDePruebas', () => {
  it('permite la base de pruebas local', () => {
    expect(() => asegurarBaseDePruebas(URL_VALIDA, {})).not.toThrow();
  });

  it('rechaza la base de desarrollo "ghostwall"', () => {
    expect(() => asegurarBaseDePruebas('postgres://u:p@localhost:5433/ghostwall', {})).toThrow(
      /solo se permite "ghostwall_test"/,
    );
  });

  it('rechaza un host remoto aunque la base se llame ghostwall_test', () => {
    expect(() =>
      asegurarBaseDePruebas('postgres://u:p@db.ejemplo.com:5432/ghostwall_test', {}),
    ).toThrow(/solo se permiten hosts locales/);
  });

  it('rechaza la URL configurada como DATABASE_URL de desarrollo', () => {
    expect(() => asegurarBaseDePruebas(URL_VALIDA, { DATABASE_URL: URL_VALIDA })).toThrow(
      /DATABASE_URL/,
    );
  });

  it('rechaza una URL mal formada', () => {
    expect(() => asegurarBaseDePruebas('no-es-una-url', {})).toThrow(/inválida/);
  });
});

describe('codigoErrorPostgres', () => {
  it('encuentra el código aunque esté envuelto en cause', () => {
    expect(codigoErrorPostgres({ cause: { code: '23505' } })).toBe('23505');
  });

  it('devuelve undefined si no hay código', () => {
    expect(codigoErrorPostgres(new Error('x'))).toBeUndefined();
  });
});
