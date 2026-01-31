import { Destination, FilterState, VehicleType } from '../types/index';

/**
 * Typ callbacka dla zmiany filtrów
 */
type FilterChangeCallback = (filteredDestinations: Destination[]) => void;

/**
 * Serwis odpowiedzialny za zarządzanie panelem filtrów i logiką filtrowania
 */
export class FilterService {
  private destinations: Destination[] = [];
  private filterState: FilterState = { years: [], vehicleTypes: [] };
  private isPanelCollapsed = false;
  private filterChangeCallback: FilterChangeCallback | null = null;

  private filterPanelElement: HTMLElement | null = null;
  private yearFiltersElement: HTMLElement | null = null;
  private vehicleFiltersElement: HTMLElement | null = null;
  private toggleFilterBtnElement: HTMLElement | null = null;
  private toggleIconElement: HTMLElement | null = null;
  private resetFiltersBtnElement: HTMLElement | null = null;

  /**
   * Inicjalizuje serwis filtrów
   */
  initialize(): void {
    this.filterPanelElement = document.getElementById('filterPanel');
    this.yearFiltersElement = document.getElementById('yearFilters');
    this.vehicleFiltersElement = document.getElementById('vehicleFilters');
    this.toggleFilterBtnElement = document.getElementById('toggleFilterBtn');
    this.toggleIconElement = document.getElementById('toggleIcon');
    this.resetFiltersBtnElement = document.getElementById('resetFiltersBtn');

    this.setupEventListeners();
  }

  /**
   * Ustawia dane miejsc docelowych i buduje panel filtrów
   * @param destinations - Tablica miejsc docelowych
   */
  setDestinations(destinations: Destination[]): void {
    this.destinations = destinations;
    this.buildFilterPanel();
  }

  /**
   * Buduje panel filtrów na podstawie dostępnych danych
   */
  private buildFilterPanel(): void {
    if (!this.yearFiltersElement || !this.vehicleFiltersElement) {
      console.error('Elementy panelu filtrów nie są zainicjalizowane');
      return;
    }

    // Pobierz unikalne lata
    const years = this.extractYears(this.destinations);

    // Pobierz dostępne typy pojazdów
    const vehicleTypes: VehicleType[] = ['plane', 'train', 'car'];

    // Buduj checkboxy dla lat
    this.yearFiltersElement.innerHTML = '';
    years.forEach((year) => {
      const checkbox = this.createCheckbox(`year-${year}`, year, 'year', year);
      this.yearFiltersElement.appendChild(checkbox);
    });

    // Buduj checkboxy dla typów pojazdów
    this.vehicleFiltersElement.innerHTML = '';
    vehicleTypes.forEach((type) => {
      const label = this.getVehicleTypeLabel(type);
      const icon = this.getVehicleTypeIcon(type);
      const checkbox = this.createCheckbox(`vehicle-${type}`, `${icon} ${label}`, 'vehicle', type);
      this.vehicleFiltersElement.appendChild(checkbox);
    });
  }

  /**
   * Tworzy element checkboxa
   */
  private createCheckbox(
    id: string,
    label: string,
    filterType: 'year' | 'vehicle',
    value: string
  ): HTMLElement {
    const container = document.createElement('div');
    container.className = 'filter-checkbox';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = id;
    checkbox.className = 'filter-checkbox-input';
    checkbox.dataset.filterType = filterType;
    checkbox.dataset.value = value;

    const labelElement = document.createElement('label');
    labelElement.htmlFor = id;
    labelElement.className = 'filter-checkbox-label';
    labelElement.textContent = label;

    container.appendChild(checkbox);
    container.appendChild(labelElement);

    return container;
  }

  /**
   * Pobiera etykietę dla typu pojazdu
   */
  private getVehicleTypeLabel(type: VehicleType): string {
    const labels: Record<VehicleType, string> = {
      plane: 'Samolot',
      train: 'Pociąg',
      car: 'Samochód',
    };
    return labels[type];
  }

  /**
   * Pobiera ikonę dla typu pojazdu
   */
  private getVehicleTypeIcon(type: VehicleType): string {
    const icons: Record<VehicleType, string> = {
      plane: '✈️',
      train: '🚆',
      car: '🚗',
    };
    return icons[type];
  }

