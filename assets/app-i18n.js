// 产品界面翻译集中维护，用户填写的任务名称和说明不参与翻译。
(function () {
  'use strict';
  const en = {
    'TickList — 待办清单': 'TickList — To-do list',
    'TickList，打开即用的本地待办清单。把今天，一件件做好。由 Soren 开发。': 'TickList, your local to-do list. Make today count, one task at a time. Developed by Soren.',
    'TickList，返回首页': 'TickList, back to home', '返回首页': 'Back to home',
    '切换为日间模式': 'Switch to light mode', '切换为夜间模式': 'Switch to dark mode',
    '待办清单': 'To-do list', '把今天，一件件做好。': 'Make today count, one task at a time.',
    '添加新的待办事项…': 'Add a new task…', '添加': 'Add', '全部': 'All', '未完成': 'Pending', '已完成': 'Completed',
    '清除已完成': 'Clear completed', '撤销': 'Undo', '设置': 'Settings', '关闭设置': 'Close settings',
    '数据保存在当前浏览器，建议定期备份。': 'Saved in this browser. Back up regularly.',
    '数据': 'Data', '导出': 'Export', '备份数据': 'Back up data', '恢复数据': 'Restore data', '导出 Markdown': 'Export Markdown',
    '保存完整清单，方便日后恢复': 'Save your complete list for later recovery',
    '从备份文件恢复清单': 'Restore your list from a backup file',
    '将清单保存为可阅读的文档': 'Save your list as a readable document',
    '任务详情': 'Task details', '关闭任务详情': 'Close task details', '任务名称': 'Task name', '详细说明': 'Description',
    '填写任务的具体内容、步骤或补充说明（选填）': 'Add details, steps, or notes (optional)',
    '创建时间': 'Created', '截止时间': 'Deadline', '清除': 'Clear', '设置截止时间': 'Set deadline', '关闭截止时间设置': 'Close deadline settings',
    '名称与说明离开输入框后自动保存，截止时间更改后自动保存。': 'Name and notes save when you leave the field. Deadline changes save automatically.',
    '更改后自动保存。': 'Changes save automatically.',
    '浏览器无法保存数据。当前修改只在本页暂存，关闭或刷新后可能丢失。请打开右上角“设置”，点击“备份数据”保存副本。': 'Your browser cannot save data. Changes are kept only on this page and may be lost on refresh or close. Open Settings and choose Back up data to save a copy.',
    '浏览器无法保存数据，当前修改只在本页暂存。请关闭详情后，在“设置”中备份数据。': 'Your browser cannot save data. Changes are kept only on this page. Close details and back up your data in Settings.',
    '浏览器无法保存数据，当前修改只在本页暂存。请在“设置”中备份数据。': 'Your browser cannot save data. Changes are kept only on this page. Back up your data in Settings.',
    '检测到异常的本地数据，原始内容已保留；为避免页面出错，暂时显示空清单。请优先使用已有备份恢复。若浏览器仍无法保存，请先备份本页的新任务。': 'Invalid local data was found and preserved. An empty list is shown to keep the page working. Restore an existing backup first. If saving still fails, back up any new tasks on this page.',
    '未完成 · 已逾期': 'Pending · Overdue', '未知（旧版本数据）': 'Unknown (older data)',
    '另一个页面已修改清单。当前页的修改尚未保存，请先备份当前页，再刷新查看最新清单。': 'Another page changed your list. Changes on this page have not been saved. Back up this page, then refresh to view the latest list.',
    '恢复失败：另一个页面已修改清单，请备份当前页后刷新再恢复。': 'Restore failed: another page changed the list. Back up this page, then refresh before restoring.',
    '名称需为 1–200 个字符，已保留原名称。': 'Use 1–200 characters. The original name has been kept.',
    '已删除 {count} 项待办': ({ count }) => 'Deleted ' + count + (count === 1 ? ' task' : ' tasks'),
    '已清除 {count} 项已完成待办': ({ count }) => 'Cleared ' + count + (count === 1 ? ' completed task' : ' completed tasks'),
    '共 {total} 项，已完成 {done} 项': ({ total, done }) => total + (total === 1 ? ' task, ' : ' tasks, ') + done + ' completed',
    '还没有已完成的事项': 'No completed tasks yet', '没有未完成的事项': 'No pending tasks', '暂无待办事项，添加一个吧': 'No tasks yet. Add one to get started.',
    '标记为未完成': 'Mark as pending', '标记为完成': 'Mark as completed', '查看任务详情': 'View task details',
    '修改截止时间': 'Edit deadline', '删除': 'Delete', '按住手柄拖动排序': 'Hold the handle to reorder', '拖动排序': 'Reorder task',
    '备份文件超过 5 MiB，读取和恢复可能耗时。是否继续？': 'This backup is larger than 5 MiB. Reading and restoring it may take some time. Continue?',
    '无法读取备份文件，文件格式或事项内容不正确。': 'Cannot read the backup. The file format or task data is invalid.',
    '恢复备份会替换当前全部待办事项。建议先备份当前数据，确定继续吗？': 'Restoring this backup will replace all current tasks. Back up your current data first. Continue?',
    '恢复失败：浏览器无法保存数据，当前待办事项未被替换。': 'Restore failed: your browser cannot save data. Your current tasks have not been replaced.',
    'TickList-备份-': 'TickList-backup-', '# TickList 待办清单': '# TickList To-do list',
    '> 把今天，一件件做好。': '> Make today count, one task at a time.', '导出时间：': 'Exported: ',
    '## 进行中': '## Pending', '## 已完成': '## Completed', '_暂无未完成事项_': '_No pending tasks_', '_暂无已完成事项_': '_No completed tasks_',
    '（截止 {date}）': ' (due {date})'
  };
  function t(source, values = {}) {
    const translated = window.TodoLanguage.get() === 'en' ? (en[source] || source) : source;
    const message = typeof translated === 'function' ? translated(values) : translated;
    return message.replace(/\{(\w+)\}/g, (match, name) => values[name] ?? match);
  }
  const texts = {
    '.app h1': '待办清单', '.subtitle': '把今天，一件件做好。', '#addBtn': '添加',
    '.filter[data-filter="all"]': '全部', '.filter[data-filter="pending"]': '未完成', '.filter[data-filter="done"]': '已完成',
    '#clearDone': '清除已完成', '#undoBtn': '撤销', '#settingsTitle': '设置',
    '#settingsDescription': '数据保存在当前浏览器，建议定期备份。', '#settingsDataTitle': '数据', '#settingsExportTitle': '导出',
    '#backupBtn strong': '备份数据', '#backupBtn small': '保存完整清单，方便日后恢复',
    '#restoreBtn strong': '恢复数据', '#restoreBtn small': '从备份文件恢复清单',
    '#exportBtn strong': '导出 Markdown', '#exportBtn small': '将清单保存为可阅读的文档',
    '#detailsTitle': '任务详情', 'label[for="detailText"]': '任务名称', 'label[for="detailDescription"]': '详细说明',
    '.detail-fields dt:first-child': '创建时间', 'label[for="detailDeadline"]': '截止时间', '#detailClear': '清除',
    '#detailsDialog > .settings-description': '名称与说明离开输入框后自动保存，截止时间更改后自动保存。',
    '#detailSaveWarning': '浏览器无法保存数据，当前修改只在本页暂存。请关闭详情后，在“设置”中备份数据。',
    '#deadlineTitle': '设置截止时间', 'label[for="deadlineInput"]': '截止时间', '#deadlineClear': '清除',
    '.deadline-hint': '更改后自动保存。', '#deadlineSaveWarning': '浏览器无法保存数据，当前修改只在本页暂存。请在“设置”中备份数据。'
  };
  const attributes = [
    ['.logo', 'aria-label', 'TickList，返回首页'], ['.logo', 'title', '返回首页'],
    ['#settingsBtn', 'aria-label', '设置'], ['#settingsBtn', 'title', '设置'],
    ['#settingsClose', 'aria-label', '关闭设置'], ['#detailsClose', 'aria-label', '关闭任务详情'],
    ['#deadlineClose', 'aria-label', '关闭截止时间设置'], ['#input', 'placeholder', '添加新的待办事项…'],
    ['#detailDescription', 'placeholder', '填写任务的具体内容、步骤或补充说明（选填）'],
    ['meta[name="description"]', 'content', 'TickList，打开即用的本地待办清单。把今天，一件件做好。由 Soren 开发。']
  ];
  function apply() {
    document.title = t('TickList — 待办清单');
    Object.entries(texts).forEach(([selector, source]) => {
      document.querySelectorAll(selector).forEach(element => { element.textContent = t(source); });
    });
    attributes.forEach(([selector, attribute, source]) => {
      document.querySelectorAll(selector).forEach(element => element.setAttribute(attribute, t(source)));
    });
  }
  window.AppI18n = { t };
  window.TodoLanguage.subscribe(apply);
  apply();
  window.TodoLanguage.initPicker();
})();
