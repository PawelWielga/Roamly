# Instrukcje dla Agentów AI

## Informacje o projekcie

Projekt **Roamly** to interaktywna mapa podróży z animacjami pojazdów, zbudowana przy użyciu:

- **TypeScript** - język programowania

- **Vite** - narzędzie do budowania aplikacji

- **Leaflet** - biblioteka do map

- **Tailwind CSS** - framework CSS

## Struktura projektu

```

Roamly/

├── src/

│   ├── app/

│   │   └── app.ts              # Główna klasa aplikacji

│   ├── constants/

│   │   ├── mapConfig.ts        # Konfiguracja mapy

│   │   └── vehicleIcons.ts    # Ikony pojazdów

│   ├── services/

│   │   ├── animationService.ts # Serwis animacji

│   │   ├── dataService.ts      # Serwis danych

│   │   ├── filterService.ts    # Serwis filtrów (nowy)

│   │   ├── mapService.ts      # Serwis mapy

│   │   └── uiService.ts       # Serwis UI

│   ├── types/

│   │   └── index.ts           # Typy TypeScript

│   └── main.ts               # Punkt wejścia

├── public/

│   ├── styles.css             # Style CSS

│   └── destinations.json      # Dane podróży

├── index.html                 # Główny plik HTML

├── plans/                    # Plany implementacji

└── AGENT.md                  # Ten plik

```

## Ważne zasady

### Końce linii

**KRYTYCZNE:** Wszystkie pliki muszą używać końców linii **CRLF** (Windows), a nie LF (Unix).

- Ustaw edytor na CRLF i utrzymuj spójne końce linii

- Unikaj używania poleceń PowerShell do konwersji końców linii podczas pracy

### Styl kodu

- Używaj TypeScript z typowaniem

- Komentarze JSDoc dla wszystkich publicznych metod

- Singleton pattern dla serwisów (export const serviceName = new ServiceClass())

- Nazewnictwo: camelCase dla zmiennych/metod, PascalCase dla klas

### Kolory i stylistyka

- Kolor główny: `#3b82f6` (niebieski)

- Kolor ciemniejszy: `#2563eb`

- Kolor tła: `#ffffff` (biały)

- Kolor tekstu: `#1f2937`, `#374151`, `#4b5563`, `#6b7280`

- Font: **Inter** (Google Fonts)

- Efekt blur: `backdrop-filter: blur(4px)` lub `blur(8px)`

## Serwisy

### dataService.ts

Odpowiedzialny za ładowanie i zarządzanie danymi podróży z pliku `destinations.json`.

### mapService.ts

Odpowiedzialny za zarządzanie mapą Leaflet:

- `initializeMap()` - inicjalizacja mapy

- `addMarker()` - dodawanie znaczników

- `updateMarkers()` - aktualizacja znaczników (nowa metoda)

- `fitToDestinations()` - dopasowanie widoku do miejsc

- `clearMarkers()` - usuwanie wszystkich znaczników

### uiService.ts

Odpowiedzialny za zarządzanie interfejsem użytkownika:

- `showDetails()` - pokazywanie karty szczegółów

- `hideDetails()` - ukrywanie karty szczegółów

- `updateStatus()` - aktualizacja tekstu statusu

### filterService.ts (nowy)

Odpowiedzialny za zarządzanie panelem filtrów:

- `initialize()` - inicjalizacja serwisu

- `setDestinations()` - ustawienie danych i budowanie panelu

- `onFilterChange()` - callback dla zmiany filtrów

- `reset()` - resetowanie stanu

### animationService.ts

Odpowiedzialny za animację pojazdów na trasie.

## Typy danych

### Destination

```typescript
interface Destination {
  id: number;

  type: VehicleType; // 'plane' | 'train' | 'car'

  start: [number, number]; // [szerokość, długość]

  name: string;

  coords: [number, number]; // [szerokość, długość]

  date: string; // np. "Sierpień 2023"

  description: string;

  imageUrl: string;
}
```

### FilterState

```typescript
interface FilterState {
  years: string[];

  vehicleTypes: VehicleType[];
}
```

## Panel filtrów

Panel filtrów znajduje się po lewej stronie mapy i pozwala na:

- Filtrowanie po latach (dynamicznie pobierane z danych)

- Filtrowanie po środkach transportu (plane, train, car)

- Zwijanie/rozwijanie panelu

- Resetowanie filtrów

### Elementy HTML

- `#filterPanel` - główny kontener panelu

- `#toggleFilterBtn` - przycisk zwijania/rozwijania

- `#toggleIcon` - ikona przycisku (◀/▶)

- `#yearFilters` - kontener checkboxów dla lat

- `#vehicleFilters` - kontener checkboxów dla środków transportu

- `#resetFiltersBtn` - przycisk resetowania

### Klasy CSS

- `.filter-panel` - główny panel

- `.filter-panel.collapsed` - panel zwinięty

- `.toggle-filter-btn` - przycisk zwijania

- `.filter-content` - zawartość panelu

- `.filter-section` - sekcja filtrów

- `.filter-checkbox` - checkbox

- `.filter-checkbox-input` - input checkboxa

- `.filter-checkbox-label` - etykieta checkboxa

- `.reset-filters-btn` - przycisk resetowania

## Uruchamianie projektu

```bash

npm install      # Instalacja zależności

npm run dev      # Uruchomienie serwera deweloperskiego

npm run build    # Budowanie projektu

```

Serwer deweloperski działa na `http://localhost:3000/Roamly/`

## Testowanie

Przed zatwierdzeniem zmian sprawdź:

- Panel filtrów wyświetla się poprawnie po lewej stronie

- Lata są dynamicznie pobierane z danych

- Checkboxy działają poprawnie

- Filtracja AND działa poprawnie

- Przycisk zwijania/rozwijania działa

- Reset filtrów działa

- Responsywność na urządzeniach mobilnych

- Styl pasuje do reszty strony

- Końce linii są CRLF (Windows)

## Znane problemy

- ESLint może zgłaszać błędy o końcach linii - zignoruj je, jeśli pliki działają poprawnie

- Serwer deweloperski może blokować pliki podczas pracy - zatrzymaj go przed modyfikacją plików

- W workflowach GitHub Actions lint, type-check oraz format-check są tymczasowo wyłączone (zastąpione krokami no-op); szczegóły w `plans/ci-checks-removed.md`.

## GitHub Pages i domena

- Plik `public/CNAME` zawiera domenę niestandardową dla GitHub Pages i jest kopiowany do `dist` podczas builda.
- Workflow deploy ustawia `cname: wycieczki.dihor.pl` jako dodatkowe zabezpieczenie.

## Utrzymanie AGENT.md

- Jesli ten plik zostal odczytany i do kodu dodajesz cos nowego (funkcjonalnosc, konfiguracje, nowe pliki lub zaleznosci), masz obowiazek zaktualizowac ten opis, aby pozostawal zgodny z aktualnym stanem projektu.
