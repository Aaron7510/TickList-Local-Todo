// Allowlist-only static release; no install step and no historical/private content.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist');
function files(dir) {
  if (fs.lstatSync(path.join(root, dir)).isSymbolicLink()) throw new Error('Directories must not be symlinks');
  return fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap(entry => {
    if (entry.isSymbolicLink()) throw new Error('Release sources must not contain symlinks');
    const name = `${dir}/${entry.name}`;
    return entry.isDirectory() ? files(name) : [name];
  });
}
const sources = ['index.html', 'landing.html', 'LICENSE', 'BRAND-LICENSE.md', ...files('assets')].sort();
const extras = ['.nojekyll', 'README.txt', 'release-manifest.json'];
const allowed = new Set([...sources, ...extras]);
if (fs.existsSync(out)) {
  for (const name of files('dist')) {
    if (!allowed.has(name.slice(5))) throw new Error(`Unexpected output file: ${name}; review it before rebuilding.`);
  }
}
fs.mkdirSync(out, { recursive: true });
const manifest = [];
for (const name of sources) {
  const target = path.join(out, name);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  let parent = path.dirname(target);
  while (parent !== root) {
    if (fs.lstatSync(parent).isSymbolicLink()) throw new Error('Output directories must not be symlinks');
    parent = path.dirname(parent);
  }
  if (fs.existsSync(target) && fs.lstatSync(target).isSymbolicLink()) throw new Error('Output files must not be symlinks');
  const data = fs.readFileSync(path.join(root, name));
  fs.writeFileSync(target, data);
  manifest.push({ path: name, bytes: data.length, sha256: crypto.createHash('sha256').update(data).digest('hex') });
}
for (const name of extras) {
  const file = path.join(out, name);
  if (fs.existsSync(file) && fs.lstatSync(file).isSymbolicLink()) throw new Error('Output files must not be symlinks');
}
fs.writeFileSync(path.join(out, '.nojekyll'), '');
fs.writeFileSync(path.join(out, 'README.txt'), 'TickList static release\nOpen landing.html for the introduction or index.html for the app. Keep assets/ alongside both files.\nTasks live in this browser and origin. Export a JSON backup before changing browsers or URLs.\n');
fs.writeFileSync(path.join(out, 'release-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`Packaged ${sources.length} runtime and license files into dist/; hashes saved in release-manifest.json.`);
