import { rm, mkdir, cp, readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
await rm('dist', { recursive: true, force: true });
execFileSync(
  'npx',
  [
    'parcel',
    'build',
    'src/index.tsx',
    'src/Setup.tsx',
    '--no-cache',
    '--no-source-maps',
  ],
  { stdio: 'inherit' },
);
await mkdir('dist/public', { recursive: true });
await cp('public', 'dist/public', { recursive: true });
for (const file of ['popup.html', 'setup.html', 'reset.css'])
  await cp(file, `dist/${file}`);
const manifest = JSON.parse(await readFile('manifest.json', 'utf8'));
delete manifest.key;
await writeFile('dist/manifest.json', JSON.stringify(manifest, null, 2) + '\n');
