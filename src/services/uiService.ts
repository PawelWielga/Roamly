import { Destination } from '../types/index';
import { STATUS_TEXTS, getMovingStatusText } from '../constants/mapConfig';

/**
 * Serwis odpowiedzialny za zarządzanie interfejsem użytkownika
 */
export class UIService {
  private statusElement: HTMLElement | null = null;
  private overlayElement: HTMLElement | null = null;
  private detailsCardElement: HTMLElement | null = null;
  private destImageElement: HTMLAnchorElement | null = null;
  private destTitleElement: HTMLElement | null = null;
  private destDateElement: HTMLElement | null = null;
  private destDescElement: HTMLElement | null = null;

  /**
   * Inicjalizuje serwis UI
   */
  initialize(): void {
    this.statusElement = document.getElementById('statusText');
    this.overlayElement = document.getElementById('overlay');
    this.detailsCardElement = document.getElementById('detailsCard');
    this.destImageElement = document.getElementById('destImage') as HTMLAnchorElement | null;
    this.destTitleElement = document.getElementById('destTitle');
    this.destDateElement = document.getElementById('destDate');
    this.destDescElement = document.getElementById('destDesc');
  }

  /**
   * Aktualizuje tekst statusu
   * @param text - Nowy tekst statusu
   */
  updateStatus(text: string): void {
    if (this.statusElement) {
      this.statusElement.textContent = text;
    }
  }

  /**
   * Ustawia tekst statusu na stan domyślny
   */
  setDefaultStatus(): void {
    this.updateStatus(STATUS_TEXTS.IDLE);
  }

  /**
   * Ustawia tekst statusu przygotowania
   * @param destination - Nazwa miejsca docelowego
   */
  setPreparingStatus(destination: string): void {
    this.updateStatus(STATUS_TEXTS.PREPARING(destination));
  }

  /**
   * Ustawia tekst statusu podczas ruchu
   * @param type - Typ pojazdu
   * @param destination - Nazwa miejsca docelowego
   */
  setMovingStatus(type: string, destination: string): void {
    this.updateStatus(getMovingStatusText(type, destination));
  }

  /**
   * Ustawia tekst statusu po dotarciu do celu
   * @param destination - Nazwa miejsca docelowego
   */
  setArrivedStatus(destination: string): void {
    this.updateStatus(STATUS_TEXTS.ARRIVED(destination));
  }

  /**
   * Pokazuje kartę szczegółów
   * @param destination - Miejsce docelowe
   */
  showDetails(destination: Destination): void {
    if (
      !this.destImageElement ||
      !this.destTitleElement ||
      !this.destDateElement ||
      !this.destDescElement
    ) {
      console.error('Elementy UI nie są zainicjalizowane');
      return;
    }

    this.destTitleElement.textContent = destination.name;
    this.destDateElement.textContent = destination.date;
    this.destDescElement.textContent = destination.description;
    const videoUrl = destination.videoUrl?.trim();
    const imageUrl = destination.imageUrl?.trim();
    const thumbnailUrl = videoUrl ? this.getYouTubeThumbnailUrl(videoUrl) : null;
    const backgroundUrl = imageUrl || thumbnailUrl;

    if (backgroundUrl) {
      this.destImageElement.style.backgroundImage = `url(${backgroundUrl})`;
    } else {
      this.destImageElement.style.backgroundImage = 'none';
    }

    const hasVideo = Boolean(videoUrl);
    this.destImageElement.classList.toggle('dest-image--video', hasVideo);

    if (hasVideo && videoUrl) {
      this.destImageElement.href = videoUrl;
      this.destImageElement.target = '_blank';
      this.destImageElement.rel = 'noopener noreferrer';
      this.destImageElement.setAttribute(
        'aria-label',
        `Otworz film na YouTube: ${destination.name}`
      );
      this.destImageElement.removeAttribute('aria-disabled');
      this.destImageElement.removeAttribute('tabindex');
    } else {
      this.destImageElement.removeAttribute('href');
      this.destImageElement.removeAttribute('target');
      this.destImageElement.removeAttribute('rel');
      this.destImageElement.setAttribute('aria-label', `Zdjecie miejsca: ${destination.name}`);
      this.destImageElement.setAttribute('aria-disabled', 'true');
      this.destImageElement.setAttribute('tabindex', '-1');
    }

    this.showOverlay();
    this.showDetailsCard();
  }

