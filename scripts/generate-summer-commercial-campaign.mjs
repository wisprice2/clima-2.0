import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const outputDir = path.join(root, "entregables/redes-sociales/campana-verano-con-qr");
const backgroundDir = path.join(outputDir, "fondos");
const logoSource = path.join(root, "public/images/logo-cero-clima-oficial.png");
const qrSource = path.join(root, "entregables/redes-sociales/qr-ceroclima-web.png");

await fs.mkdir(backgroundDir, { recursive: true });

const ads = [
  {
    id: "01-adelantate-al-verano",
    source: "C:/Users/T-800/.codex/generated_images/01a07b30-8ec1-7070-8923-8c5300d3535e/exec-dc150e97-338b-40e3-8e48-719abf8f82bc.png",
    badge: "PREPÁRATE CON ANTICIPACIÓN",
    headline: ["ADELÁNTATE", "AL VERANO"],
    body: ["Instala tu aire acondicionado", "antes de que llegue el calor."],
    bullets: ["Evaluación técnica", "Instalación profesional"],
    cta: "COTIZA HOY",
    qrTitle: "ESCANEA Y COTIZA",
  },
  {
    id: "02-que-el-calor-no-te-sorprenda",
    source: "C:/Users/T-800/.codex/generated_images/01a07b30-8ec1-7070-8923-8c5300d3535e/exec-3ae9960b-fd0c-4e2f-9a48-e15216b46ded.png",
    badge: "CONFORT RESIDENCIAL",
    headline: ["QUE EL CALOR", "NO TE SORPRENDA"],
    body: ["Prepara ahora el confort", "de tu hogar."],
    bullets: ["Capacidad calculada", "Tecnología Inverter"],
    cta: "COTIZA CON ANTICIPACIÓN",
    qrTitle: "ESCANEA Y COTIZA",
    headlineSize: 61,
  },
  {
    id: "03-mas-confort-para-tu-negocio",
    source: "C:/Users/T-800/.codex/generated_images/01a07b30-8ec1-7070-8923-8c5300d3535e/exec-9892eac3-f52d-4f96-ba79-fb854b77f575.png",
    badge: "SOLUCIONES COMERCIALES",
    headline: ["MÁS CONFORT", "PARA TU NEGOCIO"],
    body: ["Climatización para oficinas,", "locales comerciales y empresas."],
    bullets: ["Cassette, ductos y piso cielo", "Evaluación técnica"],
    cta: "COTIZA TU PROYECTO",
    qrTitle: "ESCANEA Y CONÓCENOS",
    headlineSize: 58,
  },
  {
    id: "04-cuantos-btu-necesitas",
    source: "C:/Users/T-800/.codex/generated_images/01a07b30-8ec1-7070-8923-8c5300d3535e/exec-a87fe7b8-62e5-4aa6-af28-9771d7bb04e4.png",
    badge: "SELECCIONADOR EN LA WEB",
    headline: ["¿CUÁNTOS BTU", "NECESITAS?"],
    body: ["Calcula una recomendación inicial", "según los m² de tu espacio."],
    bullets: ["Resultado inmediato", "Confirmación técnica"],
    cta: "CALCULA EN NUESTRA WEB",
    qrTitle: "ESCANEA Y CALCULA",
  },
  {
    id: "05-prepara-tu-equipo-para-el-verano",
    source: "C:/Users/T-800/.codex/generated_images/01a07b30-8ec1-7070-8923-8c5300d3535e/exec-a29d2570-a6cb-4675-a3b5-dec1b9adcc07.png",
    badge: "MANTENCIÓN PREVENTIVA",
    headline: ["PREPARA TU EQUIPO", "PARA EL VERANO"],
    body: ["Mantención, limpieza", "y sanitización profesional."],
    bullets: ["Revisión preventiva", "Atención técnica directa"],
    cta: "AGENDA TU MANTENCIÓN",
    qrTitle: "ESCANEA Y CONTÁCTANOS",
    headlineSize: 53,
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
  .resize({ width: 385 })
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

for (const ad of ads) {
  const headlineSize = ad.headlineSize ?? 68;
  await fs.copyFile(ad.source, path.join(backgroundDir, `${ad.id}-sin-texto.png`));

  const overlay = Buffer.from(`
  <svg width="1080" height="1350" viewBox="0 0 1080 1350" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="leftShade" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stop-color="#050e19" stop-opacity="0.99"/>
        <stop offset="0.52" stop-color="#071525" stop-opacity="0.91"/>
        <stop offset="0.76" stop-color="#071525" stop-opacity="0.18"/>
        <stop offset="1" stop-color="#071525" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="bottomShade" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0.50" stop-color="#050e19" stop-opacity="0"/>
        <stop offset="1" stop-color="#050e19" stop-opacity="0.98"/>
      </linearGradient>
      <linearGradient id="accent" x1="0" x2="1">
        <stop offset="0" stop-color="#12bff0"/>
        <stop offset="1" stop-color="#ff6817"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="#000" flood-opacity="0.32"/>
      </filter>
    </defs>

    <rect width="1080" height="1350" fill="url(#leftShade)"/>
    <rect width="1080" height="1350" fill="url(#bottomShade)"/>

    <g>
      <rect x="58" y="205" width="375" height="46" rx="23" fill="#ff6817"/>
      <circle cx="88" cy="228" r="13" fill="#ffffff" fill-opacity="0.22"/>
      <g stroke="#ffffff" stroke-width="2.5" stroke-linecap="round">
        <circle cx="88" cy="228" r="6" fill="none"/>
        <path d="M88 216v-4M88 244v-4M76 228h-4M104 228h-4M79.5 219.5l-3-3M99.5 239.5l-3-3M96.5 219.5l3-3M76.5 239.5l3-3"/>
      </g>
      <text x="115" y="236" fill="#ffffff" font-family="Arial, sans-serif" font-size="20" font-weight="800" letter-spacing="1">${escapeXml(ad.badge)}</text>
    </g>

    <g>
      <rect x="58" y="274" width="264" height="43" rx="21.5" fill="#0a2134" fill-opacity="0.84" stroke="#12bff0" stroke-width="2"/>
      <text x="190" y="302" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="19" font-weight="800" letter-spacing="1">21 AÑOS DE EXPERIENCIA</text>
    </g>

    <text x="58" y="417" fill="#ffffff" font-family="Arial, sans-serif" font-size="${headlineSize}" font-weight="800" letter-spacing="-1.5">${escapeXml(ad.headline[0])}</text>
    <text x="58" y="493" fill="#ffffff" font-family="Arial, sans-serif" font-size="${headlineSize}" font-weight="800" letter-spacing="-1.5">${escapeXml(ad.headline[1])}</text>
    <rect x="59" y="520" width="190" height="8" rx="4" fill="url(#accent)"/>

    <text x="58" y="590" fill="#f2f8fb" font-family="Arial, sans-serif" font-size="29" font-weight="400">${escapeXml(ad.body[0])}</text>
    <text x="58" y="630" fill="#f2f8fb" font-family="Arial, sans-serif" font-size="29" font-weight="400">${escapeXml(ad.body[1])}</text>

    <circle cx="76" cy="704" r="17" fill="#12bff0"/>
    <path d="M68 704l6 6 11-14" fill="none" stroke="#06101d" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="108" y="714" fill="#ffffff" font-family="Arial, sans-serif" font-size="27" font-weight="700">${escapeXml(ad.bullets[0])}</text>

    <circle cx="76" cy="766" r="17" fill="#ff6817"/>
    <path d="M68 766l6 6 11-14" fill="none" stroke="#06101d" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="108" y="776" fill="#ffffff" font-family="Arial, sans-serif" font-size="27" font-weight="700">${escapeXml(ad.bullets[1])}</text>

    <text x="58" y="865" fill="#9ee5f7" font-family="Arial, sans-serif" font-size="22" font-weight="800" letter-spacing="1.4">COBERTURA TÉCNICA</text>
    <text x="58" y="906" fill="#ffffff" font-family="Arial, sans-serif" font-size="32" font-weight="700">Desde Arica hasta Los Lagos</text>

    <g filter="url(#shadow)">
      <rect x="58" y="981" width="604" height="92" rx="46" fill="#ff6817"/>
      <circle cx="111" cy="1027" r="24" fill="#ffffff" fill-opacity="0.19"/>
      <path d="M101 1015c13-11 31 1 25 16-5 14-21 18-34 12l5-10c-5-7-3-13 4-18z" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="151" y="1037" fill="#ffffff" font-family="Arial, sans-serif" font-size="28" font-weight="800">${escapeXml(ad.cta)}</text>
    </g>

    <text x="58" y="1160" fill="#ffffff" font-family="Arial, sans-serif" font-size="42" font-weight="800">+56 9 9680 9677</text>
    <text x="58" y="1217" fill="#bed0dc" font-family="Arial, sans-serif" font-size="21">Evaluación e instalación profesional</text>
    <text x="58" y="1283" fill="#ffffff" fill-opacity="0.76" font-family="Arial, sans-serif" font-size="20" font-weight="700" letter-spacing="2">CEROCLIMA · CLIMATIZACIÓN SUSTENTABLE</text>

    <g filter="url(#shadow)">
      <rect x="758" y="954" width="278" height="338" rx="28" fill="#ffffff"/>
      <rect x="758" y="954" width="278" height="13" rx="6.5" fill="url(#accent)"/>
      <text x="897" y="1005" text-anchor="middle" fill="#07111e" font-family="Arial, sans-serif" font-size="18" font-weight="800" letter-spacing="0.5">${escapeXml(ad.qrTitle)}</text>
      <text x="897" y="1274" text-anchor="middle" fill="#0a6597" font-family="Arial, sans-serif" font-size="18" font-weight="700">ceroclima.com</text>
    </g>
  </svg>`);

  const outputPng = path.join(outputDir, `${ad.id}-con-qr-1080x1350.png`);
  const outputJpg = path.join(outputDir, `${ad.id}-con-qr-1080x1350.jpg`);
  const composed = sharp(ad.source)
    .resize(1080, 1350, { fit: "cover", position: "centre" })
    .composite([
      { input: overlay, left: 0, top: 0 },
      { input: logo, left: 58, top: 48 },
      { input: qr, left: 789, top: 1022 },
    ]);

  await composed.clone().png({ compressionLevel: 9 }).toFile(outputPng);
  await composed.clone().jpeg({ quality: 92, chromaSubsampling: "4:4:4" }).toFile(outputJpg);
  outputs.push({ ...ad, outputPng, outputJpg });
}

const thumbWidth = 330;
const thumbHeight = 413;
const gap = 24;
const sheetWidth = gap * 4 + thumbWidth * 3;
const sheetHeight = 82 + gap * 3 + thumbHeight * 2;
const composites = [];

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
  composites.push({ input: thumb, left, top });
}

const header = Buffer.from(`
<svg width="${sheetWidth}" height="${sheetHeight}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#07111e"/>
  <text x="${sheetWidth / 2}" y="45" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="27" font-weight="800" letter-spacing="1.3">CAMPAÑA COMERCIAL CEROCLIMA · VERANO CON QR</text>
</svg>`);

const contactSheet = path.join(outputDir, "vista-previa-campana-comercial-verano-con-qr.png");
await sharp({ create: { width: sheetWidth, height: sheetHeight, channels: 4, background: "#07111e" } })
  .composite([{ input: header, left: 0, top: 0 }, ...composites])
  .png({ compressionLevel: 9 })
  .toFile(contactSheet);

console.log(JSON.stringify({ contactSheet, outputs }, null, 2));
