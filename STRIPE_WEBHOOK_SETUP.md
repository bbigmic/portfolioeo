# Konfiguracja Webhooków Stripe

## Endpoint URL Webhook

Dla środowiska produkcyjnego:
```
https://twoja-domena.com/api/stripe/webhook
```

Dla środowiska testowego (lokalnego z Stripe CLI):
```
http://localhost:3000/api/stripe/webhook
```

## Eventy do dodania w Stripe Dashboard

W Stripe Dashboard (https://dashboard.stripe.com/webhooks) dodaj następujące eventy:

### ✅ Obecnie obsługiwane eventy:

1. **`checkout.session.completed`**
   - Aktywuje się po zakończeniu płatności w Checkout Session
   - Aktualizuje użytkownika: ustawia `isPremium = true` i zapisuje `stripeSubscriptionId`

2. **`customer.subscription.updated`**
   - Aktywuje się gdy subskrypcja zostanie zaktualizowana (np. zmiana planu, odnowienie)
   - Sprawdza status subskrypcji i aktualizuje `isPremium` w bazie danych

3. **`customer.subscription.deleted`**
   - Aktywuje się gdy subskrypcja zostanie anulowana lub usunięta
   - Ustawia `isPremium = false` i usuwa `stripeSubscriptionId`

### 🔄 Zalecane dodatkowe eventy (opcjonalne):

4. **`invoice.payment_failed`** (zalecane)
   - Aktywuje się gdy płatność za fakturę nie powiedzie się
   - Możesz użyć tego do powiadomienia użytkownika o problemie z płatnością
   - **Status**: Nie zaimplementowane w kodzie (można dodać)

5. **`customer.subscription.created`** (opcjonalne)
   - Aktywuje się gdy subskrypcja zostanie utworzona
   - **Status**: Nie zaimplementowane (zazwyczaj `checkout.session.completed` wystarcza)

6. **`invoice.payment_succeeded`** (opcjonalne)
   - Aktywuje się gdy płatność za fakturę zakończy się sukcesem
   - Przydatne do logowania historii płatności
   - **Status**: Nie zaimplementowane w kodzie

## Instrukcja konfiguracji w Stripe Dashboard

1. Przejdź do: https://dashboard.stripe.com/webhooks
2. Kliknij **"Add endpoint"** (lub **"Add webhook endpoint"**)
3. Wpisz URL endpoint:
   - Produkcja: `https://twoja-domena.com/api/stripe/webhook`
   - Test: `https://twoja-domena.vercel.app/api/stripe/webhook` (dla Vercel)
4. Wybierz eventy do subskrypcji:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - (Opcjonalnie) `invoice.payment_failed`
5. Kliknij **"Add endpoint"**
6. Skopiuj **Signing secret** (zaczyna się od `whsec_`)
7. Dodaj go do zmiennej środowiskowej `STRIPE_WEBHOOK_SECRET` w pliku `.env`

## Testowanie webhooków lokalnie

Aby testować webhooki lokalnie, użyj Stripe CLI:

```bash
# Zainstaluj Stripe CLI
# macOS: brew install stripe/stripe-cli/stripe
# Linux/Windows: https://stripe.com/docs/stripe-cli

# Zaloguj się
stripe login

# Przekieruj webhooki na lokalny endpoint
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Stripe CLI wyświetli webhook secret (whsec_...)
# Użyj tego secret w zmiennej STRIPE_WEBHOOK_SECRET
```

## Weryfikacja działania

Po skonfigurowaniu webhooka możesz przetestować go w Stripe Dashboard:
1. Przejdź do webhook endpoint
2. Kliknij **"Send test webhook"**
3. Wybierz event (np. `checkout.session.completed`)
4. Sprawdź logi aplikacji czy event został poprawnie obsłużony

## Aktualna implementacja

Kod webhooka znajduje się w: `app/api/stripe/webhook/route.ts`

Obecnie obsługiwane eventy:
- `checkout.session.completed` - aktywacja premium po płatności
- `customer.subscription.updated` - aktualizacja statusu subskrypcji
- `customer.subscription.deleted` - deaktywacja premium po anulowaniu

