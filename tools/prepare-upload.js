// Prepare a source-only upload list without staging, committing, or deleting files.
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const base = 'marketing/video/production/';
function gitPaths(...args) {
  return cp.execFileSync('git', ['-c', 'core.quotepath=false', ...args, '-z'], {
    cwd: root, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
  }).split('\0').filter(Boolean);
}
const exists = file => fs.existsSync(path.join(root, file));
function meta(file) {
  const data = fs.readFileSync(path.join(root, file));
  return { path: file, bytes: data.length, sha256: crypto.createHash('sha256').update(data).digest('hex') };
}
function verifiedMeta(file, expected) {
  const item = meta(file);
  if (item.sha256 !== expected.sha256 || (expected.bytes !== undefined && item.bytes !== expected.bytes)) {
    throw Error('Approved input changed: ' + file);
  }
  return item;
}
const tracked = gitPaths('ls-files');
const pending = gitPaths('ls-files', '--others', '--exclude-standard');
const changed = gitPaths('diff', '--name-only', 'HEAD');
const allow = file => [
  /^tools\/prepare-upload\.js$/,
  /^docs\/(?:release\/上传范围说明|maintenance\/视频废案清理报告)\.md$/,
  /^marketing\/video\/(?:README|定版登记|品牌IP与宣传视频策划|原创配乐制作记录-2026-10-18|交互音效优化记录-2026-10-18)\.md$/,
  /^marketing\/video\/production\/(?:src\/|scripts\/)/,
  /^marketing\/video\/production\/public\/brand\//,
  /^marketing\/video\/production\/media\/.*\.(?:json|md|html|png)$/i,
  /^marketing\/video\/production\/evidence\/.*\.(?:json|md|txt|py)$/i,
  /^marketing\/video\/production\/(?:package(?:-lock)?\.json|remotion\.config\.ts|tsconfig\.json|eslint\.config\.mjs|\.gitignore|\.prettierrc|README\.md|requirements\.txt)$/,
  /^marketing\/video\/release\/2026-10-19\/(?:README\.md|SHA256SUMS\.txt|(?:release-manifest|verification|documentation-verification)\.json)$/,
].some(pattern => pattern.test(file));
const additions = pending.filter(allow);
const selected = [...new Set([...changed, ...additions])].sort();
const forbidden = selected.filter(file => /\.(?:wav|mp3|mp4|zip|gguf|npy|safetensors)$/i.test(file)
  || /\/(?:node_modules|__pycache__)\//.test(file) || file.startsWith(base + 'out/'));
if (forbidden.length) throw Error('Excluded files in source list: ' + forbidden.join(','));
const deletedTrackedPaths = selected.filter(file => !exists(file));
const manifest = JSON.parse(fs.readFileSync(path.join(root, base, 'media/asset-manifest.json'), 'utf8'));
const requiredProductionInputs = manifest.assets.filter(item => /\.(wav|mp3)$/i.test(item.path))
  .map(item => verifiedMeta(base + item.path, item));
const separateApprovedMedia = manifest.approvedMedia
  .map(item => verifiedMeta(path.posix.normalize(base + item.path), item));
const tree = new Set([...tracked.filter(exists), ...additions]);
const historicalNames = new Set([
  base + 'evidence/2026-10-19/score/README.md',
  base + 'evidence/2026-10-19/sfx/README.md',
]);
const currentDocuments = [];
const historicalDocuments = [];
const broken = [];
let currentLocalReferences = 0;
for (const file of [...tree].sort()) {
  if (!file.endsWith('.md')) continue;
  const references = [...fs.readFileSync(path.join(root, file), 'utf8')
    .matchAll(/!?\[[^\]]*\]\(([^\s)]+)\)/g)]
    .map(match => match[1]).filter(ref => !/^(?:[a-z]+:|\/\/|#)/i.test(ref));
  // These two original delivery records retain their bytes and historical paths.
  // Their current navigation lives in the evidence index, which is checked normally.
  if (historicalNames.has(file)) {
    historicalDocuments.push({ ...meta(file), historicalLocalReferences: references.length });
    continue;
  }
  currentDocuments.push(file);
  for (const ref of references) {
    currentLocalReferences++;
    const target = path.relative(root, path.resolve(root, path.dirname(file),
      decodeURIComponent(ref.split(/[?#]/)[0]))).split(path.sep).join('/');
    if (!tree.has(target)) broken.push({ document: file, target });
  }
}
const report = {
  schema: 3,
  checkedOn: new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai' }).format(new Date()),
  purpose: 'source-upload-selection-not-deletion-policy',
  validationPassed: broken.length === 0,
  selectedFiles: selected.filter(exists).map(meta),
  deletedTrackedPaths,
  requiredProductionInputs,
  separateApprovedMedia,
  sourceLinkAudit: {
    currentDocuments, currentLocalReferences, historicalDocuments,
    historicalPolicy: 'Original delivery records preserve historical links; use production/evidence/2026-10-19/README.md for current navigation.',
  },
  brokenSourceTreeLinks: broken,
  staged: gitPaths('diff', '--cached', '--name-only'),
};
if (process.argv.includes('--write') && report.validationPassed) {
  fs.writeFileSync(path.join(root, 'docs/release/upload-allowlist.txt'), report.selectedFiles.map(item => item.path).join('\n') + '\n');
  fs.writeFileSync(path.join(root, 'docs/release/upload-scope-audit.json'), JSON.stringify(report, null, 2) + '\n');
}
console.log(JSON.stringify({
  validationPassed: report.validationPassed,
  selectedFiles: report.selectedFiles.length,
  sourceMiB: +(report.selectedFiles.reduce((sum, item) => sum + item.bytes, 0) / 1048576).toFixed(3),
  requiredInputFiles: requiredProductionInputs.length,
  requiredInputMiB: +(requiredProductionInputs.reduce((sum, item) => sum + item.bytes, 0) / 1048576).toFixed(3),
  approvedMedia: separateApprovedMedia.length,
  currentMarkdownDocuments: currentDocuments.length,
  currentLocalReferences,
  historicalMarkdownDocuments: historicalDocuments.length,
  historicalLocalReferences: historicalDocuments.reduce((sum, item) => sum + item.historicalLocalReferences, 0),
  brokenSourceTreeLinks: broken,
  staged: report.staged,
}, null, 2));
if (!report.validationPassed) process.exitCode = 1;
