import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateProfileSchema = z.object({
  customName: z.string().optional().nullable(),
  customEmail: z.union([
    z.string().email(),
    z.literal(""),
    z.null(),
  ]).optional().nullable(),
  hideEmail: z.boolean().optional(),
  customSlug: z.union([
    z.string().min(3).max(50).regex(/^[a-z0-9-]+$/),
    z.literal(""),
    z.null(),
  ]).optional().nullable(),
}).transform((data) => ({
  customName: data.customName?.trim() || null,
  customEmail: data.customEmail && data.customEmail.trim() !== "" ? data.customEmail.trim() : null,
  hideEmail: data.hideEmail ?? false,
  customSlug: data.customSlug && data.customSlug.trim() !== "" ? data.customSlug.trim() : null,
}))

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        isPremium: true,
        customName: true,
        customLogo: true,
        customBackground: true,
        customEmail: true,
        hideEmail: true,
        customSlug: true,
        socialLinks: {
          select: {
            id: true,
            platform: true,
            url: true,
          },
          orderBy: { createdAt: "asc" },
        },
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isPremium: true },
    })

    if (!user?.isPremium) {
      return NextResponse.json(
        { error: "Premium subscription required" },
        { status: 403 }
      )
    }

    const body = await request.json()
    console.log("Received body:", body)
    
    const data = updateProfileSchema.parse(body)
    console.log("Parsed data:", data)

    // Check if customSlug is unique (if provided)
    if (data.customSlug) {
      const existingUser = await prisma.user.findFirst({
        where: {
          customSlug: data.customSlug,
          id: { not: session.user.id },
        },
      })

      if (existingUser) {
        return NextResponse.json(
          { error: "Ten link jest już zajęty" },
          { status: 400 }
        )
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        customName: data.customName,
        customEmail: data.customEmail,
        hideEmail: data.hideEmail ?? false,
        customSlug: data.customSlug,
      },
      select: {
        customName: true,
        customLogo: true,
        customEmail: true,
        hideEmail: true,
        customSlug: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.errors)
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      )
    }
    console.error("Error updating profile:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

