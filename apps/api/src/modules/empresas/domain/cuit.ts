// Validación del CUIT (RF-001; CUU01 paso 2 y camino 2.a).
// Algoritmo de módulo 11 con pesos 5,4,3,2,7,6,5,4,3,2 sobre los primeros 10 dígitos.
// Formato aceptado: exactamente 11 dígitos sin separadores (D4 §8.2.1: VARCHAR(11)).
// Cuando el cálculo da 10 no existe dígito verificador válido y el CUIT se rechaza;
// las fuentes consultadas no coinciden sobre ese caso (AMB-37).

const PESOS = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2] as const;
const FORMATO_CUIT = /^\d{11}$/;

/**
 * Calcula el dígito verificador para los primeros 10 dígitos de un CUIT.
 * Devuelve `null` si el cálculo da 10 (no hay dígito verificador válido).
 */
export function calcularDigitoVerificadorCuit(primerosDiez: string): number | null {
  if (!/^\d{10}$/.test(primerosDiez)) {
    throw new Error('Se esperaban exactamente 10 dígitos');
  }
  const suma = PESOS.reduce((acumulado, peso, i) => acumulado + peso * Number(primerosDiez[i]), 0);
  const resultado = 11 - (suma % 11);
  if (resultado === 11) return 0;
  if (resultado === 10) return null;
  return resultado;
}

/** Indica si `cuit` tiene formato válido y dígito verificador correcto. */
export function esCuitValido(cuit: string): boolean {
  if (!FORMATO_CUIT.test(cuit)) return false;
  const esperado = calcularDigitoVerificadorCuit(cuit.slice(0, 10));
  return esperado !== null && esperado === Number(cuit[10]);
}
