import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const manifestPath = 'dist/manifest.json';
const manifest = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', manifestPath)),
);

delete manifest.key;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
