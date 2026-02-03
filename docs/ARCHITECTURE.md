# Architektura Roamly

Ten dokument opisuje architekturę aplikacji Roamly, wzorce projektowe i decyzje techniczne.

## 📐 Wzorce architektoniczne

### Service Layer Pattern

Aplikacja używa wzorca Service Layer do oddzielenia logiki biznesowej od warstwy prezentacji.

```
┌─────────────────────────────────────┐
│         UI Layer (HTML/CSS)         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Application Layer (App)        │
└──────────────┬──────────────────────┘
               │
       ┌───────┴───────┐
       │               │
┌──────▼──────┐  ┌────▼─────────┐
│   Services  │  │   Constants  │
└─────────────┘  └──────────────┘
       │
┌──────▼──────┐
│    Types    │
└─────────────┘
```

### Singleton Pattern

Serwisy są implementowane jako singletony, aby zapewnić pojedynczą instancję w całej aplikacji:

```typescript
export const dataService = new DataService();
export const mapService = new MapService();
export const animationService = new AnimationService();
export const uiService = new UIService();
```

### Observer Pattern

Serwisy używają wzorca Observer do komunikacji między komponentami:

```typescript
// MapService
mapService.on('moveend', handler);
mapService.once('moveend', handler);
```

## 🏗️ Struktura modułów

### Types Module (`src/types/index.ts`)

Definiuje wszystkie typy TypeScript używane w aplikacji:

- `VehicleType` - Typy środków transportu
- `Destination` - Interfejs miejsca docelowego
- `MapConfig` - Konfiguracja mapy
- `AnimationConfig` - Konfiguracja animacji
- `AppState` - Stan aplikacji

### Constants Module (`src/constants/`)

Przechowuje stałe konfiguracyjne:

- `mapConfig.ts` - Konfiguracja mapy i teksty statusu
- `vehicleIcons.ts` - Definicje ikon pojazdów

### Services Module (`src/services/`)

Zawiera serwisy odpowiedzialne za konkretne funkcjonalności:

#### DataService

Odpowiedzialny za:

- Ładowanie danych z pliku JSON
- Zarządzanie kolekcją miejsc docelowych
- CRUD operacje na danych

Metody:

- `loadDestinations()` - Ładuje dane
- `getDestinations()` - Pobiera wszystkie miejsca
- `getDestinationById()` - Pobiera miejsce po ID
- `addDestination()` - Dodaje nowe miejsce
- `removeDestination()` - Usuwa miejsce
- `updateDestination()` - Aktualizuje miejsce

#### MapService

Odpowiedzialny za:

- Inicjalizację mapy Leaflet
- Zarządzanie znacznikami
- Zarządzanie ścieżkami
- Zarządzanie pojazdami
- Zoom i nawigację

Metody:

- `initializeMap()` - Inicjalizuje mapę
- `addMarker()` - Dodaje znacznik
- `createPath()` - Tworzy ścieżkę
- `createVehicleMarker()` - Tworzy znacznik pojazdu
- `updateVehiclePosition()` - Aktualizuje pozycję pojazdu
- `updateVehicleRotation()` - Aktualizuje rotację pojazdu
- `fitToDestinations()` - Dostosowuje widok do miejsc
- `fitToRoute()` - Dostosowuje widok do trasy

#### AnimationService

Odpowiedzialny za:

- Obliczanie ścieżek
- Animację pojazdów
- Zarządzanie stanem animacji

Metody:

- `calculatePathPoints()` - Oblicza punkty ścieżki
- `calculateRotation()` - Oblicza rotację
- `startAnimation()` - Rozpoczyna animację
- `cancelAnimation()` - Anuluje animację

#### UIService

Odpowiedzialny za:

- Zarządzanie elementami UI
- Aktualizację statusów
- Pokazywanie/ukrywanie kart szczegółów

Metody:

- `initialize()` - Inicjalizuje serwis
- `updateStatus()` - Aktualizuje status
- `showDetails()` - Pokazuje szczegóły
- `hideDetails()` - Ukrywa szczegóły

### Application Module (`src/app/app.ts`)

