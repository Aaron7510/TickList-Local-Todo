(function () {
'use strict';

  // 首帧绘制前就应用颜色模式，避免闪烁；仅“用户明确选择”时存值，否则跟随系统
  var themeKey = 'todo.theme.v2';
  try {
    var saved = localStorage.getItem(themeKey);
    if (saved === 'light' || saved === 'dark') {
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      document.documentElement.setAttribute('data-theme',
        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light');
    }
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }

window.TodoTheme = { init(themeBtn) {
  /* 颜色模式：默认跟随系统，用户点击后记忆选择 */

  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const themeKey = 'todo.theme.v2';
  let theme = null; // 'light' | 'dark' | null(跟随系统)
  try { const saved = localStorage.getItem(themeKey); theme = ['light', 'dark'].includes(saved) ? saved : null; } catch (e) { /* 主题仍可在当前页面使用 */ }

  function effectiveTheme() { return theme || (mq.matches ? 'dark' : 'light'); }
  function applyTheme() {
    const t = effectiveTheme();
    document.documentElement.setAttribute('data-theme', t);
    const label = t === 'dark' ? '切换为日间模式' : '切换为夜间模式';
    themeBtn.title = window.AppI18n ? window.AppI18n.t(label) : label;
    themeBtn.setAttribute('aria-label', themeBtn.title);
  }
  themeBtn.addEventListener('click', () => {
    theme = effectiveTheme() === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(themeKey, theme); } catch (e) { /* 当前页面仍可切换 */ }
    applyTheme();
  });
  mq.addEventListener('change', () => { if (!theme) applyTheme(); });
  window.TodoLanguage?.subscribe(applyTheme);
  applyTheme();


} };
})();
