import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { fetchSiteMetadata } from "@/lib/metadata"
import { z } from "zod"

const projectSchema = z.object({
  url: z.string().url(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projects = await prisma.project.findMany({
      where: { userId: session.user.id },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Sprawdź czy użytkownik istnieje w bazie danych
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      console.error(`User not found in database: ${session.user.id}`)
      return NextResponse.json(
        { error: "User not found. Please log in again." },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { url } = projectSchema.parse(body)

    // Fetch metadata - sprawdza czy URL jest dostępny
    let metadata
    try {
      metadata = await fetchSiteMetadata(url)
    } catch (error) {
      console.error('Error fetching site metadata:', error)
      const errorMessage = error instanceof Error ? error.message : 'Nie udało się połączyć z podanym adresem URL'
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      )
    }

    // Generate screenshot and upload to Cloudinary
    let screenshotUrl: string | null = null
    if (metadata.screenshot) {
      try {
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
        const screenshotResponse = await fetch(
          `${baseUrl}/api/screenshot?url=${encodeURIComponent(metadata.screenshot)}&returnUrl=true`,
          { signal: AbortSignal.timeout(90000) } // 90 sekund timeout dla stron z filmami
        )
        
        if (screenshotResponse.ok) {
          const screenshotData = await screenshotResponse.json()
          if (screenshotData.url && !screenshotData.error) {
            screenshotUrl = screenshotData.url
          }
        } else {
          console.warn('Screenshot generation failed, continuing without screenshot')
        }
      } catch (error) {
        // Jeśli timeout, loguj ale kontynuuj bez screenshotu
        if (error instanceof Error && error.name === 'TimeoutError') {
          console.warn('Screenshot generation timed out (strona może zawierać filmy), continuing without screenshot')
        } else {
          console.error('Error generating screenshot:', error)
        }
        // Kontynuuj bez screenshotu - nie blokuj tworzenia projektu
      }
    }

    // Get current max order
    const maxOrder = await prisma.project.findFirst({
      where: { userId: session.user.id },
      orderBy: { order: 'desc' },
      select: { order: true },
    })

    console.log("Creating project with userId:", session.user.id)
    
    const project = await prisma.project.create({
      data: {
        url,
        title: metadata.title,
        description: metadata.description,
        image: metadata.image,
        favicon: metadata.favicon,
        screenshot: screenshotUrl,
        userId: session.user.id,
        order: (maxOrder?.order ?? -1) + 1,
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid URL" },
        { status: 400 }
      )
    }
    
    // Log szczegółowych informacji o błędzie
    if (error && typeof error === 'object' && 'code' in error) {
      console.error("Error creating project - Prisma error:", {
        code: (error as any).code,
        meta: (error as any).meta,
        userId: session?.user?.id,
      })
    } else {
      console.error("Error creating project:", error)
    }
    
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

