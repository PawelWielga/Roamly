import { VehicleIcon, VehicleType } from '../types/index';

/**
 * Stałe HTML dla ikon pojazdów
 */
export const VEHICLE_ICONS: Record<VehicleType, VehicleIcon> = {
  plane: {
    type: 'plane',
    svg: `<img class="vehicle-icon-svg" src="/plane.png" alt="" />`,
    color: '#1F6F8B',
  },
  train: {
    type: 'train',
    svg: `<img class="vehicle-icon-svg" src="/train.png" alt="" />`,
    color: '#E76F51',
    dashArray: '5, 10',
  },
  car: {
    type: 'car',
    svg: `<img class="vehicle-icon-svg" src="/car.png" alt="" />`,
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
 * Funkcja pomocnicza do pobrania HTML ikony pojazdu
 * @param type - Typ pojazdu
 * @returns Ciąg HTML
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
