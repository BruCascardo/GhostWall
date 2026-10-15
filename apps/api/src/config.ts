import { z } from 'zod';

// Variables de entorno del servicio api. Se validan al arrancar: si falta o es inválida
// alguna, el proceso termina con un mensaje claro (ADR 0012).
const configSchema = z.object({
  API_PORT: z.coerce.number().int().min(1).max(65535).default(3001),
});

export type Config = z.infer<typeof configSchema>;

export function loadConfig(env: NodeJS.ProcessEnv): Config {
  const result = configSchema.safeParse(env);
  if (!result.success) {
    throw new Error(`Configuración inválida del servicio api:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}
