import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

import react from "@astrojs/react";

import sentry from "@sentry/astro";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), sitemap(), react(), sentry(
    {
      dsn: "https://60ca35c87961d415f39b0eb74f994e7e@o4508535276568576.ingest.us.sentry.io/4508535283122178",
      sourceMapsUploadOptions: {
        project: "javascript-astro",
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
    }
  )]
});