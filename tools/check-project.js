// Dependency-free syntax and case-sensitive resource checks, suitable for Linux CI.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
let scripts = 0, references = 0;
function collect(dir) {
  return fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap(e => {
    const name = path.join(dir, e.name);
    if (e.isDirectory() && ['node_modules', 'out', 'history', 'layout', 'references', 'cleanup'].includes(e.name)) return [];
    return e.isDirectory() ? collect(name) : [name];
  });
}
function existsExact(file) {
  const relative = path.relative(root, file);
  if (relative.startsWith('..') || path.isAbsolute(relative)) return false;
  let parent = root;
  for (const part of relative.split(path.sep)) {
    if (!fs.existsSync(parent) || !fs.statSync(parent).isDirectory() || !fs.readdirSync(parent).includes(part)) return false;
    parent = path.join(parent, part);
  }
  return fs.existsSync(file);
}
function checkRef(name, ref) {
  if (/^(?:[a-z]+:|\/\/|#)/i.test(ref)) return;
  const target = decodeURIComponent(ref.split(/[?#]/)[0]);
  if (!target) return;
  if (!existsExact(path.resolve(root, path.dirname(name), target))) throw new Error(`Missing or wrong-case reference in ${name}: ${ref}`);
  references++;
}
for (const name of ['assets', 'brand', 'tools', 'tests'].flatMap(collect).filter(n => n.endsWith('.js'))) {
  new vm.Script(fs.readFileSync(path.join(root, name), 'utf8'), { filename: name });
  scripts++;
}
for (const name of ['index.html', 'landing.html', 'brand/preview.html']) {
  const html = fs.readFileSync(path.join(root, name), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  if (new Set(ids).size !== ids.length) throw new Error(`Duplicate HTML ids: ${name}`);
  for (const m of html.matchAll(/\b(?:aria-labelledby|aria-describedby|aria-controls|for)="([^"]+)"/g)) {
    for (const id of m[1].split(/\s+/)) if (!ids.includes(id)) throw new Error(`Missing label/control id in ${name}: ${id}`);
  }
  for (const m of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) checkRef(name, m[1]);
  for (const m of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) new vm.Script(m[1], { filename: name });
}
for (const name of collect('assets').filter(n => n.endsWith('.css'))) {
  for (const m of fs.readFileSync(path.join(root, name), 'utf8').matchAll(/url\(["']?([^"')]+)["']?\)/g)) checkRef(name, m[1]);
}
for (const name of ['README.md', 'CHANGELOG.md', 'brand/README.md', ...collect('docs').filter(n => n.endsWith('.md')), ...collect('marketing/video').filter(n => n.endsWith('.md'))]) {
  for (const m of fs.readFileSync(path.join(root, name), 'utf8').matchAll(/!?\[[^\]]*\]\(([^\s)]+)\)/g)) checkRef(name, m[1]);
}
console.log(`Project checks passed: ${scripts} JavaScript files, ${references} local references, unique page ids.`);
