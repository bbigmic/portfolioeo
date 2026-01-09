import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'white',
        }}
      >
        <div
          style={{
            width: '160px',
            height: '160px',
            background: 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '72px',
            fontWeight: 'bold',
            color: 'white',
          }}
        >
          P
        </div>
      </div>
    ),
    { ...size }
  )
}

