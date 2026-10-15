// Configuración de ESLint para todo el código TypeScript/JavaScript del monorepo (ADR 0012).
// El código Python se verifica con Ruff (services/ml/pyproject.toml).
import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const webFiles = ['apps/web/**/*.{ts,tsx}'];

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/next-env.d.ts',
      'services/**',
      'docs/**',
    ],
  },
  js.configs.recommended,
  // Reglas con información de tipos: detectan, por ejemplo, promesas no esperadas.
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
      globals: { ...globals.node },
    },
  },
  {
    files: webFiles,
    ...nextPlugin.configs['core-web-vitals'],
    settings: { next: { rootDir: 'apps/web' } },
  },
  { files: webFiles, ...reactHooks.configs.flat.recommended },
  {
    files: webFiles,
    languageOptions: { globals: { ...globals.browser } },
  },
  // Archivos de configuración en JavaScript: sin reglas que requieran tipos.
  { files: ['**/*.{js,mjs,cjs}'], ...tseslint.configs.disableTypeChecked },
  // Debe ir al final: desactiva reglas de estilo que se superponen con Prettier.
  prettier,
);
