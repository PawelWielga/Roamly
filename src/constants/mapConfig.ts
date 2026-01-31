import { MapConfig, AnimationConfig } from '../types/index';

/**
 * Domyślna konfiguracja mapy
 */
export const DEFAULT_MAP_CONFIG: MapConfig = {
  center: [52, 19],
  zoom: 5,
  minZoom: 2,
  markerZoomAnimation: false,
};

/**
 * Domyślna konfiguracja animacji
 */
export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  duration: 2500,
  steps: 200,
  curveFactor: 0.15,
};

/**
 * URL warstwy kafelków mapy
 */
export const TILE_LAYER_URL =
  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png';

/**
 * Tekst atrybucji mapy
 */
export const TILE_LAYER_ATTRIBUTION = '&copy; OpenStreetMap contributors &copy; CARTO';

/**
 * Domyślne opcje zoomu do trasy
 */
export const ROUTE_ZOOM_OPTIONS = {
  padding: [100, 100] as [number, number],
  duration: 1.2,
  easeLinearity: 0.25,
};

/**
 * Domyślne opcje zoomu do wszystkich miejsc
 */
export const ALL_DESTINATIONS_ZOOM_OPTIONS = {
  padding: [80, 80] as [number, number],
  duration: 1.5,
};

/**
 * Opcje zoomu do szczegółów miejsca
 */
export const DETAILS_ZOOM_OPTIONS = {
  duration: 1.5,
};

/**
 * Teksty statusu aplikacji
 */
export const STATUS_TEXTS = {
  IDLE: 'Wybierz cel podróży na mapie',
  PREPARING: (destination: string) => `Przygotowanie trasy: ${destination}`,
  MOVING_PLANE: (destination: string) => `Lot do: ${destination}`,
  MOVING_TRAIN: (destination: string) => `Podróż pociągiem do: ${destination}`,
  MOVING_CAR: (destination: string) => `Przejazd samochodem do: ${destination}`,
  ARRIVED: (destination: string) => `Dotarto do celu: ${destination}`,
};

/**
 * Funkcja pomocnicza do pobrania tekstu statusu podczas ruchu
 * @param type - Typ pojazdu
 * @param destination - Nazwa miejsca docelowego
 * @returns Tekst statusu
 */
export function getMovingStatusText(type: string, destination: string): string {
  switch (type) {
    case 'plane':
      return STATUS_TEXTS.MOVING_PLANE(destination);
    case 'train':
      return STATUS_TEXTS.MOVING_TRAIN(destination);
    case 'car':
      return STATUS_TEXTS.MOVING_CAR(destination);
    default:
      return STATUS_TEXTS.MOVING_PLANE(destination);
  }
}
