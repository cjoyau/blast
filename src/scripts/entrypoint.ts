import type { Alpine } from 'alpinejs';
import type { ThemeStore, LanguageStore } from './types';
import collapse from '@alpinejs/collapse';
import contactForm from './contact-form';
import dnaBackground from './dna-background';
import { defaultLocale, locales } from '@i18n/utils';

const base = import.meta.env.BASE_URL;

const entrypoint = (Alpine: Alpine) => {
  Alpine.plugin(collapse);
  Alpine.plugin(contactForm);
  Alpine.plugin(dnaBackground);

  Alpine.data('accordion', () => ({
    selected: null as number | null,
    toggle(value: number) {
      this.selected = this.selected === value ? null : value;
    },
  }));

  Alpine.data('accordionItem', (id: number) => ({
    id,
    isOpen(this: { id: number; selected: number | null }): boolean {
      return this.id === this.selected;
    },
    isNextOpen(this: { id: number; selected: number | null }): boolean {
      return this.id + 1 === this.selected;
    },
  }));

  Alpine.data('typewriter', (interval: number, max: number) => ({
    timer: null as ReturnType<typeof setInterval> | null,
    i: 0,
    interval,
    max,
    start() {
      this.timer = setInterval(() => {
        if (this.i < this.max) {
          this.i += this.interval;
        } else {
          clearInterval(this.timer!);
        }
      }, this.interval);
    },
  }));

  const themeStore: ThemeStore = {
    isDark: false,

    init() {
      this.isDark = document.documentElement.classList.contains('dark');
    },

    toggle() {
      this.isDark = !this.isDark;
      if (this.isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
    },
  };

  Alpine.store('theme', themeStore);

  const languageStore: LanguageStore = {
    lang: defaultLocale,

    init() {
      const pathLocale = globalThis.location.pathname.replace(base, '/').split('/')[1];
      this.lang = pathLocale && locales.includes(pathLocale) ? pathLocale : defaultLocale;
    },

    setLang(lang: string) {
      this.lang = lang;
      localStorage.setItem('language', this.lang);
    },
  };

  Alpine.store('language', languageStore);
};

export default entrypoint;
