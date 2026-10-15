// Pruebas del hook que bloquea operaciones de Git de publicación o reescritura (CLAUDE.md, "Prohibido").
// Ejecutar desde la raíz: node --test .claude/hooks/
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { motivoDeBloqueo } from './bloquear-operaciones-git.mjs';

const BLOQUEADOS = [
  'git commit -m "x"',
  'git push origin main',
  'git push --force',
  'git merge main',
  'git rebase main',
  'git cherry-pick abc123',
  'git pull',
  'git am parche.patch',
  'git revert HEAD',
  'git reset --hard HEAD~1',
  'git clean -fd',
  'git tag v1.0.0',
  'git tag -d v1.0.0',
  'git branch -D rama',
  'git stash drop',
  'git checkout -- archivo.ts',
  'git checkout .',
  'git switch --discard-changes main',
  'git restore archivo.ts',
  'git restore --worktree --staged archivo.ts',
  // Formas que una regla de permisos por prefijo no detecta (docs de permisos de Claude Code).
  'git -C . push origin main',
  'git -c push.default=current push',
  'git -C "C:/Users/x/GhostWall" commit -m x',
  "git 'push' origin main",
  '/usr/bin/git push',
  'C:\\Program Files\\Git\\bin\\git.exe push',
  'npm test && git commit -m x',
  'npm run verify; git push',
  'echo $(git push)',
  "bash -c 'git push origin main'",
  'git -c alias.p=push p',
  'GIT_DIR=.git git commit -m x',
  '& git push',
  'git --no-pager commit --amend',
  // Otros programas.
  'gh pr create --fill',
  'gh pr merge 3',
  'gh release create v1',
  'gh workflow run ci.yml',
  'gh api -X POST repos/x/y/issues',
  'gh api repos/x/y/issues -f title=x',
  'npm publish',
  'npm publish --workspace @ghostwall/api',
  'uv publish',
  'docker push imagen:1',
  'docker compose -f infra/compose/compose.yaml push',
  'vercel --prod',
  'kubectl apply -f k8s/',
];

const PERMITIDOS = [
  'git status',
  'git diff',
  'git diff --stat main',
  'git log --oneline -5',
  'git log --grep=commit',
  'git show HEAD',
  'git branch',
  'git branch --show-current',
  'git tag',
  'git tag --list',
  'git stash list',
  'git checkout -b feature/nueva',
  'git switch main',
  'git restore --staged archivo.ts',
  'git ls-remote --tags https://github.com/actions/checkout.git',
  'git rev-parse HEAD',
  'npm run verify',
  'npm run test:integration',
  'npx prettier --check .',
  'gh pr view 3',
  'gh pr list',
  'gh api repos/x/y/pulls',
  'docker compose -f infra/compose/compose.yaml ps',
  'docker info',
  'Get-ChildItem .github',
  'uv run --directory services/ml pytest',
  'node --test .claude/hooks/',
  'cat docs/commit-guidelines.md',
  '',
];

test('bloquea las operaciones de publicación, integración y reescritura', () => {
  for (const comando of BLOQUEADOS) {
    assert.notEqual(motivoDeBloqueo(comando), null, `debería bloquear: ${comando}`);
  }
});

test('permite los comandos de lectura y verificación', () => {
  for (const comando of PERMITIDOS) {
    assert.equal(motivoDeBloqueo(comando), null, `no debería bloquear: ${comando}`);
  }
});

test('no falla con entradas que no son texto', () => {
  assert.equal(motivoDeBloqueo(undefined), null);
  assert.equal(motivoDeBloqueo(42), null);
});

// Prueba del contrato con Claude Code: JSON por stdin, código de salida 2 y motivo en stderr.
const SCRIPT = fileURLToPath(new URL('./bloquear-operaciones-git.mjs', import.meta.url));
const ejecutar = (entrada) =>
  spawnSync(process.execPath, [SCRIPT], { input: entrada, encoding: 'utf8' });

test('como proceso: sale con 2 y explica el motivo al bloquear', () => {
  const r = ejecutar(
    JSON.stringify({ tool_name: 'Bash', tool_input: { command: 'git -C . push' } }),
  );
  assert.equal(r.status, 2);
  assert.match(r.stderr, /git push/);
});

test('como proceso: sale con 0 para un comando permitido, también en PowerShell', () => {
  const r = ejecutar(
    JSON.stringify({ tool_name: 'PowerShell', tool_input: { command: 'git status' } }),
  );
  assert.equal(r.status, 0);
  assert.equal(r.stderr, '');
});

test('como proceso: bloquea si el evento no es JSON válido', () => {
  assert.equal(ejecutar('no es json').status, 2);
});
