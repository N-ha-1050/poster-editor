import { builtinModules } from "node:module"
import { resolve } from "node:path"
import { defineConfig } from "vite"

export default defineConfig({
  build: {
    target: "node18",
    ssr: true,
    lib: {
      entry: resolve(__dirname, "src/cli/index.ts"),
      formats: ["es"],
      fileName: () => "cli.js",
    },
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      external: [...builtinModules, ...builtinModules.map((m) => `node:${m}`)],
      output: {
        entryFileNames: "cli.js",
        banner: "#!/usr/bin/env node\n",
      },
    },
  },
})
