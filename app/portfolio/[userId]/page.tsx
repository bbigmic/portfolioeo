import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Image from "next/image"
import { ExternalLink } from "lucide-react"
import Link from "next/link"
import ProjectImage from "../../components/ProjectImage"

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

async function getUser(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, image: true },
    })
    return user
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

export default async function PortfolioPage({
  params,
}: {
  params: { userId: string }
}) {
  const user = await getUser(params.userId)
  const projects = await getProjects(params.userId)

  if (!user) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            {user.image && (
              <div className="mb-4 flex justify-center">
                <Image
                  src={user.image}
                  alt={user.name || "User"}
                  width={96}
                  height={96}
                  className="rounded-full"
                />
              </div>
            )}
            <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {user.name || "Portfolio"}
            </h1>
            {user.email && (
              <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
            )}
          </div>

          {/* Projects Grid */}
          {projects.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center shadow-lg">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
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
                  className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
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
                        <h3 className="font-bold text-xl mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                          {project.title || new URL(project.url).hostname}
                        </h3>
                        {project.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {project.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-medium">
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
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Stworzone z{" "}
              <Link
                href="/"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Portfolioeo
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

