import { NextRequest, NextResponse } from "next/server"
import puppeteer from "puppeteer"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get("url")
  const returnUrl = searchParams.get("returnUrl") === "true" // Opcjonalny parametr do zwracania URL zamiast obrazu

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 })
  }

  try {
    // Validate URL
    new URL(url)
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
  }

  // Sprawdź czy Cloudinary jest skonfigurowane
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return NextResponse.json(
      { error: "Cloudinary nie jest skonfigurowane" },
      { status: 500 }
    )
  }

  try {
    // Uruchom Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
      ],
    })

    const page = await browser.newPage()
    
    // Ustaw viewport
    await page.setViewport({
      width: 1200,
      height: 900,
      deviceScaleFactor: 1,
    })

    // Przejdź do strony i poczekaj aż się załaduje
    // Używamy 'load' zamiast 'networkidle0' dla stron z filmami/streamingiem
    // które mogą mieć ciągłe połączenia sieciowe
    try {
      await page.goto(url, {
        waitUntil: 'load', // Czeka na załadowanie DOM i podstawowych zasobów
        timeout: 60000, // 60 sekund timeout dla stron z filmami
      })
    } catch (error) {
      // Jeśli 'load' się nie powiedzie, spróbuj 'domcontentloaded'
      if (error instanceof Error && error.message.includes('timeout')) {
        console.log('Load timeout, trying domcontentloaded...')
        await page.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout: 60000,
        })
      } else {
        throw error
      }
    }

    // Dodatkowe czekanie na pełne załadowanie (dla stron z animacjami/JS/filmami)
    // Dla stron z filmami dajemy więcej czasu na renderowanie
    await new Promise(resolve => setTimeout(resolve, 5000)) // 5 sekund dodatkowego czekania

    // Zrób screenshot
    const screenshotBuffer = await page.screenshot({
      type: 'png',
      fullPage: false,
    })

    await browser.close()

    // Upload do Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "portfolieo/screenshots",
            resource_type: "image",
            format: "png",
            transformation: [
              { width: 1200, height: 900, crop: "limit" },
              { quality: "auto:good" },
            ],
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        )
        .end(screenshotBuffer as Buffer)
    })

    const screenshotUrl = (uploadResult as any).secure_url

    // Jeśli returnUrl=true, zwróć JSON z URL z Cloudinary
    if (returnUrl) {
      return NextResponse.json({ url: screenshotUrl })
    }

    // W przeciwnym razie zwróć obraz bezpośrednio z bufora (dla kompatybilności)
    return new NextResponse(screenshotBuffer as Buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    })
  } catch (error) {
    console.error('Error generating screenshot:', error)
    
    // Jeśli returnUrl=true, zwróć JSON z błędem
    if (returnUrl) {
      return NextResponse.json(
        { 
          error: 'Błąd generowania screenshotu',
          message: error instanceof Error ? error.message : 'Nieznany błąd'
        },
        { status: 500 }
      )
    }
    
    // Fallback: Return a simple SVG placeholder
    const placeholderSvg = `
      <svg width="1200" height="900" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="900" fill="#f3f4f6"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="#6b7280" text-anchor="middle" dominant-baseline="middle">
          Błąd generowania screenshotu
        </text>
        <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="16" fill="#9ca3af" text-anchor="middle" dominant-baseline="middle">
          ${error instanceof Error ? error.message : 'Nieznany błąd'}
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
}

