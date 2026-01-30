/**
 * Testy jednostkowe dla DataService
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DataService } from '../services/dataService.js';
import { Destination } from '../types/index.js';

describe('DataService', () => {
  let dataService: DataService;
  const mockDestinations: Destination[] = [
    {
      id: 1,
      type: 'plane',
      start: [52.1672, 20.9679],
      name: 'Valletta, Malta',
      coords: [35.8989, 14.5146],
      date: 'Sierpień 2023',
      description: 'Słoneczna wyspa pełna historii.',
      imageUrl: 'https://example.com/image.jpg',
    },
    {
      id: 2,
      type: 'train',
      start: [53.7784, 20.4801],
      name: 'Kraków, Polska',
      coords: [50.0647, 19.945],
      date: 'Październik 2024',
      description: 'Podróż pociągiem PKP Intercity.',
      imageUrl: 'https://example.com/image2.jpg',
    },
  ];

  beforeEach(() => {
    dataService = new DataService();
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ destinations: mockDestinations }),
      })
    ) as unknown as typeof fetch;
  });

  describe('loadDestinations', () => {
    it('powinien załadować dane z pliku JSON', async () => {
      const result = await dataService.loadDestinations('/test/data.json');
      expect(result).toEqual(mockDestinations);
      expect(dataService.hasLoadedData()).toBe(true);
    });

    it('powinien rzucić błąd gdy odpowiedź nie jest OK', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
        })
      ) as unknown as typeof fetch;

      await expect(dataService.loadDestinations('/test/data.json')).rejects.toThrow();
    });

    it('powinien użyć domyślnego URL gdy nie podano', async () => {
      await dataService.loadDestinations();
      expect(global.fetch).toHaveBeenCalledWith('/src/data/destinations.json');
    });
  });

  describe('getDestinations', () => {
    it('powinien zwrócić wszystkie miejsca docelowe', async () => {
      await dataService.loadDestinations();
      const result = dataService.getDestinations();
      expect(result).toEqual(mockDestinations);
    });

    it('powinien rzucić błąd gdy dane nie są załadowane', () => {
      expect(() => dataService.getDestinations()).toThrow('Dane nie zostały jeszcze załadowane');
    });
  });

  describe('getDestinationById', () => {
    it('powinien zwrócić miejsce docelowe po ID', async () => {
      await dataService.loadDestinations();
      const result = dataService.getDestinationById(1);
      expect(result).toEqual(mockDestinations[0]);
    });

    it('powinien zwrócić undefined gdy ID nie istnieje', async () => {
      await dataService.loadDestinations();
      const result = dataService.getDestinationById(999);
      expect(result).toBeUndefined();
    });
  });

  describe('getDestinationsByType', () => {
    it('powinien zwrócić miejsca docelowe po typie', async () => {
      await dataService.loadDestinations();
      const result = dataService.getDestinationsByType('plane');
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('plane');
    });

    it('powinien zwrócić pustą tablicę gdy brak miejsc danego typu', async () => {
      await dataService.loadDestinations();
      const result = dataService.getDestinationsByType('car');
      expect(result).toHaveLength(0);
    });
  });

  describe('addDestination', () => {
    it('powinien dodać nowe miejsce docelowe', async () => {
      await dataService.loadDestinations();
      const newDestination: Destination = {
        id: 3,
        type: 'car',
        start: [50.0, 20.0],
        name: 'Warszawa, Polska',
        coords: [52.2297, 21.0122],
        date: 'Styczeń 2025',
        description: 'Stolica Polski.',
        imageUrl: 'https://example.com/image3.jpg',
      };

      dataService.addDestination(newDestination);
      const result = dataService.getDestinations();
      expect(result).toHaveLength(3);
      expect(result[2]).toEqual(newDestination);
    });
  });

  describe('removeDestination', () => {
    it('powinien usunąć miejsce docelowe po ID', async () => {
      await dataService.loadDestinations();
      const result = dataService.removeDestination(1);
      expect(result).toBe(true);
      expect(dataService.getDestinations()).toHaveLength(1);
    });

    it('powinien zwrócić false gdy ID nie istnieje', async () => {
      await dataService.loadDestinations();
      const result = dataService.removeDestination(999);
      expect(result).toBe(false);
    });
  });

  describe('updateDestination', () => {
    it('powinien zaktualizować miejsce docelowe', async () => {
      await dataService.loadDestinations();
      const result = dataService.updateDestination(1, { name: 'Zaktualizowana nazwa' });
      expect(result?.name).toBe('Zaktualizowana nazwa');
    });

    it('powinien zwrócić undefined gdy ID nie istnieje', async () => {
      await dataService.loadDestinations();
      const result = dataService.updateDestination(999, { name: 'Test' });
      expect(result).toBeUndefined();
    });
  });
});