  /**
   * Buduje URL miniaturki YouTube dla podanego linku
   * @param videoUrl - Link do filmu
   * @returns URL miniaturki lub null
   */
  private getYouTubeThumbnailUrl(videoUrl: string): string | null {
    const videoId = this.extractYouTubeVideoId(videoUrl);
    if (!videoId) {
      return null;
    }

    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }

  /**
   * Wydobywa ID filmu z URL YouTube
   * @param videoUrl - Link do filmu
   * @returns ID filmu lub null
   */
  private extractYouTubeVideoId(videoUrl: string): string | null {
    try {
      const url = new URL(videoUrl);
      const hostname = url.hostname.replace('www.', '').toLowerCase();

      if (hostname === 'youtu.be') {
        const id = url.pathname.split('/').filter(Boolean)[0];
        return id ?? null;
      }

      if (hostname.endsWith('youtube.com') || hostname === 'youtube-nocookie.com') {
        const vParam = url.searchParams.get('v');
        if (vParam) {
          return vParam;
        }

        const pathParts = url.pathname.split('/').filter(Boolean);
        const section = pathParts[0];
        const id = pathParts[1];

        if (section === 'embed' || section === 'shorts' || section === 'live') {
          return id ?? null;
        }
      }
    } catch (error) {
      return null;
    }

    return null;
  }

  /**
   * Ukrywa kartę szczegółów
   */
  hideDetails(): void {
    this.hideOverlay();
    this.hideDetailsCard();
  }

  /**
   * Pokazuje nakładkę
   */
  private showOverlay(): void {
    if (this.overlayElement) {
      this.overlayElement.style.display = 'block';
    }
  }

  /**
   * Ukrywa nakładkę
   */
  private hideOverlay(): void {
    if (this.overlayElement) {
      this.overlayElement.style.display = 'none';
    }
  }

  /**
   * Pokazuje kartę szczegółów
   */
  private showDetailsCard(): void {
    if (this.detailsCardElement) {
      this.detailsCardElement.style.display = 'block';
    }
  }

  /**
   * Ukrywa kartę szczegółów
   */
  private hideDetailsCard(): void {
    if (this.detailsCardElement) {
      this.detailsCardElement.style.display = 'none';
    }
  }

  /**
   * Sprawdza czy karta szczegółów jest widoczna
   * @returns True jeśli karta jest widoczna
   */
  isDetailsVisible(): boolean {
    return this.detailsCardElement?.style.display === 'block';
  }

  /**
   * Dodaje nasłuchiwacz kliknięcia na nakładkę
   * @param handler - Funkcja obsługująca kliknięcie
   */
  onOverlayClick(handler: () => void): void {
    this.overlayElement?.addEventListener('click', handler);
  }

  /**
   * Dodaje nasłuchiwacz kliknięcia na przycisk zamknięcia
   * @param handler - Funkcja obsługująca kliknięcie
   */
  onCloseButtonClick(handler: () => void): void {
    const closeButton = document.querySelector('#detailsCard button');
    if (closeButton) {
      closeButton.addEventListener('click', handler);
    }
  }

  /**
   * Pokazuje wskaźnik ładowania
   */
  showLoading(): void {
    this.updateStatus('⏳ Ładowanie danych...');
  }

  /**
   * Pokazuje komunikat o błędzie
   * @param message - Komunikat błędu
   */
  showError(message: string): void {
    this.updateStatus(`❌ ${message}`);
  }

  /**
   * Resetuje stan UI
   */
  reset(): void {
    this.hideDetails();
    this.setDefaultStatus();
  }
}

/**
 * Singleton instancja serwisu UI
 */
export const uiService = new UIService();







