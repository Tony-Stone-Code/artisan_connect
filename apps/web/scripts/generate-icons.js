const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// SVG definition for standard icon (with rounded squircle & amber badge)
function getStandardSvg(size) {
  return `
<svg width="${size}" height="${size}" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#02365B" />
      <stop offset="60%" stop-color="#002B49" />
      <stop offset="100%" stop-color="#011B2E" />
    </linearGradient>

    <!-- Amber Gold Gradient -->
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCD34D" />
      <stop offset="45%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>

    <!-- Inner Shield Gradient -->
    <linearGradient id="shieldBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#00243E" />
      <stop offset="100%" stop-color="#001626" />
    </linearGradient>

    <!-- Soft Glow -->
    <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#F59E0B" flood-opacity="0.35" />
    </filter>

    <filter id="subtleDrop" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000000" flood-opacity="0.4" />
    </filter>
  </defs>

  <!-- Squircle Base (22% radius = 112px on 512) -->
  <rect x="16" y="16" width="480" height="480" rx="110" fill="url(#bgGrad)" stroke="rgba(245, 158, 11, 0.4)" stroke-width="4" filter="url(#subtleDrop)" />

  <!-- Subtle Radial Sheen -->
  <circle cx="256" cy="180" r="220" fill="#0284C7" opacity="0.12" />

  <!-- Shield Outer Frame (Amber Gold) -->
  <g filter="url(#goldGlow)">
    <path d="M 256 90 L 380 148 V 262 C 380 345 328 412 256 432 C 184 412 132 345 132 262 V 148 Z" 
          fill="url(#goldGrad)" />
  </g>

  <!-- Shield Inner Layer (Deep Cobalt) -->
  <path d="M 256 108 L 362 158 V 258 C 362 331 316 391 256 409 C 196 391 150 331 150 258 V 158 Z" 
        fill="url(#shieldBg)" stroke="rgba(255, 255, 255, 0.15)" stroke-width="2" />

  <!-- Geometric Artisan Emblem 'A' + Roof Chevron -->
  <!-- Top Chevron/Peak -->
  <path d="M 256 160 L 322 216 L 302 232 L 256 194 L 210 232 L 190 216 Z" fill="url(#goldGrad)" />

  <!-- Main 'A' Letterform -->
  <path d="M 256 195 L 324 340 H 284 L 268 304 H 244 L 228 340 H 188 Z M 256 250 L 249 276 H 263 Z" 
        fill="#FFFFFF" />

  <!-- Gold Crossbar Highlight -->
  <rect x="238" y="294" width="36" height="8" rx="4" fill="url(#goldGrad)" />

  <!-- Small Verification Star at Shield Base -->
  <polygon points="256,368 261,380 274,380 263,388 267,400 256,392 245,400 249,388 238,380 251,380" fill="url(#goldGrad)" />
</svg>
`;
}

// Maskable icon (safe area 80% circle, edge-to-edge background)
function getMaskableSvg() {
  return `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="mBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#02365B" />
      <stop offset="60%" stop-color="#002B49" />
      <stop offset="100%" stop-color="#011B2E" />
    </linearGradient>

    <linearGradient id="mGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCD34D" />
      <stop offset="45%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>

    <linearGradient id="mShieldBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#00243E" />
      <stop offset="100%" stop-color="#001626" />
    </linearGradient>
  </defs>

  <!-- Full-bleed background for maskable circle/squircle clipping -->
  <rect width="512" height="512" fill="url(#mBgGrad)" />

  <!-- Scaled content centered within 70% safe zone (circle of radius 180 at 256,256) -->
  <g transform="translate(256, 256) scale(0.72) translate(-256, -256)">
    <!-- Shield Outer Frame -->
    <path d="M 256 80 L 390 142 V 268 C 390 358 334 430 256 452 C 178 430 122 358 122 268 V 142 Z" 
          fill="url(#mGoldGrad)" />

    <!-- Shield Inner -->
    <path d="M 256 100 L 370 154 V 264 C 370 342 321 407 256 427 C 191 407 142 342 142 264 V 154 Z" 
          fill="url(#mShieldBg)" stroke="rgba(255, 255, 255, 0.15)" stroke-width="2" />

    <!-- Top Chevron/Peak -->
    <path d="M 256 150 L 328 212 L 306 230 L 256 188 L 206 230 L 184 212 Z" fill="url(#mGoldGrad)" />

    <!-- Main 'A' -->
    <path d="M 256 190 L 330 350 H 286 L 268 310 H 244 L 226 350 H 182 Z M 256 248 L 248 278 H 264 Z" 
          fill="#FFFFFF" />

    <!-- Gold Crossbar Highlight -->
    <rect x="238" y="300" width="36" height="9" rx="4" fill="url(#mGoldGrad)" />

    <!-- Small Star at Base -->
    <polygon points="256,380 262,393 276,393 265,402 269,415 256,406 243,415 247,402 236,393 250,393" fill="url(#mGoldGrad)" />
  </g>
</svg>
`;
}

async function run() {
  const publicDir = path.join(__dirname, '../public');
  const iconsDir = path.join(publicDir, 'icons');

  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  const standardSvg = getStandardSvg(512);
  const standardBuffer = Buffer.from(standardSvg);

  const maskableSvg = getMaskableSvg();
  const maskableBuffer = Buffer.from(maskableSvg);

  // 1. icon-512.png (512x512)
  await sharp(standardBuffer)
    .resize(512, 512)
    .png({ quality: 95 })
    .toFile(path.join(iconsDir, 'icon-512.png'));
  console.log('Generated public/icons/icon-512.png');

  // 2. icon-192.png (192x192)
  await sharp(standardBuffer)
    .resize(192, 192)
    .png({ quality: 95 })
    .toFile(path.join(iconsDir, 'icon-192.png'));
  console.log('Generated public/icons/icon-192.png');

  // 3. icon-maskable.png (512x512)
  await sharp(maskableBuffer)
    .resize(512, 512)
    .png({ quality: 95 })
    .toFile(path.join(iconsDir, 'icon-maskable.png'));
  console.log('Generated public/icons/icon-maskable.png');

  // 4. apple-touch-icon.png (180x180) - uses maskable background so iOS adds smooth squircle
  await sharp(maskableBuffer)
    .resize(180, 180)
    .png({ quality: 95 })
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Generated public/apple-touch-icon.png');

  // 5. Root public/icon.png (512x512 replacement for legacy icon.png)
  await sharp(standardBuffer)
    .resize(512, 512)
    .png({ quality: 95 })
    .toFile(path.join(publicDir, 'icon.png'));
  console.log('Generated public/icon.png');
}

run().catch(console.error);
