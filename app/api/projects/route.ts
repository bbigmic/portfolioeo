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

    const body = await request.json()
    const { url } = projectSchema.parse(body)

    // Fetch metadata
    const metadata = await fetchSiteMetadata(url)

    // Generate screenshot URL - use full URL to our API endpoint
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const screenshotUrl = metadata.screenshot 
      ? `${baseUrl}/api/screenshot?url=${encodeURIComponent(metadata.screenshot)}`
      : null

    // Get current max order
    const maxOrder = await prisma.project.findFirst({
      where: { userId: session.user.id },
      orderBy: { order: 'desc' },
      select: { order: true },
    })

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
    console.error("Error creating project:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

