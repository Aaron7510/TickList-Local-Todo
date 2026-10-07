// Run with: node tests/smoke-test.js
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

class Element {
  constructor(tag = 'div') {
    this.tag = tag;
    this.children = [];
    this.events = {};
    this.dataset = {};
    this.style = { setProperty(name, value) { this[name] = value; } };
    this.className = '';
    this.hidden = false;
    this.value = '';
    this.files = [];
    this.open = false;
    this.classList = {
      add: name => { this.className += ' ' + name; },
      remove: name => { this.className = this.className.replace(new RegExp('\\b' + name + '\\b', 'g'), '').trim(); }
    };
  }
  set innerHTML(value) { this.children = []; this.html = value; }
  get innerHTML() { return this.html || ''; }
  setAttribute(name, value) { (this.attributes ||= {})[name] = value; }
  checkValidity() { return this.valid !== false; }
  addEventListener(type, handler) { (this.events[type] ||= []).push(handler); }
  async trigger(type, event = {}) { for (const handler of this.events[type] || []) await handler(event); }
  appendChild(child) { this.children.push(child); return child; }
  removeChild(child) { this.children = this.children.filter(x => x !== child); }
  remove() {}
  click() { this.onClick?.(); }
  focus() {}
  showModal() { this.open = true; }
  close() { this.open = false; this.trigger('close'); }
  getBoundingClientRect() { return { top: 0, left: 0, right: 100, bottom: 40, width: 100, height: 40 }; }
  querySelectorAll(selector) {
    if (selector === '.item[data-id]') return this.children.filter(x => x.className.includes('item') && x.dataset.id);
    return [];
  }
  querySelector(selector) {
    const name = selector.slice(1);
    for (const child of this.children) {
      if (child.className.split(' ').includes(name)) return child;
      const found = child.querySelector(selector);
      if (found) return found;
    }
    return null;
  }
}

const html = fs.readFileSync('index.html', 'utf8');
const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(x => fs.readFileSync(x[1], 'utf8'));
scripts.forEach(script => new vm.Script(script));

const ids = ['app', 'input', 'addBtn', 'list', 'remain', 'clearDone', 'exportBtn', 'backupBtn',
  'restoreBtn', 'restoreFile', 'saveWarning', 'undoToast', 'undoMessage', 'undoBtn', 'themeBtn',
  'settingsBtn', 'settingsDialog', 'settingsClose', 'detailsDialog', 'detailsClose',
  'detailText', 'detailDescription', 'detailNameError', 'detailStatus', 'detailCreated', 'detailDeadline', 'detailClear', 'detailSaveWarning',
  'deadlineDialog', 'deadlineInput', 'deadlineClear', 'deadlineSaveWarning', 'deadlineTask', 'deadlineClose'];
const elements = Object.fromEntries(ids.map(id => [id, new Element()]));
const filters = [new Element('button'), new Element('button'), new Element('button')];
filters[0].dataset.filter = 'all';
filters[1].dataset.filter = 'pending';
filters[2].dataset.filter = 'done';
const storage = new Map();
let failSave = false;
const downloads = [];
const alerts = [];
let confirmRestore = true;
let confirmAnswers = [];
const confirmations = [];
let testNow = new Date('2026-09-30T10:00:00').getTime();
class TestDate extends Date {
  constructor(...args) { super(...(args.length ? args : [testNow])); }
  static now() { return testNow; }
}
const timers = new Map();
let nextTimer = 0;

const context = vm.createContext({
  document: {
    documentElement: { setAttribute() {} },
    body: new Element('body'),
    getElementById: id => elements[id],
    querySelectorAll: selector => selector === '.filter' ? filters : [],
    createElement: tag => {
      const el = new Element(tag);
      if (tag === 'a') el.onClick = () => downloads.push(el);
      return el;
    },
    addEventListener() {}
  },
  window: { events: {}, matchMedia: () => ({ matches: false, addEventListener() {} }),
    addEventListener(type, handler) { (this.events[type] ||= []).push(handler); } },
  localStorage: {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => { if (failSave) throw Error('blocked'); storage.set(key, value); },
    removeItem: key => storage.delete(key)
  },
  URL: { createObjectURL: blob => { downloads.blob = blob; return 'blob:test'; }, revokeObjectURL() {} },
  Blob, Date: TestDate, Math, JSON, Set, Map, Array, navigator: {},
  setTimeout: (fn, delay) => { const id = ++nextTimer; timers.set(id, { fn, at: testNow + delay }); return id; },
  clearTimeout: id => timers.delete(id),
  alert: message => alerts.push(message),
  confirm: message => { confirmations.push(message); return confirmAnswers.length ? confirmAnswers.shift() : confirmRestore; }
});
scripts.forEach(script => vm.runInContext(script, context));

