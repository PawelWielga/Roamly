/**
 * Główny plik wejściowy aplikacji Roamly
 * Inicjalizuje aplikację po załadowaniu DOM
 */

import { app } from './app/app';

/**
 * Interfejs rozszerzający Window
 */
interface RoamlyWindow extends Window {
  roamlyApp?: typeof app;
}

/**
 * Funkcja inicjalizująca aplikację
 */
async function initializeApp(): Promise<void> {
  try {
    await app.initialize('map');
  } catch (error) {
    console.error('Krytyczny błąd podczas inicjalizacji aplikacji:', error);
  }
}

/**
 * Uruchamia aplikację po załadowaniu DOM
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  // DOM jest już załadowany
  initializeApp();
}

// Eksportuj aplikację dla celów deweloperskich
if (typeof window !== 'undefined') {
  (window as RoamlyWindow).roamlyApp = app;
}
