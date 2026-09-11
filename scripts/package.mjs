import { readFile, rm, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
const { version } = JSON.parse(await readFile('dist/manifest.json', 'utf8'));
await mkdir('release', { recursive: true });
const target = `release/tagchoose-${version}-chrome.zip`;
await rm(target, { force: true });
execFileSync('zip', ['-qr', `../${target}`, '.'], {
  cwd: 'dist',
  stdio: 'inherit',
});
execFileSync('unzip', ['-t', target], { stdio: 'inherit' });
