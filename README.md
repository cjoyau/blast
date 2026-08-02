# Blast · Blue astro theme

Production-ready theme specially designed for Business, Marketing, SaaS and Startup websites.

[![Build status](https://img.shields.io/github/actions/workflow/status/cjoyau/blast/deploy.yml)](https://github.com/cjoyau/blast/actions/workflows/deploy.yml)
[![Quality gate status](https://sonarcloud.io/api/project_badges/measure?project=cjoyau_blast&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=cjoyau_blast)
[![License](https://img.shields.io/github/license/cjoyau/blast)](./LICENSE)
[![Astro](https://img.shields.io/badge/Astro-7-BC52EE?logo=astro&logoColor=white)](https://astro.build)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.x-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Node](https://img.shields.io/badge/Node-22.12%2B-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)

## <img src="public/logo.svg" width="24" height="24" align="center" /> Key Features

* **Built with Astro 7, Tailwind CSS v4 &amp; Alpine.js**
* **7+ Pages**
* **17+ Sections**
* **Multi-language** support
* **Static site generation** (SSG) optimized
* **Content Security Policy** (CSP) enabled by default
* **Automatic sha256 hashing** of inline scripts and styles
* Clean &amp; Modern Design
* Fully Responsive
* Dark &amp; Light Mode
* Fast &amp; Performant
* Super Lightweight
* Client Router
* **Vitest** Unit Tests
* **Prettier** Code Formatter
* **Google Fonts**
* **Remix Icons**
* **Basin** Contact Form
* **Turnstile** Spam Protection

## <img src="public/logo.svg" width="24" height="24" align="center" /> Getting Started

### Requirements

* Basic knowledge of Astro, HTML and CSS.
* Text editor (We recommend Visual Studio Code)
* Node.js 22 or higher.

### Environment variables

Before you start, make sure to create a `.env` file in the root of your project and add the following environment variables:

```
BASIN_FORM_ID=<your-form-id> ①
TURNSTILE_SITEKEY=<your-sitekey> ②
```
1. Your Basin Form ID. You can find it in your [Basin dashboard](https://usebasin.com/?via=cjoyau).
2. Your Cloudflare Turnstile Site Key. You can find it in your Cloudflare dashboard.

### Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                            |
|:--------------------------|:--------------------------------------------------|
| `npm install`             | Installs dependencies                             |
| `npm run dev`             | Starts local dev server at `localhost:4321`       |
| `npm run build`           | Check and build your production site to `./dist/` |
| `npm run preview`         | Preview your build locally, before deploying      |
| `npm run test`            | Starts Vitest unit tests                          |
| `npm run test:coverage`   | Run Vitest unit tests with v8 code coverage       |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check`  |
| `npm run astro -- --help` | Get help using the Astro CLI                      |

## <img src="public/logo.svg" width="24" height="24" align="center" /> Project Structure

Inside the project, you’ll see the following folders and files:

```
/ 📒
├── 📂 src/ ①
│   ├── 📂 assets/ ②
│   │   └── 📂 icons/ ③
│   ├── 📂 components/ ④
│   ├── 📂 i18n/ ⑤
│   ├── 📂 layouts/ ⑥
│   ├── 📂 pages/ ⑦
│   ├── 📂 scripts/
│   │   └── 📄 entrypoint.ts ⑧
│   ├── 📂 styles/
│   │   └── 📄 global.css ⑨
│   └── 📂 tests/ ⑩
├── 📂 public/ ⑪
├── 📄 .prettierrc ⑫
├── 📄 astro.config.mjs ⑬
├── 📄 package-lock.json
├── 📄 package.json ⑭
├── 📄 README.md
├── 📄 tsconfig.json ⑮
└── 📄 vitest.config.ts ⑯
```
1. Project source code (components, pages, …)
2. Any processed assets (images, svgs, …)
3. Remix icons used as SVG components.
4. Reusable Astro components used to build pages.
5. Internationalization files that contain the translations of the textual content of the site.
6. Astro components that define the UI structure shared by one or more pages.
7. Astro components used to create new pages on your site. Each page is exposed as a route based on its file name.
8. Alpine.js entrypoint.
9. Tailwind configuration file. The theme section is where you define your color palette and fonts.
10. Tests (Vitest unit tests for components, …)
11. Any static assets (images, fonts, icons, …)
12. Prettier configuration file.
13. Astro configuration file.
14. File used by JavaScript package managers to manage your dependencies. It also defines the scripts that are commonly used to run Astro.
15. TypeScript configuration file.
16. Vitest configuration file.

## <img src="public/logo.svg" width="24" height="24" align="center" /> Deployment

Ready to build and deploy your site? Follow the [official documentation](https://docs.astro.build/en/guides/deploy/).

## <img src="public/logo.svg" width="24" height="24" align="center" /> License

This project is licensed under the terms of the MIT license.
