import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve(process.cwd(), 'public');
const iconsDir = path.join(publicDir, 'icons');
const screenshotsDir = path.join(publicDir, 'screenshots');
const iconSvg = path.join(publicDir, 'icon.svg');
const maskableSvg = path.join(publicDir, 'icon-maskable.svg');

if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

async function generateIcons() {
  console.log('Generating /icons/ icons...');
  await sharp(iconSvg).resize(192, 192).png().toFile(path.join(iconsDir, 'icon-192.png'));
  await sharp(iconSvg).resize(512, 512).png().toFile(path.join(iconsDir, 'icon-512.png'));
  await sharp(maskableSvg).resize(512, 512).png().toFile(path.join(iconsDir, 'icon-maskable-512.png'));
  console.log('Icons generated successfully.');
}

// Generate high quality SVG for Desktop gameplay (1280x720)
const desktopSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </radialGradient>
    <radialGradient id="bubbleCyan" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#67e8f9" stop-opacity="0.85" />
      <stop offset="35%" stop-color="#38bdf8" stop-opacity="0.65" />
      <stop offset="70%" stop-color="#0284c7" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#0369a1" stop-opacity="0.75" />
    </radialGradient>
    <radialGradient id="bubbleEmerald" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#6ee7b7" stop-opacity="0.9" />
      <stop offset="40%" stop-color="#10b981" stop-opacity="0.7" />
      <stop offset="100%" stop-color="#047857" stop-opacity="0.8" />
    </radialGradient>
    <radialGradient id="bubbleIndigo" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#c7d2fe" stop-opacity="0.8" />
      <stop offset="40%" stop-color="#6366f1" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#4338ca" stop-opacity="0.75" />
    </radialGradient>
    <radialGradient id="bubbleAmber" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#fde68a" stop-opacity="0.8" />
      <stop offset="40%" stop-color="#f59e0b" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#b45309" stop-opacity="0.75" />
    </radialGradient>
    <linearGradient id="specular" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#06b6d4" flood-opacity="0.35" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1280" height="720" fill="url(#bgGlow)" />

  <!-- Ambient background glow blobs -->
  <circle cx="200" cy="500" r="180" fill="#0369a1" fill-opacity="0.12" filter="blur(40px)" />
  <circle cx="1000" cy="200" r="220" fill="#4338ca" fill-opacity="0.12" filter="blur(50px)" />

  <!-- Top HUD Header -->
  <rect x="40" y="24" width="1200" height="84" rx="24" fill="#0f172a" fill-opacity="0.8" stroke="#334155" stroke-width="2" />

  <!-- HUD: Target Display -->
  <rect x="64" y="38" width="220" height="56" rx="16" fill="#0284c7" fill-opacity="0.25" stroke="#38bdf8" stroke-width="1.5" />
  <text x="80" y="64" font-family="-apple-system, sans-serif" font-size="13" font-weight="700" fill="#7dd3fc" letter-spacing="1">TARGET NUMBER</text>
  <text x="80" y="86" font-family="-apple-system, sans-serif" font-size="24" font-weight="900" fill="#ffffff">12</text>

  <!-- HUD: Score -->
  <rect x="304" y="38" width="180" height="56" rx="16" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
  <text x="320" y="64" font-family="-apple-system, sans-serif" font-size="13" font-weight="700" fill="#94a3b8" letter-spacing="1">SCORE</text>
  <text x="320" y="86" font-family="-apple-system, sans-serif" font-size="22" font-weight="800" fill="#f8fafc">1,480</text>

  <!-- HUD: Combo -->
  <rect x="504" y="38" width="140" height="56" rx="16" fill="#f59e0b" fill-opacity="0.15" stroke="#fbbf24" stroke-width="1.5" />
  <text x="520" y="64" font-family="-apple-system, sans-serif" font-size="13" font-weight="700" fill="#fcd34d" letter-spacing="1">COMBO</text>
  <text x="520" y="86" font-family="-apple-system, sans-serif" font-size="22" font-weight="900" fill="#fbbf24">x4 🔥</text>

  <!-- HUD: Time Remaining -->
  <rect x="664" y="38" width="160" height="56" rx="16" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
  <text x="680" y="64" font-family="-apple-system, sans-serif" font-size="13" font-weight="700" fill="#94a3b8" letter-spacing="1">TIME LEFT</text>
  <text x="680" y="86" font-family="-apple-system, sans-serif" font-size="22" font-weight="800" fill="#38bdf8">0:42</text>

  <!-- HUD: Lives -->
  <g transform="translate(844, 52)">
    <text x="0" y="24" font-size="26">❤️❤️❤️</text>
  </g>

  <!-- HUD: Mode & Pause Button -->
  <rect x="1100" y="38" width="116" height="56" rx="16" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
  <text x="1136" y="73" font-family="-apple-system, sans-serif" font-size="16" font-weight="800" fill="#94a3b8">PAUSE</text>

  <!-- Floating Bubble 1 (Target Match: 7 + 5 = 12) -->
  <g transform="translate(420, 360)" filter="url(#shadow)">
    <circle cx="0" cy="0" r="76" fill="url(#bubbleEmerald)" stroke="#a7f3d0" stroke-width="3" />
    <ellipse cx="-24" cy="-30" rx="28" ry="14" fill="url(#specular)" transform="rotate(-35 -24 -30)" />
    <text x="0" y="10" font-family="-apple-system, sans-serif" font-size="34" font-weight="900" text-anchor="middle" fill="#ffffff">7 + 5</text>
  </g>

  <!-- Floating Bubble 2 (Target Match: 6 × 2 = 12) -->
  <g transform="translate(820, 280)" filter="url(#shadow)">
    <circle cx="0" cy="0" r="82" fill="url(#bubbleCyan)" stroke="#bae6fd" stroke-width="3.5" />
    <ellipse cx="-26" cy="-32" rx="30" ry="15" fill="url(#specular)" transform="rotate(-35 -26 -32)" />
    <text x="0" y="12" font-family="-apple-system, sans-serif" font-size="36" font-weight="900" text-anchor="middle" fill="#ffffff">6 × 2</text>
  </g>

  <!-- Floating Bubble 3 (Distractor: 9 + 4 = 13) -->
  <g transform="translate(210, 240)">
    <circle cx="0" cy="0" r="68" fill="url(#bubbleIndigo)" stroke="#c7d2fe" stroke-width="2.5" />
    <ellipse cx="-20" cy="-26" rx="24" ry="12" fill="url(#specular)" transform="rotate(-35 -20 -26)" />
    <text x="0" y="9" font-family="-apple-system, sans-serif" font-size="30" font-weight="800" text-anchor="middle" fill="#ffffff">9 + 4</text>
  </g>

  <!-- Floating Bubble 4 (Target Match: 16 - 4 = 12) -->
  <g transform="translate(680, 520)">
    <circle cx="0" cy="0" r="72" fill="url(#bubbleCyan)" stroke="#7dd3fc" stroke-width="2.5" />
    <ellipse cx="-22" cy="-28" rx="26" ry="13" fill="url(#specular)" transform="rotate(-35 -22 -28)" />
    <text x="0" y="10" font-family="-apple-system, sans-serif" font-size="32" font-weight="800" text-anchor="middle" fill="#ffffff">16 - 4</text>
  </g>

  <!-- Floating Bubble 5 (Distractor: 8 + 3 = 11) -->
  <g transform="translate(1040, 460)">
    <circle cx="0" cy="0" r="65" fill="url(#bubbleAmber)" stroke="#fde68a" stroke-width="2.5" />
    <ellipse cx="-18" cy="-24" rx="22" ry="11" fill="url(#specular)" transform="rotate(-35 -18 -24)" />
    <text x="0" y="9" font-family="-apple-system, sans-serif" font-size="28" font-weight="800" text-anchor="middle" fill="#ffffff">8 + 3</text>
  </g>

  <!-- Decorative Sparkles -->
  <circle cx="430" cy="270" r="3" fill="#fef08a" />
  <circle cx="780" cy="400" r="4" fill="#67e8f9" />
