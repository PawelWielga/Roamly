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
 * GĹ‚Ăłwna klasa aplikacji Roamly
 * Koordynuje wszystkie serwisy i zarzÄ…dza przepĹ‚ywem aplikacji
 */
export class RoamlyApp {
  private destinations: Destination[] = [];
  private filteredDestinations: Destination[] = [];
  private isInitialized = false;

  /**
   * Inicjalizuje aplikacjÄ™
   * @param mapContainerId - ID kontenera mapy
   */
  async initialize(mapContainerId: string = 'map'): Promise<void> {
    if (this.isInitialized) {
      console.warn('Aplikacja jest juĹĽ zainicjalizowana');
      return;
    }

    try {
      // Inicjalizuj serwis UI
      uiService.initialize();

      // Inicjalizuj serwis filtrĂłw
      filterService.initialize();

      // PokaĹĽ wskaĹşnik Ĺ‚adowania
      uiService.showLoading();

      // ZaĹ‚aduj dane
      this.destinations = await dataService.loadDestinations();
      this.filteredDestinations = [...this.destinations];

      // Ustaw dane w serwisie filtrĂłw
      filterService.setDestinations(this.destinations);

      // Skonfiguruj callback dla zmiany filtrĂłw
      filterService.onFilterChange((filteredDestinations) => {
        this.handleFilterChange(filteredDestinations);
      });

      // Inicjalizuj mapÄ™
      mapService.initializeMap(mapContainerId);

      // Dodaj znaczniki dla wszystkich miejsc
      this.addMarkers();

      // Dostosuj widok mapy do wszystkich miejsc
      mapService.fitToDestinations(this.destinations, ALL_DESTINATIONS_ZOOM_OPTIONS);

      // Ustaw domyĹ›lny status
      uiService.setDefaultStatus();

      // Skonfiguruj obsĹ‚ugÄ™ zdarzeĹ„ UI
      this.setupUIHandlers();

      this.isInitialized = true;
      console.log('Aplikacja Roamly zostaĹ‚a zainicjalizowana');
    } catch (error) {
      console.error('BĹ‚Ä…d podczas inicjalizacji aplikacji:', error);
      uiService.showError('Nie udaĹ‚o siÄ™ zaĹ‚adowaÄ‡ aplikacji');
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
   * Konfiguruje obsĹ‚ugÄ™ zdarzeĹ„ UI
   */
  private setupUIHandlers(): void {
    // ObsĹ‚uga klikniÄ™cia na nakĹ‚adkÄ™
    uiService.onOverlayClick(() => this.closeDetails());

    // ObsĹ‚uga klikniÄ™cia na przycisk zamkniÄ™cia
    uiService.onCloseButtonClick(() => this.closeDetails());
  }

  /**
   * ObsĹ‚uguje zmianÄ™ filtrĂłw
   * @param filteredDestinations - Przefiltrowane miejsca docelowe
   */
  private handleFilterChange(filteredDestinations: Destination[]): void {
    this.filteredDestinations = [...filteredDestinations];

    if (uiService.isDetailsVisible()) {
      return;
    }
    // Aktualizuj znaczniki na mapie
    mapService.updateMarkers(filteredDestinations, (dest) => this.onMarkerClick(dest));

    // Dostosuj widok mapy do przefiltrowanych miejsc
    if (filteredDestinations.length > 0) {
      mapService.fitToDestinations(filteredDestinations, ALL_DESTINATIONS_ZOOM_OPTIONS);
    }
  }

  /**
   * ObsĹ‚uguje klikniÄ™cie na znacznik
   * @param destination - KlikniÄ™te miejsce docelowe
   */
  private onMarkerClick(destination: Destination): void {
    // Nie uruchamiaj nowej podrĂłĹĽy jeĹ›li animacja jest w toku
    if (animationService.isAnimatingNow()) {
      return;
    }

    // Ukryj pozostaĹ‚e znaczniki od razu po wyborze celu
    mapService.updateMarkers([destination], (dest) => this.onMarkerClick(dest));

    this.prepareJourney(destination);
  }

  /**
   * Przygotowuje podrĂłĹĽ - najpierw zoom, potem animacja
   * @param destination - Miejsce docelowe
   */
  private prepareJourney(destination: Destination): void {
    uiService.setPreparingStatus(destination.name);

    // Zoom do trasy
    mapService.fitToRoute(destination.start, destination.coords, ROUTE_ZOOM_OPTIONS);

    // Rozpocznij animacjÄ™ po zakoĹ„czeniu zoomu
    mapService.once('moveend', () => {
      setTimeout(() => this.startJourney(destination), 200);
    });
  }

  /**
   * Rozpoczyna animacjÄ™ podrĂłĹĽy
   * @param destination - Miejsce docelowe
   */
  private startJourney(destination: Destination): void {
    uiService.setMovingStatus(destination.type, destination.name);

    animationService.startAnimation(
      destination,
      () => this.finishJourney(destination)
      // Opcjonalnie: obsĹ‚uga postÄ™pu animacji
    );
  }

  /**
   * KoĹ„czy podrĂłĹĽ i pokazuje szczegĂłĹ‚y
   * @param destination - Miejsce docelowe
   */
  private finishJourney(destination: Destination): void {
    uiService.setArrivedStatus(destination.name);

    setTimeout(() => {
      this.showDetails(destination);
    }, 500);
  }

  /**
   * Pokazuje szczegĂłĹ‚y miejsca
   * @param destination - Miejsce docelowe
   */
  private showDetails(destination: Destination): void {
    uiService.showDetails(destination);

    // Ukryj pozostałe znaczniki na czas podglądu szczegółów
    mapService.updateMarkers([destination], (dest) => this.onMarkerClick(dest));

    // Zoom do szczegĂłĹ‚Ăłw
    mapService.zoomTo(destination.coords, 10, DETAILS_ZOOM_OPTIONS);
  }

  /**
   * Zamyka szczegĂłĹ‚y i resetuje widok
   */
  private closeDetails(): void {
    uiService.hideDetails();

    // WyczyĹ›Ä‡ trasÄ™
    mapService.clearRoute();

    // PrzywrĂłÄ‡ znaczniki zgodne z filtrami
    mapService.updateMarkers(this.filteredDestinations, (dest) => this.onMarkerClick(dest));

    // Resetuj widok mapy
    mapService.fitToDestinations(this.filteredDestinations, ALL_DESTINATIONS_ZOOM_OPTIONS);

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
   * @param id - ID miejsca docelowego do usuniÄ™cia
   * @returns True jeĹ›li miejsce zostaĹ‚o usuniÄ™te
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
   * @returns True jeĹ›li aplikacja jest zainicjalizowana
   */
  isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Niszczy aplikacjÄ™ i czyĹ›ci zasoby
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
