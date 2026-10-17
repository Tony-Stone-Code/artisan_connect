import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'ArtisanConnect - Find Trusted Professionals in Ghana';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#09090b',
          position: 'relative',
        }}
      >
        {/* Grid pattern background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Accent bar top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: 'linear-gradient(90deg, #2563eb, #3b82f6, #60a5fa)',
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              backgroundColor: '#2563eb',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
              fontWeight: 700,
            }}
          >
            A
          </div>
          <span style={{ color: 'white', fontSize: 48, fontWeight: 700, letterSpacing: '-0.025em' }}>
            Artisan<span style={{ color: '#3b82f6' }}>Connect</span>
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            color: '#a1a1aa',
            fontSize: 28,
            maxWidth: 700,
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          Find and hire verified plumbers, electricians, carpenters, and other skilled professionals across Ghana.
        </p>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '8px 24px',
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            artisan-connect.netlify.app
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
