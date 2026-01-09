# Migracja - Dodanie Screenshotów

Aby dodać obsługę screenshotów do istniejących projektów, wykonaj następujące kroki:

## 1. Zaktualizuj schemat bazy danych

```bash
npx prisma db push
```

To doda nowe pole `screenshot` do tabeli `Project`.

## 2. (Opcjonalnie) Zaktualizuj istniejące projekty

Jeśli chcesz wygenerować screenshoty dla istniejących projektów, możesz uruchomić:

```bash
npx prisma studio
```

I ręcznie zaktualizować projekty, lub dodać nowe projekty - screenshoty będą generowane automatycznie.

## 3. Uruchom ponownie aplikację

```bash
npm run dev
```

## Jak to działa?

- Gdy dodajesz nowy projekt, aplikacja automatycznie generuje URL do screenshotu strony
- Screenshot jest używany jako fallback, gdy strona nie ma og:image
- Używamy darmowego serwisu `image.thum.io` do generowania screenshotów
- Screenshot pokazuje pierwszy widok strony po wejściu na nią

