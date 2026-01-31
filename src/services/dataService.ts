import { Destination, DestinationsData } from '../types/index';

/**
 * Serwis odpowiedzialny za ładowanie i zarządzanie danymi podróży
 */
export class DataService {
  private destinations: Destination[] = [];
  private isLoaded = false;

  /**
   * Ładuje dane z pliku JSON
   * @param url - URL do pliku JSON
   * @returns Promise z tablicą miejsc docelowych
   */
  async loadDestinations(url: string = '/destinations.json'): Promise<Destination[]> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: DestinationsData = await response.json();
      this.destinations = data.destinations;
      this.isLoaded = true;
      return this.destinations;
    } catch (error) {
      console.error('Błąd podczas ładowania danych:', error);
      throw error;
    }
  }

  /**
   * Pobiera wszystkie załadowane miejsca docelowe
   * @returns Tablica miejsc docelowych
   */
  getDestinations(): Destination[] {
    if (!this.isLoaded) {
      throw new Error('Dane nie zostały jeszcze załadowane');
    }
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
   * Pobiera miejsca docelowe po typie środka transportu
   * @param type - Typ środka transportu
   * @returns Tablica miejsc docelowych
   */
  getDestinationsByType(type: string): Destination[] {
    return this.destinations.filter((dest) => dest.type === type);
  }

  /**
   * Sprawdza czy dane zostały załadowane
   * @returns True jeśli dane są załadowane
   */
  hasLoadedData(): boolean {
    return this.isLoaded;
  }

  /**
   * Dodaje nowe miejsce docelowe
   * @param destination - Miejsce docelowe do dodania
   */
  addDestination(destination: Destination): void {
    this.destinations.push(destination);
  }

  /**
   * Usuwa miejsce docelowe po ID
   * @param id - ID miejsca docelowego do usunięcia
   * @returns True jeśli miejsce zostało usunięte
   */
  removeDestination(id: number): boolean {
    const index = this.destinations.findIndex((dest) => dest.id === id);
    if (index !== -1) {
      this.destinations.splice(index, 1);
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
      return destination;
    }
    return undefined;
  }
}

/**
 * Singleton instancja serwisu danych
 */
export const dataService = new DataService();