</svg>
`;

// Generate high quality SVG for Mobile gameplay (750x1334)
const mobileSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 1334" width="750" height="1334">
  <defs>
    <radialGradient id="mBgGlow" cx="50%" cy="20%" r="80%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </radialGradient>
    <radialGradient id="mBubbleCyan" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#67e8f9" stop-opacity="0.88" />
      <stop offset="40%" stop-color="#0284c7" stop-opacity="0.65" />
      <stop offset="100%" stop-color="#0369a1" stop-opacity="0.8" />
    </radialGradient>
    <radialGradient id="mBubbleEmerald" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#6ee7b7" stop-opacity="0.9" />
      <stop offset="40%" stop-color="#10b981" stop-opacity="0.7" />
      <stop offset="100%" stop-color="#047857" stop-opacity="0.8" />
    </radialGradient>
    <radialGradient id="mBubbleIndigo" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#c7d2fe" stop-opacity="0.85" />
      <stop offset="40%" stop-color="#6366f1" stop-opacity="0.65" />
      <stop offset="100%" stop-color="#4338ca" stop-opacity="0.8" />
    </radialGradient>
    <linearGradient id="mSpecular" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
    </linearGradient>
  </defs>

  <rect width="750" height="1334" fill="url(#mBgGlow)" />

  <!-- Top Header HUD -->
  <rect x="24" y="32" width="702" height="140" rx="28" fill="#0f172a" fill-opacity="0.85" stroke="#334155" stroke-width="2" />

  <!-- Target Banner -->
  <rect x="44" y="48" width="220" height="108" rx="20" fill="#0284c7" fill-opacity="0.25" stroke="#38bdf8" stroke-width="2" />
  <text x="154" y="82" font-family="-apple-system, sans-serif" font-size="14" font-weight="700" fill="#7dd3fc" text-anchor="middle" letter-spacing="1">TARGET</text>
  <text x="154" y="132" font-family="-apple-system, sans-serif" font-size="44" font-weight="900" fill="#ffffff" text-anchor="middle">14</text>

  <!-- Score & Lives & Time -->
  <text x="320" y="80" font-family="-apple-system, sans-serif" font-size="14" font-weight="700" fill="#94a3b8">SCORE</text>
  <text x="320" y="120" font-family="-apple-system, sans-serif" font-size="32" font-weight="900" fill="#ffffff">2,350</text>

  <text x="500" y="80" font-family="-apple-system, sans-serif" font-size="14" font-weight="700" fill="#94a3b8">TIME</text>
  <text x="500" y="120" font-family="-apple-system, sans-serif" font-size="32" font-weight="900" fill="#38bdf8">0:38</text>

  <text x="640" y="80" font-family="-apple-system, sans-serif" font-size="14" font-weight="700" fill="#94a3b8">LIVES</text>
  <text x="640" y="118" font-size="24">❤️❤️❤️</text>

  <!-- Floating Bubbles -->
  <!-- Target Match 9 + 5 = 14 -->
  <g transform="translate(375, 480)">
    <circle cx="0" cy="0" r="105" fill="url(#mBubbleEmerald)" stroke="#a7f3d0" stroke-width="4" />
    <ellipse cx="-32" cy="-40" rx="38" ry="18" fill="url(#mSpecular)" transform="rotate(-35 -32 -40)" />
    <text x="0" y="16" font-family="-apple-system, sans-serif" font-size="48" font-weight="900" text-anchor="middle" fill="#ffffff">9 + 5</text>
  </g>

  <!-- Target Match 7 × 2 = 14 -->
  <g transform="translate(200, 820)">
    <circle cx="0" cy="0" r="95" fill="url(#mBubbleCyan)" stroke="#7dd3fc" stroke-width="3.5" />
    <ellipse cx="-28" cy="-36" rx="34" ry="16" fill="url(#mSpecular)" transform="rotate(-35 -28 -36)" />
    <text x="0" y="14" font-family="-apple-system, sans-serif" font-size="44" font-weight="900" text-anchor="middle" fill="#ffffff">7 × 2</text>
  </g>

  <!-- Distractor 8 + 4 = 12 -->
  <g transform="translate(560, 780)">
    <circle cx="0" cy="0" r="88" fill="url(#mBubbleIndigo)" stroke="#c7d2fe" stroke-width="3" />
    <ellipse cx="-26" cy="-32" rx="30" ry="14" fill="url(#mSpecular)" transform="rotate(-35 -26 -32)" />
    <text x="0" y="13" font-family="-apple-system, sans-serif" font-size="40" font-weight="800" text-anchor="middle" fill="#ffffff">8 + 4</text>
  </g>

  <!-- Distractor 15 - 2 = 13 -->
  <g transform="translate(375, 1100)">
    <circle cx="0" cy="0" r="85" fill="url(#mBubbleCyan)" stroke="#38bdf8" stroke-width="3" />
    <ellipse cx="-25" cy="-30" rx="28" ry="14" fill="url(#mSpecular)" transform="rotate(-35 -25 -30)" />
    <text x="0" y="12" font-family="-apple-system, sans-serif" font-size="38" font-weight="800" text-anchor="middle" fill="#ffffff">15 - 2</text>
  </g>
</svg>
`;

