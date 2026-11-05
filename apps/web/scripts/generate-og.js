const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#021B30" />
      <stop offset="50%" stop-color="#002B49" />
      <stop offset="100%" stop-color="#07131F" />
    </linearGradient>

    <!-- Top Accent Gradient -->
    <linearGradient id="topBorder" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F59E0B" />
      <stop offset="50%" stop-color="#0284C7" />
      <stop offset="100%" stop-color="#F59E0B" />
    </linearGradient>

    <!-- Card Background Gradient -->
    <linearGradient id="cardBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="rgba(255, 255, 255, 0.08)" />
      <stop offset="100%" stop-color="rgba(255, 255, 255, 0.02)" />
    </linearGradient>

    <!-- Pill Gradient -->
    <linearGradient id="pillGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="rgba(245, 158, 11, 0.2)" />
      <stop offset="100%" stop-color="rgba(245, 158, 11, 0.05)" />
    </linearGradient>

    <!-- Ambient Glow Filter -->
    <filter id="glowBlue" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="80" />
    </filter>
    <filter id="glowAmber" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="60" />
    </filter>

    <!-- Grid Pattern -->
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(255, 255, 255, 0.04)" stroke-width="1" />
    </pattern>
  </defs>

  <!-- Base Background -->
  <rect width="1200" height="630" fill="url(#bgGradient)" />

  <!-- Ambient Glows -->
  <circle cx="200" cy="120" r="180" fill="#0284C7" opacity="0.25" filter="url(#glowBlue)" />
  <circle cx="1050" cy="500" r="160" fill="#F59E0B" opacity="0.2" filter="url(#glowAmber)" />
  <circle cx="950" cy="150" r="140" fill="#002B49" opacity="0.4" filter="url(#glowBlue)" />

  <!-- Subtle Grid Overlay -->
  <rect width="1200" height="630" fill="url(#grid)" />

  <!-- Top Accent Bar -->
  <rect x="0" y="0" width="1200" height="8" fill="url(#topBorder)" />

  <!-- Content Container -->
  <g transform="translate(80, 60)">
    
    <!-- Top Row: Logo & National Badge -->
    <g>
      <!-- Logo Shield Icon -->
      <rect x="0" y="0" width="60" height="60" rx="14" fill="#002B49" stroke="#F59E0B" stroke-width="2.5" />
      <path d="M 30 14 L 46 22 V 34 C 46 43 39 50 30 52 C 21 50 14 43 14 34 V 22 Z" fill="#F59E0B" />
      <!-- Letter 'A' on Shield -->
      <text x="30" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="20" fill="#002B49" text-anchor="middle">A</text>

      <!-- Logo Text -->
      <text x="76" y="43" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="36" fill="#FFFFFF" letter-spacing="-0.5">
        Artisan<tspan fill="#F59E0B">Connect</tspan>
      </text>

      <!-- Category Pill Badge -->
      <g transform="translate(730, 8)">
        <rect width="310" height="42" rx="21" fill="url(#pillGrad)" stroke="#F59E0B" stroke-width="1.2" />
        <!-- Verification dot -->
        <circle cx="24" cy="21" r="5" fill="#10B981" />
        <text x="40" y="27" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="13" fill="#F59E0B" letter-spacing="1.2">
          GHANA'S VERIFIED TRADES NETWORK
        </text>
      </g>
    </g>

    <!-- Main Headline -->
    <text x="0" y="160" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="52" fill="#FFFFFF" letter-spacing="-1">
      Find &amp; Hire Trusted Artisans Across Ghana
    </text>

    <!-- Subtitle -->
    <text x="0" y="210" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="400" font-size="22" fill="#94A3B8">
      Vetted electricians, plumbers, carpenters, and technicians with biometric Ghana Card
    </text>
    <text x="0" y="240" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="400" font-size="22" fill="#94A3B8">
      verification, guaranteed upfront quotes, and milestone escrow payment security.
    </text>

    <!-- 3 Value Proposition Cards -->
    <g transform="translate(0, 275)">
      
      <!-- Card 1: Biometric Verification -->
      <g>
        <rect width="330" height="135" rx="16" fill="url(#cardBg)" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1" />
        <!-- Shield Icon Badge -->
        <rect x="20" y="22" width="40" height="40" rx="10" fill="rgba(16, 185, 129, 0.15)" />
        <path d="M 40 32 L 48 37 V 44 C 48 49 44 53 40 54 C 36 53 32 49 32 44 V 37 Z" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M 37 43 L 39 45 L 44 40" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        
        <text x="72" y="47" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="18" fill="#FFFFFF">
          Ghana Card Verified
        </text>
        <text x="20" y="86" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="400" font-size="14" fill="#94A3B8">
          Identity-vetted artisans with verified
        </text>
        <text x="20" y="106" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="400" font-size="14" fill="#94A3B8">
          credentials and tracked service history.
        </text>
      </g>

      <!-- Card 2: Escrow Protection -->
      <g transform="translate(355, 0)">
        <rect width="330" height="135" rx="16" fill="url(#cardBg)" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1" />
        <!-- Lock Icon Badge -->
        <rect x="20" y="22" width="40" height="40" rx="10" fill="rgba(245, 158, 11, 0.15)" />
        <rect x="34" y="38" width="12" height="11" rx="2" fill="none" stroke="#F59E0B" stroke-width="2" />
        <path d="M 36 38 V 34 C 36 31.8 37.8 30 40 30 C 42.2 30 44 31.8 44 34 V 38" fill="none" stroke="#F59E0B" stroke-width="2" />

        <text x="72" y="47" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="18" fill="#FFFFFF">
          Escrow Protected
        </text>
        <text x="20" y="86" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="400" font-size="14" fill="#94A3B8">
          Your payment stays safely in escrow
        </text>
        <text x="20" y="106" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="400" font-size="14" fill="#94A3B8">
          until you approve completed work.
        </text>
      </g>

      <!-- Card 3: Realtime Chat & Transparency -->
      <g transform="translate(710, 0)">
        <rect width="330" height="135" rx="16" fill="url(#cardBg)" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1" />
        <!-- Chat Icon Badge -->
        <rect x="20" y="22" width="40" height="40" rx="10" fill="rgba(2, 132, 199, 0.15)" />
        <path d="M 33 46 L 33 34 C 33 32.3 34.3 31 36 31 L 44 31 C 45.7 31 47 32.3 47 34 L 47 43 C 47 44.7 45.7 46 44 46 L 37 46 L 33 50 Z" fill="none" stroke="#0284C7" stroke-width="2" stroke-linejoin="round" />

        <text x="72" y="47" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="18" fill="#FFFFFF">
          Direct Realtime Chat
        </text>
        <text x="20" y="86" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="400" font-size="14" fill="#94A3B8">
          Chat instantly, share task photos,
        </text>
        <text x="20" y="106" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="400" font-size="14" fill="#94A3B8">
          and receive clear written quotes.
        </text>
      </g>
    </g>

    <!-- Bottom Footer Row -->
    <g transform="translate(0, 445)">
      <!-- Domain Pill -->
      <rect width="310" height="44" rx="10" fill="rgba(0, 43, 73, 0.8)" stroke="#F59E0B" stroke-width="1.5" />
      <text x="155" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="16" fill="#FFFFFF" text-anchor="middle">
        artisan-connect-mvp.vercel.app
      </text>

      <!-- Regions list -->
      <text x="340" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="500" font-size="15" fill="#64748B">
        Greater Accra • Ashanti • Central • Western • Nationwide
      </text>

      <!-- Trust Rating -->
      <g transform="translate(900, 4)">
        <!-- 5 Amber Stars -->
        <text x="0" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="16" fill="#F59E0B">★ ★ ★ ★ ★</text>
        <text x="90" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="600" font-size="15" fill="#F8FAFC">4.9 / 5 Rating</text>
      </g>
    </g>

  </g>
</svg>
`;

async function generate() {
  const outputPath = path.join(__dirname, '../public/og-image.png');
  const buffer = Buffer.from(svg);
  await sharp(buffer)
    .png({ quality: 95 })
    .toFile(outputPath);
  console.log('Successfully generated og-image.png at:', outputPath);
}

generate().catch(console.error);
