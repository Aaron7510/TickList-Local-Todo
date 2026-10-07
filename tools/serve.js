// Optional desktop preview. Runtime pages still work without Node.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const port = Number(process.argv[2] || 4180);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Invalid preview port');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' };
const server = http.createServer((req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return; }
  let name;
  try { name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\/+/, '') || 'landing.html'; }
  catch { res.writeHead(400); res.end(); return; }
  const file = path.resolve(root, name);
  const relative = path.relative(root, file);
  // Only public pages and assets are served; history, config and private files stay local.
  const allowed = /^(index\.html|landing\.html|assets[/\\].+|brand[/\\](preview\.html|font-options[/\\][^/\\]+\.svg))$/.test(relative);
  if (!allowed || relative.startsWith('..') || path.isAbsolute(relative)) { res.writeHead(404); res.end(); return; }
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(req.method === 'HEAD' ? undefined : data);
  });
});
server.listen(port, '127.0.0.1', () => console.log(`TickList preview: http://127.0.0.1:${port}/landing.html`));
