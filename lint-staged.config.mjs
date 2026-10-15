// Verificaciones rápidas sobre los archivos en stage antes de cada commit (ADR 0012).
// Solo verifican: no modifican archivos. Para corregir: npm run lint:fix / npm run format / npm run ml:format.
export default {
  '*.{ts,tsx,js,mjs}': ['eslint --max-warnings=0', 'prettier --check'],
  '*.{json,css,yaml,yml}': 'prettier --check',
  'services/ml/**/*.py': () => [
    'uv run --directory services/ml ruff format --check .',
    'uv run --directory services/ml ruff check .',
  ],
};
