# Portfolioeo

Aplikacja do szybkiego tworzenia portfolio przez wklejanie linków do projektów. Zaloguj się przez Google, dodaj linki do swoich projektów, a aplikacja automatycznie pobierze podglądy, ikony i tytuły.

## Funkcje

- 🔐 Szybkie logowanie przez Google OAuth
- 📎 Automatyczne pobieranie metadanych stron (tytuł, opis, obraz, favicon)
- 📸 Automatyczne generowanie screenshotów stron (podgląd pierwszego widoku)
- 🎨 Piękne kafelki z podglądami projektów
- 🔗 Unikalny link do Twojego portfolio
- 📱 Responsywny design
- 👑 **Premium (19 zł/miesiąc)**:
  - ✏️ Edycja nazwy (imię i nazwisko)
  - 🖼️ Upload własnego logo (Cloudinary)
  - 📧 Edycja emaila z opcją ukrycia
  - 🔗 Custom link (np. `/portfolio/twoj-link`)
  - 🔗 Linki do social media (GitHub, LinkedIn, Twitter, itp.)

## Wymagania

- Node.js 18+ 
- npm lub yarn
- Konto Google dla OAuth (opcjonalne - można użyć lokalnego developmentu)

## Instalacja

1. Sklonuj repozytorium:
```bash
git clone <repo-url>
cd portfolioeo
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
SCREENSHOTONE_ACCESS_KEY=twój-klucz-z-screenshotone.com
SCREENSHOTONE_SECRET_KEY=twój-secret-key-z-screenshotone.com

# Wymagane dla funkcji Premium:
STRIPE_SECRET_KEY=sk_test_twój-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_twój-webhook-secret
CLOUDINARY_CLOUD_NAME=twój-cloud-name
CLOUDINARY_API_KEY=twój-api-key
CLOUDINARY_API_SECRET=twój-api-secret
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
     - [screenshotone.com](https://screenshotone.com) - darmowy tier dostępny
   - Dodaj klucz do pliku `.env` jako `SCREENSHOTONE_ACCESS_KEY` i `SCREENSHOTONE_SECRET_KEY`

8. (Wymagane dla Premium) Skonfiguruj Stripe:
   - Utwórz konto na [Stripe](https://stripe.com)
   - Przejdź do sekcji Developers > API keys
   - Skopiuj Secret key (testowy lub produkcyjny) do `STRIPE_SECRET_KEY`
   - Utwórz webhook endpoint w Stripe Dashboard:
     - URL: `https://twoja-domena.com/api/stripe/webhook`
     - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Skopiuj webhook secret do `STRIPE_WEBHOOK_SECRET`

9. (Wymagane dla Premium) Skonfiguruj Cloudinary:
   - Utwórz konto na [Cloudinary](https://cloudinary.com)
   - Przejdź do Dashboard i skopiuj:
     - Cloud name → `CLOUDINARY_CLOUD_NAME`
     - API Key → `CLOUDINARY_API_KEY`
     - API Secret → `CLOUDINARY_API_SECRET`

10. Zainicjalizuj bazę danych:
```bash
npx prisma generate
npx prisma db push
```

11. Uruchom serwer deweloperski:
```bash
npm run dev
```

12. Otwórz [http://localhost:3000](http://localhost:3000) w przeglądarce.

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
- **PostgreSQL** - Baza danych (można zmienić na SQLite)
- **Tailwind CSS** - Stylowanie
- **TypeScript** - Typowanie
- **Cheerio** - Parsowanie HTML do pobierania metadanych
- **Stripe** - Płatności i subskrypcje
- **Cloudinary** - Hosting obrazów (logo)

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

### Funkcje Premium (zaimplementowane):

- [x] Edycja nazwy (imię i nazwisko)
- [x] Upload własnego logo
- [x] Edycja emaila z opcją ukrycia
- [x] Custom link (np. `/portfolio/twoj-link`)
- [x] Linki do social media

### Dodatkowe funkcje do rozważenia:

- [ ] Edycja projektów
- [ ] Zmiana kolejności projektów (drag & drop)
- [ ] Własne tło/kolor portfolio
- [ ] Eksport portfolio jako PDF
- [ ] Statystyki odwiedzin
- [ ] Własna domena

## Licencja

MIT

