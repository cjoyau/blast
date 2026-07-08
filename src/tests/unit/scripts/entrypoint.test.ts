import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import entrypoint from '@scripts/entrypoint';

const base = import.meta.env.BASE_URL;

const mockAlpine = {
  plugin: vi.fn(),
  data: vi.fn(),
  store: vi.fn(),
};

describe('entrypoint', () => {
  let originalLocation: any;
  let originalNavigator: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock localStorage
    const mockStorage: Record<string, string> = {};
    Object.defineProperty(globalThis, 'localStorage', {
      value: {
        getItem: vi.fn((key) => mockStorage[key] || null),
        setItem: vi.fn((key, value) => {
          mockStorage[key] = value.toString();
        }),
      },
      writable: true,
    });

    // Mock location
    originalLocation = globalThis.location;
    Object.defineProperty(globalThis, 'location', {
      value: { pathname: '/', replace: vi.fn() },
      writable: true,
    });

    // Mock navigator
    originalNavigator = globalThis.navigator;
    Object.defineProperty(globalThis, 'navigator', {
      value: { language: 'en-US' },
      writable: true,
    });
  });

  afterEach(() => {
    globalThis.location = originalLocation;
    globalThis.navigator = originalNavigator;
  });

  it('registers plugins, data, and stores', () => {
    entrypoint(mockAlpine as any);
    expect(mockAlpine.plugin).toHaveBeenCalled();
    expect(mockAlpine.data).toHaveBeenCalledWith('accordion', expect.any(Function));
    expect(mockAlpine.data).toHaveBeenCalledWith('accordionItem', expect.any(Function));
    expect(mockAlpine.data).toHaveBeenCalledWith('typewriter', expect.any(Function));
    expect(mockAlpine.store).toHaveBeenCalledWith('theme', expect.any(Object));
    expect(mockAlpine.store).toHaveBeenCalledWith('language', expect.any(Object));
  });

  describe('accordion data', () => {
    it('toggles selected value', () => {
      entrypoint(mockAlpine as any);
      const dataCall = mockAlpine.data.mock.calls.find((call: any) => call[0] === 'accordion');
      const getAccordionData = dataCall?.[1];
      const accordion = getAccordionData();

      expect(accordion.selected).toBe(null);

      accordion.toggle(1);
      expect(accordion.selected).toBe(1);

      accordion.toggle(1);
      expect(accordion.selected).toBe(null);

      accordion.toggle(2);
      expect(accordion.selected).toBe(2);
    });
  });

  describe('accordionItem data', () => {
    it('checks if open or next open', () => {
      entrypoint(mockAlpine as any);
      const dataCall = mockAlpine.data.mock.calls.find((call: any) => call[0] === 'accordionItem');
      const getAccordionItemData = dataCall?.[1];
      const item1 = getAccordionItemData(1);

      item1.selected = 1;
      expect(item1.isOpen()).toBe(true);
      expect(item1.isNextOpen()).toBe(false);

      item1.selected = 2;
      expect(item1.isOpen()).toBe(false);
      expect(item1.isNextOpen()).toBe(true);

      item1.selected = 3;
      expect(item1.isOpen()).toBe(false);
      expect(item1.isNextOpen()).toBe(false);
    });
  });

  describe('typewriter data', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it('increments internal state based on interval', () => {
      entrypoint(mockAlpine as any);
      const dataCall = mockAlpine.data.mock.calls.find((call: any) => call[0] === 'typewriter');
      const getTypewriterData = dataCall?.[1];
      const typewriter = getTypewriterData(10, 20);

      expect(typewriter.i).toBe(0);
      typewriter.start();

      vi.advanceTimersByTime(10);
      expect(typewriter.i).toBe(10);

      vi.advanceTimersByTime(10);
      expect(typewriter.i).toBe(20);

      vi.advanceTimersByTime(10);
      expect(typewriter.i).toBe(20); // Stops incrementing

      expect(typewriter.timer).not.toBeNull();
    });
  });

  describe('ThemeStore', () => {
    let originalDocument: any;

    beforeEach(() => {
      originalDocument = globalThis.document;
      const classes = new Set<string>();
      (globalThis as any).document = {
        documentElement: {
          classList: {
            add: vi.fn((cls: string) => classes.add(cls)),
            remove: vi.fn((cls: string) => classes.delete(cls)),
            contains: vi.fn((cls: string) => classes.has(cls)),
          },
        },
      };
    });

    afterEach(() => {
      globalThis.document = originalDocument;
    });

    it('initializes dark theme from HTML classList', () => {
      entrypoint(mockAlpine as any);
      const themeStoreCall = mockAlpine.store.mock.calls.find((call: any) => call[0] === 'theme');
      const themeStore = themeStoreCall?.[1];

      document.documentElement.classList.add('dark');
      themeStore.init();

      expect(themeStore.isDark).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(globalThis.localStorage.setItem).not.toHaveBeenCalled();
    });

    it('toggles theme', () => {
      entrypoint(mockAlpine as any);
      const themeStoreCall = mockAlpine.store.mock.calls.find((call: any) => call[0] === 'theme');
      const themeStore = themeStoreCall?.[1];

      themeStore.isDark = false;
      themeStore.toggle();
      expect(themeStore.isDark).toBe(true);
      expect(globalThis.localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
      themeStore.toggle();
      expect(themeStore.isDark).toBe(false);
      expect(globalThis.localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
    });

    it('syncs HTML classList on initialization when light mode', () => {
      entrypoint(mockAlpine as any);
      const themeStoreCall = mockAlpine.store.mock.calls.find((call: any) => call[0] === 'theme');
      const themeStore = themeStoreCall?.[1];

      document.documentElement.classList.remove('dark');
      themeStore.init();

      expect(themeStore.isDark).toBe(false);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
      expect(globalThis.localStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('LanguageStore', () => {
    it('initializes language from path locale if supported', () => {
      entrypoint(mockAlpine as any);
      const langStoreCall = mockAlpine.store.mock.calls.find((call: any) => call[0] === 'language');
      const langStore = langStoreCall?.[1];

      globalThis.location.pathname = `${base}fr/about/`;

      langStore.init();
      expect(langStore.lang).toBe('fr');
      expect(globalThis.localStorage.setItem).not.toHaveBeenCalled();
    });

    it('uses default locale if path locale is unsupported', () => {
      entrypoint(mockAlpine as any);
      const langStoreCall = mockAlpine.store.mock.calls.find((call: any) => call[0] === 'language');
      const langStore = langStoreCall?.[1];

      globalThis.location.pathname = `${base}es/about/`;

      langStore.init();
      expect(langStore.lang).toBe('en');
      expect(globalThis.localStorage.setItem).not.toHaveBeenCalled();
    });

    it('uses default locale on root path', () => {
      entrypoint(mockAlpine as any);
      const langStoreCall = mockAlpine.store.mock.calls.find((call: any) => call[0] === 'language');
      const langStore = langStoreCall?.[1];

      globalThis.location.pathname = `${base}`;

      langStore.init();
      expect(langStore.lang).toBe('en');
      expect(globalThis.localStorage.setItem).not.toHaveBeenCalled();
    });

    it('sets language', () => {
      entrypoint(mockAlpine as any);
      const langStoreCall = mockAlpine.store.mock.calls.find((call: any) => call[0] === 'language');
      const langStore = langStoreCall?.[1];

      langStore.setLang('fr');
      expect(langStore.lang).toBe('fr');
      expect(globalThis.localStorage.setItem).toHaveBeenCalledWith('language', 'fr');
    });
  });
});
