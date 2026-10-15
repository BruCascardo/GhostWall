// T-001 (parte unitaria) — RF-001: validación del CUIT al dar de alta una empresa (CUU01 p2, 2.a).
// Los valores esperados se calcularon con una implementación independiente y se contrastaron con
// ejemplos publicados (20-12345678-6 válido; 30-12345678-9 inválido, su DV correcto es 1).
import { describe, expect, it } from 'vitest';
import { calcularDigitoVerificadorCuit, esCuitValido } from './cuit';

describe('T-001 RF-001 esCuitValido', () => {
  it.each(['20123456786', '30123456781'])(
    'acepta un CUIT con dígito verificador correcto: %s',
    (cuit) => {
      expect(esCuitValido(cuit)).toBe(true);
    },
  );

  it('acepta el caso límite en que el cálculo da 11 y el dígito verificador es 0', () => {
    expect(esCuitValido('30000000090')).toBe(true);
  });

  it('rechaza un dígito verificador incorrecto', () => {
    expect(esCuitValido('30123456789')).toBe(false);
  });

  it('rechaza el ejemplo de D4 §8.2.3 ("20-12345678-9"): su dígito verificador correcto es 6', () => {
    expect(esCuitValido('20123456789')).toBe(false);
  });

  it('rechaza los prefijos cuyo cálculo da 10, porque no tienen dígito verificador válido (AMB-37)', () => {
    for (let digito = 0; digito <= 9; digito++) {
      expect(esCuitValido(`2000000001${digito}`)).toBe(false);
    }
  });

  it.each([
    ['vacío', ''],
    ['10 dígitos', '2012345678'],
    ['12 dígitos', '201234567861'],
    ['con guiones', '20-12345678-6'],
    ['con espacios', '20 12345678 6'],
    ['con letras', '2012345678A'],
  ])('rechaza un formato inválido (%s)', (_caso, cuit) => {
    expect(esCuitValido(cuit)).toBe(false);
  });
});

describe('T-001 RF-001 calcularDigitoVerificadorCuit', () => {
  it('devuelve null cuando el cálculo da 10', () => {
    expect(calcularDigitoVerificadorCuit('2000000001')).toBeNull();
  });

  it('exige exactamente 10 dígitos de entrada', () => {
    expect(() => calcularDigitoVerificadorCuit('123')).toThrow();
  });
});
