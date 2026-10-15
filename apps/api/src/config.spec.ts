// T-020 — ADR 0012: la configuración se valida al arrancar y un valor inválido detiene el proceso.
import { describe, expect, it } from 'vitest';
import { loadConfig } from './config';

describe('T-020 loadConfig', () => {
  it('usa el puerto por defecto 3001 si API_PORT no está definido', () => {
    expect(loadConfig({}).API_PORT).toBe(3001);
  });

  it.each(['1', '65535'])('acepta el puerto límite %s', (puerto) => {
    expect(loadConfig({ API_PORT: puerto }).API_PORT).toBe(Number(puerto));
  });

  it.each(['0', '65536', '-1', '3001.5', 'abc'])('rechaza API_PORT=%s', (puerto) => {
    expect(() => loadConfig({ API_PORT: puerto })).toThrow(/Configuración inválida/);
  });
});
