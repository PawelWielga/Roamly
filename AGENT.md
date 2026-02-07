# Instrukcje dla AgentĂłw AI

## Informacje o projekcie

Projekt **Roamly** to interaktywna mapa podrĂłĹĽy z animacjami pojazdĂłw, zbudowana przy uĹĽyciu:

- **TypeScript** - jÄ™zyk programowania

- **Vite** - narzÄ™dzie do budowania aplikacji

- **Leaflet** - biblioteka do map

- **Tailwind CSS** - framework CSS

## Struktura projektu

```

Roamly/

â”śâ”€â”€ src/

â”‚   â”śâ”€â”€ app/

â”‚   â”‚   â””â”€â”€ app.ts              # GĹ‚Ăłwna klasa aplikacji

â”‚   â”śâ”€â”€ constants/

â”‚   â”‚   â”śâ”€â”€ mapConfig.ts        # Konfiguracja mapy

â”‚   â”‚   â””â”€â”€ vehicleIcons.ts    # Ikony pojazdĂłw

â”‚   â”śâ”€â”€ services/

â”‚   â”‚   â”śâ”€â”€ animationService.ts # Serwis animacji

â”‚   â”‚   â”śâ”€â”€ dataService.ts      # Serwis danych

â”‚   â”‚   â”śâ”€â”€ filterService.ts    # Serwis filtrĂłw (nowy)

â”‚   â”‚   â”śâ”€â”€ mapService.ts      # Serwis mapy

â”‚   â”‚   â””â”€â”€ uiService.ts       # Serwis UI

â”‚   â”śâ”€â”€ types/

â”‚   â”‚   â””â”€â”€ index.ts           # Typy TypeScript

â”‚   â””â”€â”€ main.ts               # Punkt wejĹ›cia

â”śâ”€â”€ public/

â”‚   â”śâ”€â”€ styles.css             # Style CSS

â”‚   â””â”€â”€ destinations.json      # Dane podrĂłĹĽy

â”śâ”€â”€ index.html                 # GĹ‚Ăłwny plik HTML

â”śâ”€â”€ plans/                    # Plany implementacji

â””â”€â”€ AGENT.md                  # Ten plik

```

## WaĹĽne zasady

### KoĹ„ce linii

**KRYTYCZNE:** Wszystkie pliki muszÄ… uĹĽywaÄ‡ koĹ„cĂłw linii **CRLF** (Windows), a nie LF (Unix).

- Ustaw edytor na CRLF i utrzymuj spĂłjne koĹ„ce linii

- Unikaj uĹĽywania poleceĹ„ PowerShell do konwersji koĹ„cĂłw linii podczas pracy

### Styl kodu

- UĹĽywaj TypeScript z typowaniem

- Komentarze JSDoc dla wszystkich publicznych metod

- Singleton pattern dla serwisĂłw (export const serviceName = new ServiceClass())

- Nazewnictwo: camelCase dla zmiennych/metod, PascalCase dla klas

### Kolory i stylistyka

- Kolor gĹ‚Ăłwny: `#3b82f6` (niebieski)

- Kolor ciemniejszy: `#2563eb`

- Kolor tĹ‚a: `#ffffff` (biaĹ‚y)

- Kolor tekstu: `#1f2937`, `#374151`, `#4b5563`, `#6b7280`

- Font: **Inter** (Google Fonts)

- Efekt blur: `backdrop-filter: blur(4px)` lub `blur(8px)`

## Serwisy

### dataService.ts

Odpowiedzialny za Ĺ‚adowanie i zarzÄ…dzanie danymi podrĂłĹĽy z pliku `destinations.json`.

### mapService.ts

Odpowiedzialny za zarzÄ…dzanie mapÄ… Leaflet:

- `initializeMap()` - inicjalizacja mapy

- `addMarker()` - dodawanie znacznikĂłw

- `updateMarkers()` - aktualizacja znacznikĂłw (nowa metoda)

- `fitToDestinations()` - dopasowanie widoku do miejsc

- `clearMarkers()` - usuwanie wszystkich znacznikĂłw

### uiService.ts

Odpowiedzialny za zarzÄ…dzanie interfejsem uĹĽytkownika:

- `showDetails()` - pokazywanie karty szczegĂłĹ‚Ăłw

- `hideDetails()` - ukrywanie karty szczegĂłĹ‚Ăłw

- `updateStatus()` - aktualizacja tekstu statusu

### filterService.ts (nowy)

Odpowiedzialny za zarzÄ…dzanie panelem filtrĂłw:

