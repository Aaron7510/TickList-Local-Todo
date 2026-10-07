// 存储格式和校验集中在这里；损坏的原始数据保留副本后才允许覆盖。
(function () {
  'use strict';
  const KEY = 'todo.list.v3';
  let blocked = false;
  let observed = null;
  function validate(data) {
    if (!Array.isArray(data)) throw new Error('事项必须为数组');
    const ids = new Set();
    return data.map(t => {
      if (!t || typeof t.id !== 'string' || !t.id || ids.has(t.id) ||
          typeof t.text !== 'string' || !t.text.trim() || t.text.length > 200 ||
          typeof t.done !== 'boolean' || typeof t.deadline !== 'string' ||
          typeof t.createdAt !== 'string' ||
          (t.description !== undefined && (typeof t.description !== 'string' || t.description.length > 5000)) ||
          [t.deadline, t.createdAt].some(v => v && isNaN(new Date(v).getTime()))) throw new Error('事项格式无效');
      ids.add(t.id);
      return { id: t.id, text: t.text, description: t.description || '', deadline: t.deadline, createdAt: t.createdAt, done: t.done };
    });
  }
  function preserve(key, raw) {
    try { localStorage.setItem(key + '.recovery.' + Date.now(), raw); }
    catch (error) { blocked = true; }
  }
  function load() {
    blocked = false;
    let key = KEY, raw;
    try {
      raw = localStorage.getItem(KEY);
      observed = raw;
      if (raw !== null) return { todos: validate(JSON.parse(raw)), error: false };
      for (key of ['todo.list.v2', 'todo.list.v1']) {
        raw = localStorage.getItem(key);
        if (raw === null) continue;
        const old = JSON.parse(raw);
        if (!Array.isArray(old)) throw new Error('旧版格式无效');
        const todos = validate(old.map(t => ({
          id: t && t.id, text: t && t.text, createdAt: '',
          deadline: key === 'todo.list.v2' ? (t && t.end || '') : '',
          done: key === 'todo.list.v2' ? (t && t.progress || 0) >= 100 : !!(t && t.done)
        })));
        // 先保存成功，再清理旧键；失败时仍可使用内存中的迁移结果。
        try { save(todos); localStorage.removeItem(key); }
        catch (error) { return { todos, error: true }; }
        return { todos, error: false };
      }
      return { todos: [], error: false };
    } catch (error) {
      if (typeof raw === 'string') preserve(key, raw);
      return { todos: [], error: true, invalid: typeof raw === 'string' };
    }
  }
  function save(todos) {
    if (blocked) throw new Error('无法保留异常数据，禁止覆盖');
    const clean = validate(todos);
    if (isStale()) {
      const error = new Error('其他页面已更新清单，禁止覆盖');
      error.code = 'CONFLICT';
      throw error;
    }
    const raw = JSON.stringify(clean);
    localStorage.setItem(KEY, raw);
    observed = raw;
  }
  function isStale() { return localStorage.getItem(KEY) !== observed; }
  function parseBackup(backup) {
    if (!backup || backup.format !== 'aaron-todo-backup' || backup.version !== 1) throw new Error('备份格式无效');
    return validate(backup.todos);
  }
  window.TodoStorage = { load, save, parseBackup, isStale };
})();
