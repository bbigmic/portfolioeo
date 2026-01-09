import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignInButton from "./components/SignInButton";
import Image from "next/image";
import StructuredData from "./components/StructuredData";
import { 
  Zap, 
  Link2, 
  Image as ImageIcon, 
  Share2, 
  CheckCircle2, 
  ArrowRight,
  Globe,
  Clock,
  Palette
} from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <>
      <StructuredData />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/logo-portfolioeo.png"
              alt="Portfolioeo Logo"
              width={32}
              height={32}
              className="w-8 h-8"
              priority
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Portfolioeo
            </span>
          </div>
          <SignInButton />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 mb-8 text-sm font-medium">
            <Zap className="w-4 h-4" />
            <span>Tworzenie portfolio w minutę</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Stwórz swoje portfolio
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">
              bez wysiłku
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Wklej linki do swoich projektów, a my automatycznie pobierzemy metadane, 
            wygenerujemy screenshoty i stworzymy piękne portfolio gotowe do udostępnienia.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <SignInButton />
            <a 
              href="#jak-to-dziala" 
              className="px-8 py-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              Dowiedz się więcej
            </a>
          </div>

          {/* Hero Visual */}
          <div className="relative mt-16">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl rounded-full"></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-6 h-48 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <Globe className="w-8 h-8 text-white" />
                      </div>
                      <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-24 mx-auto mb-2"></div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Wszystko czego potrzebujesz
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Wszystkie narzędzia w jednym miejscu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Link2,
                title: "Wklej i gotowe",
                description: "Po prostu wklej link do swojego projektu. Nie musisz ręcznie dodawać tytułów, opisów czy obrazów.",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: ImageIcon,
                title: "Automatyczne screenshoty",
                description: "Aplikacja automatycznie generuje wysokiej jakości screenshoty Twoich projektów.",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: Zap,
                title: "Błyskawiczna konfiguracja",
                description: "Twój portfolio jest gotowy w mniej niż minutę. Bez skomplikowanych ustawień.",
                color: "from-orange-500 to-red-500"
              },
              {
                icon: Share2,
                title: "Udostępnij łatwo",
                description: "Otrzymaj unikalny link do swojego portfolio i udostępnij go gdzie chcesz.",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Palette,
                title: "Piękny design",
                description: "Nowoczesny, responsywny design który świetnie wygląda na każdym urządzeniu.",
                color: "from-indigo-500 to-purple-500"
              },
              {
                icon: Clock,
                title: "Oszczędność czasu",
                description: "Zamiast godzin spędzonych na konfiguracji, skup się na tym co ważne - na swoich projektach.",
                color: "from-pink-500 to-rose-500"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="jak-to-dziala" className="container mx-auto px-4 py-20 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Jak to działa?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Trzy proste kroki do Twojego portfolio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">

            {[
              {
                step: "1",
                title: "Zaloguj się",
                description: "Zaloguj się przez Google w kilka sekund. Bez skomplikowanych formularzy.",
                icon: CheckCircle2
              },
              {
                step: "2",
                title: "Dodaj projekty",
                description: "Wklej linki do swoich projektów. Aplikacja automatycznie pobierze wszystkie potrzebne informacje.",
                icon: Link2
              },
              {
                step: "3",
                title: "Udostępnij",
                description: "Skopiuj link do swojego portfolio i udostępnij go pracodawcom, klientom lub znajomym.",
                icon: Share2
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                    {step.step}
                  </div>
                  <step.icon className="w-12 h-12 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Gotowy na start?
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Stwórz swoje portfolio już dziś i pokaż światu swoje projekty
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignInButton />
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-blue-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Bezpłatne</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Bez karty kredytowej</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Gotowe w minutę</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Image
                src="/logo-portfolioeo.png"
                alt="Portfolioeo Logo"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Portfolioeo
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-center md:text-right">
              © {new Date().getFullYear()} Portfolioeo. Wszystkie prawa zastrzeżone.
            </p>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}

