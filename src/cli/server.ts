import { createReadStream, existsSync, statSync, watch } from "node:fs"
import { readFile } from "node:fs/promises"
import { createServer, type ServerResponse } from "node:http"
import { basename, dirname, extname, join, resolve } from "node:path"
import { getHtml } from "../markdown"

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
}

const RELOAD_SCRIPT = `
<script>
(() => {
  const es = new EventSource('/_reload');
  es.onmessage = (event) => {
    if (event.data === 'reload') {
      window.location.reload();
    }
  };
  es.onerror = () => {
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };
})();
</script>
`

export interface ServerOptions {
  port?: number
}

export function startPreviewServer(
  inputPath: string,
  options: ServerOptions = {},
) {
  const resolvedInput = resolve(process.cwd(), inputPath)

  if (!existsSync(resolvedInput)) {
    console.error(`Error: File not found: "${inputPath}"`)
    process.exit(1)
  }

  const baseDir = dirname(resolvedInput)
  const port = options.port || 3000
  const clients = new Set<ServerResponse>()

  function notifyClients() {
    for (const client of clients) {
      try {
        client.write("data: reload\n\n")
      } catch {
        clients.delete(client)
      }
    }
  }

  // Watch markdown file for live reload
  let debounceTimer: NodeJS.Timeout | null = null
  const watcher = watch(resolvedInput, () => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      console.log(
        `[poster] "${basename(resolvedInput)}" modified, reloading preview...`,
      )
      notifyClients()
    }, 100)
  })

  const server = createServer(async (req, res) => {
    const url = new URL(req.url || "/", `http://localhost:${port}`)
    const pathname = decodeURIComponent(url.pathname)

    // SSE reload endpoint
    if (pathname === "/_reload") {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      })
      res.write("\n")
      clients.add(res)
      req.on("close", () => {
        clients.delete(res)
      })
      return
    }

    // Main poster page
    if (pathname === "/" || pathname === "/index.html") {
      try {
        const markdown = await readFile(resolvedInput, "utf-8")
        const { html } = await getHtml(markdown)
        const injectedHtml = html.includes("</body>")
          ? html.replace("</body>", `${RELOAD_SCRIPT}</body>`)
          : `${html}${RELOAD_SCRIPT}`

        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
        res.end(injectedHtml)
      } catch (err) {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" })
        res.end(
          `Build error:\n${err instanceof Error ? err.stack || err.message : String(err)}`,
        )
      }
      return
    }

    // Static asset serving relative to markdown directory
    const safePath = join(baseDir, pathname.replace(/^\/+/, ""))
    // Prevent directory traversal
    if (!safePath.startsWith(baseDir)) {
      res.writeHead(403, { "Content-Type": "text/plain" })
      res.end("Forbidden")
      return
    }

    if (existsSync(safePath) && statSync(safePath).isFile()) {
      const ext = extname(safePath).toLowerCase()
      const contentType = MIME_TYPES[ext] || "application/octet-stream"
      res.writeHead(200, { "Content-Type": contentType })
      createReadStream(safePath).pipe(res)
      return
    }

    res.writeHead(404, { "Content-Type": "text/plain" })
    res.end("Not Found")
  })

  server.listen(port, () => {
    console.log(`
  🚀 Poster Preview Server running at:
     > Local: http://localhost:${port}/

  👀 Watching "${inputPath}" (Press Ctrl+C to stop)
`)
  })

  process.on("SIGINT", () => {
    watcher.close()
    server.close()
    process.exit(0)
  })
}
