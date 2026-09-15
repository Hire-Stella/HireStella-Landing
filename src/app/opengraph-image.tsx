import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'HireStella — Capacity, coordinated.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** §7.4 — social metadata. Midnight ground, one signal, the wordmark set in type. */
export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background:
            'linear-gradient(135deg, #070B18 0%, #141B45 52%, #0B1028 100%)',
          color: '#fff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: '18px solid #FF6200',
              borderTop: '11px solid transparent',
              borderBottom: '11px solid transparent',
            }}
          />
          <div
            style={{
              fontSize: 22,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: 'rgba(199,201,232,.78)',
            }}
          >
            AI Workforce Orchestration
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              letterSpacing: -2.6,
              lineHeight: 1.05,
              maxWidth: 920,
            }}
          >
            Tell Stella what is slowing your business down.
          </div>
          <div style={{ fontSize: 30, color: 'rgba(231,234,244,.72)' }}>
            One AI General Manager. Eight connected AI Specialists.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 28,
            borderTop: '1px solid rgba(199,201,232,.18)',
          }}
        >
          <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: -1 }}>HireStella</div>
          <div style={{ fontSize: 24, color: 'rgba(199,201,232,.68)' }}>
            Capacity, coordinated.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
