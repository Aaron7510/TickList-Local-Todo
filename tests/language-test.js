// Run with: node tests/language-test.js. Uses isolated storage; never touches real tasks.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('assets/language.js', 'utf8');
const key = 'ticklist.landing.language.v1';
function page(storage, href = 'http://localhost/landing.html', blocked = false) {
  const events = {};
  const root = {};
  const link = {
    href: 'index.html',
    getAttribute() { return this.href; },
    setAttribute(name, value) { this[name] = value; }
  };
  const location = new URL(href);
  let cleaned;
  const context = vm.createContext({ URL,
    window: { location, history: { replaceState(_state, _title, value) { cleaned = value; } },
      addEventListener(name, handler) { events[name] = handler; } },
    document: { documentElement: { setAttribute(name, value) { root[name] = value; } },
      getElementById() { return null; }, querySelectorAll(selector) { return selector === '[data-language-link]' ? [link] : []; } },
    localStorage: { getItem(k) { if (blocked) throw Error('blocked'); return storage.get(k) ?? null; },
      setItem(k, value) { if (blocked) throw Error('blocked'); storage.set(k, value); } }
  });
  vm.runInContext(source, context);
  return { api: context.window.TodoLanguage, events, root, link, context, cleaned: () => cleaned };
}
const storage = new Map([['todo.list.v3', 'unchanged']]);
const landing = page(storage);
assert.equal(landing.api.get(), 'zh');
landing.api.set('en');
const product = page(storage, 'http://localhost/index.html');
assert.equal(product.api.get(), 'en');
assert.equal(product.root.lang, 'en');
product.api.set('zh');
landing.events.pageshow(); // Back/forward cache must pick up the latest selection.
assert.equal(landing.api.get(), 'zh');
product.api.set('en');
landing.events.storage({ key });
assert.equal(landing.api.get(), 'en');
assert.equal(page(storage).api.get(), 'en'); // A new visit keeps the last selection.
assert.equal(storage.get('todo.list.v3'), 'unchanged');
storage.set(key, 'invalid');
assert.equal(page(storage).api.get(), 'zh');
const unavailable = page(new Map(), undefined, true);
unavailable.api.set('en');
assert.equal(unavailable.api.get(), 'en');
unavailable.events.pageshow();
assert.equal(unavailable.api.get(), 'en');
const fileStorage = new Map([[key, 'zh']]);
const filePage = page(fileStorage, 'file:///D:/TickList/index.html?lang=en');
assert.equal(filePage.api.get(), 'en');
assert.equal(fileStorage.get(key), 'en');
assert.equal(filePage.cleaned(), 'file:///D:/TickList/index.html');
filePage.api.set('zh');
assert.equal(new URL(filePage.link.href).searchParams.get('lang'), 'zh');
assert.equal(page(fileStorage, 'file:///D:/TickList/index.html').api.get(), 'zh');
for (const path of ['index.html', 'landing.html']) {
  const html = fs.readFileSync(path, 'utf8');
  assert.match(html, /src="assets\/language.js"/);
  assert.match(html, /href="assets\/language.css"/);
  assert.match(html, /data-language-link/);
}
const translatedPage = page(new Map());
const translationSource = fs.readFileSync('assets/app-i18n.js', 'utf8');
vm.runInContext(translationSource, translatedPage.context);
translatedPage.api.set('en');
const translate = translatedPage.context.window.AppI18n.t;
const dynamicKeys = [...fs.readFileSync('assets/app.js', 'utf8').matchAll(/tr\('([^']+)'/g)].map(match => match[1]);
const staticValues = [...translationSource.slice(translationSource.indexOf('  const texts')).matchAll(/'([^']*[\p{Script=Han}][^']*)'/gu)].map(match => match[1]);
for (const key of new Set([...dynamicKeys, ...staticValues])) {
  assert.notEqual(translate(key), key, 'Missing English translation: ' + key);
}
assert.equal(translate('共 {total} 项，已完成 {done} 项', { total: 1, done: 0 }), '1 task, 0 completed');
assert.equal(translate('已删除 {count} 项待办', { count: 2 }), 'Deleted 2 tasks');
translatedPage.api.set('zh');
assert.equal(translate('共 {total} 项，已完成 {done} 项', { total: 1, done: 0 }), '共 1 项，已完成 0 项');
console.log('Language checks passed: shared preference, reload, pageshow, storage events, invalid values, blocked storage, file navigation and translation coverage.');
