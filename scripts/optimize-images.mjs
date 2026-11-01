/**
 * Bildoptimierung für die OSOBAU-Website
 * ------------------------------------------------------------
 * Liest Originalbilder aus `assets-src/` und erzeugt:
 *   - public/images/<name>-<breite>.avif / .webp (responsive Varianten)
 *   - public/images/<name>-<breite>.jpg (Fallback + Open-Graph)
 *   - public/brand/  Logo (transparent, dunkel + hell), Favicons
 *   - src/data/images.generated.json (Maße + verfügbare Breiten → kein Layout-Shift)
 *
 * Neue Projektbilder: Datei nach `assets-src/projekte/` legen
 * (sprechender Dateiname, z. B. "projektname-01.jpg") und `npm run images` ausführen.
 */
import sharp from 'sharp';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(root, 'assets-src');
const OUT_IMG = path.join(root, 'public/images');
const OUT_BRAND = path.join(root, 'public/brand');
const MANIFEST = path.join(root, 'src/data/images.generated.json');

const WIDTHS = [480, 800, 1200, 1600, 2048];

await mkdir(OUT_IMG, { recursive: true });
await mkdir(OUT_BRAND, { recursive: true });

const manifest = {};
const files = (await readdir(path.join(SRC, 'projekte'))).filter((f) => /\.(png|jpe?g|webp|tiff?)$/i.test(f)).sort();

for (const file of files) {
  const name = file.replace(/\.[^.]+$/, '');
  const input = sharp(path.join(SRC, 'projekte', file)).rotate();
  const { width, height } = await input.metadata();
  const widths = WIDTHS.filter((w) => w < width);
  widths.push(Math.min(width, 2048));
  const unique = [...new Set(widths)].sort((a, b) => a - b);

  for (const w of unique) {
    const base = input.clone().resize({ width: w, withoutEnlargement: true });
    await base.clone().avif({ quality: 52, effort: 4 }).toFile(path.join(OUT_IMG, `${name}-${w}.avif`));
    await base.clone().webp({ quality: 74 }).toFile(path.join(OUT_IMG, `${name}-${w}.webp`));
    await base.clone().jpeg({ quality: 78, mozjpeg: true }).toFile(path.join(OUT_IMG, `${name}-${w}.jpg`));
  }
  // kleiner, unscharfer Platzhalter (LQIP) als Data-URI
  const lqip = await input.clone().resize(24).blur(1.2).webp({ quality: 40 }).toBuffer();
  manifest[name] = {
    width,
    height,
    widths: unique,
    placeholder: `data:image/webp;base64,${lqip.toString('base64')}`,
  };
  console.log(`✓ ${name} (${width}×${height}) → ${unique.join(', ')}`);
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');

/* ---------- Logo: Weiß → transparent, dunkle + helle Variante ---------- */
const logoSrc = path.join(SRC, 'brand/osobau-logo-original.png');
const trimmed = await sharp(logoSrc).flatten({ background: '#ffffff' }).trim({ threshold: 30 }).toBuffer();
const { data, info } = await sharp(trimmed).greyscale().raw().toBuffer({ resolveWithObject: true });

async function makeLogo(rgb, file) {
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i++) {
    const alpha = 255 - data[i]; // dunkles Pixel = deckend
    out[i * 4] = rgb[0];
    out[i * 4 + 1] = rgb[1];
    out[i * 4 + 2] = rgb[2];
    out[i * 4 + 3] = alpha < 12 ? 0 : Math.min(255, Math.round(alpha * 1.08));
  }
  const img = sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } });
  await img.clone().png({ compressionLevel: 9 }).toFile(path.join(OUT_BRAND, `${file}.png`));
  await img.clone().webp({ quality: 90, alphaQuality: 100 }).toFile(path.join(OUT_BRAND, `${file}.webp`));
}
await makeLogo([23, 25, 27], 'osobau-logo-dunkel');
await makeLogo([255, 255, 255], 'osobau-logo-hell');
console.log(`✓ Logo ${info.width}×${info.height}`);

/* ---------- Favicon: Dach-Signet aus dem Logo ---------- */
// Oberer Logobereich (Dach + Fenster), auf dunklem Grund
const roofHeight = Math.round(info.height * 0.405);
const roofLeft = Math.round(info.width * 0.36);
const roofWidth = Math.round(info.width * 0.28);
const roof = await sharp(path.join(OUT_BRAND, 'osobau-logo-hell.png'))
  .extract({ left: roofLeft, top: 0, width: roofWidth, height: roofHeight })
  .trim({ threshold: 1 })
  .toBuffer();

for (const size of [32, 180, 512]) {
  const inner = Math.round(size * 0.72);
  const mark = await sharp(roof).resize({ width: inner, height: inner, fit: 'inside' }).toBuffer();
  const meta = await sharp(mark).metadata();
  await sharp({ create: { width: size, height: size, channels: 4, background: '#171C20' } })
    .composite([{ input: mark, left: Math.round((size - meta.width) / 2), top: Math.round((size - meta.height) / 2) }])
    .png()
    .toFile(path.join(root, 'public', size === 180 ? 'apple-touch-icon.png' : `favicon-${size}.png`));
}

/* ---------- Open-Graph-Bild 1200×630 ---------- */
await sharp(path.join(SRC, 'projekte/saarterrassen-plaza-nord-03.png'))
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .composite([
    { input: Buffer.from('<svg width="1200" height="630"><rect width="1200" height="630" fill="#171C20" fill-opacity="0.55"/></svg>') },
    { input: await sharp(path.join(OUT_BRAND, 'osobau-logo-hell.png')).resize({ width: 520 }).toBuffer(), gravity: 'centre' },
  ])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(path.join(root, 'public/og-image.jpg'));

console.log('✓ Favicons + OG-Bild erstellt');