// Generate high quality SVG for Tablet gameplay (1200x800)
const tabletSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <defs>
    <radialGradient id="tBgGlow" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </radialGradient>
    <radialGradient id="tBubbleCyan" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#67e8f9" stop-opacity="0.88" />
      <stop offset="40%" stop-color="#0284c7" stop-opacity="0.65" />
      <stop offset="100%" stop-color="#0369a1" stop-opacity="0.8" />
    </radialGradient>
    <radialGradient id="tBubbleEmerald" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#6ee7b7" stop-opacity="0.9" />
      <stop offset="40%" stop-color="#10b981" stop-opacity="0.7" />
      <stop offset="100%" stop-color="#047857" stop-opacity="0.8" />
    </radialGradient>
    <linearGradient id="tSpecular" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
    </linearGradient>
  </defs>

  <rect width="1200" height="800" fill="url(#tBgGlow)" />

  <!-- Top HUD Header -->
  <rect x="36" y="28" width="1128" height="92" rx="24" fill="#0f172a" fill-opacity="0.8" stroke="#334155" stroke-width="2" />

  <rect x="60" y="44" width="220" height="60" rx="16" fill="#0284c7" fill-opacity="0.25" stroke="#38bdf8" stroke-width="1.5" />
  <text x="80" y="70" font-family="-apple-system, sans-serif" font-size="13" font-weight="700" fill="#7dd3fc" letter-spacing="1">TARGET</text>
  <text x="80" y="94" font-family="-apple-system, sans-serif" font-size="26" font-weight="900" fill="#ffffff">18</text>

  <text x="320" y="70" font-family="-apple-system, sans-serif" font-size="13" font-weight="700" fill="#94a3b8">SCORE</text>
  <text x="320" y="94" font-family="-apple-system, sans-serif" font-size="24" font-weight="800" fill="#f8fafc">3,120</text>

  <text x="500" y="70" font-family="-apple-system, sans-serif" font-size="13" font-weight="700" fill="#fcd34d">COMBO</text>
  <text x="500" y="94" font-family="-apple-system, sans-serif" font-size="24" font-weight="900" fill="#fbbf24">x5 🔥</text>

  <text x="680" y="70" font-family="-apple-system, sans-serif" font-size="13" font-weight="700" fill="#94a3b8">TIME</text>
  <text x="680" y="94" font-family="-apple-system, sans-serif" font-size="24" font-weight="800" fill="#38bdf8">0:29</text>

  <text x="860" y="86" font-size="26">❤️❤️❤️</text>

  <!-- Floating Bubbles -->
  <!-- Target 18: 9 × 2 -->
  <g transform="translate(380, 420)">
    <circle cx="0" cy="0" r="88" fill="url(#tBubbleEmerald)" stroke="#a7f3d0" stroke-width="3.5" />
    <ellipse cx="-28" cy="-34" rx="32" ry="16" fill="url(#tSpecular)" transform="rotate(-35 -28 -34)" />
    <text x="0" y="13" font-family="-apple-system, sans-serif" font-size="40" font-weight="900" text-anchor="middle" fill="#ffffff">9 × 2</text>
  </g>

  <!-- Target 18: 10 + 8 -->
  <g transform="translate(800, 320)">
    <circle cx="0" cy="0" r="92" fill="url(#tBubbleCyan)" stroke="#7dd3fc" stroke-width="3.5" />
    <ellipse cx="-30" cy="-36" rx="34" ry="17" fill="url(#tSpecular)" transform="rotate(-35 -30 -36)" />
    <text x="0" y="14" font-family="-apple-system, sans-serif" font-size="40" font-weight="900" text-anchor="middle" fill="#ffffff">10 + 8</text>
  </g>

  <!-- Distractor 20 - 4 = 16 -->
  <g transform="translate(200, 260)">
    <circle cx="0" cy="0" r="74" fill="url(#tBubbleCyan)" stroke="#38bdf8" stroke-width="2.5" />
    <ellipse cx="-24" cy="-28" rx="26" ry="13" fill="url(#tSpecular)" transform="rotate(-35 -24 -28)" />
    <text x="0" y="11" font-family="-apple-system, sans-serif" font-size="32" font-weight="800" text-anchor="middle" fill="#ffffff">20 - 4</text>
  </g>

  <!-- Distractor 12 + 5 = 17 -->
  <g transform="translate(980, 560)">
    <circle cx="0" cy="0" r="76" fill="url(#tBubbleCyan)" stroke="#38bdf8" stroke-width="2.5" />
    <ellipse cx="-24" cy="-28" rx="26" ry="13" fill="url(#tSpecular)" transform="rotate(-35 -24 -28)" />
    <text x="0" y="11" font-family="-apple-system, sans-serif" font-size="32" font-weight="800" text-anchor="middle" fill="#ffffff">12 + 5</text>
  </g>
</svg>
`;

async function generateScreenshots() {
  console.log('Generating /screenshots/ images...');
  await sharp(Buffer.from(desktopSvg)).png().toFile(path.join(screenshotsDir, 'bubble-math-desktop.png'));
  await sharp(Buffer.from(mobileSvg)).png().toFile(path.join(screenshotsDir, 'bubble-math-mobile.png'));
  await sharp(Buffer.from(tabletSvg)).png().toFile(path.join(screenshotsDir, 'bubble-math-tablet.png'));
  console.log('Screenshots generated successfully.');
}

async function run() {
  await generateIcons();
  await generateScreenshots();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
