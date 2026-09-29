import { existsSync, watch } from "node:fs"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { basename, dirname, extname, resolve } from "node:path"
import { getHtml } from "../../markdown"

export interface BuildOptions {
  output?: string
  watch?: boolean
}

export async function buildCommand(
  inputPath: string,
  options: BuildOptions = {},
) {
  const resolvedInput = resolve(process.cwd(), inputPath)

  if (!existsSync(resolvedInput)) {
    console.error(`Error: File not found: "${inputPath}"`)
    process.exit(1)
  }

  const outputFilename = options.output
    ? resolve(process.cwd(), options.output)
    : resolve(
        dirname(resolvedInput),
        `${basename(resolvedInput, extname(resolvedInput))}.html`,
      )

  async function compile(): Promise<boolean> {
    try {
      const markdown = await readFile(resolvedInput, "utf-8")
      const { html, matter } = await getHtml(markdown)

      await mkdir(dirname(outputFilename), { recursive: true })
      await writeFile(outputFilename, html, "utf-8")

      const title = matter.title || basename(resolvedInput)
      console.log(`[poster] Built "${title}" -> ${outputFilename}`)
      return true
    } catch (err) {
      console.error(
        `[poster] Build error:`,
        err instanceof Error ? err.message : err,
      )
      return false
    }
  }

  const success = await compile()
  if (!options.watch && !success) {
    process.exit(1)
  }

  if (options.watch) {
    console.log(
      `[poster] Watching "${inputPath}" for changes... (Ctrl+C to stop)`,
    )
    let debounceTimer: NodeJS.Timeout | null = null

    try {
      const watcher = watch(resolvedInput, () => {
        if (debounceTimer) clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => {
          console.log(`[poster] File changed, rebuilding...`)
          compile()
        }, 100)
      })

      process.on("SIGINT", () => {
        watcher.close()
        process.exit(0)
      })
    } catch (err) {
      console.error(
        `[poster] Failed to watch file:`,
        err instanceof Error ? err.message : err,
      )
    }
  }
}
