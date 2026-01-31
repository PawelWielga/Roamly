import { Destination } from '../types/index';
import { dataService } from '../services/dataService';
import { mapService } from '../services/mapService';
import { animationService } from '../services/animationService';
import { uiService } from '../services/uiService';
import { filterService } from '../services/filterService';
import {
  ROUTE_ZOOM_OPTIONS,
  ALL_DESTINATIONS_ZOOM_OPTIONS,
  DETAILS_ZOOM_OPTIONS,
} from '../constants/mapConfig';

/**
 * Główna klasa aplikacji Roamly
 * Koordynuje wszystkie serwisy i zarządza przepływem aplikacji
 */
export class RoamlyApp {
  private destinations: Destination[] = [];
  private isInitialized = false;

  /**
   * Inicjalizuje aplikację
   * @param mapContainerId - ID kontenera mapy
   */
  async initialize(mapContainerId: string = 'map'): Promise<void> {
    if (this.isInitialized) {
      console.warn('Aplikacja jest już zainicjalizowana');
      return;
    }

    try {
      // Inicjalizuj serwis UI
      uiService.initialize();

      // Inicjalizuj serwis filtrów
      filterService.initialize();

      // Pokaż wskaźnik ładowania
      uiService.showLoading();

      // Załaduj dane
      this.destinations = await dataService.loadDestinations();

      // Ustaw dane w serwisie filtrów
      filterService.setDestinations(this.destinations);

      // Skonfiguruj callback dla zmiany filtrów
      filterService.onFilterChange((filteredDestinations) => {
        this.handleFilterChange(filteredDestinations);
      });

      // Inicjalizuj mapę
      mapService.initializeMap(mapContainerId);

      // Dodaj znaczniki dla wszystkich miejsc
      this.addMarkers();

      // Dostosuj widok mapy do wszystkich miejsc
      mapService.fitToDestinations(this.destinations, ALL_DESTINATIONS_ZOOM_OPTIONS);

      // Ustaw domyślny status
      uiService.setDefaultStatus();

      // Skonfiguruj obsługę zdarzeń UI
      this.setupUIHandlers();

      this.isInitialized = true;
      console.log('Aplikacja Roamly została zainicjalizowana');
    } catch (error) {
      console.error('Błąd podczas inicjalizacji aplikacji:', error);
      uiService.showError('Nie udało się załadować aplikacji');
    }
  }

  /**
   * Dodaje znaczniki dla wszystkich miejsc docelowych
   */
  private addMarkers(): void {
    this.destinations.forEach((destination) => {
      mapService.addMarker(destination, () => this.onMarkerClick(destination));
    });
  }

  /**
   * Konfiguruje obsługę zdarzeń UI
   */
  private setupUIHandlers(): void {
    // Obsługa kliknięcia na nakładkę
    uiService.onOverlayClick(() => this.closeDetails());

    // Obsługa kliknięcia na przycisk zamknięcia
    uiService.onCloseButtonClick(() => this.closeDetails());
  }

  /**
   * Obsługuje zmianę filtrów
   * @param filteredDestinations - Przefiltrowane miejsca docelowe
   */
  private handleFilterChange(filteredDestinations: Destination[]): void {
    // Aktualizuj znaczniki na mapie
    mapService.updateMarkers(filteredDestinations, (dest) => this.onMarkerClick(dest));

    // Dostosuj widok mapy do przefiltrowanych miejsc
    if (filteredDestinations.length > 0) {
      mapService.fitToDestinations(filteredDestinations, ALL_DESTINATIONS_ZOOM_OPTIONS);
    }
  }

  /**
   * Obsługuje kliknięcie na znacznik
   * @param destination - Kliknięte miejsce docelowe
   */
  private onMarkerClick(destination: Destination): void {
    // Nie uruchamiaj nowej podróży jeśli animacja jest w toku
    if (animationService.isAnimatingNow()) {
      return;
    }

    this.prepareJourney(destination);
  }

