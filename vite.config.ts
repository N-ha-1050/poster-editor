import { fileURLToPath, URL } from "node:url"
import type { UserConfig } from "vite"
export default {
  base: "/",
  resolve: {
    alias: {
      "monaco-editor/esm": fileURLToPath(
        new URL("./node_modules/monaco-editor/esm/", import.meta.url),
      ),
    },
  },
  optimizeDeps: {
    exclude: ["monaco-editor"],
  },
} satisfies UserConfig
