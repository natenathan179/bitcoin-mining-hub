// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          // Large content datasets are shared by several routes, so Rollup would
          // otherwise hoist them into the entry chunk every visitor downloads.
          // Pinning them to their own chunks keeps the first page load small.
          manualChunks(id: string) {
            if (id.includes("src/lib/blog-index")) return "data-blog-index";
            if (id.includes("src/lib/blog-match")) return "data-blog-index";
            if (id.includes("src/lib/page-copy")) return "data-page-copy";
            if (id.includes("src/lib/marketplace")) return "data-marketplace";
            return undefined;
          },
        },
      },
    },
  },
});
