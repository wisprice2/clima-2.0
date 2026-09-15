import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const outputDir = path.join(root, "entregables/redes-sociales/variantes-con-qr");
const backgroundDir = path.join(outputDir, "fondos");
const logoSource = path.join(root, "public/images/logo-cero-clima-oficial.png");
const qrSource = path.join(root, "entregables/redes-sociales/qr-ceroclima-web.png");

await fs.mkdir(backgroundDir, { recursive: true });

const variants = [
  {
    id: "01-clima-perfecto",
    source: "C:/Users/T-800/.codex/generated_images/01a07b30-8ec1-7070-8923-8c5300d3535e/exec-dc150e97-338b-40e3-8e48-719abf8f82bc.png",
    badge: "21 AÑOS DE EXPERIENCIA",
    headline: ["CLIMA PERFECTO", "TODO EL AÑO"],
    body: ["Aire acondicionado para tu hogar", "o negocio."],
    bullets: ["Evaluación técnica", "Instalación profesional"],
    cta: "COTIZA POR WHATSAPP",
    qrTitle: "ESCANEA Y CONÓCENOS",
  },
  {
    id: "02-confort-residencial",
    source: "C:/Users/T-800/.codex/generated_images/01a07b30-8ec1-7070-8923-8c5300d3535e/exec-3ae9960b-fd0c-4e2f-9a48-e15216b46ded.png",
    badge: "CLIMATIZACIÓN RESIDENCIAL",
    headline: ["CONFORT EN CASA", "TODO EL AÑO"],
    body: ["Frío y calor dimensionado", "para cada ambiente."],
    bullets: ["Capacidad calculada", "Tecnología Inverter"],
    cta: "COTIZA TU PROYECTO",
    qrTitle: "ESCANEA Y COTIZA",
  },
  {
    id: "03-soluciones-comerciales",
    source: "C:/Users/T-800/.codex/generated_images/01a07b30-8ec1-7070-8923-8c5300d3535e/exec-9892eac3-f52d-4f96-ba79-fb854b77f575.png",
    badge: "SOLUCIONES COMERCIALES",
    headline: ["TU NEGOCIO", "SIEMPRE CONFORTABLE"],
    body: ["Climatización profesional", "para espacios de mayor exigencia."],
    bullets: ["Cassette, ductos y piso cielo", "Evaluación técnica"],
    cta: "HABLEMOS DE TU PROYECTO",
    qrTitle: "ESCANEA Y CONÓCENOS",
    headlineSize: 57,
  },
  {
    id: "04-mantencion-sanitizacion",
    source: "C:/Users/T-800/.codex/generated_images/01a07b30-8ec1-7070-8923-8c5300d3535e/exec-a29d2570-a6cb-4675-a3b5-dec1b9adcc07.png",
    badge: "MANTENCIÓN Y SANITIZACIÓN",
    headline: ["CUIDA TU EQUIPO", "Y SU RENDIMIENTO"],
    body: ["Limpieza, revisión preventiva", "y atención técnica directa."],
    bullets: ["Trabajo profesional", "Hogar y empresa"],
    cta: "AGENDA UNA REVISIÓN",
    qrTitle: "ESCANEA Y CONTÁCTANOS",
    headlineSize: 58,
  },
  {
    id: "05-selector-btu",
    source: "C:/Users/T-800/.codex/generated_images/01a07b30-8ec1-7070-8923-8c5300d3535e/exec-a87fe7b8-62e5-4aa6-af28-9771d7bb04e4.png",
    badge: "CALCULADORA EN LA WEB",
    headline: ["ELIGE LOS BTU", "CORRECTOS"],
    body: ["Estima la capacidad según los m²", "de tu espacio."],
    bullets: ["Resultado inmediato", "Confirmación técnica"],
    cta: "CALCULA EN NUESTRA WEB",
    qrTitle: "ESCANEA Y CALCULA",
  },
];

const { data: logoPixels, info: logoInfo } = await sharp(logoSource)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

for (let index = 0; index < logoPixels.length; index += 4) {
  const brightness = Math.max(logoPixels[index], logoPixels[index + 1], logoPixels[index + 2]);
  if (brightness <= 12) logoPixels[index + 3] = 0;
  else if (brightness < 42) logoPixels[index + 3] = Math.round(((brightness - 12) / 30) * 255);
}

