/**
 * Bundles the site into ONE self-contained HTML file.
 *
 * Why this exists: the dev server only exists inside whatever machine is
 * running it. A single file with the CSS and JS inlined can be opened from
 * anywhere — mailed, dropped on a phone, published as an Artifact — and behaves
 * exactly like the real site, because it renders the same components rather
 * than a hand-written copy of them.
 *
 *   node preview/build.mjs [outfile]      # default: preview/out/ctrl-room.html
 *
 * The one thing Next provides that this has to replace is the font: next/font
 * self-hosts Inter at build time, so standalone we link Google Fonts and set
 * --font-sans by hand. Everything downstream of that variable is identical.
 */
import {build} from 'esbuild';
import {execFile} from 'node:child_process';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {promisify} from 'node:util';

const run = promisify(execFile);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, process.argv[2] ?? 'preview/out/ctrl-room.html');
const tmp = resolve(root, 'preview/.tmp');

await mkdir(tmp, {recursive: true});
await mkdir(dirname(out), {recursive: true});

await build({
  entryPoints: [resolve(root, 'preview/entry.tsx')],
  bundle: true,
  minify: true,
  format: 'iife',
  jsx: 'automatic',
  target: 'es2020',
  define: {'process.env.NODE_ENV': '"production"'},
  outfile: resolve(tmp, 'app.js'),
  logLevel: 'warning',
});

await run(
  resolve(root, 'node_modules/.bin/tailwindcss'),
  ['-c', 'preview/tailwind.config.ts', '-i', 'app/globals.css', '-o', 'preview/.tmp/app.css', '--minify'],
  {cwd: root}
);

const [css, js] = await Promise.all([
  readFile(resolve(tmp, 'app.css'), 'utf8'),
  readFile(resolve(tmp, 'app.js'), 'utf8'),
]);

const html = `<title>ctrl ROOM</title>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0A0A0A">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">

<style>
:root { --font-sans: 'Inter'; }
html, body {
  background: #0A0A0A;
  font-family: var(--font-sans), ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
}
#root { background: #0A0A0A; }
</style>

<style>
${css}</style>

<div id="root"></div>

<script>
${js}
</script>
`;

await writeFile(out, html);
console.log(`${out}  ${(html.length / 1024).toFixed(0)} KB`);
