import { defineConfig } from "astro/config";
import expressiveCode from "astro-expressive-code";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: 'static',
  site: "https://ambraglow.org",
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
        allowedHosts: ['ambraglow.org'],
        port: 3000
    },
  }
});
