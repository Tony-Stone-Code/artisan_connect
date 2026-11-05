import { ImageResponse } from 'next/og';

export const alt = 'ArtisanConnect - Find Trusted Professionals in Ghana';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const rawUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://artisan-connect-mvp.vercel.app');
  const domain = rawUrl.replace(/^https?:\/\//, '');

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#001B2E',
          backgroundImage: 'radial-gradient(circle at 15% 15%, #02365B 0%, #001B2E 70%)',
          padding: '60px 80px',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Accent Bar Top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: 'linear-gradient(90deg, #F59E0B 0%, #0284C7 50%, #F59E0B 100%)',
          }}
        />

        {/* Top Header Row: Brand Logo & Verified Pill */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: 14,
                backgroundColor: '#002B49',
                border: '2px solid #F59E0B',
                color: '#F59E0B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
                fontWeight: 900,
              }}
            >
              A
            </div>
            <span style={{ color: '#FFFFFF', fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em' }}>
              Artisan<span style={{ color: '#F59E0B' }}>Connect</span>
            </span>
          </div>

          {/* National Trust Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 20px',
              borderRadius: 9999,
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.6)',
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' }} />
            <span style={{ color: '#F59E0B', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em' }}>
              GHANA'S VERIFIED TRADES NETWORK
            </span>
          </div>
        </div>

        {/* Middle: Headline & Subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 960 }}>
          <h1
            style={{
              color: '#FFFFFF',
              fontSize: 54,
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              margin: 0,
            }}
          >
            Find &amp; Hire Trusted Artisans Across Ghana
          </h1>
          <p
            style={{
              color: '#94A3B8',
              fontSize: 22,
              lineHeight: 1.45,
              margin: 0,
            }}
          >
            Ghana Card verified plumbers, electricians, carpenters, and technicians with guaranteed upfront quotes and escrow payment protection.
          </p>
        </div>

        {/* 3 Pillar Cards */}
        <div style={{ display: 'flex', width: '100%', gap: 20 }}>
          {/* Pillar 1 */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              padding: '18px 22px',
              borderRadius: 14,
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <span style={{ color: '#10B981', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em' }}>
              BIOMETRIC TRUST
            </span>
            <span style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 700 }}>Ghana Card Verified</span>
            <span style={{ color: '#94A3B8', fontSize: 13 }}>Vetted credentials &amp; background checked</span>
          </div>

          {/* Pillar 2 */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              padding: '18px 22px',
              borderRadius: 14,
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <span style={{ color: '#F59E0B', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em' }}>
              SECURE PAYMENTS
            </span>
            <span style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 700 }}>Escrow Protected</span>
            <span style={{ color: '#94A3B8', fontSize: 13 }}>Funds released upon satisfied completion</span>
          </div>

          {/* Pillar 3 */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              padding: '18px 22px',
              borderRadius: 14,
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <span style={{ color: '#0284C7', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em' }}>
              DIRECT COMMS
            </span>
            <span style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 700 }}>Instant Realtime Chat</span>
            <span style={{ color: '#94A3B8', fontSize: 13 }}>Task photos, quick quotes &amp; updates</span>
          </div>
        </div>

        {/* Bottom Footer: Domain & Regions */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: 18,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              backgroundColor: 'rgba(0, 43, 73, 0.8)',
              padding: '8px 20px',
              borderRadius: 10,
              border: '1px solid #F59E0B',
            }}
          >
            <span style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 700 }}>{domain}</span>
          </div>

          <span style={{ color: '#64748B', fontSize: 15, fontWeight: 500 }}>
            Serving Greater Accra • Ashanti • Western • Central • Nationwide
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#F59E0B', fontSize: 13, fontWeight: 700, letterSpacing: '0.05em' }}>TRUST SCORE</span>
            <span style={{ color: '#F8FAFC', fontSize: 15, fontWeight: 600 }}>4.9 / 5.0 Rating</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