  /**
   * Pobiera unikalne lata z danych
   */
  private extractYears(destinations: Destination[]): string[] {
    const years = destinations
      .map((dest) => {
        const match = dest.date.match(/\d{4}/);
        return match ? match[0] : '';
      })
      .filter((year) => year !== '');
    return [...new Set(years)].sort();
  }

  /**
   * Konfiguruje nasłuchiwacze zdarzeń
   */
  private setupEventListeners(): void {
    // Obsługa checkboxów
    document.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.classList.contains('filter-checkbox-input')) {
        this.handleFilterChange(target);
      }
    });

    // Obsługa przycisku zwijania/rozwijania
    this.toggleFilterBtnElement?.addEventListener('click', () => {
      this.togglePanel();
    });

    // Obsługa przycisku resetowania
    this.resetFiltersBtnElement?.addEventListener('click', () => {
      this.resetFilters();
    });
  }

  /**
   * Obsługuje zmianę filtra
   */
  private handleFilterChange(checkbox: HTMLInputElement): void {
    const filterType = checkbox.dataset.filterType as 'year' | 'vehicle';
    const value = checkbox.dataset.value;

    if (!filterType || !value) return;

    if (filterType === 'year') {
      if (checkbox.checked) {
        this.filterState.years.push(value);
      } else {
        this.filterState.years = this.filterState.years.filter((y) => y !== value);
      }
    } else if (filterType === 'vehicle') {
      if (checkbox.checked) {
        this.filterState.vehicleTypes.push(value as VehicleType);
      } else {
        this.filterState.vehicleTypes = this.filterState.vehicleTypes.filter((t) => t !== value);
      }
    }

    this.applyFilters();
  }

  /**
   * Aplikuje filtry i wywołuje callback
   */
  private applyFilters(): void {
    const filtered = this.filterDestinations(this.destinations, this.filterState);
    this.filterChangeCallback?.(filtered);
  }

  /**
   * Filtruje miejsca docelowe (logika AND)
   */
  private filterDestinations(destinations: Destination[], filters: FilterState): Destination[] {
    return destinations.filter((dest) => {
      const yearMatch =
        filters.years.length === 0 || filters.years.some((year) => dest.date.includes(year));
      const vehicleMatch =
        filters.vehicleTypes.length === 0 || filters.vehicleTypes.includes(dest.type);
      return yearMatch && vehicleMatch;
    });
  }

  /**
   * Przełącza widoczność panelu
   */
  private togglePanel(): void {
    this.isPanelCollapsed = !this.isPanelCollapsed;

    if (this.filterPanelElement) {
      if (this.isPanelCollapsed) {
        this.filterPanelElement.classList.add('collapsed');
      } else {
        this.filterPanelElement.classList.remove('collapsed');
      }
    }

    if (this.toggleIconElement) {
      this.toggleIconElement.textContent = this.isPanelCollapsed ? '▶' : '◀';
    }
  }

  /**
   * Resetuje wszystkie filtry
   */
  private resetFilters(): void {
    this.filterState = { years: [], vehicleTypes: [] };

    // Odznacz wszystkie checkboxy
    const checkboxes = document.querySelectorAll('.filter-checkbox-input');
    checkboxes.forEach((checkbox) => {
      (checkbox as HTMLInputElement).checked = false;
    });

    this.applyFilters();
  }

  /**
   * Ustawia callback dla zmiany filtrów
   * @param callback - Funkcja wywoływana przy zmianie filtrów
   */
  onFilterChange(callback: FilterChangeCallback): void {
    this.filterChangeCallback = callback;
  }

  /**
   * Pobiera aktualny stan filtrów
   * @returns Aktualny stan filtrów
   */
  getFilterState(): FilterState {
    return { ...this.filterState };
  }

  /**
   * Sprawdza czy panel jest zwinięty
   * @returns True jeśli panel jest zwinięty
   */
  isCollapsed(): boolean {
    return this.isPanelCollapsed;
  }

  /**
   * Resetuje stan serwisu
   */
  reset(): void {
    this.filterState = { years: [], vehicleTypes: [] };
    this.isPanelCollapsed = false;
    this.filterChangeCallback = null;
  }
}

/**
 * Singleton instancja serwisu filtrów
 */
export const filterService = new FilterService();
