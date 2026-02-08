import L from 'leaflet';
import { Destination, MapConfig, ZoomOptions } from '../types/index';
import {
  DEFAULT_MAP_CONFIG,
  TILE_LAYER_URL,
  TILE_LAYER_ATTRIBUTION,
  ROUTE_ZOOM_OPTIONS,
  ALL_DESTINATIONS_ZOOM_OPTIONS,
  DETAILS_ZOOM_OPTIONS,
} from '../constants/mapConfig';
import { getVehicleColor, getVehicleMarkerSvg } from '../constants/vehicleIcons';

/**
 * Serwis odpowiedzialny za zarzÄ…dzanie mapÄ… Leaflet
 */
export class MapService {
  private map: L.Map | null = null;
  private markers: Map<number, L.Marker> = new Map();
  private currentPath: L.Polyline | null = null;
  private currentVehicle: L.Marker | null = null;

  /**
   * Inicjalizuje mapÄ™
   * @param containerId - ID kontenera mapy
   * @param config - Konfiguracja mapy
   * @returns Zainicjalizowana mapa
   */
  initializeMap(containerId: string, config: MapConfig = DEFAULT_MAP_CONFIG): L.Map {
    if (this.map) {
      console.warn('Mapa jest juĹĽ zainicjalizowana');
      return this.map;
    }

    this.map = L.map(containerId, config);

    L.tileLayer(TILE_LAYER_URL, {
      attribution: TILE_LAYER_ATTRIBUTION,
    }).addTo(this.map);

    return this.map;
  }

  /**
   * Pobiera instancjÄ™ mapy
   * @returns Instancja mapy lub null
   */
  getMap(): L.Map | null {
    return this.map;
  }

  /**
   * Dodaje znacznik dla miejsca docelowego
   * @param destination - Miejsce docelowe
   * @param onClick - Funkcja wywoĹ‚ywana po klikniÄ™ciu
   * @returns Utworzony znacznik
   */
  addMarker(destination: Destination, onClick?: (dest: Destination) => void): L.Marker {
    if (!this.map) {
      throw new Error('Mapa nie jest zainicjalizowana');
    }

    const markerColor = getVehicleColor(destination.type);

    const markerIconHtml = `
      <div class="destination-marker destination-marker--${destination.type}" style="--marker-color: ${markerColor};">
        <span class="destination-marker__pulse"></span>
        <span class="destination-marker__ring"></span>
        <span class="destination-marker__icon">${getVehicleMarkerSvg(destination.type)}</span>
      </div>
    `;

    const icon = L.divIcon({
      html: markerIconHtml,
      className: 'destination-marker-wrapper',
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      popupAnchor: [0, -22],
    });

    const marker = L.marker(destination.coords, { icon }).addTo(this.map);

    marker.bindTooltip(destination.destinationName, {
      direction: 'top',
      offset: [0, -18],
      opacity: 0.95,
      className: 'destination-tooltip',
    });

    if (onClick) {
      marker.on('click', () => onClick(destination));
    }

    this.markers.set(destination.id, marker);
    return marker;
  }

  /**
   * Usuwa znacznik po ID
   * @param id - ID znacznika
   */
  removeMarker(id: number): void {
    const marker = this.markers.get(id);
    if (marker) {
      this.map?.removeLayer(marker);
      this.markers.delete(id);
    }
  }

  /**
   * Usuwa wszystkie znaczniki
   */
  clearMarkers(): void {
    this.markers.forEach((marker) => {
      this.map?.removeLayer(marker);
    });
    this.markers.clear();
  }

  /**
   * Aktualizuje znaczniki na mapie
   * @param destinations - Tablica miejsc docelowych do wyĹ›wietlenia
   * @param onClick - Funkcja wywoĹ‚ywana po klikniÄ™ciu
   */
  updateMarkers(destinations: Destination[], onClick?: (dest: Destination) => void): void {
    // UsuĹ„ wszystkie istniejÄ…ce znaczniki
    this.clearMarkers();

    // Dodaj nowe znaczniki
    destinations.forEach((destination) => {
      this.addMarker(destination, onClick);
    });
  }

  /**
   * Dostosowuje widok mapy do wszystkich miejsc
   * @param destinations - Tablica miejsc docelowych
   * @param options - Opcje zoomu
   */
  fitToDestinations(destinations: Destination[], options?: ZoomOptions): void {
    if (!this.map || destinations.length === 0) {
      return;
    }

    const bounds = L.latLngBounds([]);
    destinations.forEach((dest) => {
      bounds.extend(dest.coords);
      bounds.extend(dest.start);
    });

    const zoomOptions = options || ALL_DESTINATIONS_ZOOM_OPTIONS;
    this.map.fitBounds(bounds, zoomOptions);
  }

  /**
   * Dostosowuje widok mapy do trasy
   * @param start - Punkt startowy
   * @param end - Punkt koĹ„cowy
   * @param options - Opcje zoomu
   */
  fitToRoute(start: [number, number], end: [number, number], options?: ZoomOptions): void {
    if (!this.map) {
      return;
    }

    const bounds = L.latLngBounds([start, end]);
    const zoomOptions = options || ROUTE_ZOOM_OPTIONS;
    this.map.flyToBounds(bounds, zoomOptions);
  }

