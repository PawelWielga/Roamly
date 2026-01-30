import { Destination, VehicleType } from '../types/index';
import { DEFAULT_ANIMATION_CONFIG } from '../constants/mapConfig';
import { getVehicleSvg, getVehicleColor, getVehicleDashArray } from '../constants/vehicleIcons';
import { mapService } from './mapService';

/**
 * Serwis odpowiedzialny za animację pojazdów na mapie
 */
export class AnimationService {
  private isAnimating = false;
  private animationFrameId: number | null = null;
  private currentDestination: Destination | null = null;

  /**
   * Sprawdza czy animacja jest w toku
   * @returns True jeśli animacja jest w toku
   */
  isAnimatingNow(): boolean {
    return this.isAnimating;
  }

  /**
   * Pobiera aktualnie animowane miejsce docelowe
   * @returns Aktualne miejsce docelowe lub null
   */
  getCurrentDestination(): Destination | null {
    return this.currentDestination;
  }

  /**
   * Oblicza punkty ścieżki między dwoma punktami
   * @param start - Punkt startowy [szerokość, długość]
   * @param end - Punkt końcowy [szerokość, długość]
   * @param type - Typ środka transportu
   * @param steps - Liczba kroków
   * @returns Tablica punktów ścieżki
   */
  calculatePathPoints(
    start: [number, number],
    end: [number, number],
    type: VehicleType,
    steps: number = DEFAULT_ANIMATION_CONFIG.steps
  ): [number, number][] {
    const points: [number, number][] = [];

    for (let i = 0; i <= steps; i++) {
      const f = i / steps;
      let lat = start[0] + (end[0] - start[0]) * f;
      const lng = start[1] + (end[1] - start[1]) * f;

      // Dodaj krzywiznę dla samolotów
      if (type === 'plane') {
        const curveFactor = (end[1] - start[1]) * (DEFAULT_ANIMATION_CONFIG.curveFactor || 0.15);
        const offset = Math.sin(Math.PI * f) * curveFactor;
        lat += offset;
      }

      points.push([lat, lng]);
    }

    return points;
  }

  /**
   * Oblicza rotację między dwoma punktami
   * @param p1 - Pierwszy punkt [szerokość, długość]
   * @param p2 - Drugi punkt [szerokość, długość]
   * @returns Kąt rotacji w stopniach
   */
  calculateRotation(p1: [number, number], p2: [number, number]): number {
    const dy = p2[0] - p1[0];
    const dx = p2[1] - p1[1];
    return 90 - (Math.atan2(dy, dx) * 180) / Math.PI;
  }

  /**
   * Rozpoczyna animację podróży
   * @param destination - Miejsce docelowe
   * @param onComplete - Funkcja wywoływana po zakończeniu animacji
   * @param onProgress - Funkcja wywoływana przy każdym kroku animacji
   */
  startAnimation(
    destination: Destination,
    onComplete: () => void,
    onProgress?: (progress: number) => void
  ): void {
    if (this.isAnimating) {
      console.warn('Animacja jest już w toku');
      return;
    }

    this.isAnimating = true;
    this.currentDestination = destination;

    // Wyczyść poprzednią trasę
    mapService.clearRoute();

    // Oblicz punkty ścieżki
    const pathPoints = this.calculatePathPoints(
      destination.start,
      destination.coords,
      destination.type
    );

    // Utwórz linię trasy
    const color = getVehicleColor(destination.type);
    const dashArray = getVehicleDashArray(destination.type);
    mapService.createPath(color, dashArray);

    // Utwórz znacznik pojazdu
    const iconHtml = getVehicleSvg(destination.type);
    mapService.createVehicleMarker(destination.start, iconHtml);

    // Rozpocznij animację
    this.animateVehicle(pathPoints, DEFAULT_ANIMATION_CONFIG.duration, onComplete, onProgress);
  }

  /**
   * Animuje pojazd wzdłuż ścieżki
   * @param pathPoints - Punkty ścieżki
   * @param duration - Czas trwania animacji w ms
   * @param onComplete - Funkcja wywoływana po zakończeniu
   * @param onProgress - Funkcja wywoływana przy każdym kroku
   */
  private animateVehicle(
    pathPoints: [number, number][],
    duration: number,
    onComplete: () => void,
    onProgress?: (progress: number) => void
  ): void {
    const startTime = performance.now();

    const animate = (currentTime: number): void => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Oblicz aktualną pozycję
      const floatIdx = progress * (pathPoints.length - 1);
      const idx1 = Math.floor(floatIdx);
      const idx2 = Math.min(idx1 + 1, pathPoints.length - 1);
      const subProgress = floatIdx - idx1;

      const p1 = pathPoints[idx1];
      const p2 = pathPoints[idx2];

      if (p1 && p2) {
        // Interpoluj pozycję
        const currentPos: [number, number] = [
          p1[0] + (p2[0] - p1[0]) * subProgress,
          p1[1] + (p2[1] - p1[1]) * subProgress,
        ];

        // Aktualizuj pozycję pojazdu
        mapService.updateVehiclePosition(currentPos);

        // Aktualizuj rotację
        const rotation = this.calculateRotation(p1, p2);
        mapService.updateVehicleRotation(rotation);

        // Aktualizuj ścieżkę
        const pathToUpdate = pathPoints.slice(0, idx1 + 1).concat([currentPos]);
        mapService.updatePath(pathToUpdate);

        // Wywołaj callback postępu
        if (onProgress) {
          onProgress(progress);
        }
      }

      // Kontynuuj lub zakończ animację
      if (progress < 1) {
        this.animationFrameId = requestAnimationFrame(animate);
      } else {
        this.finishAnimation(onComplete);
      }
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  /**
   * Kończy animację
   * @param onComplete - Funkcja wywoływana po zakończeniu
   */
  private finishAnimation(onComplete: () => void): void {
    this.isAnimating = false;
    this.animationFrameId = null;

    // Dodaj animację lądowania
    mapService.addLandingAnimation();

    // Wywołaj callback po krótkim opóźnieniu
    setTimeout(() => {
      onComplete();
    }, 500);
  }

  /**
   * Anuluje aktualną animację
   */
  cancelAnimation(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.isAnimating = false;
    this.currentDestination = null;
  }

  /**
   * Resetuje stan serwisu
   */
  reset(): void {
    this.cancelAnimation();
    this.currentDestination = null;
  }
}

/**
 * Singleton instancja serwisu animacji
 */
export const animationService = new AnimationService();