Główna klasa `RoamlyApp` koordynuje wszystkie serwisy:

- Inicjalizuje aplikację
- Zarządza przepływem użytkownika
- Obsługuje zdarzenia
- Udostępnia API dla deweloperów

## 🔄 Przepływ danych

### Inicjalizacja aplikacji

```
DOMContentLoaded
    ↓
app.initialize()
    ↓
uiService.initialize()
    ↓
dataService.loadDestinations()
    ↓
mapService.initializeMap()
    ↓
addMarkers()
    ↓
mapService.fitToDestinations()
    ↓
uiService.setDefaultStatus()
```

### Przepływ podróży

```
Kliknięcie na znacznik
    ↓
onMarkerClick()
    ↓
prepareJourney()
    ↓
uiService.setPreparingStatus()
    ↓
mapService.fitToRoute()
    ↓
moveend event
    ↓
startJourney()
    ↓
uiService.setMovingStatus()
    ↓
animationService.startAnimation()
    ↓
finishJourney()
    ↓
uiService.setArrivedStatus()
    ↓
showDetails()
    ↓
mapService.zoomTo()
```

## 🎨 Decyzje projektowe

### Dlaczego TypeScript?

- Statyczne typowanie zapobiega błędom
- Lepsza autouzupełnianie w IDE
- Łatwiejsze refaktoryzowanie
- Samodokumentujący się kod

### Dlaczego Vite?

- Szybki serwer deweloperski
- Natywne moduły ES
- Optymalizacja budowania
- Łatwa konfiguracja

### Dlaczego Leaflet?

- Lekka biblioteka
- Bogate API
- Aktywna społeczność
- Dobre wsparcie dla mobilnych urządzeń

### Dlaczego dane w JSON?

- Łatwe edytowanie
- Wersjonowanie w Git
- Oddzielenie danych od kodu
- Łatwe rozszerzanie

## 🔧 Rozszerzalność

### Dodawanie nowych typów pojazdów

1. Dodaj typ do `VehicleType` w `src/types/index.ts`
2. Dodaj ikonę do `VEHICLE_ICONS` w `src/constants/vehicleIcons.ts`
3. Zaktualizuj logikę animacji w `src/services/animationService.ts`

### Dodawanie nowych funkcjonalności

1. Zdefiniuj typy w `src/types/index.ts`
2. Utwórz nowy serwis w `src/services/`
3. Zintegruj z `RoamlyApp` w `src/app/app.ts`
4. Dodaj testy w `src/tests/`

### Dodawanie nowych animacji

1. Zdefiniuj konfigurację w `src/constants/mapConfig.ts`
2. Zaimplementuj logikę w `src/services/animationService.ts`
3. Dodaj testy jednostkowe

## 🧪 Testowanie

### Strategia testowania

- **Testy jednostkowe** - Testowanie pojedynczych funkcji i metod
- **Testy integracyjne** - Testowanie interakcji między serwisami
- **Testy E2E** - Testowanie pełnego przepływu użytkownika (planowane)

### Mockowanie

Serwisy są mockowane w testach przy użyciu Vitest:

```typescript
vi.mock('../services/mapService.js', () => ({
  mapService: {
    clearRoute: vi.fn(),
    createPath: vi.fn(),
    // ...
  },
}));
```

## 📊 Wydajność

### Optymalizacje

- Użycie `requestAnimationFrame` dla płynnych animacji
- Debouncing zdarzeń mapy
- Lazy loading danych
- Optymalizacja renderowania CSS

### Monitorowanie

Planowane dodanie:

- Google Analytics
- Sentry dla błędów
- Performance monitoring

## 🔒 Bezpieczeństwo

- CSP headers (planowane)
- Sanitizacja danych wejściowych
- HTTPS wymuszony w produkcji
- Brak wrażliwych danych w kodzie

## 🚀 Przyszłe plany

- [ ] Dodanie obsługi wielu użytkowników
- [ ] Backend API
- [ ] Baza danych
- [ ] Autentykacja
- [ ] Udostępnianie podróży
- [ ] Eksport do PDF
- [ ] Integracja z Google Maps
- [ ] PWA support
