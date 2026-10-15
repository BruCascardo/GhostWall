import { defineConfig } from 'drizzle-kit';

// `npm run db:generate` genera migraciones SQL a partir del esquema; no se conecta a ninguna base.
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './drizzle',
  strict: true,
});