  /**
   * Przygotowuje podróż - najpierw zoom, potem animacja
   * @param destination - Miejsce docelowe
   */
  private prepareJourney(destination: Destination): void {
    uiService.setPreparingStatus(destination.name);

    // Zoom do trasy
    mapService.fitToRoute(destination.start, destination.coords, ROUTE_ZOOM_OPTIONS);

    // Rozpocznij animację po zakończeniu zoomu
    mapService.once('moveend', () => {
      setTimeout(() => this.startJourney(destination), 200);
    });
  }

  /**
   * Rozpoczyna animację podróży
   * @param destination - Miejsce docelowe
   */
  private startJourney(destination: Destination): void {
    uiService.setMovingStatus(destination.type, destination.name);

    animationService.startAnimation(
      destination,
      () => this.finishJourney(destination)
      // Opcjonalnie: obsługa postępu animacji
    );
  }

  /**
   * Kończy podróż i pokazuje szczegóły
   * @param destination - Miejsce docelowe
   */
  private finishJourney(destination: Destination): void {
    uiService.setArrivedStatus(destination.name);

    setTimeout(() => {
      this.showDetails(destination);
    }, 500);
  }

  /**
   * Pokazuje szczegóły miejsca
   * @param destination - Miejsce docelowe
   */
  private showDetails(destination: Destination): void {
    uiService.showDetails(destination);

    // Zoom do szczegółów
    mapService.zoomTo(destination.coords, 10, DETAILS_ZOOM_OPTIONS);
  }

  /**
   * Zamyka szczegóły i resetuje widok
   */
  private closeDetails(): void {
    uiService.hideDetails();

    // Wyczyść trasę
    mapService.clearRoute();

    // Resetuj widok mapy
    mapService.fitToDestinations(this.destinations, ALL_DESTINATIONS_ZOOM_OPTIONS);

    // Resetuj status
    uiService.setDefaultStatus();
  }

  /**
   * Pobiera wszystkie miejsca docelowe
   * @returns Tablica miejsc docelowych
   */
  getDestinations(): Destination[] {
    return [...this.destinations];
  }

  /**
   * Pobiera miejsce docelowe po ID
   * @param id - ID miejsca docelowego
   * @returns Miejsce docelowe lub undefined
   */
  getDestinationById(id: number): Destination | undefined {
    return this.destinations.find((dest) => dest.id === id);
  }

  /**
   * Dodaje nowe miejsce docelowe
   * @param destination - Miejsce docelowe do dodania
   */
  addDestination(destination: Destination): void {
    this.destinations.push(destination);
    dataService.addDestination(destination);
    mapService.addMarker(destination, () => this.onMarkerClick(destination));
    mapService.fitToDestinations(this.destinations, ALL_DESTINATIONS_ZOOM_OPTIONS);
  }

  /**
   * Usuwa miejsce docelowe
   * @param id - ID miejsca docelowego do usunięcia
   * @returns True jeśli miejsce zostało usunięte
   */
  removeDestination(id: number): boolean {
    const index = this.destinations.findIndex((dest) => dest.id === id);
    if (index !== -1) {
      this.destinations.splice(index, 1);
      dataService.removeDestination(id);
      mapService.removeMarker(id);
      mapService.fitToDestinations(this.destinations, ALL_DESTINATIONS_ZOOM_OPTIONS);
      return true;
    }
    return false;
  }

  /**
   * Aktualizuje miejsce docelowe
   * @param id - ID miejsca docelowego
   * @param updates - Obiekt z aktualizacjami
   * @returns Zaktualizowane miejsce docelowe lub undefined
   */
  updateDestination(id: number, updates: Partial<Destination>): Destination | undefined {
    const destination = this.getDestinationById(id);
    if (destination) {
      Object.assign(destination, updates);
      dataService.updateDestination(id, updates);
      return destination;
    }
    return undefined;
  }

  /**
   * Sprawdza czy aplikacja jest zainicjalizowana
   * @returns True jeśli aplikacja jest zainicjalizowana
   */
  isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Niszczy aplikację i czyści zasoby
   */
  destroy(): void {
    mapService.destroy();
    animationService.reset();
    uiService.reset();
    filterService.reset();
    this.destinations = [];
    this.isInitialized = false;
  }
}

/**
 * Singleton instancja aplikacji
 */
export const app = new RoamlyApp();
