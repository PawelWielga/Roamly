import { VehicleIcon, VehicleType } from '../types/index';

/**
 * Stałe SVG dla ikon pojazdów
 */
export const VEHICLE_ICONS: Record<VehicleType, VehicleIcon> = {
  plane: {
    type: 'plane',
    svg: `<svg class="vehicle-icon-svg" width="30" height="30" viewBox="0 0 24 24" fill="#1F6F8B" xmlns="http://www.w3.org/2000/svg"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>`,
    color: '#1F6F8B',
  },
  train: {
    type: 'train',
    svg: `<svg class="vehicle-icon-svg" width="30" height="30" viewBox="0 0 24 24" fill="#E76F51" xmlns="http://www.w3.org/2000/svg"><path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-6H7V6h4v5zm5 6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1-6h-4V6h4v5z"/></svg>`,
    color: '#E76F51',
    dashArray: '5, 10',
  },
  car: {
    type: 'car',
    svg: `<svg class="vehicle-icon-svg" width="30" height="30" viewBox="0 0 24 24" fill="#6B8E6E" xmlns="http://www.w3.org/2000/svg"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42.99L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>`,
    color: '#6B8E6E',
    dashArray: '5, 10',
  },
};

/**
 * Funkcja pomocnicza do pobrania ikony pojazdu
 * @param type - Typ pojazdu
 * @returns Obiekt ikony pojazdu
 */
export function getVehicleIcon(type: VehicleType): VehicleIcon {
  return VEHICLE_ICONS[type];
}

/**
 * Funkcja pomocnicza do pobrania SVG pojazdu
 * @param type - Typ pojazdu
 * @returns Ciąg SVG
 */
export function getVehicleSvg(type: VehicleType): string {
  return VEHICLE_ICONS[type].svg;
}

/**
 * Funkcja pomocnicza do pobrania koloru pojazdu
 * @param type - Typ pojazdu
 * @returns Kolor w formacie hex
 */
export function getVehicleColor(type: VehicleType): string {
  return VEHICLE_ICONS[type].color;
}

/**
 * Funkcja pomocnicza do pobrania wzorca linii przerywanej
 * @param type - Typ pojazdu
 * @returns Wzorzec linii lub null
 */
export function getVehicleDashArray(type: VehicleType): string | null {
  return VEHICLE_ICONS[type].dashArray || null;
}
