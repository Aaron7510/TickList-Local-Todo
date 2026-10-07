// node brand/render-assets.js <path-to-sharp-package>
const fs = require('node:fs');
const path = require('node:path');
const sharp = require(process.argv[2] || 'sharp');
const out = path.join(__dirname, '..', 'assets', 'brand');
async function png(svg, file, width, height) {
  const source = path.join(out, svg);
  const svgWidth = Number(fs.readFileSync(source, 'utf8').match(/width="(\d+)"/)[1]);
  const density = Math.max(72, Math.ceil(width / svgWidth * 72));
  await sharp(source, { density }).resize(width, height).png().toFile(path.join(out, file));
}
async function main() {
  await png('icon.svg', 'icon-512.png', 512, 512);
  await png('icon.svg', 'icon-1024.png', 1024, 1024);
  await png('icon.svg', 'apple-touch-icon.png', 180, 180);
  const logoWidth = Number(fs.readFileSync(path.join(out, 'logo-light.svg'), 'utf8').match(/width="(\d+)"/)[1]);
  await png('logo-light.svg', 'logo-light.png', logoWidth * 4, 256);
  await png('logo-dark.svg', 'logo-dark.png', logoWidth * 4, 256);
  await png('favicon.svg', 'favicon-16.png', 16, 16);
  await png('favicon.svg', 'favicon-32.png', 32, 32);
  const images = [16, 32].map(size => ({size, data:fs.readFileSync(path.join(out, 'favicon-' + size + '.png'))}));
  const header = Buffer.alloc(6 + images.length * 16);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach((entry, i) => {
    const start = 6 + i * 16;
    header[start] = entry.size;
    header[start + 1] = entry.size;
    header.writeUInt16LE(1, start + 4);
    header.writeUInt16LE(32, start + 6);
    header.writeUInt32LE(entry.data.length, start + 8);
    header.writeUInt32LE(offset, start + 12);
    offset += entry.data.length;
  });
  fs.writeFileSync(path.join(out, 'favicon.ico'), Buffer.concat([header, ...images.map(x => x.data)]));
  console.log('Generated 7 PNG assets and a 16/32px ICO.');
}
main().catch(error => {console.error(error); process.exitCode = 1;});
