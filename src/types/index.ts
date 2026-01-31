/**
 * Typy środków transportu dostępnych w aplikacji
 */
export type VehicleType = 'plane' | 'train' | 'car';

/**
 * Interfejs reprezentujący cel podróży
 */
export interface Destination {
  /** Unikalny identyfikator */
  id: number;
  /** Typ środka transportu */
  type: VehicleType;
  /** Współrzędne punktu startowego [szerokość, długość] */
  start: [number, number];
  /** Nazwa miejsca docelowego */
  name: string;
  /** Współrzędne miejsca docelowego [szerokość, długość] */
  coords: [number, number];
  /** Data podróży */
  date: string;
  /** Opis miejsca */
  description: string;
  /** URL obrazka miejsca */
  imageUrl: string;
}

/**
 * Interfejs reprezentujący dane z pliku JSON
 */
export interface DestinationsData {
  destinations: Destination[];
}

/**
 * Interfejs reprezentujący punkt na mapie
 */
export interface LatLng {
  lat: number;
  lng: number;
}

/**
 * Interfejs reprezentujący granice mapy
 */
export interface MapBounds {
  northEast: LatLng;
  southWest: LatLng;
}

/**
 * Interfejs reprezentujący konfigurację mapy
 */
export interface MapConfig {
  center: [number, number];
  zoom: number;
  minZoom: number;
  markerZoomAnimation: boolean;
}

/**
 * Interfejs reprezentujący konfigurację animacji pojazdu
 */
export interface AnimationConfig {
  duration: number;
  steps: number;
  curveFactor?: number;
}

/**
 * Interfejs reprezentujący ikonę pojazdu
 */
export interface VehicleIcon {
  type: VehicleType;
  svg: string;
  color: string;
  dashArray?: string;
}

/**
 * Interfejs reprezentujący stan aplikacji
 */
export interface AppState {
  isMoving: boolean;
  currentDestination: Destination | null;
  statusText: string;
}

/**
 * Interfejs reprezentujący opcje zoomu mapy
 */
export interface ZoomOptions {
  padding?: [number, number];
  duration?: number;
  easeLinearity?: number;
}

/**
 * Interfejs reprezentujący opcje trasy
 */
export interface PathOptions {
  color: string;
  weight: number;
  opacity: number;
  lineJoin: 'round' | 'bevel' | 'miter';
  dashArray?: string | null;
}

/**
 * Interfejs reprezentujący stan filtrów
 */
export interface FilterState {
  years: string[];
  vehicleTypes: VehicleType[];
}

/**
 * Interfejs reprezentujący opcje filtrów
 */
export interface FilterOptions {
  years: string[];
  vehicleTypes: VehicleType[];
}
