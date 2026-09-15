import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const source = "C:/Users/T-800/.codex/generated_images/01a07b30-8ec1-7070-8923-8c5300d3535e/exec-dc150e97-338b-40e3-8e48-719abf8f82bc.png";
const logoSource = path.join(root, "public/images/logo-cero-clima-oficial.png");
const outputDir = path.join(root, "entregables/redes-sociales");
const qrSource = path.join(outputDir, "qr-ceroclima-web.png");
const outputPng = path.join(outputDir, "publicidad-cero-clima-facebook-instagram-con-qr-1080x1350.png");
const outputJpg = path.join(outputDir, "publicidad-cero-clima-facebook-instagram-con-qr-1080x1350.jpg");
const backgroundCopy = path.join(outputDir, "fondo-publicidad-cero-clima-sin-texto.png");

await fs.mkdir(outputDir, { recursive: true });
await fs.copyFile(source, backgroundCopy);

const { data: logoPixels, info: logoInfo } = await sharp(logoSource)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

for (let index = 0; index < logoPixels.length; index += 4) {
  const brightness = Math.max(logoPixels[index], logoPixels[index + 1], logoPixels[index + 2]);
  if (brightness <= 12) {
    logoPixels[index + 3] = 0;
  } else if (brightness < 42) {
    logoPixels[index + 3] = Math.round(((brightness - 12) / 30) * 255);
  }
}

const logo = await sharp(logoPixels, {
  raw: { width: logoInfo.width, height: logoInfo.height, channels: 4 },
})
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 8 })
  .resize({ width: 420 })
  .png()
  .toBuffer();

const qr = await sharp(qrSource)
  .resize(226, 226, { kernel: "nearest" })
  .png()
  .toBuffer();

const overlay = Buffer.from(`
<svg width="1080" height="1350" viewBox="0 0 1080 1350" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="leftShade" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#06101d" stop-opacity="0.98"/>
      <stop offset="0.55" stop-color="#06101d" stop-opacity="0.80"/>
      <stop offset="0.82" stop-color="#06101d" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#06101d" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="bottomShade" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0.57" stop-color="#06101d" stop-opacity="0"/>
      <stop offset="1" stop-color="#06101d" stop-opacity="0.9"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" x2="1">
      <stop offset="0" stop-color="#0eb9ef"/>
      <stop offset="1" stop-color="#ff6716"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="#000" flood-opacity="0.28"/>
    </filter>
  </defs>

  <rect width="1080" height="1350" fill="url(#leftShade)"/>
  <rect width="1080" height="1350" fill="url(#bottomShade)"/>
  <rect x="65" y="250" width="335" height="48" rx="24" fill="#0eb9ef" fill-opacity="0.14" stroke="#25c9f6" stroke-width="2"/>
  <circle cx="91" cy="274" r="8" fill="#ff6716"/>
  <text x="112" y="282" fill="#ffffff" font-family="Arial, sans-serif" font-size="22" font-weight="700" letter-spacing="1.5">21 AÑOS DE EXPERIENCIA</text>

  <text x="65" y="396" fill="#ffffff" font-family="Arial, sans-serif" font-size="76" font-weight="800" letter-spacing="-2">CLIMA PERFECTO</text>
  <text x="65" y="477" fill="#ffffff" font-family="Arial, sans-serif" font-size="76" font-weight="800" letter-spacing="-2">TODO EL AÑO</text>
  <rect x="66" y="508" width="175" height="7" rx="3.5" fill="url(#accent)"/>

  <text x="65" y="578" fill="#e9f5fb" font-family="Arial, sans-serif" font-size="31" font-weight="400">Aire acondicionado para tu hogar</text>
  <text x="65" y="618" fill="#e9f5fb" font-family="Arial, sans-serif" font-size="31" font-weight="400">o negocio.</text>

  <circle cx="83" cy="690" r="17" fill="#0eb9ef"/>
  <path d="M75 690l6 6 11-14" fill="none" stroke="#06101d" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="115" y="700" fill="#ffffff" font-family="Arial, sans-serif" font-size="28" font-weight="700">Evaluación técnica</text>

  <circle cx="83" cy="752" r="17" fill="#ff6716"/>
  <path d="M75 752l6 6 11-14" fill="none" stroke="#06101d" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="115" y="762" fill="#ffffff" font-family="Arial, sans-serif" font-size="28" font-weight="700">Instalación profesional</text>

  <text x="65" y="842" fill="#9edff3" font-family="Arial, sans-serif" font-size="24" font-weight="700" letter-spacing="1">PRESENCIA TÉCNICA</text>
  <text x="65" y="883" fill="#ffffff" font-family="Arial, sans-serif" font-size="34" font-weight="700">Desde Arica hasta Los Lagos</text>

  <g filter="url(#shadow)">
    <rect x="65" y="1015" width="505" height="92" rx="46" fill="#ff6716"/>
    <circle cx="117" cy="1061" r="24" fill="#ffffff" fill-opacity="0.18"/>
    <path d="M107 1049c13-11 31 1 25 16-5 14-21 18-34 12l5-10c-5-7-3-13 4-18z" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="158" y="1072" fill="#ffffff" font-family="Arial, sans-serif" font-size="29" font-weight="800" letter-spacing="0.5">COTIZA POR WHATSAPP</text>
  </g>

  <text x="65" y="1188" fill="#ffffff" font-family="Arial, sans-serif" font-size="43" font-weight="800">+56 9 9680 9677</text>
  <text x="65" y="1240" fill="#bed0dc" font-family="Arial, sans-serif" font-size="21" font-weight="400">Tecnología Inverter y Wi-Fi en modelos compatibles</text>
  <text x="65" y="1290" fill="#ffffff" fill-opacity="0.72" font-family="Arial, sans-serif" font-size="20" font-weight="700" letter-spacing="2">CEROCLIMA · CLIMATIZACIÓN SUSTENTABLE</text>

  <g filter="url(#shadow)">
    <rect x="744" y="964" width="276" height="326" rx="28" fill="#ffffff"/>
    <rect x="744" y="964" width="276" height="12" rx="6" fill="url(#accent)"/>
    <text x="882" y="1011" text-anchor="middle" fill="#07111e" font-family="Arial, sans-serif" font-size="20" font-weight="800" letter-spacing="1">ESCANEA Y CONÓCENOS</text>
    <text x="882" y="1271" text-anchor="middle" fill="#0a5f91" font-family="Arial, sans-serif" font-size="18" font-weight="700">ceroclima.com</text>
  </g>
</svg>`);

const base = sharp(source)
  .resize(1080, 1350, { fit: "cover", position: "centre" })
  .composite([
    { input: overlay, left: 0, top: 0 },
    { input: logo, left: 65, top: 66 },
    { input: qr, left: 769, top: 1025 },
  ]);

await base.clone().png({ compressionLevel: 9 }).toFile(outputPng);
await base.clone().jpeg({ quality: 92, chromaSubsampling: "4:4:4" }).toFile(outputJpg);

console.log(JSON.stringify({ outputPng, outputJpg, backgroundCopy }, null, 2));
