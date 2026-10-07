// Scroll progress is deterministic; browser screenshots separately verify presentation.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const events = {}, values = {};
let top = 900;
const media = { matches: false, addEventListener(_name, callback) { this.change = callback; } };
const context = vm.createContext({ window: { innerHeight: 900, matchMedia: () => media,
  addEventListener(name, callback) { events[name] = callback; },
  requestAnimationFrame(callback) { queue.push(callback); return queue.length; } },
  document: { getElementById(id) { return id === 'proof' ? { getBoundingClientRect: () => ({ top }) } : {
    style: { setProperty(name, value) { values[name] = value; }, removeProperty(name) { delete values[name]; } }
  }; } } });
const queue = [];
vm.runInContext(fs.readFileSync('assets/landing.js', 'utf8'), context);
function scroll(position, event = 'scroll') { top = position; events[event](); while (queue.length) queue.shift()(); }
assert.equal(values['--product-opacity'], '0');
scroll(585); assert.equal(values['--product-opacity'], '0.5'); assert.equal(values['--product-offset'], '10px');
scroll(405); assert.equal(values['--product-opacity'], '1'); assert.equal(values['--product-offset'], '0px');
scroll(765); assert.equal(values['--product-opacity'], '0');
context.window.innerHeight = 720;
scroll(324, 'resize'); assert.equal(values['--product-opacity'], '1');
media.matches = true; media.change(); while (queue.length) queue.shift()();
assert.deepEqual(values, {});
media.matches = false; media.change(); while (queue.length) queue.shift()();
assert.equal(values['--product-opacity'], '1');
console.log('Landing tests passed: forward/reverse scroll, resize and reduced-motion changes.');
