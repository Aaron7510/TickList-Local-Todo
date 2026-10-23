const fs = require("node:fs");
const path = require("node:path");
const sharp = require(process.env.SHARP_PATH || "sharp");
(async () => {
  const root = process.argv[2];
  for (const name of fs.readdirSync(path.join(root, "source")).filter(n => n.endsWith(".svg"))) {
    const source = path.join(root,"source",name);
    const stem = name.slice(0,-4);
    const png = path.join(root,"public",stem+".png");
    const jpg = path.join(root,"public",stem+".jpg");
    if (fs.existsSync(png) || fs.existsSync(jpg)) throw new Error("Output exists: "+stem);
    const rendered = await sharp(source).flatten({background:"#ffffff"}).toColorspace("srgb").png().toBuffer();
    await sharp(rendered).png().toFile(png);
    await sharp(rendered).jpeg({quality:95,chromaSubsampling:"4:4:4"}).toFile(jpg);
  }
})().catch(error => { console.error(error); process.exit(1); });
