(function () {
  'use strict';
  const tr = window.AppI18n.t;
  const loaded = window.TodoStorage.load();
  let storageError = loaded.error;
  let storageConflict = false;
  let todos = loaded.todos;
  let currentFilter = 'all';

  const input = document.getElementById('input');
  const addBtn = document.getElementById('addBtn');
  const listEl = document.getElementById('list');
  const appEl = document.getElementById('app');
  const remainEl = document.getElementById('remain');
  const clearDoneBtn = document.getElementById('clearDone');
  const exportBtn = document.getElementById('exportBtn');
  const backupBtn = document.getElementById('backupBtn');
  const restoreBtn = document.getElementById('restoreBtn');
  const restoreFile = document.getElementById('restoreFile');
  const deadlineDialog = document.getElementById('deadlineDialog');
  const deadlineInput = document.getElementById('deadlineInput');
  const deadlineClear = document.getElementById('deadlineClear');
  const deadlineSaveWarning = document.getElementById('deadlineSaveWarning');
  let deadlineId = null;
  function openDeadline(id) {
    if (dragController.active || deadlineDialog.open) return;
    dragController.cancelPress();
    const t = todos.find(t => t.id === id);
    if (!t) return;
    deadlineId = id;
    document.getElementById('deadlineTask').textContent = t.text;
    const d = new Date(t.deadline);
    deadlineInput.value = t.deadline ? d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes()) : '';
    deadlineClear.disabled = !t.deadline;
    deadlineSaveWarning.hidden = !storageError;
    deadlineDialog.showModal();
    document.body.classList.add('deadline-open');
    deadlineInput.focus();
  }
  function saveDeadlineValue() {
    const t = todos.find(t => t.id === deadlineId);
    if (!t || !deadlineInput.checkValidity()) return;
    const value = deadlineInput.value || '';
    if (value === t.deadline) return;
    t.deadline = value;
    deadlineClear.disabled = !value;
    deadlineSaveWarning.hidden = save();
    render();
  }
  deadlineInput.addEventListener('change', saveDeadlineValue);
  deadlineClear.addEventListener('click', () => { deadlineInput.value = ''; saveDeadlineValue(); });
  document.getElementById('deadlineClose').addEventListener('click', () => deadlineDialog.close());
  deadlineDialog.addEventListener('close', () => {
    saveDeadlineValue();
    const id = deadlineId;
    deadlineId = null;
    document.body.classList.remove('deadline-open');
    const item = Array.from(listEl.querySelectorAll('.item[data-id]')).find(el => el.dataset.id === id);
    if (item) item.querySelector('.deadline').focus();
    else input.focus();
  });
  deadlineDialog.addEventListener('click', e => {
    if (e.target !== deadlineDialog) return;
    const r = deadlineDialog.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) deadlineDialog.close();
  });
  const detailsDialog = document.getElementById('detailsDialog');
  const detailText = document.getElementById('detailText');
  const detailDescription = document.getElementById('detailDescription');
  const detailNameError = document.getElementById('detailNameError');
  const detailStatus = document.getElementById('detailStatus');
  const detailCreated = document.getElementById('detailCreated');
  const detailDeadline = document.getElementById('detailDeadline');
  const detailClear = document.getElementById('detailClear');
  const detailSaveWarning = document.getElementById('detailSaveWarning');
  let detailId = null;
  function refreshDetailStatus() {
    const t = todos.find(t => t.id === detailId);
    if (!t) return;
    const overdue = isOverdue(t);
    detailStatus.textContent = t.done ? tr('已完成') : overdue ? tr('未完成 · 已逾期') : tr('未完成');
    detailStatus.className = 'detail-status' + (overdue ? ' overdue' : '');
  }
  function openDetails(id) {
    if (dragController.active || detailsDialog.open) return;
    dragController.cancelPress();
    const t = todos.find(t => t.id === id);
    if (!t) return;
    detailId = id;
    detailText.value = t.text;
    detailDescription.value = t.description || '';
    detailNameError.hidden = true;
    detailText.setAttribute('aria-invalid', 'false');
    detailCreated.textContent = formatCreated(t.createdAt);
    const d = new Date(t.deadline);
    detailDeadline.value = t.deadline && !isNaN(d.getTime())
      ? d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes()) : '';
    detailClear.disabled = !t.deadline;
    detailSaveWarning.hidden = !storageError;
    refreshDetailStatus();
    detailsDialog.showModal();
    document.body.classList.add('details-open');
  }
  document.getElementById('detailsClose').addEventListener('click', () => detailsDialog.close());
  detailsDialog.addEventListener('close', () => {
    saveDetailContent();
    const id = detailId;
    detailId = null;
    document.body.classList.remove('details-open');
    const item = Array.from(listEl.querySelectorAll('.item[data-id]')).find(el => el.dataset.id === id);
    if (item) item.querySelector('.task-title').focus();
    else input.focus();
  });
  function saveDetailContent() {
    const t = todos.find(t => t.id === detailId);
    if (!t) return;
    const name = detailText.value.trim();
    const validName = name.length > 0 && name.length <= 200;
    detailNameError.hidden = validName;
    detailText.setAttribute('aria-invalid', String(!validName));
    if (!validName) detailNameError.textContent = tr('名称需为 1–200 个字符，已保留原名称。');
    const description = detailDescription.value;
    if (description.length > 5000) return;
    const nextName = validName ? name : t.text;
    if (nextName === t.text && description === (t.description || '')) return;
    t.text = nextName;
    t.description = description;
    detailSaveWarning.hidden = save();
    render();
  }
  detailText.addEventListener('change', saveDetailContent);
  detailDescription.addEventListener('change', saveDetailContent);
  detailsDialog.addEventListener('click', e => {
    if (e.target !== detailsDialog) return;
    const r = detailsDialog.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) detailsDialog.close();
  });
  function saveDetailDeadline() {
    const t = todos.find(t => t.id === detailId);
    if (!t || !detailDeadline.checkValidity()) return;
    t.deadline = detailDeadline.value || '';
    detailClear.disabled = !t.deadline;
    detailSaveWarning.hidden = save();
    render();
  }
  detailDeadline.addEventListener('change', saveDetailDeadline);
  detailClear.addEventListener('click', () => { detailDeadline.value = ''; saveDetailDeadline(); });
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsDialog = document.getElementById('settingsDialog');
  const settingsClose = document.getElementById('settingsClose');
  settingsBtn.addEventListener('click', () => {
    if (settingsDialog.open) return;
    settingsDialog.showModal();
    settingsBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('settings-open');
  });
  settingsClose.addEventListener('click', () => settingsDialog.close());
  settingsDialog.addEventListener('close', () => {
    document.body.classList.remove('settings-open');
    settingsBtn.setAttribute('aria-expanded', 'false');
  });
  settingsDialog.addEventListener('click', e => {
    if (e.target !== settingsDialog) return;
    const rect = settingsDialog.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) settingsDialog.close();
  });
  const saveWarning = document.getElementById('saveWarning');
  const undoToast = document.getElementById('undoToast');
  const undoMessage = document.getElementById('undoMessage');
  const undoBtn = document.getElementById('undoBtn');
  let pendingUndo = null;
  let undoTimer = null;
  let overdueTimer = null;
  saveWarning.hidden = !storageError;
  saveWarning.textContent = tr('浏览器无法保存数据。当前修改只在本页暂存，关闭或刷新后可能丢失。请打开右上角“设置”，点击“备份数据”保存副本。');
  let invalidDataWarning = !!loaded.invalid;
  if (loaded.invalid) saveWarning.textContent = tr('检测到异常的本地数据，原始内容已保留；为避免页面出错，暂时显示空清单。请优先使用已有备份恢复。若浏览器仍无法保存，请先备份本页的新任务。');
  const filters = document.querySelectorAll('.filter');

  window.TodoTheme.init(document.getElementById('themeBtn'));

  function updateSaveWarning() {
    const conflict = tr('另一个页面已修改清单。当前页的修改尚未保存，请先备份当前页，再刷新查看最新清单。');
    saveWarning.textContent = storageConflict ? conflict : invalidDataWarning
      ? tr('检测到异常的本地数据，原始内容已保留；为避免页面出错，暂时显示空清单。请优先使用已有备份恢复。若浏览器仍无法保存，请先备份本页的新任务。')
      : tr('浏览器无法保存数据。当前修改只在本页暂存，关闭或刷新后可能丢失。请打开右上角“设置”，点击“备份数据”保存副本。');
    detailSaveWarning.textContent = storageConflict ? conflict : tr('浏览器无法保存数据，当前修改只在本页暂存。请关闭详情后，在“设置”中备份数据。');
    deadlineSaveWarning.textContent = storageConflict ? conflict : tr('浏览器无法保存数据，当前修改只在本页暂存。请在“设置”中备份数据。');
    saveWarning.hidden = detailSaveWarning.hidden = deadlineSaveWarning.hidden = !storageError;
  }
  function checkExternalChanges() {
    try {
      storageConflict = window.TodoStorage.isStale();
      if (storageConflict) storageError = true;
    } catch (_) { storageError = true; }
    updateSaveWarning();
  }
  window.addEventListener('storage', event => {
    if (event.key === 'todo.list.v3' || event.key === null) checkExternalChanges();
  });
  window.addEventListener('pageshow', checkExternalChanges);

  function saveRaw(arr) { window.TodoStorage.save(arr); }
  function save() {
    invalidDataWarning = false;
    try { saveRaw(todos); storageError = false; storageConflict = false; }
    catch (e) { storageError = true; storageConflict = e.code === 'CONFLICT'; }
    updateSaveWarning();
    updateCounter();
    return !storageError;
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function formatCreated(value) {
    const d = new Date(value);
    if (!value || isNaN(d.getTime())) return tr('未知（旧版本数据）');
    return window.TodoLanguage.get() === 'en'
      ? fmt(value).replace(', ', ', ' + d.getFullYear() + ', ')
      : d.getFullYear() + '年' + fmt(value);
  }
  function fmt(v) {
    if (!v) return tr('设置截止时间');
    const d = new Date(v);
    if (isNaN(d)) return v;
    if (window.TodoLanguage.get() === 'en') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months[d.getMonth()] + ' ' + d.getDate() + ', ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
    }
    return (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }
  function add(text) {
    if (dragController.active) return;
    todos.unshift({ id: Date.now() + '' + Math.random().toString(36).slice(2, 7), text, description: '', deadline: '', createdAt: new Date().toISOString(), done: false });
    save(); render();
  }
  function toggle(id) {
    if (dragController.active) return;
    const i = todos.findIndex(x => x.id === id);
    if (i < 0) return;
    const t = todos[i];
    t.done = !t.done;
    // 移动到未完成组与已完成组的分界处：
    // 勾选完成 → 移到所有未完成事项下面（已完成组顶部）
    // 取消勾选 → 移到已完成组前面（未完成组底部）
    todos.splice(i, 1);
    const firstDone = todos.findIndex(x => x.done);
    if (firstDone === -1) todos.push(t);
    else todos.splice(firstDone, 0, t);
    save(); render();
  }
  function dismissUndo() {
    clearTimeout(undoTimer);
    undoTimer = null;
    pendingUndo = null;
    undoToast.hidden = true;
  }
  let undoCopy = null;
  function offerUndo(removed, message) {
    dismissUndo();
    pendingUndo = removed;
    undoCopy = message;
    undoMessage.textContent = tr(message, { count: removed.length });
    undoToast.hidden = false;
    undoTimer = setTimeout(dismissUndo, 10000);
  }
  function remove(id) {
    if (dragController.active) return;
    const index = todos.findIndex(x => x.id === id);
    if (index < 0) return;
    const removed = [{ item: todos[index], index, before: todos[index + 1]?.id, after: todos[index - 1]?.id }];
    todos.splice(index, 1);
    save(); render(); offerUndo(removed, '已删除 {count} 项待办');
  }
  function clearDone() {
    if (dragController.active) return;
    const removed = todos.flatMap((item, index) => item.done ? [{ item, index, before: todos[index + 1]?.id, after: todos[index - 1]?.id }] : []);
    if (!removed.length) return;
    todos = todos.filter(x => !x.done);
    save(); render(); offerUndo(removed, '已清除 {count} 项已完成待办');
  }
  undoBtn.addEventListener('click', () => {
    if (!pendingUndo || dragController.active) return;
    for (const { item, index, before, after } of pendingUndo) {
      if (todos.some(t => t.id === item.id)) continue;
      const next = todos.findIndex(t => t.id === before);
      const previous = todos.findIndex(t => t.id === after);
      const position = next >= 0 ? next : previous >= 0 ? previous + 1 : Math.min(index, todos.length);
      todos.splice(position, 0, item);
    }
    dismissUndo();
    save(); render();
  });

  const dragController = window.TodoDrag.create(listEl, ids => {
    reorderTodos(ids);
    save(); render();
  });

  // 仅重排当前可见的事项，不可见项（筛选时）保持原有穿插位置
  function reorderTodos(orderedVisibleIds) {
    const visibleSet = new Set(todos.filter(matches).map(t => t.id));
    if (orderedVisibleIds.length !== visibleSet.size || new Set(orderedVisibleIds).size !== visibleSet.size ||
        orderedVisibleIds.some(id => !visibleSet.has(id))) return;
    const byId = new Map(todos.map(t => [t.id, t]));
    let vi = 0;
    const out = [];
    todos.forEach(t => {
      if (visibleSet.has(t.id)) out.push(byId.get(orderedVisibleIds[vi++]));
      else out.push(t);
    });
    todos = out;
  }

  function matches(t) {
    if (currentFilter === 'pending') return !t.done;
    if (currentFilter === 'done') return t.done;
    return true;
  }

  function isOverdue(t, now = Date.now()) {
    return !!t.deadline && !t.done && new Date(t.deadline).getTime() <= now;
  }
  function refreshOverdue() {
    clearTimeout(overdueTimer);
    const now = Date.now();
    const byId = new Map(todos.map(t => [t.id, t]));
    listEl.querySelectorAll('.item[data-id]').forEach(el => {
      const t = byId.get(el.dataset.id);
      const label = el.querySelector('.deadline');
      if (!t || !label) return;
      const overdue = isOverdue(t, now);
      label.className = 'deadline' + (overdue ? ' overdue' : '');
      label.textContent = '⏰ ' + fmt(t.deadline);
    });
    refreshDetailStatus();
    // 在下一个截止点更新，最长每分钟检查一次，以适应系统时钟变化。
    if (document.hidden) return;
    let delay = 60000;
    todos.forEach(t => {
      const remaining = new Date(t.deadline).getTime() - now;
      if (!t.done && remaining > 0) delay = Math.min(delay, remaining);
    });
    overdueTimer = setTimeout(refreshOverdue, Math.max(1, delay));
  }
  document.addEventListener('visibilitychange', refreshOverdue);
  window.addEventListener('focus', refreshOverdue);

  function updateCounter() {
    const done = todos.filter(t => t.done).length;
    remainEl.textContent = tr('共 {total} 项，已完成 {done} 项', { total: todos.length, done });
  }

  let lastLayoutCount = 0;
  let lastLayoutHeight = null;
  let lockedLayoutHeight = null;
  function updateLayout() {
    const rows = Array.from(listEl.querySelectorAll('.item[data-id]'));
    let height = appEl.offsetHeight;
    if (rows.length > 4) {
      const fourth = rows[3], last = rows[rows.length - 1];
      height -= (last.offsetTop + last.offsetHeight) - (fourth.offsetTop + fourth.offsetHeight);
      // 跨过四条的边界时保留原位置，避免新增的长任务改变锁定位置。
      if (lockedLayoutHeight === null) lockedLayoutHeight = lastLayoutCount === 4 ? lastLayoutHeight : height;
      height = lockedLayoutHeight;
    } else {
      lockedLayoutHeight = null;
    }
    appEl.style.setProperty('--app-layout-height', height + 'px');
    lastLayoutCount = rows.length;
    lastLayoutHeight = height;
  }
  window.addEventListener('resize', () => {
    lockedLayoutHeight = null;
    lastLayoutCount = 0;
    updateLayout();
  });

  function render() {
    // FLIP - First：记录重排前每个事项的位置
    const oldTops = new Map();
    listEl.querySelectorAll('.item[data-id]').forEach(el => {
      oldTops.set(el.dataset.id, el.getBoundingClientRect().top);
    });
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const items = todos.filter(matches);
    listEl.innerHTML = '';

    if (items.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty';
      const tip = currentFilter === 'done' ? tr('还没有已完成的事项')
        : currentFilter === 'pending' ? tr('没有未完成的事项') : tr('暂无待办事项，添加一个吧');
      empty.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9 2 2 4-4"/></svg>' + tip;
      listEl.appendChild(empty);
      updateLayout();
      refreshOverdue();
      return;
    }

    items.forEach(t => {
      const li = document.createElement('li');
      li.className = 'item' + (t.done ? ' done' : '');
      li.dataset.id = t.id;
      // 只有真正新增的事项才播放入场动画，避免重排时整列闪烁
      if (!oldTops.has(t.id)) li.classList.add('enter');

      const check = document.createElement('button');
      check.type = 'button';
      check.className = 'check';
      check.innerHTML = '<svg viewBox="0 0 24 24"><polyline points="6 12 10 16 18 7"/></svg>';
      check.title = t.done ? tr('标记为未完成') : tr('标记为完成');
      check.setAttribute('aria-label', check.title + '：' + t.text);
      check.setAttribute('aria-pressed', String(t.done));
      check.addEventListener('click', () => toggle(t.id));

      const middle = document.createElement('div');
      middle.className = 'middle';

      const text = document.createElement('button');
      text.type = 'button';
      text.className = 'text task-title';
      text.title = tr('查看任务详情');
      text.textContent = t.text;
      text.addEventListener('click', () => openDetails(t.id));

      middle.appendChild(text);
      const deadline = document.createElement('button');
      deadline.type = 'button';
      deadline.className = 'deadline' + (isOverdue(t) ? ' overdue' : '');
      deadline.textContent = '⏰ ' + fmt(t.deadline);
      deadline.title = t.deadline ? tr('修改截止时间') : tr('设置截止时间');
      deadline.setAttribute('aria-label', deadline.title + '：' + t.text);
      deadline.addEventListener('click', () => openDeadline(t.id));
      middle.appendChild(deadline);

      const del = document.createElement('button');
      del.className = 'del';
      del.type = 'button';
      del.innerHTML = '&times;';
      del.title = tr('删除');
      del.setAttribute('aria-label', del.title + ': ' + t.text);
      del.addEventListener('click', () => remove(t.id));

      const handle = document.createElement('button');
      handle.className = 'drag-handle';
      handle.type = 'button';
      handle.title = tr('按住手柄拖动排序');
      handle.setAttribute('aria-label', tr('拖动排序') + ': ' + t.text);
      handle.innerHTML = '<svg viewBox="0 0 16 20" aria-hidden="true"><circle cx="5" cy="4" r="1.5"/><circle cx="11" cy="4" r="1.5"/><circle cx="5" cy="10" r="1.5"/><circle cx="11" cy="10" r="1.5"/><circle cx="5" cy="16" r="1.5"/><circle cx="11" cy="16" r="1.5"/></svg>';
      handle.addEventListener('pointerdown', ev => dragController.start(ev, li, t.id));

      li.appendChild(check);
      li.appendChild(middle);
      li.appendChild(handle);
      li.appendChild(del);
      listEl.appendChild(li);
    });

    updateLayout();
    // FLIP - Last / Invert / Play：让位置变化的事项从旧位置平滑滑到新位置
    if (!reduceMotion) {
      listEl.querySelectorAll('.item[data-id]').forEach(el => {
        const oldTop = oldTops.get(el.dataset.id);
        if (oldTop == null) return; // 新加入的事项走入场动画
        const dy = oldTop - el.getBoundingClientRect().top;
        if (!dy) return;
        el.animate(
          [
            { transform: 'translateY(' + dy + 'px)' },
            { transform: 'translateY(0)' }
          ],
          { duration: 708, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
        );
      });
    }
    refreshOverdue();
  }

  function submit() {
    if (dragController.active) return;
    const text = input.value.trim();
    if (!text) return;
    add(text);
    input.value = '';
    input.focus();
  }

  addBtn.addEventListener('click', submit);
  input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.isComposing && e.keyCode !== 229) submit(); });

  filters.forEach(f => {
    f.addEventListener('click', () => {
      if (dragController.active) return;
      filters.forEach(x => {
        x.classList.remove('active');
        x.setAttribute('aria-pressed', 'false');
      });
      f.classList.add('active');
      f.setAttribute('aria-pressed', 'true');
      currentFilter = f.dataset.filter;
      render();
    });
  });

  clearDoneBtn.addEventListener('click', clearDone);

  function download(name, content, type) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  backupBtn.addEventListener('click', () => {
    const now = new Date();
    const date = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
    const backup = { format: 'aaron-todo-backup', version: 1, exportedAt: new Date().toISOString(), todos };
    download(tr('TickList-备份-') + date + '.json', JSON.stringify(backup, null, 2), 'application/json;charset=utf-8');
  });

  restoreBtn.addEventListener('click', () => restoreFile.click());
  let restoreRequest = 0;
  restoreFile.addEventListener('change', async () => {
    const request = ++restoreRequest;
    const file = restoreFile.files[0];
    restoreFile.value = '';
    if (!file) return;
    if (file.size > 5 * 1024 * 1024 &&
        !confirm(tr('备份文件超过 5 MiB，读取和恢复可能耗时。是否继续？'))) return;
    let restored;
    try {
      const contents = await file.text();
      if (request !== restoreRequest) return;
      const backup = JSON.parse(contents);
      restored = window.TodoStorage.parseBackup(backup);
    } catch (e) {
      if (request !== restoreRequest) return;
      alert(tr('无法读取备份文件，文件格式或事项内容不正确。'));
      return;
    }
    if (!confirm(tr('恢复备份会替换当前全部待办事项。建议先备份当前数据，确定继续吗？'))) return;
    try {
      saveRaw(restored);
    } catch (e) {
      storageError = true;
      storageConflict = e.code === 'CONFLICT';
      updateSaveWarning();
      alert(storageConflict ? tr('恢复失败：另一个页面已修改清单，请备份当前页后刷新再恢复。')
        : tr('恢复失败：浏览器无法保存数据，当前待办事项未被替换。'));
      return;
    }
    storageError = false;
    storageConflict = false;
    invalidDataWarning = false;
    updateSaveWarning();
    todos = restored;
    dismissUndo();
    updateCounter();
    render();
  });

  exportBtn.addEventListener('click', () => {
    const now = new Date();
    const date = pad(now.getFullYear()) + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
    let lines = [tr('# TickList 待办清单'), '', tr('> 把今天，一件件做好。'), '', tr('导出时间：') + fmt(now), '', tr('## 进行中'), ''];

    const active = todos.filter(t => !t.done);
    const done = todos.filter(t => t.done);
    function appendDescription(t) {
      if (!t.description) return;
      lines.push('');
      t.description.split(/\r?\n/).forEach(line => lines.push('  > ' + line));
      lines.push('');
    }

    if (active.length === 0) lines.push(tr('_暂无未完成事项_'));
    active.forEach(t => {
      const dl = t.deadline ? tr('（截止 {date}）', { date: fmt(t.deadline) }) : '';
      lines.push('- [ ] ' + t.text + dl);
      appendDescription(t);
    });

    lines.push('', tr('## 已完成'), '');
    if (done.length === 0) lines.push(tr('_暂无已完成事项_'));
    done.forEach(t => {
      const dl = t.deadline ? tr('（截止 {date}）', { date: fmt(t.deadline) }) : '';
      lines.push('- ✔ ' + t.text + dl);
      appendDescription(t);
    });

    download('TickList-' + date + '.md', '\ufeff' + lines.join('\n'), 'text/markdown;charset=utf-8');
  });

  window.TodoLanguage.subscribe(() => {
    if (pendingUndo) undoMessage.textContent = tr(undoCopy, { count: pendingUndo.length });
    updateSaveWarning();
    if (detailId) detailCreated.textContent = formatCreated(todos.find(t => t.id === detailId)?.createdAt || '');
    if (!detailNameError.hidden) detailNameError.textContent = tr('名称需为 1–200 个字符，已保留原名称。');
    // 跨标签页切换可能发生在拖动过程中，延后到落位后的 render 更新列表。
    if (!dragController.active) { dragController.cancelPress(); render(); }
    refreshDetailStatus();
    updateCounter();
  });

  render();
  updateCounter();
})();
