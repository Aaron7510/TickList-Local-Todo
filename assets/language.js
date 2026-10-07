// 两个页面共用语言偏好和图标选择器；不访问清单数据。
(function () {
  'use strict';
  const key = 'ticklist.landing.language.v1'; // 沿用已有偏好，兼容此前的选择。
  const listeners = new Set();
  const normalize = value => value === 'en' ? 'en' : 'zh';
  let language = 'zh';
  try { language = normalize(localStorage.getItem(key)); } catch (_) {}
  // 本地文件的存储隔离由浏览器决定，通过站内链接携带选择保证两页一致。
  if (window.location?.protocol === 'file:') {
    const url = new URL(window.location.href);
    const linked = url.searchParams.get('lang');
    if (linked === 'zh' || linked === 'en') {
      language = linked;
      try { localStorage.setItem(key, language); } catch (_) {}
      url.searchParams.delete('lang');
      try { window.history.replaceState(null, '', url.href); } catch (_) {}
    }
  }
  function apply() {
    document.documentElement.setAttribute('lang', language === 'en' ? 'en' : 'zh-CN');
    if (window.location?.protocol === 'file:') {
      document.querySelectorAll('[data-language-link]').forEach(link => {
        const url = new URL(link.getAttribute('href'), window.location.href);
        url.searchParams.set('lang', language);
        link.setAttribute('href', url.href);
      });
    }
    listeners.forEach(listener => listener(language));
  }
  function set(value) {
    language = normalize(value);
    try { localStorage.setItem(key, language); } catch (_) {}
    apply();
  }
  function refresh() {
    try {
      const saved = normalize(localStorage.getItem(key));
      if (saved !== language) { language = saved; apply(); }
    } catch (_) {}
  }
  function initPicker() {
    const trigger = document.getElementById('languageBtn');
    const options = document.getElementById('languageOptions');
    if (!trigger || !options) return;
    const picker = trigger.closest('.language-picker');
    const buttons = options.querySelectorAll('[data-language]');
    function update() {
      const label = language === 'en' ? 'Choose language' : '选择语言';
      trigger.title = label;
      trigger.setAttribute('aria-label', label);
      options.setAttribute('aria-label', label);
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
    }
    function close(restoreFocus) {
      options.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      if (restoreFocus) trigger.focus();
    }
    trigger.addEventListener('click', () => {
      if (!options.hidden) { close(false); return; }
      options.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      options.querySelector('[aria-pressed="true"]').focus();
    });
    buttons.forEach(button => button.addEventListener('click', () => { set(button.dataset.language); close(true); }));
    picker.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !options.hidden) { event.preventDefault(); close(true); }
    });
    picker.addEventListener('focusout', event => { if (!picker.contains(event.relatedTarget)) close(false); });
    document.addEventListener('click', event => { if (!picker.contains(event.target)) close(false); });
    listeners.add(update);
    update();
    trigger.disabled = false;
    apply();
  }
  window.TodoLanguage = { get: () => language, set, subscribe: listener => listeners.add(listener), initPicker };
  document.documentElement.setAttribute('lang', language === 'en' ? 'en' : 'zh-CN');
  window.addEventListener('storage', event => { if (event.key === key || event.key === null) refresh(); });
  window.addEventListener('pageshow', refresh);
})();
