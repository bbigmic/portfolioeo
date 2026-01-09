# Portfolieo

Aplikacja do szybkiego tworzenia portfolio przez wklejanie linków do projektów. Zaloguj się przez Google, dodaj linki do swoich projektów, a aplikacja automatycznie pobierze podglądy, ikony i tytuły.

## Funkcje

- 🔐 Szybkie logowanie przez Google OAuth
- 📎 Automatyczne pobieranie metadanych stron (tytuł, opis, obraz, favicon)
- 📸 Automatyczne generowanie screenshotów stron (podgląd pierwszego widoku)
- 🎨 Piękne kafelki z podglądami projektów
- 🔗 Unikalny link do Twojego portfolio
- 📱 Responsywny design

## Wymagania

- Node.js 18+ 
- npm lub yarn
- Konto Google dla OAuth (opcjonalne - można użyć lokalnego developmentu)

## Instalacja

1. Sklonuj repozytorium:
```bash
git clone <repo-url>
cd portfolieo
```

2. Zainstaluj zależności:
```bash
npm install
```

3. Skonfiguruj zmienne środowiskowe:
```bash
cp .env.example .env
```

4. Edytuj plik `.env` i dodaj:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=wygeneruj-secret-klucz-używając-openssl-rand-base64-32
GOOGLE_CLIENT_ID=twój-google-client-id
GOOGLE_CLIENT_SECRET=twój-google-client-secret

# Opcjonalnie - dla lepszej jakości screenshotów:
# SCREENSHOT_API_KEY=twój-klucz-z-screenshotapi.net
# SCREENSHOTONE_API_KEY=twój-klucz-z-screenshotone.com
```

5. Wygeneruj klucz NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

6. Skonfiguruj Google OAuth:
   - Przejdź do [Google Cloud Console](https://console.cloud.google.com/)
   - Utwórz nowy projekt lub wybierz istniejący
   - Włącz Google+ API
   - Utwórz OAuth 2.0 Client ID
   - Dodaj `http://localhost:3000/api/auth/callback/google` jako Authorized redirect URI
   - Skopiuj Client ID i Client Secret do pliku `.env`

7. (Opcjonalnie) Skonfiguruj API do screenshotów:
   - Aplikacja automatycznie generuje screenshoty stron
   - Dla lepszej jakości możesz dodać klucz API:
     - [screenshotapi.net](https://screenshotapi.net) - darmowy tier dostępny
     - [screenshotone.com](https://screenshotone.com) - darmowy tier dostępny
   - Dodaj klucz do pliku `.env` jako `SCREENSHOT_API_KEY` lub `SCREENSHOTONE_API_KEY`

8. Zainicjalizuj bazę danych:
```bash
npx prisma generate
npx prisma db push
```

9. Uruchom serwer deweloperski:
```bash
npm run dev
```

10. Otwórz [http://localhost:3000](http://localhost:3000) w przeglądarce.

## Użycie

1. Zaloguj się przez Google
2. Wklej link do swojego projektu w formularzu
3. Aplikacja automatycznie pobierze metadane (tytuł, obraz, favicon) i wygeneruje screenshot
4. Screenshot pokazuje pierwszy widok strony po wejściu na nią
5. Skopiuj link do swojego portfolio i udostępnij go

## Technologie

- **Next.js 14** - Framework React
- **NextAuth.js** - Autentykacja
- **Prisma** - ORM dla bazy danych
- **SQLite** - Baza danych (można zmienić na PostgreSQL)
- **Tailwind CSS** - Stylowanie
- **TypeScript** - Typowanie
- **Cheerio** - Parsowanie HTML do pobierania metadanych

## Struktura projektu

```
portfolieo/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth konfiguracja
│   │   ├── projects/             # API dla projektów
│   │   └── screenshot/           # API do generowania screenshotów
│   ├── dashboard/                # Strona zarządzania portfolio
│   ├── portfolio/[userId]/      # Publiczna strona portfolio
│   └── page.tsx                  # Strona główna
├── lib/
│   ├── prisma.ts                 # Prisma client
│   └── metadata.ts               # Pobieranie metadanych stron
├── prisma/
│   └── schema.prisma             # Schemat bazy danych
└── types/
    └── next-auth.d.ts            # Typy TypeScript dla NextAuth
```

## Rozwój

### Dodatkowe funkcje do rozważenia:

- [ ] Edycja projektów
- [ ] Zmiana kolejności projektów (drag & drop)
- [ ] Własne tło/kolor portfolio
- [ ] Eksport portfolio jako PDF
- [ ] Statystyki odwiedzin
- [ ] Własna domena

## Licencja

MIT

