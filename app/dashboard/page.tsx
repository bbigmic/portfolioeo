"use client"

import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Plus, Trash2, ExternalLink, Copy, Check, Crown, Upload, X, Link as LinkIcon } from "lucide-react"
import Image from "next/image"
import ProjectImage from "../components/ProjectImage"
import { useToast } from "../components/ToastContainer"
import { useConfirm } from "../components/ConfirmDialog"

interface Project {
  id: string
  url: string
  title: string | null
  description: string | null
  image: string | null
  favicon: string | null
  screenshot: string | null
}

interface Profile {
  isPremium: boolean
  customName: string | null
  customLogo: string | null
  customBackground: string | null
  customEmail: string | null
  hideEmail: boolean
  customSlug: string | null
  socialLinks: SocialLink[]
}

interface SocialLink {
  id: string
  platform: string
  url: string
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showToast } = useToast()
  const { confirm } = useConfirm()
  const [projects, setProjects] = useState<Project[]>([])
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [portfolioUrl, setPortfolioUrl] = useState("")
  const [copied, setCopied] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingBackground, setUploadingBackground] = useState(false)
  
  // Profile form state
  const [customName, setCustomName] = useState("")
  const [customEmail, setCustomEmail] = useState("")
  const [hideEmail, setHideEmail] = useState(false)
  const [customSlug, setCustomSlug] = useState("")
  const [newSocialPlatform, setNewSocialPlatform] = useState("")
  const [newSocialUrl, setNewSocialUrl] = useState("")
  const [baseUrl, setBaseUrl] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin)
    }
  }, [])

  useEffect(() => {
    if (session?.user?.id) {
      fetchProjects()
      fetchProfile()
      updatePortfolioUrl()
    }
  }, [session])

  useEffect(() => {
    if (profile) {
      setCustomName(profile.customName || "")
      setCustomEmail(profile.customEmail || "")
      setHideEmail(profile.hideEmail || false)
      setCustomSlug(profile.customSlug || "")
    }
  }, [profile])

  useEffect(() => {
    const success = searchParams.get("success")
    const canceled = searchParams.get("canceled")
    
    if (success === "true") {
      showToast("Subskrypcja Premium została aktywowana!", "success")
      fetchProfile()
      router.replace("/dashboard")
    } else if (canceled === "true") {
      router.replace("/dashboard")
    }
  }, [searchParams, router, showToast])

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

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile")
      if (res.ok) {
        const data = await res.json()
        setProfile(data)
        updatePortfolioUrl(data.customSlug)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setLoadingProfile(false)
    }
  }

  const updatePortfolioUrl = (customSlug?: string | null) => {
    const origin = typeof window !== "undefined" ? window.location.origin : baseUrl || ""
    if (customSlug) {
      setPortfolioUrl(`${origin}/portfolio/${customSlug}`)
    } else if (session?.user?.id) {
      setPortfolioUrl(`${origin}/portfolio/${session.user.id}`)
    }
  }

  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
      })
      if (res.ok) {
        const { url } = await res.json()
        window.location.href = url
      } else {
        const error = await res.json()
        showToast(error.error || "Nie udało się utworzyć sesji płatności", "error")
      }
    } catch (error) {
      console.error("Error creating checkout:", error)
      showToast("Wystąpił błąd podczas tworzenia sesji płatności", "error")
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingLogo(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/profile/upload-logo", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        const { url } = await res.json()
        setProfile((prev) => prev ? { ...prev, customLogo: url } : null)
        showToast("Logo zostało zaktualizowane!", "success")
      } else {
        const error = await res.json()
        showToast(error.error || "Nie udało się przesłać logo", "error")
      }
    } catch (error) {
      console.error("Error uploading logo:", error)
      showToast("Wystąpił błąd podczas przesyłania logo", "error")
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingBackground(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/profile/upload-background", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        const { url } = await res.json()
        setProfile((prev) => prev ? { ...prev, customBackground: url } : null)
        showToast("Tło zostało zaktualizowane!", "success")
      } else {
        const error = await res.json()
        showToast(error.error || "Nie udało się przesłać tła", "error")
      }
    } catch (error) {
      console.error("Error uploading background:", error)
      showToast("Wystąpił błąd podczas przesyłania tła", "error")
    } finally {
      setUploadingBackground(false)
    }
  }

  const handleDeleteLogo = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const confirmed = await confirm("Czy na pewno chcesz usunąć logo?")
    if (!confirmed) {
      return
    }

    try {
      const res = await fetch("/api/profile/delete-logo", {
        method: "DELETE",
      })

      if (res.ok) {
        setProfile((prev) => prev ? { ...prev, customLogo: null } : null)
        showToast("Logo zostało usunięte!", "success")
      } else {
        const error = await res.json()
        showToast(error.error || "Nie udało się usunąć logo", "error")
      }
    } catch (error) {
      console.error("Error deleting logo:", error)
      showToast("Wystąpił błąd podczas usuwania logo", "error")
    }
  }

  const handleDeleteBackground = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const confirmed = await confirm("Czy na pewno chcesz usunąć tło?")
    if (!confirmed) {
      return
    }

    try {
      const res = await fetch("/api/profile/delete-background", {
        method: "DELETE",
      })

      if (res.ok) {
        setProfile((prev) => prev ? { ...prev, customBackground: null } : null)
        showToast("Tło zostało usunięte!", "success")
      } else {
        const error = await res.json()
        showToast(error.error || "Nie udało się usunąć tła", "error")
      }
    } catch (error) {
      console.error("Error deleting background:", error)
      showToast("Wystąpił błąd podczas usuwania tła", "error")
    }
  }

  const handleSaveProfile = async () => {
    setSavingProfile(true)
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customName: customName?.trim() || null,
          customEmail: customEmail?.trim() || null,
          hideEmail,
          customSlug: customSlug?.trim() || null,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setProfile((prev) => prev ? { ...prev, ...data } : null)
        updatePortfolioUrl(data.customSlug)
        showToast("Profil został zaktualizowany!", "success")
      } else {
        const error = await res.json()
        showToast(error.error || "Nie udało się zaktualizować profilu", "error")
      }
    } catch (error) {
      console.error("Error saving profile:", error)
      showToast("Wystąpił błąd podczas zapisywania profilu", "error")
    } finally {
      setSavingProfile(false)
    }
  }

  const handleAddSocialLink = async () => {
    if (!newSocialPlatform.trim() || !newSocialUrl.trim()) {
      showToast("Wypełnij wszystkie pola", "error")
      return
    }

    try {
      const res = await fetch("/api/profile/social-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: newSocialPlatform.trim(),
          url: newSocialUrl.trim(),
        }),
      })

      if (res.ok) {
        const newLink = await res.json()
        setProfile((prev) => prev ? {
          ...prev,
          socialLinks: [...(prev.socialLinks || []), newLink],
        } : null)
        setNewSocialPlatform("")
        setNewSocialUrl("")
        showToast("Link został dodany!", "success")
      } else {
        const error = await res.json()
        showToast(error.error || "Nie udało się dodać linku", "error")
      }
    } catch (error) {
      console.error("Error adding social link:", error)
      showToast("Wystąpił błąd podczas dodawania linku", "error")
    }
  }

  const handleDeleteSocialLink = async (id: string) => {
    const confirmed = await confirm("Czy na pewno chcesz usunąć ten link?")
    if (!confirmed) return

    try {
      const res = await fetch(`/api/profile/social-links?id=${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setProfile((prev) => prev ? {
          ...prev,
          socialLinks: (prev.socialLinks || []).filter((link) => link.id !== id),
        } : null)
        showToast("Link został usunięty!", "success")
      } else {
        showToast("Nie udało się usunąć linku", "error")
      }
    } catch (error) {
      console.error("Error deleting social link:", error)
      showToast("Wystąpił błąd podczas usuwania linku", "error")
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
        showToast("Projekt został dodany!", "success")
      } else {
        showToast("Nie udało się dodać projektu. Sprawdź czy URL jest poprawny.", "error")
      }
    } catch (error) {
      console.error("Error adding project:", error)
      showToast("Wystąpił błąd podczas dodawania projektu.", "error")
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async (id: string) => {
    const confirmed = await confirm("Czy na pewno chcesz usunąć ten projekt?")
    if (!confirmed) return

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== id))
        showToast("Projekt został usunięty!", "success")
      } else {
        showToast("Nie udało się usunąć projektu", "error")
      }
    } catch (error) {
      console.error("Error deleting project:", error)
      showToast("Wystąpił błąd podczas usuwania projektu", "error")
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

          {/* Premium Section */}
          {!loadingProfile && (
            <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 dark:from-yellow-600 dark:via-yellow-700 dark:to-yellow-800 rounded-lg p-6 mb-8 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Crown className="text-white" size={32} />
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {profile?.isPremium ? "Masz Premium!" : "Wykup Premium"}
                    </h2>
                    <p className="text-yellow-100">
                      {profile?.isPremium
                        ? "Ciesz się wszystkimi funkcjami premium - przewiń w dół aby edytować profil"
                        : "Tylko 19 zł/miesiąc - edytuj profil, custom link, social media"}
                    </p>
                  </div>
                </div>
                {!profile?.isPremium && (
                  <button
                    onClick={handleCheckout}
                    className="px-6 py-3 bg-white text-yellow-600 font-semibold rounded-lg hover:bg-yellow-50 transition-colors"
                  >
                    Wykup Premium
                  </button>
                )}
              </div>
            </div>
          )}

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

          {/* Premium Profile Editor */}
          {!loadingProfile && profile?.isPremium && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-lg border-2 border-yellow-400 dark:border-yellow-600">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Crown size={28} className="text-yellow-500" />
                  <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                    Edycja Profilu Premium
                  </span>
                </h2>
                <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full text-sm font-semibold">
                  AKTYWNE
                </span>
              </div>

              {/* Logo Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Logo</label>
                <div className="flex items-center gap-4">
                  {profile.customLogo && (
                    <div className="relative">
                      <Image
                        src={profile.customLogo}
                        alt="Logo"
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors flex items-center gap-2">
                      <Upload size={18} />
                      {uploadingLogo ? "Przesyłanie..." : profile.customLogo ? "Zmień logo" : "Prześlij logo"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        disabled={uploadingLogo}
                      />
                    </label>
                    {profile.customLogo && (
                      <button
                        type="button"
                        onClick={handleDeleteLogo}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
                      >
                        <X size={18} />
                        Usuń
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Background Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Tło Portfolio</label>
                <div className="flex flex-col gap-4">
                  {profile.customBackground && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                      <Image
                        src={profile.customBackground}
                        alt="Tło"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors flex items-center gap-2">
                      <Upload size={18} />
                      {uploadingBackground ? "Przesyłanie..." : profile.customBackground ? "Zmień tło" : "Prześlij tło"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBackgroundUpload}
                        className="hidden"
                        disabled={uploadingBackground}
                      />
                    </label>
                    {profile.customBackground && (
                      <button
                        type="button"
                        onClick={handleDeleteBackground}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
                      >
                        <X size={18} />
                        Usuń
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Tło będzie wyświetlane na całej stronie portfolio
                  </p>
                </div>
              </div>

              {/* Custom Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Nazwa (Imię i Nazwisko)</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder={session.user?.name || "Twoja nazwa"}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              {/* Custom Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder={session.user?.email || "twoj@email.com"}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
                <label className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={hideEmail}
                    onChange={(e) => setHideEmail(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Ukryj email na stronie portfolio</span>
                </label>
              </div>

              {/* Custom Slug */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Custom Link</label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 dark:text-gray-400">{baseUrl || "https://portfolieo.pl"}/portfolio/</span>
                  <input
                    type="text"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    placeholder="twoj-link"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Tylko małe litery, cyfry i myślniki. Minimum 3 znaki.
                </p>
              </div>

              {/* Social Links */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Linki do Social Media</label>
                <div className="space-y-2 mb-3">
                  {profile.socialLinks?.map((link) => (
                    <div key={link.id} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <LinkIcon size={18} className="text-gray-500" />
                      <span className="flex-1 font-medium">{link.platform}</span>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm truncate max-w-xs"
                      >
                        {link.url}
                      </a>
                      <button
                        onClick={() => handleDeleteSocialLink(link.id)}
                        className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSocialPlatform}
                    onChange={(e) => setNewSocialPlatform(e.target.value)}
                    placeholder="Platforma (np. GitHub, LinkedIn)"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                  <input
                    type="url"
                    value={newSocialUrl}
                    onChange={(e) => setNewSocialUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                  <button
                    onClick={handleAddSocialLink}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Dodaj
                  </button>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingProfile ? "Zapisywanie..." : "Zapisz zmiany"}
              </button>
            </div>
          )}

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

