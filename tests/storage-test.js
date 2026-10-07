// Run with: node tests/storage-test.js
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('assets/storage.js', 'utf8');
const item = { id: 'a', text: '任务', done: false, deadline: '', createdAt: '' };
function setup(entries = {}, fail = false) {
  const data = new Map(Object.entries(entries));
  const context = vm.createContext({ window: {}, localStorage: {
    getItem: k => data.get(k) ?? null,
    setItem(k, v) { if (fail) throw Error('blocked'); data.set(k, v); },
    removeItem: k => data.delete(k)
  } });
  vm.runInContext(source, context);
  return { api: context.window.TodoStorage, data };
}
let test = setup({ 'todo.list.v3': JSON.stringify([item]) });
assert.equal(test.api.load().todos[0].text, '任务');
assert.equal(test.api.load().todos[0].description, '');
const withDescription = { ...item, description: '用户填写的说明\n保留换行' };
test.api.save([withDescription]);
assert.equal(test.api.load().todos[0].description, withDescription.description);
assert.throws(() => test.api.save([{ ...item, description: 123 }]));
assert.throws(() => test.api.save([{ ...item, description: '字'.repeat(5001) }]));
for (const bad of ['{bad', '{}', '[null]', JSON.stringify([item, item]), JSON.stringify([{ ...item, createdAt: 'bad-date' }])]) {
  test = setup({ 'todo.list.v3': bad, 'todo.list.v2': '[]' });
  assert.equal(test.api.load().error, true);
  assert.equal(test.data.get('todo.list.v3'), bad);
  assert.ok([...test.data.keys()].some(k => k.startsWith('todo.list.v3.recovery.')));
  test.api.save([item]);
  assert.equal(JSON.parse(test.data.get('todo.list.v3')).length, 1);
}
test = setup({ 'todo.list.v3': '[null]' }, true);
assert.equal(test.api.load().error, true);
assert.throws(() => test.api.save([item]));
assert.equal(test.data.get('todo.list.v3'), '[null]');
test = setup({ 'todo.list.v2': JSON.stringify([{ id: 'a', text: '旧任务', progress: 100, end: '' }]) });
assert.equal(test.api.load().todos[0].done, true);
assert.equal(test.data.has('todo.list.v2'), false);
test = setup({ 'todo.list.v1': JSON.stringify([{ id: 'a', text: '旧任务', done: false }]) }, true);
assert.equal(test.api.load().todos.length, 1);
assert.equal(test.data.has('todo.list.v1'), true);
test = setup({ 'todo.list.v3': '[]', 'todo.list.v1': '[null]' });
assert.equal(test.api.load().error, false); // valid empty v3 must not resurrect old data
assert.throws(() => test.api.parseBackup({ format: 'aaron-todo-backup', version: 2, todos: [] }));
test = setup({ 'todo.list.v3': JSON.stringify([item]) });
test.api.load();
const external = JSON.stringify([{ ...item, text: '另一个页面的最新清单' }]);
test.data.set('todo.list.v3', external);
assert.equal(test.api.isStale(), true);
assert.throws(() => test.api.save([{ ...item, text: '旧页面' }]), { code: 'CONFLICT' });
assert.equal(test.data.get('todo.list.v3'), external);
test.api.load();
test.api.save([{ ...item, text: '刷新后继续编辑' }]);
assert.equal(test.api.isStale(), false);
test.data.delete('todo.list.v3');
assert.throws(() => test.api.save([item]), { code: 'CONFLICT' });
const fixture = JSON.parse(fs.readFileSync('tests/fixtures/valid-backup.json', 'utf8'));
const fixtureTasks = test.api.parseBackup(fixture);
assert.equal(fixtureTasks.length, 3);
assert.equal(fixtureTasks.filter(t => t.done).length, 1);
assert.equal(fixtureTasks[0].description, '先整理重点，再列出下一步。\n仅用于公开演示。');
console.log('Storage checks passed: validation, recovery copies, blocked writes, legacy migration and stale-page protection.');
