# Tymczasowe wylaczenie sprawdzan w GitHub Actions

W workflowach GitHub Actions usunieto sprawdzanie formatowania, lint i type-check.
Na ten moment build w CI i deploy uruchamiaja tylko `npm run build`.

## Co przywrocic w przyszlosci

1. Przywrocic joby i kroki `lint`, `type-check` oraz `format-check` w `.github/workflows/ci.yml`.
2. Dodac z powrotem kroki `lint` i `type-check` w `.github/workflows/deploy.yml`.
3. Opcjonalnie rozdzielic `build` na lekki (`vite build`) i pelny (`format`, `tsc`, `vite build`).
