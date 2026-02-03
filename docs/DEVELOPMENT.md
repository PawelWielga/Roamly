# Przewodnik dewelopera Roamly

Ten dokument zawiera informacje dla deweloperów chcących rozwijać projekt Roamly.

## 🛠️ Narzędzia deweloperskie

### Zalecane IDE

- **VS Code** - Zalecany edytor
- **WebStorm** - Alternatywa dla JetBrains

### Wymagane rozszerzenia VS Code

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "usernamehw.errorlens",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

## 📝 Konwencje kodowania

### TypeScript

- Używaj `const` i `let`, unikaj `var`
- Używaj arrow functions dla callbacków
- Używaj template literals dla stringów
- Używaj destrukturyzacji obiektów i tablic
- Używaj optional chaining (`?.`) i nullish coalescing (`??`)

```typescript
// Dobrze
const destination = destinations.find((d) => d.id === id);
const name = destination?.name ?? 'Nieznane';

// Źle
var destination = destinations.find(function (d) {
  return d.id === id;
});
var name = destination ? destination.name : 'Nieznane';
```

### Nazewnictwo

- **Klasy**: PascalCase (`DataService`)
- **Funkcje/metody**: camelCase (`loadDestinations`)
- **Stałe**: UPPER_SNAKE_CASE (`DEFAULT_MAP_CONFIG`)
- **Prywatne metody**: camelCase z podkreśleniem (`_privateMethod`)
- **Interfejsy**: PascalCase z prefiksem `I` (opcjonalnie)

### Komentarze

Używaj JSDoc dla dokumentacji funkcji:

```typescript
/**
 * Ładuje dane z pliku JSON
 * @param url - URL do pliku JSON
 * @returns Promise z tablicą miejsc docelowych
 */
async loadDestinations(url: string): Promise<Destination[]> {
  // ...
}
```

### Importy

Używaj named imports dla funkcji i klas:

```typescript
import { DataService } from '../services/dataService.js';
import { Destination } from '../types/index.js';
```

## 🧪 Pisanie testów

### Struktura testu

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MyService } from '../services/myService.js';

