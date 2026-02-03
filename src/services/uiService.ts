import { Destination } from '../types/index';
import { STATUS_TEXTS, getMovingStatusText } from '../constants/mapConfig';

/**
 * Serwis odpowiedzialny za zarządzanie interfejsem użytkownika
 */
export class UIService {
  private statusElement: HTMLElement | null = null;
  private overlayElement: HTMLElement | null = null;
  private detailsCardElement: HTMLElement | null = null;
  private destImageElement: HTMLElement | null = null;
  private destTitleElement: HTMLElement | null = null;
  private destDateElement: HTMLElement | null = null;
  private destDescElement: HTMLElement | null = null;
  private videoModalElement: HTMLElement | null = null;
  private videoFrameElement: HTMLIFrameElement | null = null;
  private currentVideoUrl: string | null = null;

  /**
   * Sprawdza czy aplikacja dzia?a na urz?dzeniu mobilnym
   * @returns True je?li urz?dzenie jest mobilne
   */
  private isMobileDevice(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    const canMatchMedia = typeof window.matchMedia === 'function';
    const hasCoarsePointer = canMatchMedia && window.matchMedia('(pointer: coarse)').matches;
    const hasNoHover = canMatchMedia && window.matchMedia('(hover: none)').matches;
    const userAgent = navigator.userAgent ?? '';
    const isMobileUserAgent = /android|iphone|ipad|ipod|iemobile|opera mini/i.test(userAgent);

    return (hasCoarsePointer && hasNoHover) || isMobileUserAgent;
  }

  /**
   * Otwiera film w aplikacji YouTube na urz?dzeniach mobilnych
   * @param videoUrl - URL filmu YouTube
   */
  private openVideoInYouTubeApp(videoUrl: string): void {
    const videoId = this.extractYouTubeVideoId(videoUrl);
    const watchUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : videoUrl;

    window.location.assign(watchUrl);
  }

  /**
   * Inicjalizuje serwis UI
   */
  initialize(): void {
    this.statusElement = document.getElementById('statusText');
    this.overlayElement = document.getElementById('overlay');
    this.detailsCardElement = document.getElementById('detailsCard');
    this.destImageElement = document.getElementById('destImage');
    this.destTitleElement = document.getElementById('destTitle');
    this.destDateElement = document.getElementById('destDate');
    this.destDescElement = document.getElementById('destDesc');
    this.videoModalElement = document.getElementById('videoModal');
    this.videoFrameElement = document.getElementById('videoFrame') as HTMLIFrameElement | null;

    // Setup video modal event listeners
    this.setupVideoModalListeners();
  }

  /**
   * Konfiguruje nasłuchiwacze zdarzeń dla modala wideo
   */
  private setupVideoModalListeners(): void {
    // Close button click
    const closeButton = document.getElementById('closeVideoModal');
    if (closeButton) {
      closeButton.addEventListener('click', () => this.hideVideoModal());
    }

    // Backdrop click
    const backdrop = document.querySelector('.video-modal-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => this.hideVideoModal());
    }

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isVideoModalVisible()) {
        this.hideVideoModal();
      }
    });

    // Image click for video
    if (this.destImageElement) {
      this.destImageElement.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.currentVideoUrl) {
          this.showVideoModal(this.currentVideoUrl);
        }
      });
    }
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

    // Store video URL for modal playback
    this.currentVideoUrl = videoUrl ?? null;

    if (hasVideo && videoUrl) {
      this.destImageElement.removeAttribute('href');
      this.destImageElement.removeAttribute('target');
      this.destImageElement.removeAttribute('rel');
      this.destImageElement.setAttribute('aria-label', `Otwórz film: ${destination.name}`);
      this.destImageElement.removeAttribute('aria-disabled');
      this.destImageElement.removeAttribute('tabindex');
      this.destImageElement.style.cursor = 'pointer';
    } else {
      this.destImageElement.removeAttribute('href');
      this.destImageElement.removeAttribute('target');
      this.destImageElement.removeAttribute('rel');
      this.destImageElement.setAttribute('aria-label', `Zdjęcie miejsca: ${destination.name}`);
      this.destImageElement.setAttribute('aria-disabled', 'true');
      this.destImageElement.setAttribute('tabindex', '-1');
      this.destImageElement.style.cursor = 'default';
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
   * Pokazuje modal wideo
   * @param videoUrl - URL filmu YouTube
   */
  showVideoModal(videoUrl: string): void {
    if (this.isMobileDevice()) {
      this.openVideoInYouTubeApp(videoUrl);
      return;
    }

    if (!this.videoModalElement || !this.videoFrameElement) {
      console.error('Elementy modala wideo nie s? zainicjalizowane');
      return;
    }

    // Convert to embed URL
    const embedUrl = this.convertToEmbedUrl(videoUrl);
    if (embedUrl) {
      this.videoFrameElement.src = embedUrl;
    }

    this.videoModalElement.classList.add('active');
  }

  /**
   * Ukrywa modal wideo
   */
  hideVideoModal(): void {
    if (!this.videoModalElement || !this.videoFrameElement) {
      return;
    }

    this.videoModalElement.classList.remove('active');
    this.videoFrameElement.src = '';
  }

  /**
   * Sprawdza czy modal wideo jest widoczny
   * @returns True jeśli modal jest widoczny
   */
  isVideoModalVisible(): boolean {
    return this.videoModalElement?.classList.contains('active') ?? false;
  }

  /**
   * Konwertuje URL YouTube na URL embed
   * @param videoUrl - URL filmu YouTube
   * @returns URL embed lub null
   */
  private convertToEmbedUrl(videoUrl: string): string | null {
    const videoId = this.extractYouTubeVideoId(videoUrl);
    if (!videoId) {
      return null;
    }
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }

  /**
   * Resetuje stan UI
   */
  reset(): void {
    this.hideVideoModal();
    this.hideDetails();
    this.setDefaultStatus();
  }
}

/**
 * Singleton instancja serwisu UI
 */
export const uiService = new UIService();
