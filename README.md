# Roamly 🌍✈️🚆🚗

Interaktywna mapa podróży z animacjami pojazdów. Aplikacja wizualizuje odwiedzone miejsca z różnymi środkami transportu (samolot, pociąg, samochód).

![Roamly](https://img.shields.io/badge/version-1.0.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📋 Spis treści

- [Funkcjonalności](#funkcjonalności)
- [Technologie](#technologie)
- [Instalacja](#instalacja)
- [Uruchomienie](#uruchomienie)
- [Struktura projektu](#struktura-projektu)
- [Konfiguracja danych](#konfiguracja-danych)
- [Testowanie](#testowanie)
- [Budowanie i deployment](#budowanie-i-deployment)
- [Współpraca](#współpraca)
- [Licencja](#licencja)

## ✨ Funkcjonalności

- 🗺️ Interaktywna mapa Leaflet z warstwą Voyager
- ✈️ Animacje podróży samolotem z krzywizną trasy
- 🚆 Animacje podróży pociągiem
- 🚗 Animacje podróży samochodem
- 📍 Znaczniki dla odwiedzonych miejsc
- 📋 Karty szczegółów z informacjami o podróży
- 📱 Responsywny design
- ♿ Wsparcie dla dostępności
- 🎨 Animacje i płynne przejścia

## 🛠️ Technologie

- **TypeScript** - Język programowania z typowaniem statycznym
- **Vite** - Narzędzie do budowania i dewelopowania
- **Leaflet** - Biblioteka do map interaktywnych
- **Tailwind CSS** - Framework CSS (via CDN)
- **Vitest** - Framework testowy
- **ESLint** - Linter dla JavaScript/TypeScript
- **Prettier** - Formatowanie kodu

## 📦 Instalacja

### Wymagania

- Node.js 20 lub nowszy
- npm lub yarn

### Kroki instalacji

1. Sklonuj repozytorium:

```bash
git clone https://github.com/twoj-uzytkownik/roamly.git
cd roamly
```

2. Zainstaluj zależności:

```bash
npm install
```

## 🚀 Uruchomienie

### Tryb deweloperski

Uruchom serwer deweloperski:

```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem `http://localhost:3000`

### Podgląd produkcji

Zbuduj projekt i uruchom podgląd:

```bash
npm run build
npm run preview
```

## 📁 Struktura projektu

```
roamly/
├── .github/
│   └── workflows/          # GitHub Actions workflows
│       ├── ci.yml          # CI pipeline
│       └── deploy.yml      # Deployment do GitHub Pages
├── public/                 # Pliki statyczne
│   ├── index.html          # Główny plik HTML
│   └── styles.css          # Style CSS
├── src/
│   ├── app/                # Główna logika aplikacji
│   │   └── app.ts          # Klasa główna aplikacji
│   ├── constants/          # Stałe
│   │   ├── mapConfig.ts    # Konfiguracja mapy
│   │   └── vehicleIcons.ts # Ikony pojazdów
│   ├── data/               # Dane
│   │   └── destinations.json # Definicje miejsc
│   ├── services/           # Serwisy
│   │   ├── animationService.ts # Animacje pojazdów
│   │   ├── dataService.ts      # Zarządzanie danymi
│   │   ├── mapService.ts       # Obsługa mapy
│   │   └── uiService.ts        # Obsługa interfejsu
│   ├── tests/              # Testy
│   │   ├── setup.ts        # Konfiguracja testów
│   │   ├── animationService.test.ts
│   │   └── dataService.test.ts
│   ├── types/              # Definicje typów TypeScript
│   │   └── index.ts
│   └── main.ts             # Punkt wejścia
├── .eslintrc.json          # Konfiguracja ESLint
├── .gitignore              # Pliki ignorowane przez Git
├── .prettierrc             # Konfiguracja Prettier
├── package.json            # Zależności i skrypty
├── tsconfig.json           # Konfiguracja TypeScript
├── vite.config.ts          # Konfiguracja Vite
└── README.md               # Dokumentacja
```

## ⚙️ Konfiguracja danych

Definicje odwiedzonych miejsc są przechowywane w pliku [`src/data/destinations.json`](src/data/destinations.json).

### Format danych

```json
{
  "destinations": [
    {
      "id": 1,
      "type": "plane",
      "start": [52.1672, 20.9679],
      "name": "Valletta, Malta",
      "coords": [35.8989, 14.5146],
      "date": "Sierpień 2023",
      "description": "Słoneczna wyspa pełna historii.",
      "imageUrl": "https://example.com/image.jpg"
    }
  ]
}
```

### Pola

| Pole          | Typ              | Opis                                                |
| ------------- | ---------------- | --------------------------------------------------- |
| `id`          | number           | Unikalny identyfikator                              |
| `type`        | string           | Typ środka transportu: `plane`, `train`, `car`      |
| `start`       | [number, number] | Współrzędne punktu startowego [szerokość, długość]  |
| `name`        | string           | Nazwa miejsca docelowego                            |
| `coords`      | [number, number] | Współrzędne miejsca docelowego [szerokość, długość] |
| `date`        | string           | Data podróży                                        |
| `description` | string           | Opis miejsca                                        |
| `imageUrl`    | string           | URL obrazka miejsca                                 |

## 🧪 Testowanie

### Uruchomienie testów

```bash
# Uruchom wszystkie testy
npm run test

# Uruchom testy z interfejsem UI
npm run test:ui

# Uruchom testy z pokryciem kodu
npm run test:coverage
```

### Pisanie testów

Testy są pisane przy użyciu Vitest i umieszczane w folderze [`src/tests/`](src/tests/).

Przykład testu:

```typescript
import { describe, it, expect } from 'vitest';
import { DataService } from '../services/dataService.js';

describe('DataService', () => {
  it('powinien załadować dane', async () => {
    const service = new DataService();
    const data = await service.loadDestinations();
    expect(data).toBeDefined();
  });
});
```

## 🏗️ Budowanie i deployment

### Budowanie projektu

```bash
npm run build
```

Pliki wyjściowe zostaną umieszczone w folderze `dist/`.

### Linting i formatowanie

```bash
# Sprawdź kod linterem
npm run lint

# Napraw problemy lintera
npm run lint:fix

# Sformatuj kod
npm run format

# Sprawdź formatowanie
npm run format:check
```

### Deployment do GitHub Pages

Projekt jest skonfigurowany do automatycznego deploymentu do GitHub Pages przy użyciu GitHub Actions.

1. Włącz GitHub Pages w ustawieniach repozytorium:
   - Settings → Pages → Source: GitHub Actions

2. Wypchnij zmiany do gałęzi `main` lub `master`:

```bash
git add .
git commit -m "Nowa wersja"
git push origin main
```

Workflow automatycznie:

- Zainstaluje zależności
- Przeprowadzi testy i linting
- Zbuduje projekt
- Opublikuje na GitHub Pages

## 🤝 Współpraca

Chętnie przyjmę pomoc! Oto jak możesz pomóc:

1. Forknij repozytorium
2. Utwórz branch dla swojej funkcjonalności (`git checkout -b feature/AmazingFeature`)
3. Zcommituj zmiany (`git commit -m 'Add some AmazingFeature'`)
4. Wypchnij do brancha (`git push origin feature/AmazingFeature`)
5. Otwórz Pull Request

### Zasady współpracy

- Przestrzegaj stylu kodu (Prettier)
- Dodawaj testy dla nowych funkcjonalności
- Aktualizuj dokumentację
- Używaj jasnych komunikatów commitów

## 📄 Licencja

Ten projekt jest licencjonowany na warunkach licencji MIT - zobacz plik [LICENSE](LICENSE) dla szczegółów.

## 👏 Podziękowania

- [Leaflet](https://leafletjs.com/) - Biblioteka map interaktywnych
- [Vite](https://vitejs.dev/) - Narzędzie do budowania
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [CartoDB](https://carto.com/) - Warstwy mapy Voyager

---

Stworzone z ❤️ przez [Twoje Imię]
