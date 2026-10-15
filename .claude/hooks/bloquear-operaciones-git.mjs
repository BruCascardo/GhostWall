// Hook PreToolUse de Claude Code (docs/claude-code.md): bloquea los comandos de Bash o PowerShell que
// publican, integran o reescriben la historia de Git, publican paquetes o despliegan (CLAUDE.md, "Prohibido").
// Es una capa más, no una garantía: no ve lo que un script ejecuta por dentro ni lo que corre fuera de Claude.
// Contrato: recibe el JSON del evento por stdin; sale con 2 (y el motivo en stderr) para bloquear, o con 0.
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

// Opciones globales de git que llevan un valor separado por espacio (`git -C dir push`).
const OPCIONES_GIT_CON_VALOR =
  '(?:-C|-c|--git-dir|--work-tree|--namespace|--exec-path|--config-env)';
const VALOR = `(?:"[^"]*"|'[^']*'|\\S+)`;
// `git` como programa (también `git.exe` o con ruta), sus opciones globales y el subcomando.
const GIT = new RegExp(
  `(?:^|[\\s;&|(\`'"{$])(?:[\\w.:~-]*[\\\\/])*git(?:\\.exe)?['"]?` +
    `((?:\\s+${OPCIONES_GIT_CON_VALOR}\\s+${VALOR}|\\s+--?[\\w-]+(?:=${VALOR})?)*)` +
    `\\s+['"]?([\\w-]+)['"]?([^;&|\\n]*)`,
  'gi',
);

const SUBCOMANDOS_GIT_PROHIBIDOS = new Set([
  'commit',
  'push',
  'merge',
  'rebase',
  'cherry-pick',
  'pull',
  'am',
  'revert',
  'clean',
  'filter-branch',
  'filter-repo',
  'replace',
  'update-ref',
  'commit-tree',
]);

/** Reglas para los subcomandos de git que solo son peligrosos con ciertos argumentos. */
function subcomandoGitCondicional(subcomando, resto) {
  const argumentos = resto.trim();
  switch (subcomando) {
    case 'reset':
      return /(^|\s)--(hard|merge|keep)\b/i.test(argumentos);
    case 'tag':
      // Listar tags está permitido; crear, borrar o firmar no.
      return argumentos !== '' && !/^(-l|--list|-n\d*)\b/i.test(argumentos);
    case 'branch':
      return /(^|\s)(-[dD]|--delete|-f|--force|-[mM]|--move)\b/.test(argumentos);
    case 'stash':
      return /^(drop|clear)\b/i.test(argumentos);
    // Los tres casos siguientes descartan cambios del usuario sin posibilidad de recuperarlos.
    case 'checkout':
      return /(^|\s)(--|\.|-f|--force)(\s|$)/.test(argumentos);
    case 'switch':
      return /(^|\s)(-f|--force|--discard-changes)(\s|$)/.test(argumentos);
    case 'restore':
      // Solo `--staged` (sin `--worktree`) es seguro: saca archivos del stage sin tocar el contenido.
      return (
        !/(^|\s)(--staged|-S)(\s|$)/.test(argumentos) ||
        /(^|\s)(--worktree|-W)(\s|$)/.test(argumentos)
      );
    default:
      return false;
  }
}

// Otros programas: publicación de paquetes o imágenes, GitHub y despliegue.
const OTROS_PROHIBIDOS = [
  [
    /(?:^|[\s;&|(])gh(?:\.exe)?\s+pr\s+(create|merge|close|reopen|edit|review|comment|ready)\b/i,
    'gh pr',
  ],
  [/(?:^|[\s;&|(])gh(?:\.exe)?\s+(release|secret|variable)\b/i, 'gh release/secret/variable'],
  [
    /(?:^|[\s;&|(])gh(?:\.exe)?\s+repo\s+(create|delete|edit|fork|sync|rename|archive)\b/i,
    'gh repo',
  ],
  [
    /(?:^|[\s;&|(])gh(?:\.exe)?\s+(workflow\s+(run|enable|disable)|run\s+(rerun|cancel|delete))\b/i,
    'gh workflow/run',
  ],
  [
    /(?:^|[\s;&|(])gh(?:\.exe)?\s+api\b.*(\s(-X|--method)\s*(POST|PUT|PATCH|DELETE)|\s(-f|-F|--field|--raw-field|--input)\s)/i,
    'gh api (escritura)',
  ],
  [
    /(?:^|[\s;&|(])(npm|pnpm|yarn)(?:\.cmd)?\s+(publish|unpublish|deprecate|dist-tag)\b/i,
    'publicación de paquetes npm',
  ],
  [/(?:^|[\s;&|(])(uv\s+publish|twine\s+upload)\b/i, 'publicación de paquetes Python'],
  [/(?:^|[\s;&|(])docker(?:\.exe)?\s+(push|(compose|buildx)\b[^;&|\n]*\spush)\b/i, 'docker push'],
  [
    /(?:^|[\s;&|(])(vercel|netlify\s+deploy|flyctl|fly\s+deploy|kubectl\s+(apply|delete)|helm\s+(install|upgrade))\b/i,
    'despliegue',
  ],
];

/**
 * Devuelve el motivo por el que `comando` debe bloquearse, o `null` si no coincide con ninguna regla.
 * Exportada para las pruebas (bloquear-operaciones-git.test.mjs).
 */
export function motivoDeBloqueo(comando) {
  if (typeof comando !== 'string' || comando.trim() === '') return null;
  for (const coincidencia of comando.matchAll(GIT)) {
    const opciones = coincidencia[1] ?? '';
    const subcomando = coincidencia[2].toLowerCase();
    const resto = coincidencia[3] ?? '';
    // Un alias definido en la línea de comandos podría esconder cualquier subcomando.
    if (/\balias\./i.test(opciones)) return 'git -c alias.*';
    if (SUBCOMANDOS_GIT_PROHIBIDOS.has(subcomando) || subcomandoGitCondicional(subcomando, resto)) {
      return `git ${subcomando}`;
    }
  }
  for (const [patron, motivo] of OTROS_PROHIBIDOS) {
    if (patron.test(comando)) return motivo;
  }
  return null;
}

function main() {
  let evento;
  try {
    evento = JSON.parse(readFileSync(0, 'utf8'));
  } catch {
    // Si no se puede leer el evento, se bloquea: es preferible un falso positivo a dejar pasar el comando.
    process.stderr.write(
      'Hook de GhostWall: no se pudo leer el evento; se bloquea el comando por precaución.\n',
    );
    process.exit(2);
  }
  const motivo = motivoDeBloqueo(evento?.tool_input?.command);
  if (motivo) {
    process.stderr.write(
      `Bloqueado por el hook de GhostWall (${motivo}). Claude no puede hacer commit, push, merge, rebase, ` +
        'cherry-pick, publicar, desplegar ni descartar cambios del usuario (CLAUDE.md, "Prohibido"). ' +
        'Si hace falta, pedile al integrante que lo ejecute en su propia terminal.\n',
    );
    process.exit(2);
  }
  process.exit(0);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
