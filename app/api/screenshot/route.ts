import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 })
  }

  try {
    // Validate URL
    new URL(url)
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
  }

  // Use a simple, reliable screenshot service
  // Option 1: Use screenshotapi.net if API key is provided
  if (process.env.SCREENSHOT_API_KEY) {
    const screenshotUrl = `https://api.screenshotapi.net/api/v1/screenshot?url=${encodeURIComponent(url)}&token=${process.env.SCREENSHOT_API_KEY}&width=1200&height=900&format=png&full_page=false`
    
    try {
      const response = await fetch(screenshotUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        signal: AbortSignal.timeout(15000),
      })

      if (response.ok) {
        const imageBuffer = await response.arrayBuffer()
        return new NextResponse(imageBuffer, {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=86400, s-maxage=86400',
          },
        })
      }
    } catch (error) {
      console.error('Screenshot API error:', error)
    }
  }

  // Option 2: Use screenshotone.com if API key is provided
  if (process.env.SCREENSHOTONE_ACCESS_KEY) {
    const screenshotUrl = `https://api.screenshotone.com/take?access_key=${process.env.SCREENSHOTONE_ACCESS_KEY}&url=${encodeURIComponent(url)}&viewport_width=1200&viewport_height=900&device_scale_factor=1&format=png&image_quality=80&block_ads=true&block_cookie_banners=true&delay=2&timeout=10`
    
    try {
      const response = await fetch(screenshotUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        signal: AbortSignal.timeout(15000),
      })

      if (response.ok) {
        const imageBuffer = await response.arrayBuffer()
        return new NextResponse(imageBuffer, {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=86400, s-maxage=86400',
          },
        })
      }
    } catch (error) {
      console.error('ScreenshotOne API error:', error)
    }
  }

  // Fallback: Return a simple SVG placeholder
  // This ensures the image component doesn't break even without API keys
  const placeholderSvg = `
    <svg width="1200" height="900" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="900" fill="#f3f4f6"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="#6b7280" text-anchor="middle" dominant-baseline="middle">
        Screenshot niedostępny
      </text>
      <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="16" fill="#9ca3af" text-anchor="middle" dominant-baseline="middle">
        Dodaj SCREENSHOT_API_KEY do .env
      </text>
    </svg>
  `.trim()

  return new NextResponse(placeholderSvg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

