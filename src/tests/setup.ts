/**
 * Plik konfiguracyjny dla testów Vitest
 * Ustawia środowisko testowe i mocki
 */

import { vi } from 'vitest';

// Mock Leaflet
vi.mock('leaflet', () => ({
  default: {
    map: vi.fn(() => ({
      setView: vi.fn(),
      fitBounds: vi.fn(),
      flyToBounds: vi.fn(),
      flyTo: vi.fn(),
      on: vi.fn(),
      once: vi.fn(),
      off: vi.fn(),
      remove: vi.fn(),
      removeLayer: vi.fn(),
    })),
    tileLayer: vi.fn(() => ({
      addTo: vi.fn(),
    })),
    marker: vi.fn(() => ({
      addTo: vi.fn(),
      setLatLng: vi.fn(),
      getElement: vi.fn(),
      on: vi.fn(),
    })),
    polyline: vi.fn(() => ({
      addTo: vi.fn(),
      setLatLngs: vi.fn(),
    })),
    latLngBounds: vi.fn(() => ({
      extend: vi.fn(),
    })),
    divIcon: vi.fn(),
  },
}));

// Mock fetch global
globalThis.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        destinations: [],
      }),
  })
) as unknown as typeof fetch;

// Mock requestAnimationFrame
globalThis.requestAnimationFrame = vi.fn((cb: FrameRequestCallback) => setTimeout(cb, 16));
globalThis.cancelAnimationFrame = vi.fn();

// Mock performance.now
globalThis.performance = {
  ...globalThis.performance,
  now: vi.fn(() => Date.now()),
};

// Mock DOM elements
document.getElementById = vi.fn(() => {
  const mockElement = {
    style: {},
    textContent: '',
    addEventListener: vi.fn(),
    querySelector: vi.fn(),
    classList: {
      add: vi.fn(),
      remove: vi.fn(),
    },
  };
  return mockElement as unknown as HTMLElement;
});

// Mock document.readyState
Object.defineProperty(document, 'readyState', {
  value: 'complete',
  writable: true,
});
