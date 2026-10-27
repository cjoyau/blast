import { defineConfig, fontProviders } from 'astro/config';
import alpinejs from '@astrojs/alpinejs';
import sitemap from '@astrojs/sitemap';
import compress from '@playform/compress';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';
import { defaultLocale, locales, prefixDefaultLocale } from '@i18n/utils';

const { FORM_ENDPOINT, TURNSTILE_SITEKEY } = loadEnv(process.env.NODE_ENV, process.cwd(), '');

if (!FORM_ENDPOINT || !TURNSTILE_SITEKEY) {
  console.log(
    '\x1b[33mPlease setup required environment variables. Here is a sample .env file:\x1b[0m\n\n' +
      '\x1b[38;2;139;148;158m# https://docs.usebasin.com/getting-started/quickstart/#step-2-get-your-form-endpoint\x1b[0m\n' +
      '\x1b[38;2;255;166;87mFORM_ENDPOINT\x1b[0m=\x1b[38;2;187;190;191mhttps://usebasin.com/f/your-form-endpoint\x1b[0m\n' +
      '\x1b[38;2;139;148;158m# https://developers.cloudflare.com/turnstile/troubleshooting/testing/\x1b[0m\n' +
      '\x1b[38;2;255;166;87mTURNSTILE_SITEKEY\x1b[0m=\x1b[38;2;187;190;191m1x00000000000000000000AA\x1b[0m\n'
  );
  process.exit(1);
}

const formEndpointOrigin = new URL(FORM_ENDPOINT).origin;

// https://astro.build/config
export default defineConfig({
  site: 'https://cjoyau.github.io',
  base: '/blast/',

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
        resources: ["'self'", 'https://challenges.cloudflare.com/'],
        hashes: [
          'sha256-QdsQr8DYqqAbXiHb2YTZ0RKtdorAfl82xF9ul9WqSOE=', // All pages
          'sha256-AhGOxzJqJwRvnqrHXGGHOAboYLUDRi5UY2RXZQCouYI=', // index
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
        "img-src 'self'",
        "font-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        `form-action 'self' ${formEndpointOrigin}/`,
        `connect-src 'self' ${formEndpointOrigin}/`,
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