  /**
   * Zoomuje do konkretnego miejsca
   * @param coords - WspĂłĹ‚rzÄ™dne
   * @param zoom - Poziom zoomu
   * @param options - Opcje zoomu
   */
  zoomTo(coords: [number, number], zoom: number, options?: Partial<ZoomOptions>): void {
    if (!this.map) {
      return;
    }

    const zoomOptions = { ...DETAILS_ZOOM_OPTIONS, ...options };
    this.map.flyTo(coords, zoom, zoomOptions);
  }

  /**
   * Tworzy liniÄ™ trasy
   * @param color - Kolor linii
   * @param dashArray - Wzorzec linii przerywanej
   * @returns Utworzona linia
   */
  createPath(color: string, dashArray?: string | null): L.Polyline {
    if (!this.map) {
      throw new Error('Mapa nie jest zainicjalizowana');
    }

    this.removePath();

    const path = L.polyline([], {
      color,
      weight: 3,
      opacity: 0.6,
      lineJoin: 'round',
      dashArray: dashArray || undefined,
    }).addTo(this.map);

    this.currentPath = path;
    return path;
  }

  /**
   * Aktualizuje liniÄ™ trasy
   * @param points - Tablica punktĂłw
   */
  updatePath(points: [number, number][]): void {
    if (this.currentPath) {
      this.currentPath.setLatLngs(points);
    }
  }

  /**
   * Usuwa liniÄ™ trasy
   */
  removePath(): void {
    if (this.currentPath) {
      this.map?.removeLayer(this.currentPath);
      this.currentPath = null;
    }
  }

  /**
   * Tworzy znacznik pojazdu
   * @param position - Pozycja poczÄ…tkowa
   * @param iconHtml - HTML ikony
   * @returns Utworzony znacznik pojazdu
   */
  createVehicleMarker(position: [number, number], iconHtml: string): L.Marker {
    if (!this.map) {
      throw new Error('Mapa nie jest zainicjalizowana');
    }

    const icon = L.divIcon({
      html: iconHtml,
      className: 'vehicle-container',
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });

    const marker = L.marker(position, { icon, interactive: false }).addTo(this.map);
    this.currentVehicle = marker;
    return marker;
  }

  /**
   * Aktualizuje pozycjÄ™ pojazdu
   * @param position - Nowa pozycja
   */
  updateVehiclePosition(position: [number, number]): void {
    if (this.currentVehicle) {
      this.currentVehicle.setLatLng(position);
    }
  }

  /**
   * Aktualizuje rotacjÄ™ ikony pojazdu
   * @param rotation - KÄ…t rotacji w stopniach
   */
  updateVehicleRotation(rotation: number): void {
    if (this.currentVehicle) {
      const element = this.currentVehicle.getElement();
      if (element) {
        const svg = element.querySelector('.vehicle-icon-svg') as HTMLElement;
        if (svg) {
          svg.style.transform = `rotate(${rotation}deg)`;
        }
      }
    }
  }

  /**
   * Dodaje klasÄ™ lÄ…dowania do ikony pojazdu
   */
  addLandingAnimation(): void {
    if (this.currentVehicle) {
      const element = this.currentVehicle.getElement();
      if (element) {
        const svg = element.querySelector('.vehicle-icon-svg');
        if (svg) {
          svg.classList.add('vehicle-landing');
        }
      }
    }
  }

  /**
   * Usuwa znacznik pojazdu
   */
  removeVehicle(): void {
    if (this.currentVehicle) {
      this.map?.removeLayer(this.currentVehicle);
      this.currentVehicle = null;
    }
  }

  /**
   * Usuwa wszystkie elementy trasy (pojazd i Ĺ›cieĹĽkÄ™)
   */
  clearRoute(): void {
    this.removeVehicle();
    this.removePath();
  }

  /**
   * Dodaje nasĹ‚uchiwacz zdarzenia
   * @param event - Nazwa zdarzenia
   * @param handler - Funkcja obsĹ‚ugujÄ…ca zdarzenie
   */
  on(event: string, handler: (...args: unknown[]) => void): void {
    this.map?.on(event, handler);
  }

  /**
   * Dodaje nasĹ‚uchiwacz zdarzenia, ktĂłry zostanie usuniÄ™ty po pierwszym wywoĹ‚aniu
   * @param event - Nazwa zdarzenia
   * @param handler - Funkcja obsĹ‚ugujÄ…ca zdarzenie
   */
  once(event: string, handler: (...args: unknown[]) => void): void {
    this.map?.once(event, handler);
  }

  /**
   * Usuwa nasĹ‚uchiwacz zdarzenia
   * @param event - Nazwa zdarzenia
   * @param handler - Funkcja obsĹ‚ugujÄ…ca zdarzenie
   */
  off(event: string, handler: (...args: unknown[]) => void): void {
    this.map?.off(event, handler);
  }

  /**
   * Niszczy mapÄ™ i czyĹ›ci zasoby
   */
  destroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    this.markers.clear();
    this.currentPath = null;
    this.currentVehicle = null;
  }
}

/**
 * Singleton instancja serwisu mapy
 */
export const mapService = new MapService();
