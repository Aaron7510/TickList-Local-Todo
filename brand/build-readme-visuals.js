// Native SVG documentation visuals. No screenshots, raster images or external assets.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'docs', 'visuals');
const appHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const appCss = fs.readFileSync(path.join(root, 'assets/app.css'), 'utf8');
const landingHtml = fs.readFileSync(path.join(root, 'landing.html'), 'utf8');
const theme = appCss.match(/:root\s*\{([\s\S]*?)\}/)[1];
const color = name => theme.match(new RegExp('--' + name + ':\\s*(#[0-9a-f]+)', 'i'))[1];
const logo = fs.readFileSync(path.join(root, 'assets/brand/logo-light.svg'), 'utf8')
  .replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<title[^>]*>[\s\S]*?<\/title>/, '');
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));
const text = (x, y, value, size, fill, extra = '') => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${extra}>${escape(value)}</text>`;
const rect = (x, y, w, h, radius, fill, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" ${extra}/>`;
const centered = 'text-anchor="middle"';
const iconBody = name => appHtml.match(new RegExp('<svg class="' + name + '"[^>]*>([\\s\\S]*?)<\\/svg>'))[1];
const globe = appHtml.match(/id="languageBtn"[\s\S]*?<svg[^>]*>([\s\S]*?)<\/svg>/)[1];
const gear = appHtml.match(/id="settingsBtn"[\s\S]*?<svg[^>]*>([\s\S]*?)<\/svg>/)[1];
const icon = (x, y, body, stroke) => `<svg x="${x}" y="${y}" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
const brand = (x, y, w, h) => `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 278 64">${logo}</svg>`;
function svg(width, height, title, body, definitions = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" lang="zh-CN" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="visual-title visual-description">
<title id="visual-title">${escape(title)}</title>
<desc id="visual-description">按现有页面样式绘制的静态矢量展示，非浏览器截图。仅使用公开示例任务。</desc>
<defs>${definitions}</defs>
<g font-family="Segoe UI, Microsoft YaHei, PingFang SC, sans-serif">${body}</g>
</svg>\n`;
}
const accent = color('accent'), muted = color('text-muted'), ink = color('text');
const landingCopy = id => {
  const value = landingHtml.match(new RegExp('data-i18n="' + id + '"[^>]*>([\\s\\S]*?)<\\/[^>]+>'));
  if (!value) throw new Error('Missing landing copy: ' + id);
  return value[1];
};
const landing = svg(1280, 720, 'TickList 产品介绍页（Landing）', [
  rect(0, 0, 1280, 720, 0, '#f7f8fb'),
  rect(0, 0, 1280, 400, 0, 'url(#hero-glow)'),
  brand(124, 22, 139, 32), icon(1132, 28, globe, '#97a0b0'),
  rect(558, 132, 164, 34, 17, '#eef1ff', 'stroke="#dde4ff"'),
  '<circle cx="578" cy="149" r="3.5" fill="#4f6ef7"/>',
  text(645, 154, landingCopy('badge'), 13, accent, `${centered} font-weight="600"`),
  text(640, 244, landingCopy('headlineLead'), 52, '#14171f', `${centered} font-weight="800" letter-spacing="-0.5"`),
  text(640, 306, landingCopy('headlineHighlight'), 52, 'url(#headline-ink)', `${centered} font-weight="800" letter-spacing="-0.5"`),
  text(640, 358, landingCopy('descriptionLead'), 18, '#5d6573', centered),
  `<text x="640" y="389" text-anchor="middle" font-size="18" fill="#5d6573">${escape(landingCopy('descriptionPrefix'))}<tspan fill="#14171f" font-weight="600">${escape(landingCopy('descriptionHighlight') + landingCopy('descriptionSuffix'))}</tspan></text>`,
  rect(471, 434, 196, 54, 12, accent, 'filter="url(#cta-shadow)"'),
  text(555, 468, landingCopy('start'), 17, '#fff', `${centered} font-weight="700"`),
  '<path d="M619 461h16m-6-6 6 6-6 6" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
  text(750, 467, landingCopy('seeProduct'), 15, '#5d6573', `${centered} font-weight="600"`),
  '<path d="M687 474h126" stroke="#d3d8e3" stroke-width="1.5"/>',
  text(640, 520, landingCopy('trust'), 13, '#97a0b0', centered),
  text(640, 650, landingCopy('scrollDown'), 12, '#5d6573', centered),
  '<path d="M640 663v16m-6-6 6 6 6-6" fill="none" stroke="#5d6573" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'
].join('\n'), '<radialGradient id="hero-glow" cx="50%" cy="0" r="70%"><stop stop-color="#dfe5ff" stop-opacity="0.65"/><stop offset="1" stop-color="#f7f8fb" stop-opacity="0"/></radialGradient><linearGradient id="headline-ink"><stop stop-color="#4f6ef7"/><stop offset="1" stop-color="#8a6cf5"/></linearGradient><filter id="cta-shadow" x="-30%" y="-50%" width="160%" height="230%"><feDropShadow dx="0" dy="10" stdDeviation="13" flood-color="#4f6ef7" flood-opacity="0.32"/></filter>');
const tasks = JSON.parse(fs.readFileSync(path.join(root, 'tests/fixtures/valid-backup.json'), 'utf8')).todos;
const left = 200, right = 760;
const rows = tasks.map((task, index) => {
  const y = 276 + index * 84;
  const deadlineColor = task.deadline && !task.done ? color('red') : muted;
  const deadlineLabel = task.deadline
    ? `${Number(task.deadline.slice(5, 7))}月${Number(task.deadline.slice(8, 10))}日 ${task.deadline.slice(11, 16)}`
    : '设置截止时间';
  return [
    rect(left, y, 560, 72, 14, color('card'), `stroke="${color('border')}" filter="url(#task-shadow)"`),
    `<circle cx="228" cy="${y + 36}" r="10" fill="${task.done ? color('green') : color('card')}" stroke="${task.done ? color('green') : color('border')}" stroke-width="2"/>`,
    task.done ? `<path d="m224 ${y + 36} 3 3 5-6" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>` : '',
    text(250, y + 29, task.text, 15, task.done ? muted : ink, task.done ? 'text-decoration="line-through"' : ''),
    `<svg x="250" y="${y + 42}" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${deadlineColor}" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="13" r="7"/><path d="M12 9v4l3 2M5 3 2 6m17-3 3 3"/></svg>`,
    text(271, y + 53, deadlineLabel, 12, deadlineColor),
    `<g fill="${muted}">${[0, 6, 12].map(dy => `<circle cx="685" cy="${y + 30 + dy}" r="1.3"/><circle cx="691" cy="${y + 30 + dy}" r="1.3"/>`).join('')}</g>`,
    text(729, y + 41, '×', 18, muted, centered)
  ].join('\n');
}).join('\n');
const app = svg(960, 640, 'TickList 清单页（产品界面）', [
  rect(0, 0, 960, 640, 0, color('bg')), brand(24, 23, 122, 28),
  icon(811, 27, iconBody('moon'), muted), icon(859, 27, globe, muted), icon(907, 27, gear, muted),
  text(left, 108, '待办清单', 28, ink, 'font-weight="700" letter-spacing="0.5"'),
  text(left, 137, '把今天，一件件做好。', 14, muted),
  rect(left, 164, 472, 48, 12, color('card'), `stroke="${color('border')}" stroke-width="1.5"`),
  text(left + 16, 194, '添加新的待办事项…', 15, muted),
  rect(right - 78, 164, 78, 48, 12, accent), text(right - 39, 194, '添加', 15, '#fff', `${centered} font-weight="600"`),
  ...[{x:left,w:61,label:'全部',active:true},{x:left+69,w:80,label:'未完成'},{x:left+157,w:80,label:'已完成'}].map(f => rect(f.x, 228, f.w, 34, 17, f.active ? accent : color('card'), `stroke="${f.active ? accent : color('border')}" stroke-width="1.5"`) + text(f.x+f.w/2,250,f.label,13,f.active?'#fff':muted,centered)),
  rows,
  text(646, 552, `共 ${tasks.length} 项，已完成 ${tasks.filter(t=>t.done).length} 项`, 13, muted, 'text-anchor="end"'),
  text(right, 552, '清除已完成', 13, muted, 'text-anchor="end" text-decoration="underline"')
].join('\n'), '<filter id="task-shadow" x="-10%" y="-40%" width="120%" height="180%"><feDropShadow dx="0" dy="4" stdDeviation="9" flood-color="#1e222d" flood-opacity="0.06"/></filter>');
fs.mkdirSync(out, { recursive: true });
for (const [name, contents] of [['landing-zh.svg', landing], ['app-zh.svg', app]]) {
  fs.writeFileSync(path.join(out, name), contents.replace(/[\t ]+$/gm, ''), 'utf8');
  console.log('Generated docs/visuals/' + name);
}
