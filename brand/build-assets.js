// Generate the vector identity without external packages: node brand/build-assets.js
const fs = require('node:fs');
const path = require('node:path');
const out = path.join(__dirname, '..', 'assets', 'brand');
fs.mkdirSync(out, { recursive: true });

const tick = '<path d="m18 33 10 10 19-21" fill="none" stroke="WHITE" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>';
const gradient = '<defs><linearGradient id="ticklist-gradient" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#4f6ef7"/><stop offset="1" stop-color="#8473f5"/></linearGradient></defs>';
// Committed Segoe UI Bold outlines: regeneration does not need the font installed.
const wordmarkSource = fs.readFileSync(path.join(__dirname, 'wordmark-segoe-ui.svg'), 'utf8');
const logoWidth = Number(wordmarkSource.match(/width="(\d+)"/)[1]);
const wordmarkPath = wordmarkSource.match(/<path d="([^"]+)"/)[1];
function icon(fill, useGradient = false) {
  return (useGradient ? gradient : '') + '<rect width="64" height="64" rx="18" fill="' + fill + '"/>' + tick.replace('WHITE', '#fff');
}
function wordmark(color) {
  return '<path d="' + wordmarkPath + '" fill="' + color + '" fill-rule="nonzero"/>';
}
function svg(file, width, height, content, label) {
  fs.writeFileSync(path.join(out, file), '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-labelledby="title"><title id="title">' + label + '</title>' + content + '</svg>\n');
}
svg('icon.svg', 64, 64, icon('url(#ticklist-gradient)', true), 'TickList');
svg('icon-solid.svg', 64, 64, icon('#4f6ef7'), 'TickList — solid blue');
svg('icon-mono-dark.svg', 64, 64, icon('#1a1d26'), 'TickList — monochrome dark');
svg('icon-mono-light.svg', 64, 64, '<rect width="64" height="64" rx="18" fill="#fff"/>' + tick.replace('WHITE', '#1a1d26'), 'TickList — monochrome light');
svg('tick-blue.svg', 64, 64, tick.replace('WHITE', '#4f6ef7'), 'TickList — standalone tick');
svg('tick-white.svg', 64, 64, tick.replace('WHITE', '#fff'), 'TickList — standalone white tick');
svg('logo-light.svg', logoWidth, 64, icon('url(#ticklist-gradient)', true) + wordmark('#1a1d26'), 'TickList — Segoe UI Bold');
svg('logo-dark.svg', logoWidth, 64, icon('url(#ticklist-gradient)', true) + wordmark('#f2f4ff'), 'TickList — Segoe UI Bold');
svg('logo-mono-dark.svg', logoWidth, 64, icon('#1a1d26') + wordmark('#1a1d26'), 'TickList — Segoe UI Bold monochrome');
svg('logo-mono-light.svg', logoWidth, 64, '<rect width="64" height="64" rx="18" fill="#fff"/>' + tick.replace('WHITE', '#1a1d26') + wordmark('#fff'), 'TickList — Segoe UI Bold monochrome reverse');
// Pixel-aligned variant: simple solid tile and a two-pixel tick at 16px.
svg('favicon.svg', 16, 16, '<rect width="16" height="16" rx="4" fill="#4f6ef7"/><path d="m4.5 8.5 2.5 2.5 4.5-5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>', 'TickList');
console.log('Generated 11 TickList SVG assets.');
