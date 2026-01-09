"use client"

import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, ExternalLink, Copy, Check } from "lucide-react"
import Image from "next/image"
import ProjectImage from "../components/ProjectImage"

interface Project {
  id: string
  url: string
  title: string | null
  description: string | null
  image: string | null
  favicon: string | null
  screenshot: string | null
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [portfolioUrl, setPortfolioUrl] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.id) {
      fetchProjects()
      setPortfolioUrl(`${window.location.origin}/portfolio/${session.user.id}`)
    }
  }, [session])

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects")
      if (res.ok) {
        const data = await res.json()
        setProjects(data)
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    }
  }

  const addProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setLoading(true)
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      })

      if (res.ok) {
        const newProject = await res.json()
        setProjects([...projects, newProject])
        setUrl("")
      } else {
        alert("Nie udało się dodać projektu. Sprawdź czy URL jest poprawny.")
      }
    } catch (error) {
      console.error("Error adding project:", error)
      alert("Wystąpił błąd podczas dodawania projektu.")
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async (id: string) => {
    if (!confirm("Czy na pewno chcesz usunąć ten projekt?")) return

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== id))
      }
    } catch (error) {
      console.error("Error deleting project:", error)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(portfolioUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Ładowanie...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Twoje Portfolio
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Witaj, {session.user?.name || session.user?.email}
              </p>
            </div>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Wyloguj
            </button>
          </div>

          {/* Portfolio URL */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
            <h2 className="text-lg font-semibold mb-3">Link do Twojego Portfolio</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={portfolioUrl}
                readOnly
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <button
                onClick={copyToClipboard}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check size={20} />
                    Skopiowano!
                  </>
                ) : (
                  <>
                    <Copy size={20} />
                    Kopiuj
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Add Project Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Dodaj Nowy Projekt</h2>
            <form onSubmit={addProject} className="flex gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={20} />
                {loading ? "Dodawanie..." : "Dodaj"}
              </button>
            </form>
          </div>

          {/* Projects List */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Twoje Projekty ({projects.length})</h2>
            {projects.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center shadow-lg">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  Nie masz jeszcze żadnych projektów. Dodaj pierwszy projekt powyżej!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <ProjectImage
                      image={project.image}
                      screenshot={project.screenshot}
                      favicon={project.favicon}
                      title={project.title}
                      url={project.url}
                      height="h-48"
                    />
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg truncate flex-1">
                          {project.title || new URL(project.url).hostname}
                        </h3>
                        <button
                          onClick={() => deleteProject(project.id)}
                          className="ml-2 p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      {project.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center gap-1"
                      >
                        Otwórz <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