const logo = await sharp(logoPixels, {
  raw: { width: logoInfo.width, height: logoInfo.height, channels: 4 },
})
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 8 })
  .resize({ width: 395 })
  .png()
  .toBuffer();

const qr = await sharp(qrSource)
  .resize(216, 216, { kernel: "nearest" })
  .png()
  .toBuffer();

const escapeXml = (value) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

const outputs = [];

for (const variant of variants) {
  const headlineSize = variant.headlineSize ?? 66;
  const backgroundCopy = path.join(backgroundDir, `${variant.id}-sin-texto.png`);
  await fs.copyFile(variant.source, backgroundCopy);

  const overlay = Buffer.from(`
  <svg width="1080" height="1350" viewBox="0 0 1080 1350" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="leftShade" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stop-color="#06101d" stop-opacity="0.99"/>
        <stop offset="0.53" stop-color="#06101d" stop-opacity="0.86"/>
        <stop offset="0.78" stop-color="#06101d" stop-opacity="0.18"/>
        <stop offset="1" stop-color="#06101d" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="bottomShade" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0.54" stop-color="#06101d" stop-opacity="0"/>
        <stop offset="1" stop-color="#06101d" stop-opacity="0.96"/>
      </linearGradient>
      <linearGradient id="accent" x1="0" x2="1">
        <stop offset="0" stop-color="#10bceb"/>
        <stop offset="1" stop-color="#ff6716"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="#000" flood-opacity="0.3"/>
      </filter>
    </defs>

    <rect width="1080" height="1350" fill="url(#leftShade)"/>
    <rect width="1080" height="1350" fill="url(#bottomShade)"/>

    <rect x="64" y="230" width="410" height="48" rx="24" fill="#07111e" fill-opacity="0.55" stroke="#14c2ef" stroke-width="2"/>
    <circle cx="90" cy="254" r="8" fill="#ff6716"/>
    <text x="111" y="262" fill="#ffffff" font-family="Arial, sans-serif" font-size="21" font-weight="700" letter-spacing="1.2">${escapeXml(variant.badge)}</text>

    <text x="64" y="378" fill="#ffffff" font-family="Arial, sans-serif" font-size="${headlineSize}" font-weight="800" letter-spacing="-1.5">${escapeXml(variant.headline[0])}</text>
    <text x="64" y="455" fill="#ffffff" font-family="Arial, sans-serif" font-size="${headlineSize}" font-weight="800" letter-spacing="-1.5">${escapeXml(variant.headline[1])}</text>
    <rect x="65" y="488" width="176" height="7" rx="3.5" fill="url(#accent)"/>

    <text x="64" y="558" fill="#eef8fc" font-family="Arial, sans-serif" font-size="29" font-weight="400">${escapeXml(variant.body[0])}</text>
    <text x="64" y="597" fill="#eef8fc" font-family="Arial, sans-serif" font-size="29" font-weight="400">${escapeXml(variant.body[1])}</text>

    <circle cx="82" cy="671" r="17" fill="#10bceb"/>
    <path d="M74 671l6 6 11-14" fill="none" stroke="#06101d" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="114" y="681" fill="#ffffff" font-family="Arial, sans-serif" font-size="27" font-weight="700">${escapeXml(variant.bullets[0])}</text>

    <circle cx="82" cy="733" r="17" fill="#ff6716"/>
    <path d="M74 733l6 6 11-14" fill="none" stroke="#06101d" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="114" y="743" fill="#ffffff" font-family="Arial, sans-serif" font-size="27" font-weight="700">${escapeXml(variant.bullets[1])}</text>

    <text x="64" y="833" fill="#9edff3" font-family="Arial, sans-serif" font-size="22" font-weight="700" letter-spacing="1.4">PRESENCIA TÉCNICA</text>
    <text x="64" y="874" fill="#ffffff" font-family="Arial, sans-serif" font-size="32" font-weight="700">Desde Arica hasta Los Lagos</text>

    <g filter="url(#shadow)">
      <rect x="64" y="987" width="590" height="88" rx="44" fill="#ff6716"/>
      <circle cx="116" cy="1031" r="23" fill="#ffffff" fill-opacity="0.18"/>
      <path d="M106 1019c13-11 31 1 25 16-5 14-21 18-34 12l5-10c-5-7-3-13 4-18z" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="156" y="1041" fill="#ffffff" font-family="Arial, sans-serif" font-size="27" font-weight="800">${escapeXml(variant.cta)}</text>
    </g>

    <text x="64" y="1159" fill="#ffffff" font-family="Arial, sans-serif" font-size="41" font-weight="800">+56 9 9680 9677</text>
    <text x="64" y="1214" fill="#bed0dc" font-family="Arial, sans-serif" font-size="21">21 años de experiencia en climatización</text>
    <text x="64" y="1278" fill="#ffffff" fill-opacity="0.76" font-family="Arial, sans-serif" font-size="20" font-weight="700" letter-spacing="2">CEROCLIMA · CLIMATIZACIÓN SUSTENTABLE</text>

    <g filter="url(#shadow)">
      <rect x="760" y="960" width="276" height="330" rx="28" fill="#ffffff"/>
      <rect x="760" y="960" width="276" height="12" rx="6" fill="url(#accent)"/>
      <text x="898" y="1008" text-anchor="middle" fill="#07111e" font-family="Arial, sans-serif" font-size="18" font-weight="800" letter-spacing="0.6">${escapeXml(variant.qrTitle)}</text>
      <text x="898" y="1272" text-anchor="middle" fill="#0a5f91" font-family="Arial, sans-serif" font-size="18" font-weight="700">ceroclima.com</text>
    </g>
  </svg>`);

  const outputPng = path.join(outputDir, `${variant.id}-con-qr-1080x1350.png`);
  const outputJpg = path.join(outputDir, `${variant.id}-con-qr-1080x1350.jpg`);
  const composed = sharp(variant.source)
    .resize(1080, 1350, { fit: "cover", position: "centre" })
    .composite([
      { input: overlay, left: 0, top: 0 },
      { input: logo, left: 64, top: 58 },
      { input: qr, left: 790, top: 1025 },
    ]);

  await composed.clone().png({ compressionLevel: 9 }).toFile(outputPng);
  await composed.clone().jpeg({ quality: 92, chromaSubsampling: "4:4:4" }).toFile(outputJpg);
  outputs.push({ ...variant, outputPng, outputJpg });
}

