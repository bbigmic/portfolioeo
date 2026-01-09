import * as cheerio from 'cheerio'

export interface SiteMetadata {
  title: string | null
  description: string | null
  image: string | null
  favicon: string | null
  screenshot: string | null
}

export async function fetchSiteMetadata(url: string): Promise<SiteMetadata> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)
    
    // Extract base URL for relative paths
    const urlObj = new URL(url)
    const baseUrl = `${urlObj.protocol}//${urlObj.host}`

    // Get title
    const title = 
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('title').text() ||
      null

    // Get description
    const description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      null

    // Get image
    let image =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('meta[name="twitter:image:src"]').attr('content') ||
      null

    if (image && !image.startsWith('http')) {
      image = new URL(image, baseUrl).toString()
    }

    // Get favicon
    let favicon =
      $('link[rel="icon"]').attr('href') ||
      $('link[rel="shortcut icon"]').attr('href') ||
      $('link[rel="apple-touch-icon"]').attr('href') ||
      `${baseUrl}/favicon.ico`

    if (favicon && !favicon.startsWith('http')) {
      favicon = new URL(favicon, baseUrl).toString()
    }

    // Generate screenshot URL using our own API endpoint
    // We'll generate the full URL when saving to database
    // For now, store the relative path - it will be converted to full URL in the API
    const screenshot = url // Store the original URL, we'll generate screenshot on demand

    return {
      title: title?.trim() || null,
      description: description?.trim() || null,
      image: image || null,
      favicon: favicon || null,
      screenshot: screenshot || null,
    }
  } catch (error) {
    console.error('Error fetching metadata:', error)
    // Even if metadata fetch fails, store the URL for screenshot generation
    const screenshot = url
    return {
      title: null,
      description: null,
      image: null,
      favicon: null,
      screenshot: screenshot || null,
    }
  }
}

