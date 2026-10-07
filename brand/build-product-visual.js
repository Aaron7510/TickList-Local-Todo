// 专用宣传界面：直接生成矢量图，不依赖截图或应用中的个人数据。
// node brand/build-product-visual.js [zh|en]
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const appCss = fs.readFileSync(path.join(root, 'assets/app.css'), 'utf8');
const appHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const theme = appCss.match(/:root\s*\{([\s\S]*?)\}/)[1];
const color = name => {
  const value = theme.match(new RegExp('--' + name + ':\\s*(#[0-9a-f]+)', 'i'));
  if (!value) throw new Error('Missing app color: ' + name);
  return value[1];
};
const colors = Object.fromEntries(['bg', 'card', 'border', 'text', 'text-muted', 'accent', 'green'].map(name => [name, color(name)]));
const logo = fs.readFileSync(path.join(root, 'assets/brand/logo-light.svg'), 'utf8')
  .replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<title[^>]*>[\s\S]*?<\/title>/, '');
const moon = appHtml.match(/<svg class="moon"[^>]*>([\s\S]*?)<\/svg>/)[1];
const globe = appHtml.match(/<button id="languageBtn"[\s\S]*?<svg[^>]*>([\s\S]*?)<\/svg>/)[1];
const gear = appHtml.match(/<button id="settingsBtn"[\s\S]*?<svg[^>]*>([\s\S]*?)<\/svg>/)[1];
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&apos;'}[char]));
const text = (x, y, value, size = 18, fill = colors.text, extra = '') =>
  `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${extra}>${escape(value)}</text>`;
const rect = (x, y, width, height, radius, fill, extra = '') =>
  `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" ${extra}/>`;