- `initialize()` - inicjalizacja serwisu

- `setDestinations()` - ustawienie danych i budowanie panelu

- `onFilterChange()` - callback dla zmiany filtrĂłw

- `reset()` - resetowanie stanu

### animationService.ts

Odpowiedzialny za animacjÄ™ pojazdĂłw na trasie.

## Typy danych

### Destination

```typescript
interface Destination {
  id: number;

  type: VehicleType; // 'plane' | 'train' | 'car'

  start: [number, number]; // [szerokoĹ›Ä‡, dĹ‚ugoĹ›Ä‡]

  name: string;

  coords: [number, number]; // [szerokoĹ›Ä‡, dĹ‚ugoĹ›Ä‡]

  date: string; // np. "SierpieĹ„ 2023"

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

## Panel filtrĂłw

Panel filtrĂłw znajduje siÄ™ po lewej stronie mapy i pozwala na:

- Filtrowanie po latach (dynamicznie pobierane z danych)

- Filtrowanie po Ĺ›rodkach transportu (plane, train, car)

- Zwijanie/rozwijanie panelu

- Resetowanie filtrĂłw

### Elementy HTML

- `#filterPanel` - gĹ‚Ăłwny kontener panelu

- `#toggleFilterBtn` - przycisk zwijania/rozwijania

- `#toggleIcon` - ikona przycisku (â—€/â–¶)

- `#yearFilters` - kontener checkboxĂłw dla lat

- `#vehicleFilters` - kontener checkboxĂłw dla Ĺ›rodkĂłw transportu

- `#resetFiltersBtn` - przycisk resetowania

### Klasy CSS

- `.filter-panel` - gĹ‚Ăłwny panel

- `.filter-panel.collapsed` - panel zwiniÄ™ty

- `.toggle-filter-btn` - przycisk zwijania

- `.filter-content` - zawartoĹ›Ä‡ panelu

- `.filter-section` - sekcja filtrĂłw

- `.filter-checkbox` - checkbox

- `.filter-checkbox-input` - input checkboxa

- `.filter-checkbox-label` - etykieta checkboxa

- `.reset-filters-btn` - przycisk resetowania

## Uruchamianie projektu

```bash

npm install      # Instalacja zaleĹĽnoĹ›ci

npm run dev      # Uruchomienie serwera deweloperskiego

npm run build    # Budowanie projektu

```

Serwer deweloperski dziaĹ‚a na `http://localhost:3000/Roamly/`

## Testowanie

Przed zatwierdzeniem zmian sprawdĹş:

- Panel filtrĂłw wyĹ›wietla siÄ™ poprawnie po lewej stronie

- Lata sÄ… dynamicznie pobierane z danych

- Checkboxy dziaĹ‚ajÄ… poprawnie

- Filtracja AND dziaĹ‚a poprawnie

- Przycisk zwijania/rozwijania dziaĹ‚a

- Reset filtrĂłw dziaĹ‚a

- Po wybraniu celu podrĂłĹĽy pozostaĹ‚e pinezki znikajÄ… do zamkniÄ™cia popupu

- ResponsywnoĹ›Ä‡ na urzÄ…dzeniach mobilnych

- Styl pasuje do reszty strony

- KoĹ„ce linii sÄ… CRLF (Windows)

## Znane problemy

- ESLint moĹĽe zgĹ‚aszaÄ‡ bĹ‚Ä™dy o koĹ„cach linii - zignoruj je, jeĹ›li pliki dziaĹ‚ajÄ… poprawnie

- Serwer deweloperski moĹĽe blokowaÄ‡ pliki podczas pracy - zatrzymaj go przed modyfikacjÄ… plikĂłw

- W workflowach GitHub Actions lint, type-check oraz format-check sÄ… tymczasowo wyĹ‚Ä…czone (zastÄ…pione krokami no-op); szczegĂłĹ‚y w `plans/ci-checks-removed.md`.

## GitHub Pages i domena

- Plik `public/CNAME` zawiera domenÄ™ niestandardowÄ… dla GitHub Pages i jest kopiowany do `dist` podczas builda.
- Workflow deploy ustawia `cname: wycieczki.dihor.pl` jako dodatkowe zabezpieczenie.

## Utrzymanie AGENT.md

- Jesli ten plik zostal odczytany i do kodu dodajesz cos nowego (funkcjonalnosc, konfiguracje, nowe pliki lub zaleznosci), masz obowiazek zaktualizowac ten opis, aby pozostawal zgodny z aktualnym stanem projektu.
