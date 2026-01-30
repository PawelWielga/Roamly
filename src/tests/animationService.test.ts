/**
 * Testy jednostkowe dla AnimationService
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AnimationService } from '../services/animationService';
import { Destination } from '../types/index';
import { mapService } from '../services/mapService';

// Mock mapService
vi.mock('../services/mapService.js', () => ({
  mapService: {
    clearRoute: vi.fn(),
    createPath: vi.fn(),
    createVehicleMarker: vi.fn(),
    updateVehiclePosition: vi.fn(),
    updateVehicleRotation: vi.fn(),
    updatePath: vi.fn(),
    addLandingAnimation: vi.fn(),
  },
}));

describe('AnimationService', () => {
  let animationService: AnimationService;
  const mockDestination: Destination = {
    id: 1,
    type: 'plane',
    start: [52.1672, 20.9679],
    name: 'Valletta, Malta',
    coords: [35.8989, 14.5146],
    date: 'Sierpień 2023',
    description: 'Słoneczna wyspa pełna historii.',
    imageUrl: 'https://example.com/image.jpg',
  };

  beforeEach(() => {
    animationService = new AnimationService();
    vi.clearAllMocks();
  });

  describe('isAnimatingNow', () => {
    it('powinien zwrócić false na początku', () => {
      expect(animationService.isAnimatingNow()).toBe(false);
    });
  });

  describe('getCurrentDestination', () => {
    it('powinien zwrócić null na początku', () => {
      expect(animationService.getCurrentDestination()).toBeNull();
    });
  });

  describe('calculatePathPoints', () => {
    it('powinien obliczyć punkty ścieżki dla samolotu', () => {
      const points = animationService.calculatePathPoints(
        [52.1672, 20.9679],
        [35.8989, 14.5146],
        'plane',
        10
      );
      expect(points).toHaveLength(11);
      expect(points[0]).toEqual([52.1672, 20.9679]);
      expect(points[10]).toEqual([35.8989, 14.5146]);
    });

    it('powinien obliczyć punkty ścieżki dla pociągu', () => {
      const points = animationService.calculatePathPoints(
        [53.7784, 20.4801],
        [50.0647, 19.945],
        'train',
        10
      );
      expect(points).toHaveLength(11);
    });

    it('powinien dodać krzywiznę dla samolotu', () => {
      const pointsPlane = animationService.calculatePathPoints(
        [52.1672, 20.9679],
        [35.8989, 14.5146],
        'plane',
        10
      );
      const pointsTrain = animationService.calculatePathPoints(
        [52.1672, 20.9679],
        [35.8989, 14.5146],
        'train',
        10
      );
      // Środkowe punkty dla samolotu powinny mieć inną szerokość geograficzną
      expect(pointsPlane[5][0]).not.toBe(pointsTrain[5][0]);
    });
  });

  describe('calculateRotation', () => {
    it('powinien obliczyć rotację między punktami', () => {
      const rotation = animationService.calculateRotation([52.0, 20.0], [51.0, 21.0]);
      expect(typeof rotation).toBe('number');
    });

    it('powinien zwrócić 90 dla identycznych punktów', () => {
      const rotation = animationService.calculateRotation([52.0, 20.0], [52.0, 20.0]);
      expect(rotation).toBe(90);
    });
  });

  describe('startAnimation', () => {
    it('powinien rozpocząć animację', () => {
      const onComplete = vi.fn();
      animationService.startAnimation(mockDestination, onComplete);
      expect(animationService.isAnimatingNow()).toBe(true);
      expect(mapService.clearRoute).toHaveBeenCalled();
    });

    it('nie powinien rozpocząć nowej animacji jeśli jest już w toku', () => {
      const onComplete = vi.fn();
      animationService.startAnimation(mockDestination, onComplete);
      const onComplete2 = vi.fn();
      animationService.startAnimation(mockDestination, onComplete2);
      expect(onComplete2).not.toHaveBeenCalled();
    });
  });

  describe('cancelAnimation', () => {
    it('powinien anulować animację', () => {
      const onComplete = vi.fn();
      animationService.startAnimation(mockDestination, onComplete);
      animationService.cancelAnimation();
      expect(animationService.isAnimatingNow()).toBe(false);
    });
  });

  describe('reset', () => {
    it('powinien zresetować stan serwisu', () => {
      const onComplete = vi.fn();
      animationService.startAnimation(mockDestination, onComplete);
      animationService.reset();
      expect(animationService.isAnimatingNow()).toBe(false);
      expect(animationService.getCurrentDestination()).toBeNull();
    });
  });
});
