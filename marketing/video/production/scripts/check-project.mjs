import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const visited=new Set();let staticAssets=0;
function visit(name){
 if(visited.has(name))return;visited.add(name);
 const file=path.join(root,name);if(!fs.existsSync(file))throw Error('Missing runtime input: '+name);
 if(!/\.(?:tsx?|css)$/.test(name))return;
 const text=fs.readFileSync(file,'utf8');
 for(const m of text.matchAll(/(?:from\s*|import\s*)["'](\.[^"']+)["']/g)){
  const stem=path.resolve(path.dirname(file),m[1]);const resolved=['','.ts','.tsx','.css','.json'].map(e=>stem+e).find(p=>fs.existsSync(p)&&fs.statSync(p).isFile());
  if(!resolved)throw Error('Missing import: '+m[1]+' in '+name);visit(path.relative(root,resolved));
 }
 for(const m of text.matchAll(/staticFile\(["']([^"']+)["']\)/g)){if(!fs.existsSync(path.join(root,'public',m[1])))throw Error('Missing static file: '+m[1]);staticAssets++;}
}
visit('src/index.ts');
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'))),lock=JSON.parse(fs.readFileSync(path.join(root,'package-lock.json'))).packages[''];
for(const key of ['dependencies','devDependencies'])if(JSON.stringify(pkg[key])!==JSON.stringify(lock[key]))throw Error('Dependency versions differ from original lock');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const embedded=fs.readFileSync(path.join(root,'src/brand-logo-data.ts'),'utf8').match(/brandLogoSourceSha256="([a-f0-9]+)"/)[1];
if(embedded!==sha(path.resolve(root,'../../../assets/brand/logo-light.svg')))throw Error('Formal logo source changed');
console.log(JSON.stringify({runtimeFiles:visited.size,staticAssets,lockedDependenciesMatch:true,formalLogoMatches:true}));
