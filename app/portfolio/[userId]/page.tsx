import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Image from "next/image"
import { ExternalLink, Link as LinkIcon } from "lucide-react"
import Link from "next/link"
import ProjectImage from "../../components/ProjectImage"
import type { Metadata } from "next"

type UserWithPremium = {
  id: string
  name: string | null
  email: string | null
  image: string | null
  customName: string | null
  customLogo: string | null
  customBackground: string | null
  customEmail: string | null
  hideEmail: boolean
  socialLinks: Array<{
    id: string
    platform: string
    url: string
  }>
}

async function getProjects(userId: string) {
  try {
    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { order: "asc" },
    })
    return projects
  } catch (error) {
    console.error("Error fetching projects:", error)
    return []
  }
}

async function getUser(userIdOrSlug: string): Promise<UserWithPremium | null> {
  try {
    // Try to find by custom slug first, then by ID
    let user = await (prisma.user.findFirst as any)({
      where: {
        OR: [
          { customSlug: userIdOrSlug },
          { id: userIdOrSlug },
        ],
      },
      include: {
        socialLinks: {
          orderBy: { createdAt: "asc" },
        },
      },
    }) as UserWithPremium | null
    return user
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: { userId: string }
}): Promise<Metadata> {
  const user = await getUser(params.userId)
  
  if (!user) {
    return {
      title: "Portfolio nie znalezione",
    }
  }

  const projects = await getProjects(user.id)
  const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL || 'portfolieo.vercel.app'}`
    : 'http://localhost:3000';

  const portfolioUrl = `${baseUrl}/portfolio/${params.userId}`
  const userName = user.customName || user.name || "Portfolio"
  const userImage = user.customLogo || user.image
  const title = `${userName} - Portfolio Online | Portfolio Programisty | Portfolioeo`
  const description = projects.length > 0
    ? `Portfolio online ${userName} - zobacz projekty programistyczne, aplikacje web i portfolio IT. ${projects.length} ${projects.length === 1 ? 'projekt' : 'projektów'} w portfolio.`
    : `Portfolio online ${userName} - portfolio programisty, developer portfolio, portfolio IT stworzone w Portfolioeo.`

  return {
    title,
    description,
    keywords: [
      "portfolio online",
      "portfolio programisty",
      "portfolio developer",
      `${userName} portfolio`,
      "portfolio IT",
      "portfolio projektów",
      "portfolio programistyczne",
      "portfolio web",
    ].join(", "),
    openGraph: {
      title,
      description,
      url: portfolioUrl,
      siteName: "Portfolioeo",
      images: userImage ? [
        {
          url: userImage,
          width: 1200,
          height: 630,
          alt: `${userName} - Portfolio`,
        },
      ] : [
        {
          url: `${baseUrl}/logo-portfolioeo.png`,
          width: 1200,
          height: 630,
          alt: `${userName} - Portfolio`,
        },
      ],
      locale: "pl_PL",
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: userImage ? [userImage] : [`${baseUrl}/logo-portfolioeo.png`],
    },
    alternates: {
      canonical: portfolioUrl,
    },
  }
}

export default async function PortfolioPage({
  params,
}: {
  params: { userId: string }
}) {
  const user = await getUser(params.userId)

  if (!user) {
    notFound()
  }

  const projects = await getProjects(user.id)
  
  // Use custom data if available, otherwise fallback to default
  const displayName = user.customName || user.name || "Portfolio"
  const displayLogo = user.customLogo || user.image
  const displayEmail = user.customEmail || (!user.hideEmail ? user.email : null)
  const displayBackground = user.customBackground

  return (
    <div 
      className={`min-h-screen relative ${
        !displayBackground ? 'bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900' : ''
      }`}
      style={displayBackground ? {
        backgroundImage: `url(${displayBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      } : {}}
    >
      {displayBackground && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-0" />
      )}
      <div className="relative z-10">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            {displayLogo && (
              <div className="mb-4 flex justify-center">
                <Image
                  src={displayLogo}
                  alt={displayName}
                  width={96}
                  height={96}
                  className="rounded-full object-cover"
                />
              </div>
            )}
            <h1 className={`text-5xl font-bold mb-2 leading-normal ${displayBackground ? 'text-white drop-shadow-lg' : 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'}`}>
              {displayName}
            </h1>
            {displayEmail && (
              <p className={displayBackground ? 'text-white/90 drop-shadow-md' : 'text-gray-600 dark:text-gray-400'}>{displayEmail}</p>
            )}
            
            {/* Social Links */}
            {user.socialLinks && user.socialLinks.length > 0 && (
              <div className="flex justify-center gap-4 mt-4 flex-wrap">
                {user.socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-shadow text-gray-700 hover:text-blue-600"
                  >
                    <LinkIcon size={18} />
                    <span className="font-medium">{link.platform}</span>
                    <ExternalLink size={14} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Projects Grid */}
          {projects.length === 0 ? (
            <div className={`rounded-lg p-12 text-center shadow-lg ${
              displayBackground 
                ? 'bg-white/90 backdrop-blur-sm' 
                : 'bg-white dark:bg-gray-800'
            }`}>
              <p className={displayBackground ? 'text-gray-700' : 'text-gray-500 dark:text-gray-400'} style={{ fontSize: '1.125rem' }}>
                Ten użytkownik nie ma jeszcze żadnych projektów.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <a
                  key={project.id}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${
                    displayBackground 
                      ? 'bg-white/90 backdrop-blur-sm' 
                      : 'bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className="group-hover:scale-105 transition-transform duration-300">
                    <ProjectImage
                      image={project.image}
                      screenshot={project.screenshot}
                      favicon={project.favicon}
                      title={project.title}
                      url={project.url}
                      height="h-64"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start gap-3 mb-3">
                      {project.favicon && (
                        <Image
                          src={project.favicon}
                          alt="Favicon"
                          width={24}
                          height={24}
                          className="object-contain flex-shrink-0 mt-1"
                          unoptimized
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-bold text-xl mb-1 transition-colors truncate ${
                          displayBackground 
                            ? 'text-gray-900 group-hover:text-blue-700' 
                            : 'group-hover:text-blue-600 dark:group-hover:text-blue-400'
                        }`}>
                          {project.title || new URL(project.url).hostname}
                        </h3>
                        {project.description && (
                          <p className={`text-sm line-clamp-2 ${
                            displayBackground 
                              ? 'text-gray-700' 
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {project.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 text-sm font-medium ${
                      displayBackground 
                        ? 'text-blue-700 group-hover:text-blue-800' 
                        : 'text-blue-600 dark:text-blue-400'
                    }`}>
                      <span>Otwórz projekt</span>
                      <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className={`text-sm ${displayBackground ? 'text-white drop-shadow-lg' : 'text-gray-500 dark:text-gray-400'}`}>
              Stworzone z{" "}
              <Link
                href="/"
                className={`${displayBackground ? 'text-white hover:text-yellow-200' : 'text-blue-600 dark:text-blue-400 hover:underline'}`}
              >
                Portfolioeo
              </Link>
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