async function main() {
  assert.equal(elements.settingsDialog.open, false);
  await elements.settingsBtn.trigger('click');
  assert.equal(elements.settingsDialog.open, true);
  await elements.settingsDialog.trigger('click', { target: elements.settingsDialog, clientX: 50, clientY: 20 });
  assert.equal(elements.settingsDialog.open, true); // clicking padding inside should not dismiss
  await elements.settingsClose.trigger('click');
  assert.equal(elements.settingsDialog.open, false);
  assert.equal(context.document.body.className.includes('settings-open'), false);
  await elements.settingsBtn.trigger('click');
  await elements.settingsDialog.trigger('click', { target: elements.settingsDialog, clientX: 110, clientY: 50 });
  assert.equal(elements.settingsDialog.open, false);

  elements.input.value = '第一项';
  await elements.addBtn.trigger('click');
  elements.input.value = '第二项';
  await elements.addBtn.trigger('click');
  assert.equal(elements.list.children.length, 2);
  elements.input.value = '输入法候选';
  await elements.input.trigger('keydown', { key: 'Enter', isComposing: true });
  assert.equal(elements.list.children.length, 2);
  elements.input.value = '';
  await elements.exportBtn.trigger('click');
  assert.match(downloads.at(-1).download, /\.md$/);
  assert.match(await downloads.blob.text(), /第二项/);
  const beforeMarkdownState = storage.get('todo.list.v3');
  await elements.list.children[0].children[0].trigger('click');
  await elements.exportBtn.trigger('click');
  const completedMarkdown = await downloads.blob.text();
  assert.match(completedMarkdown, /- ✔ 第二项/);
  assert.doesNotMatch(completedMarkdown, /- \[x\] 第二项/);
  await elements.list.children.find(el => el.children[1].children[0].textContent === '第二项').children[0].trigger('click');
  elements.restoreFile.files = [{ size: 100, text: async () => JSON.stringify({
    format: 'aaron-todo-backup', version: 1, todos: JSON.parse(beforeMarkdownState)
  }) }];
  await elements.restoreFile.trigger('change');

  await elements.backupBtn.trigger('click');
  const backup = JSON.parse(await downloads.blob.text());
  assert.deepEqual(backup.todos.map(x => x.text), ['第二项', '第一项']);

  const original = storage.get('todo.list.v3');
  elements.restoreFile.files = [{ size: 20, text: async () => '{bad json' }];
  await elements.restoreFile.trigger('change');
  assert.equal(storage.get('todo.list.v3'), original);
  assert.equal(alerts.length, 1);

  elements.restoreFile.files = [{ size: 100, text: async () => JSON.stringify(backup) }];
  confirmRestore = false;
  await elements.restoreFile.trigger('change');
  assert.equal(storage.get('todo.list.v3'), original);

  await elements.list.children[0].children.at(-1).trigger('click');
  assert.equal(elements.list.children.length, 1);
  assert.equal(elements.undoToast.hidden, false);
  await elements.undoBtn.trigger('click');
  assert.deepEqual(elements.list.children.map(x => x.children[1].children[0].textContent), ['第二项', '第一项']);

  // Mark two items complete, clear them, then restore their positions.
  await elements.list.children[0].children[0].trigger('click');
  await elements.list.children[0].children[0].trigger('click');
  await elements.clearDone.trigger('click');
  assert.equal(elements.list.querySelectorAll('.item[data-id]').length, 0);
  await elements.undoBtn.trigger('click');
  assert.equal(elements.list.children.length, 2);

  failSave = true;
  elements.input.value = '未保存的新事项';
  await elements.addBtn.trigger('click');
  assert.equal(elements.saveWarning.hidden, false);
  assert.equal(elements.list.children.length, 3);
  await elements.backupBtn.trigger('click');
  assert.equal(JSON.parse(await downloads.blob.text()).todos[0].text, '未保存的新事项');

  confirmRestore = true;
  elements.restoreFile.files = [{ size: 100, text: async () => JSON.stringify(backup) }];
  await elements.restoreFile.trigger('change');
  assert.equal(elements.list.children.length, 3); // failed storage leaves current list untouched
  failSave = false;
  elements.restoreFile.files = [{ size: 100, text: async () => JSON.stringify(backup) }];
  await elements.restoreFile.trigger('change');
  assert.equal(elements.list.children.length, 2);
  assert.equal(elements.saveWarning.hidden, true);

  // Backups exported by the app can legitimately exceed 5 MiB.
  const largeTodos = Array.from({ length: 350 }, (_, i) => ({
    id: 'large-' + i, text: '公开演示 ' + i, description: '字'.repeat(5000),
    done: false, deadline: '', createdAt: ''
  }));
  const largeContent = JSON.stringify({ format: 'aaron-todo-backup', version: 1, todos: largeTodos }, null, 2);
  assert.ok(new Blob([largeContent]).size > 5 * 1024 * 1024);
  let largeReads = 0;
  function selectLarge() {
    elements.restoreFile.files = [{ size: new Blob([largeContent]).size,
      text: async () => { largeReads++; return largeContent; } }];
  }
  const beforeLarge = storage.get('todo.list.v3');
  confirmAnswers = [false];
  selectLarge();
  await elements.restoreFile.trigger('change');
  assert.equal(largeReads, 0);
  assert.equal(storage.get('todo.list.v3'), beforeLarge);
  assert.match(confirmations.at(-1), /5 MiB/);
  confirmAnswers = [true, false];
  selectLarge();
  await elements.restoreFile.trigger('change');
  assert.equal(largeReads, 1);
  assert.equal(storage.get('todo.list.v3'), beforeLarge);
  failSave = true;
  confirmAnswers = [true, true];
  selectLarge();
  await elements.restoreFile.trigger('change');
  assert.equal(storage.get('todo.list.v3'), beforeLarge);
  assert.equal(elements.list.children.length, 2);
  failSave = false;
  context.window.TodoLanguage.set('en');
  confirmAnswers = [true, true];
  selectLarge();
  await elements.restoreFile.trigger('change');
  assert.match(confirmations.at(-2), /larger than 5 MiB/);
  assert.equal(JSON.parse(storage.get('todo.list.v3')).length, 350);
  await elements.backupBtn.trigger('click');
  assert.deepEqual(JSON.parse(await downloads.blob.text()).todos, largeTodos);
  context.window.TodoLanguage.set('zh');
  elements.restoreFile.files = [{ size: 100, text: async () => JSON.stringify(backup) }];
  await elements.restoreFile.trigger('change');
  assert.equal(elements.list.children.length, 2);

  await elements.list.children[0].children[0].trigger('click');
  await filters[1].trigger('click');
  assert.equal(elements.list.children.length, 1);
  assert.equal(elements.list.children[0].children[1].children[0].textContent, '第一项');
  assert.equal(filters[1].attributes['aria-pressed'], 'true');
  await elements.list.children[0].children[0].trigger('click');
  assert.equal(elements.list.querySelectorAll('.item[data-id]').length, 0);
  assert.match(elements.list.children[0].innerHTML, /没有未完成的事项/);
  await filters[2].trigger('click');
  assert.equal(elements.list.children.length, 2);
  await elements.list.children[0].children[0].trigger('click');
  assert.equal(elements.list.children.length, 1);
  await filters[0].trigger('click');
  assert.equal(elements.list.children.length, 2);
  assert.equal(filters[0].attributes['aria-pressed'], 'true');

  const pending = elements.list.children.find(el => !el.className.includes(' done'));
  assert.equal(pending.children[1].children.length, 2); // title and deadline text only
  assert.match(pending.querySelector('.deadline').textContent, /⏰ 设置截止时间/);
  await pending.querySelector('.deadline').trigger('click');
  assert.equal(elements.detailsDialog.open, false);
  assert.equal(elements.deadlineDialog.open, true);
  elements.deadlineInput.value = '2026-09-30T10:01';
  await elements.deadlineInput.trigger('change');
  assert.equal(JSON.parse(storage.get('todo.list.v3')).find(t => t.id === pending.dataset.id).deadline, '2026-09-30T10:01');
  await elements.deadlineClear.trigger('click');
  assert.equal(elements.list.children.find(el => el.dataset.id === pending.dataset.id).querySelector('.deadline').textContent, '⏰ 设置截止时间');
  assert.equal(elements.detailsDialog.open, false);
  failSave = true;
  elements.deadlineInput.value = '2026-10-01T10:00';
  await elements.deadlineInput.trigger('change');
  assert.equal(elements.deadlineSaveWarning.hidden, false);
  failSave = false;
  await elements.deadlineClear.trigger('click');
  await elements.deadlineClose.trigger('click');
  assert.equal(elements.deadlineDialog.open, false);
  assert.equal(context.document.body.className.includes('deadline-open'), false);
  await pending.querySelector('.task-title').trigger('click');
  assert.equal(elements.detailsDialog.open, true);
  assert.match(elements.detailCreated.textContent, /2026年/);
  elements.detailDeadline.value = '2026-09-30T10:01';
  await elements.detailDeadline.trigger('change');
  let card = elements.list.children.find(el => el.dataset.id === pending.dataset.id);
  const label = card.querySelector('.deadline');
  assert.equal(label.className.includes('overdue'), false);
  testNow += 60000;
  for (const [id, timer] of [...timers]) {
    if (timer.at <= testNow) { timers.delete(id); timer.fn(); }
  }
  assert.equal(card.querySelector('.deadline'), label); // refresh preserves the DOM and user focus
  assert.equal(label.className.includes('overdue'), true);
  assert.match(elements.detailStatus.textContent, /已逾期/);
  await elements.detailClear.trigger('click');
  card = elements.list.children.find(el => el.dataset.id === pending.dataset.id);
  assert.equal(card.querySelector('.deadline').textContent, '⏰ 设置截止时间');
  await elements.detailsClose.trigger('click');
  assert.equal(elements.detailsDialog.open, false);
  await card.querySelector('.task-title').trigger('click');
  elements.detailText.value = '修改后的任务';
  await elements.detailText.trigger('change');
  elements.detailDescription.value = '第一步：整理资料\n第二步：执行任务';
  await elements.detailDescription.trigger('change');
  assert.equal(elements.list.children.find(el => el.dataset.id === pending.dataset.id).querySelector('.text').textContent, '修改后的任务');
  elements.detailText.value = '   ';
  await elements.detailText.trigger('change');
  assert.equal(elements.detailNameError.hidden, false);
  assert.equal(JSON.parse(storage.get('todo.list.v3')).find(t => t.id === pending.dataset.id).text, '修改后的任务');
  await elements.detailsClose.trigger('click');
  await elements.backupBtn.trigger('click');
  const detailBackup = JSON.parse(await downloads.blob.text());
  assert.equal(detailBackup.todos.find(t => t.id === pending.dataset.id).description, '第一步：整理资料\n第二步：执行任务');
  elements.restoreFile.files = [{ size: 100, text: async () => JSON.stringify(detailBackup) }];
  await elements.restoreFile.trigger('change');
  await elements.list.children.find(el => el.dataset.id === pending.dataset.id).querySelector('.task-title').trigger('click');
  assert.equal(elements.detailText.value, '修改后的任务');
  assert.equal(elements.detailDescription.value, '第一步：整理资料\n第二步：执行任务');
  await elements.detailsClose.trigger('click');
  await elements.exportBtn.trigger('click');
  assert.match(await downloads.blob.text(), /第一步：整理资料/);
  const completed = elements.list.children.find(el => el.className.includes(' done'));
  await completed.querySelector('.task-title').trigger('click');
  elements.detailDeadline.value = '2026-09-30T09:00';
  await elements.detailDeadline.trigger('change');
  assert.equal(elements.list.children.find(el => el.dataset.id === completed.dataset.id).querySelector('.deadline').className.includes('overdue'), false);
  assert.equal(elements.detailStatus.textContent, '已完成');
  failSave = true;
  elements.detailDeadline.value = '2026-10-01T10:00';
  await elements.detailDeadline.trigger('change');
  assert.equal(elements.detailSaveWarning.hidden, false);
  elements.detailDescription.value = '保存失败时仍保留本页说明';
  await elements.detailDescription.trigger('change');
  assert.equal(elements.detailSaveWarning.hidden, false);
  await elements.backupBtn.trigger('click');
  assert.equal(JSON.parse(await downloads.blob.text()).todos.find(t => t.id === completed.dataset.id).description, '保存失败时仍保留本页说明');
  failSave = false;
  await elements.detailsClose.trigger('click');
  // A slow earlier selection must not replace a newer backup selection.
  let finishSlow;
  elements.restoreFile.files = [{ size: 100, text: () => new Promise(resolve => { finishSlow = resolve; }) }];
  const slowRestore = elements.restoreFile.trigger('change');
  const newer = { ...backup, todos: [{ ...backup.todos[0], text: '最新恢复' }] };
  elements.restoreFile.files = [{ size: 100, text: async () => JSON.stringify(newer) }];
  await elements.restoreFile.trigger('change');
  finishSlow(JSON.stringify(backup));
  await slowRestore;
  assert.equal(JSON.parse(storage.get('todo.list.v3'))[0].text, '最新恢复');
  await elements.list.children[0].children.at(-1).trigger('click');
  elements.input.value = '新增事项';
  await elements.addBtn.trigger('click');
  await elements.undoBtn.trigger('click');
  assert.equal(elements.list.children.length, 2);
  elements.restoreFile.files = [{ size: 100, text: async () => JSON.stringify(backup) }];
  await elements.restoreFile.trigger('change');
  await elements.list.children[0].children.at(-1).trigger('click');
  elements.input.value = '撤销期间新增';
  await elements.addBtn.trigger('click');
  await elements.undoBtn.trigger('click');
  assert.deepEqual(elements.list.children.map(el => el.querySelector('.text').textContent), ['撤销期间新增', '第二项', '第一项']);
  const beforeLanguage = storage.get('todo.list.v3');
  context.window.TodoLanguage.set('en');
  assert.equal(storage.get('ticklist.landing.language.v1'), 'en');
  assert.equal(storage.get('todo.list.v3'), beforeLanguage); // Translation must never write task data.
  assert.equal(elements.remain.textContent, '3 tasks, 0 completed');
  assert.equal(elements.themeBtn.title, 'Switch to dark mode');
  assert.equal(elements.list.children[0].querySelector('.text').textContent, '撤销期间新增');
  assert.equal(elements.list.children[0].querySelector('.deadline').textContent, '⏰ Set deadline');
  await elements.list.children[0].querySelector('.task-title').trigger('click');
  assert.equal(elements.detailStatus.textContent, 'Pending');
  elements.detailDeadline.value = '2026-10-05T20:00';
  await elements.detailDeadline.trigger('change');
  assert.equal(elements.list.children[0].querySelector('.deadline').textContent, '⏰ Oct 5, 20:00');
  elements.detailDeadline.valid = false;
  elements.detailDeadline.value = '';
  await elements.detailDeadline.trigger('change');
  assert.equal(elements.list.children[0].querySelector('.deadline').textContent, '⏰ Oct 5, 20:00');
  elements.detailDeadline.valid = true;
  await elements.detailsClose.trigger('click');
  await elements.exportBtn.trigger('click');
  const englishMarkdown = await downloads.blob.text();
  assert.match(englishMarkdown, /# TickList To-do list/);
  assert.match(englishMarkdown, /撤销期间新增 \(due Oct 5, 20:00\)/);
  await elements.list.children[0].children.at(-1).trigger('click');
  assert.equal(elements.undoMessage.textContent, 'Deleted 1 task');
  context.window.TodoLanguage.set('zh');
  assert.equal(elements.undoMessage.textContent, '已删除 1 项待办');
  await elements.undoBtn.trigger('click');
  assert.equal(elements.list.children[0].querySelector('.deadline').textContent, '⏰ 10月5日 20:00');
  failSave = true;
  context.window.TodoLanguage.set('en');
  assert.equal(context.window.TodoLanguage.get(), 'en');
  elements.input.value = '保存受阻';
  await elements.addBtn.trigger('click');
  assert.equal(elements.saveWarning.hidden, false);
  assert.match(elements.saveWarning.textContent, /Your browser cannot save data/);
  failSave = false;
  const otherPage = JSON.stringify([{ id: 'other-page', text: '来自另一页', done: false, deadline: '', createdAt: '' }]);
  storage.set('todo.list.v3', otherPage);
  for (const handler of context.window.events.storage) handler({ key: 'todo.list.v3' });
  assert.match(elements.saveWarning.textContent, /Another page changed/);
  elements.input.value = '保留本页未保存编辑';
  await elements.addBtn.trigger('click');
  assert.equal(storage.get('todo.list.v3'), otherPage);
  await elements.backupBtn.trigger('click');
  assert.ok(JSON.parse(await downloads.blob.text()).todos.some(t => t.text === '保留本页未保存编辑'));
  context.window.TodoLanguage.set('zh');
  assert.match(elements.saveWarning.textContent, /另一个页面/);
  assert.equal(elements.saveWarning.hidden, false);
  console.log('Smoke checks passed: task flows, settings, data operations, undo and bilingual dynamic content.');
}

main().catch(error => { console.error(error); process.exitCode = 1; });