const locale = process.argv[2] || 'zh';
if (!['zh', 'en'].includes(locale)) throw new Error('Supported languages: zh, en');
const english = locale === 'en';
const ui = english ? {
  visualTitle: 'TickList to-do list preview',
  visualDescription: 'A product visual based on the app: three sample tasks, one completed, with task entry, filters, deadlines, drag handles, delete, color mode, language, and settings.',
  heading: 'To-do list', tagline: 'Make today count, one task at a time.', placeholder: 'Add a new task…', add: 'Add',
  all: 'All', pending: 'Pending', done: 'Completed', setDeadline: 'Set deadline',
  tasks: ["Review today’s study notes", 'Make time for what matters', 'Finish one small task'],
  count: (total, done) => `${total} tasks · ${done} done`, clear: 'Clear completed'
} : {
  visualTitle: 'TickList 待办清单界面示例',
  visualDescription: '按真实应用样式制作的宣传界面。3项示例任务，1项已完成；含添加、筛选、截止时间、独立拖动手柄、删除、颜色模式、语言与设置入口。',
  heading: '待办清单', tagline: '把今天，一件件做好。', placeholder: '添加新的待办事项…', add: '添加',
  all: '全部', pending: '未完成', done: '已完成', setDeadline: '设置截止时间',
  tasks: ['整理今天的学习笔记', '为重要的事留出时间', '完成一件小事'],
  count: (total, done) => `共 ${total} 项，已完成 ${done} 项`, clear: '清除已完成'
};
const tasks = [
  {title: ui.tasks[0], deadline: english ? 'Oct 5, 20:00' : '10月5日 20:00'},
  {title: ui.tasks[1], deadline: ui.setDeadline},
  {title: ui.tasks[2], deadline: ui.setDeadline, done: true}
];
// 保持画布宽度与 38% 清单占比；减少底部留白，连同浏览器栏将外框高度缩短约 3%。
const width = 1440, height = 929, listWidth = width * 0.38;
const left = (width - listWidth) / 2;
const right = left + listWidth;
const footerY = 377 + (tasks.length - 1) * 106 + 94 + 40;
const rows = tasks.map((task, index) => {
  const y = 377 + index * 106;
  const done = Boolean(task.done);
  return `<g class="task" data-done="${done}">
    ${rect(left, y, listWidth, 94, 14, colors.card, `stroke="${colors.border}" filter="url(#task-shadow)"`)}
    <circle cx="${left + 30}" cy="${y + 47}" r="12" fill="${done ? colors.green : colors.card}" stroke="${done ? colors.green : colors.border}" stroke-width="2"/>
    ${done ? `<path d="m${left + 24} ${y + 47} 4 4 8-9" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>` : ''}
    ${text(left + 58, y + 39, task.title, 18, done ? colors['text-muted'] : colors.text, done ? 'text-decoration="line-through"' : '')}
    <use href="#alarm" x="${left + 58}" y="${y + 55}" width="15" height="15"/>
    ${text(left + 80, y + 68, task.deadline, 14, colors['text-muted'])}
    <use href="#handle" x="${right - 62}" y="${y + 37}" width="16" height="20" fill="${colors['text-muted']}"/>
    ${text(right - 25, y + 52, '×', 19, colors['text-muted'], 'text-anchor="middle"')}
  </g>`;
}).join('\n');
const filters = [
  {label: ui.all, x: left, width: 68, active: true},
  {label: ui.pending, x: left + 78, width: 84},
  {label: ui.done, x: left + 172, width: 84}
].map(item => `<g>
  ${rect(item.x, 315, item.width, 38, 19, item.active ? colors.accent : colors.card, `stroke="${item.active ? colors.accent : colors.border}" stroke-width="1.5"`)}
  ${text(item.x + item.width / 2, 339, item.label, 14, item.active ? '#fff' : colors['text-muted'], 'text-anchor="middle"')}
</g>`).join('\n');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" lang="${english ? 'en' : 'zh-CN'}" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="visual-title visual-description">
  <title id="visual-title">${escape(ui.visualTitle)}</title>
  <desc id="visual-description">${escape(ui.visualDescription)}</desc>
  <defs>
    <filter id="task-shadow" x="-10%" y="-40%" width="120%" height="180%" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="4" stdDeviation="9" flood-color="#1e222d" flood-opacity="0.06"/>
    </filter>
    <svg id="handle" viewBox="0 0 16 20">
      <circle cx="5" cy="4" r="1.5"/><circle cx="11" cy="4" r="1.5"/>
      <circle cx="5" cy="10" r="1.5"/><circle cx="11" cy="10" r="1.5"/>
      <circle cx="5" cy="16" r="1.5"/><circle cx="11" cy="16" r="1.5"/>
    </svg>
    <svg id="alarm" viewBox="0 0 24 24" fill="none" stroke="#e5484d" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="13" r="7"/><path d="M12 9v4l3 2M5 3 2 6m17-3 3 3M7 20l-1 2m11-2 1 2"/>
    </svg>
  </defs>
  ${rect(0, 0, width, height, 0, colors.bg)}
  <g id="app-header">
    <svg x="24" y="23" width="122" height="28" viewBox="0 0 278 64">${logo}</svg>
    <svg x="1293" y="27" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="${colors['text-muted']}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${moon}</svg>
    <svg x="1341" y="27" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="${colors['text-muted']}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${globe}</svg>
    <svg x="1389" y="27" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="${colors['text-muted']}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${gear}</svg>
  </g>
  <g id="task-list" data-width="${listWidth}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif">
    ${text(left, 178, ui.heading, 32, colors.text, 'font-weight="700" letter-spacing="0.5"')}
    ${text(left, 209, ui.tagline, 16, colors['text-muted'])}
    ${rect(left, 239, listWidth - 102, 56, 12, colors.card, `stroke="${colors.border}" stroke-width="1.5"`)}
    ${text(left + 18, 274, ui.placeholder, 17, colors['text-muted'])}
    ${rect(right - 92, 239, 92, 56, 12, colors.accent)}
    ${text(right - 46, 274, ui.add, 17, '#fff', 'font-weight="600" text-anchor="middle"')}
    ${filters}
    ${rows}
    ${text(right - 112, footerY, ui.count(tasks.length, tasks.filter(task => task.done).length), 14, colors['text-muted'], 'text-anchor="end"')}
    ${text(right, footerY, ui.clear, 14, colors['text-muted'], 'text-anchor="end" text-decoration="underline"')}
  </g>
</svg>
`;
const filename = english ? 'product-promo-en.svg' : 'product-promo.svg';
const output = path.join(root, 'assets/brand', filename);
fs.writeFileSync(output, svg.replace(/[\t ]+$/gm, ''), 'utf8');
console.log(`Created ${filename}: ${width} × ${height}; task list ${listWidth} px (38%).`);
