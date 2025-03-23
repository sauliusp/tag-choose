/* eslint-disable */

const fs = require('fs');
const manifestPath = 'dist/manifest.json';
const manifest = require('../' + manifestPath);
delete manifest.key;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