const thumbWidth = 330;
const thumbHeight = 413;
const gap = 24;
const sheetWidth = gap * 4 + thumbWidth * 3;
const sheetHeight = 82 + gap * 3 + thumbHeight * 2;
const contactComposites = [];

for (let index = 0; index < outputs.length; index += 1) {
  const column = index < 3 ? index : index - 3;
  const row = index < 3 ? 0 : 1;
  const xOffset = row === 1 ? Math.round((sheetWidth - (thumbWidth * 2 + gap)) / 2) : gap;
  const left = xOffset + column * (thumbWidth + gap);
  const top = 58 + gap + row * (thumbHeight + gap);
  const thumb = await sharp(outputs[index].outputPng)
    .resize(thumbWidth, thumbHeight, { fit: "cover" })
    .png()
    .toBuffer();
  contactComposites.push({ input: thumb, left, top });
}

const sheetHeader = Buffer.from(`
<svg width="${sheetWidth}" height="${sheetHeight}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#07111e"/>
  <text x="${sheetWidth / 2}" y="45" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="27" font-weight="800" letter-spacing="1.5">5 VARIANTES CEROCLIMA · PUBLICIDAD CON QR</text>
</svg>`);

const contactSheet = path.join(outputDir, "vista-previa-5-variantes-cero-clima-con-qr.png");
await sharp({ create: { width: sheetWidth, height: sheetHeight, channels: 4, background: "#07111e" } })
  .composite([{ input: sheetHeader, left: 0, top: 0 }, ...contactComposites])
  .png({ compressionLevel: 9 })
  .toFile(contactSheet);

console.log(JSON.stringify({ contactSheet, outputs }, null, 2));
