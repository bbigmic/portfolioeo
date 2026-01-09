export default function StructuredData() {
  const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL || 'portfolieo.vercel.app'}`
    : 'http://localhost:3000';

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Portfolioeo",
    "url": baseUrl,
    "logo": `${baseUrl}/logo-portfolioeo.png`,
    "description": "Stwórz swoje portfolio online w minutę! Portfolio programisty, developer portfolio, portfolio IT - wszystko automatycznie.",
    "sameAs": [],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "availableLanguage": ["Polish"]
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Portfolioeo",
    "url": baseUrl,
    "description": "Portfolio online w minutę - portfolio programisty, developer portfolio, portfolio IT",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Portfolioeo",
    "applicationCategory": "WebApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "PLN"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "ratingCount": "1"
    },
    "description": "Aplikacja do szybkiego tworzenia portfolio online. Portfolio programisty, developer portfolio, portfolio IT - wszystko automatycznie.",
    "screenshot": `${baseUrl}/logo-portfolioeo.png`,
    "featureList": [
      "Portfolio online w minutę",
      "Automatyczne pobieranie metadanych",
      "Automatyczne screenshoty projektów",
      "Bezpłatne portfolio",
      "Portfolio bez kodu",
      "Portfolio dla programistów"
    ]
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Jak stworzyć portfolio online w Portfolioeo",
    "description": "Krok po kroku jak stworzyć swoje portfolio online w minutę",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Zaloguj się",
        "text": "Zaloguj się przez Google w kilka sekund. Bez skomplikowanych formularzy.",
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Dodaj projekty",
        "text": "Wklej linki do swoich projektów. Aplikacja automatycznie pobierze wszystkie potrzebne informacje.",
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Udostępnij",
        "text": "Skopiuj link do swojego portfolio i udostępnij go pracodawcom, klientom lub znajomym.",
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Jak stworzyć portfolio online?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Zaloguj się przez Google, wklej linki do swoich projektów, a Portfolioeo automatycznie stworzy Twoje portfolio online w minutę."
        }
      },
      {
        "@type": "Question",
        "name": "Czy portfolio online jest darmowe?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Tak, Portfolioeo jest całkowicie darmowe. Nie wymagamy karty kredytowej ani żadnych opłat."
        }
      },
      {
        "@type": "Question",
        "name": "Czy potrzebuję umiejętności programowania?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nie! Portfolioeo działa bez kodu. Po prostu wklej linki do projektów, a aplikacja zrobi resztę automatycznie."
        }
      },
      {
        "@type": "Question",
        "name": "Jak długo trwa stworzenie portfolio?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Portfolio jest gotowe w mniej niż minutę. Wystarczy zalogować się i dodać linki do projektów."
        }
      },
      {
        "@type": "Question",
        "name": "Czy mogę użyć Portfolioeo jako portfolio programisty?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Tak! Portfolioeo jest idealne dla programistów, developerów i wszystkich osób pracujących w IT. Automatycznie pobiera metadane i screenshoty projektów."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}