describe('MyService', () => {
  let service: MyService;

  beforeEach(() => {
    service = new MyService();
    vi.clearAllMocks();
  });

  describe('methodName', () => {
    it('powinien zrobić coś', () => {
      // Arrange
      const input = 'test';

      // Act
      const result = service.methodName(input);

      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

### Mockowanie

```typescript
// Mock funkcji
const mockFn = vi.fn();
mockFn.mockReturnValue('value');
mockFn.mockResolvedValue('asyncValue');

// Mock modułu
vi.mock('../module.js', () => ({
  exportName: vi.fn(),
}));

// Mock globalnych obiektów
global.fetch = vi.fn();
```

## 🐛 Debugowanie

### Debugowanie w VS Code

Utwórz plik `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

### Debugowanie testów

```bash
# Uruchom testy z debuggerem
npm run test -- --inspect-brk
```

### Console logging

Używaj odpowiednich poziomów logowania:

```typescript
console.log('Informacja'); // Ogólne informacje
console.warn('Ostrzeżenie'); // Ostrzeżenia
console.error('Błąd'); // Błędy
console.debug('Debug'); // Debug (tylko w dev)
```

## 📦 Dodawanie nowych funkcjonalności

### Krok 1: Zdefiniuj typy

Dodaj typy do `src/types/index.ts`:

```typescript
export interface NewFeature {
  id: number;
  name: string;
  // ...
}
```

### Krok 2: Utwórz serwis

Utwórz nowy serwis w `src/services/`:

```typescript
export class NewFeatureService {
  private data: NewFeature[] = [];

  async loadData(): Promise<NewFeature[]> {
    // ...
  }

  // ...
}

export const newFeatureService = new NewFeatureService();
```

### Krok 3: Zintegruj z aplikacją

Zaktualizuj `src/app/app.ts`:

```typescript
export class RoamlyApp {
  async initialize(): Promise<void> {
    // ...
    await newFeatureService.loadData();
    // ...
  }
}
```

### Krok 4: Dodaj testy

Utwórz testy w `src/tests/`:

```typescript
describe('NewFeatureService', () => {
  // ...
});
```

### Krok 5: Zaktualizuj dokumentację

Zaktualizuj `README.md` i `docs/ARCHITECTURE.md`.

## 🔄 Praca z Git

### Branching

- `main/master` - Gałąź produkcyjna
- `develop` - Gałąź deweloperska
- `feature/*` - Nowe funkcjonalności
- `bugfix/*` - Poprawki błędów
- `hotfix/*` - Pilne poprawki

### Commit messages

Używaj konwencji Conventional Commits:

```
feat: dodaj obsługę nowych typów pojazdów
fix: napraw błąd animacji lądowania
docs: zaktualizuj dokumentację
test: dodaj testy dla DataService
refactor: przebuduj strukturę serwisów
style: sformatuj kod
chore: zaktualizuj zależności
```

### Pull Request

Przed utworzeniem PR:

1. Zaktualizuj branch z `develop`
2. Uruchom testy: `npm run test`
3. Uruchom linter: `npm run lint`
4. Zbuduj projekt: `npm run build`
5. Dodaj opis zmian

## 🚀 Wydania

### Wersjonowanie

Używaj Semantic Versioning (SemVer):

- `MAJOR.MINOR.PATCH`
- MAJOR: zmiany niekompatybilne wstecznie
- MINOR: nowe funkcjonalności kompatybilne wstecznie
- PATCH: poprawki błędów kompatybilne wstecznie

### Proces wydania

1. Zaktualizuj `package.json`
2. Utwórz tag: `git tag v1.0.0`
3. Wypchnij tag: `git push origin v1.0.0`
4. Utwórz Release na GitHub

## 📚 Zasoby

### Dokumentacja

- [TypeScript](https://www.typescriptlang.org/docs/)
- [Vite](https://vitejs.dev/guide/)
- [Leaflet](https://leafletjs.com/reference.html)
- [Vitest](https://vitest.dev/guide/)

### Narzędzia

- [TypeScript Playground](https://www.typescriptlang.org/play)
- [Regex101](https://regex101.com/)
- [JSONLint](https://jsonlint.com/)

## ❓ Często zadawane pytania

### Jak dodać nowe miejsce docelowe?

Edytuj `src/data/destinations.json`:

```json
{
  "destinations": [
    {
      "id": 7,
      "type": "plane",
      "start": [52.1672, 20.9679],
      "name": "Nowe miejsce",
      "coords": [50.0, 20.0],
      "date": "Styczeń 2025",
      "description": "Opis miejsca",
      "imageUrl": "https://example.com/image.jpg"
    }
  ]
}
```

### Jak zmienić ikonę pojazdu?

Edytuj `src/constants/vehicleIcons.ts`:

```typescript
export const VEHICLE_ICONS: Record<VehicleType, VehicleIcon> = {
  plane: {
    type: 'plane',
    svg: `<svg>...</svg>`,
    color: '#3b82f6',
  },
  // ...
};
```

### Jak zmienić konfigurację mapy?

Edytuj `src/constants/mapConfig.ts`:

```typescript
export const DEFAULT_MAP_CONFIG: MapConfig = {
  center: [52, 19],
  zoom: 5,
  minZoom: 2,
  markerZoomAnimation: false,
};
```

### Jak dodać nową animację?

1. Zdefiniuj konfigurację w `src/constants/mapConfig.ts`
2. Zaimplementuj logikę w `src/services/animationService.ts`
3. Dodaj testy w `src/tests/animationService.test.ts`

## 🤝 Wsparcie

Jeśli masz pytania lub potrzebujesz pomocy:

- Otwórz Issue na GitHub
- Dołącz do dyskusji w Discussions
- Skontaktuj się z maintainerem

---

Dokumentacja aktualna na dzień: 2025-01-30
