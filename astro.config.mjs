import { defineConfig, fontProviders } from 'astro/config';
import alpinejs from '@astrojs/alpinejs';
import sitemap from '@astrojs/sitemap';
import compress from '@playform/compress';
import tailwindcss from '@tailwindcss/vite';
import { defaultLocale, locales, prefixDefaultLocale } from './src/i18n/utils';

// https://astro.build/config
export default defineConfig({
  site: 'https://cjoyau.github.io',
  base: '/blast',

  fonts: [
    {
      name: 'Inter',
      cssVariable: '--font-inter',
      provider: fontProviders.fontsource(),
      weights: [400, 500, 700],
      styles: ['normal'],
    },
  ],

  i18n: {
    defaultLocale,
    locales,
    routing: {
      prefixDefaultLocale,
    },
  },

  image: {
    responsiveStyles: false,
  },

  integrations: [
    alpinejs({
      entrypoint: '/src/scripts/entrypoint',
    }),
    sitemap({
      i18n: {
        defaultLocale,
        locales: Object.fromEntries(locales.map((locale) => [locale, locale])),
      },
    }),
    compress({
      CSS: false,
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: false,
      JSON: false,
      SVG: true,
    }),
  ],

  security: {
    csp: {
      scriptDirective: {
        resources: ["'self'", 'data:', 'https://challenges.cloudflare.com/'],
        hashes: [
          'sha256-QdsQr8DYqqAbXiHb2YTZ0RKtdorAfl82xF9ul9WqSOE=', // All pages
          'sha256-wXiZn4o8arGWMd4cs1l9VEsNNHx4JWn/vzB8pa3dXRA=', // index
        ],
      },
      styleDirective: {
        resources: ["'self'"],
        hashes: [
          'sha256-/fWDvP/zU3HvBkNs4SJCgtfIW+buR1Is+LtIxjWEFpw=', // All pages
        ],
      },
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self' https://usebasin.com/",
        "connect-src 'self' https://usebasin.com/",
        "frame-src 'self' https://challenges.cloudflare.com/",
        'upgrade-insecure-requests',
      ],
    },
  },

  markdown: {
    syntaxHighlight: 'prism',
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        alpinejs: '@alpinejs/csp',
      },
    },
  },
});
