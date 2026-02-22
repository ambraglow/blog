import { defineConfig } from "astro/config";
import expressiveCode from "astro-expressive-code";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://blog.ambraglow.org",
  integrations: [expressiveCode(), mdx(), sitemap(), tailwind()],
  security: {
    allowedDomains: [
      {
        hostname: 'ambraglow.org',
        protocol: 'https'
      },
    ]
  },
  vite: {
    server: {
        allowedHosts: ['ambraglow.org']
    },
  }
});