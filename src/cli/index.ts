import { cac } from "cac"
import { buildCommand } from "./commands/build"
import { previewCommand } from "./commands/preview"

const cli = cac("poster")

cli
  .command("build <file>", "Compile markdown to poster HTML")
  .option("-o, --output <path>", "Output file path")
  .option("-w, --watch", "Watch file for changes and recompile")
  .action(
    async (file: string, options: { output?: string; watch?: boolean }) => {
      await buildCommand(file, options)
    },
  )

cli
  .command("preview <file>", "Start local preview server with auto-reload")
  .alias("dev")
  .option("-p, --port <port>", "Server port (default: 3000)")
  .action(async (file: string, options: { port?: string | number }) => {
    const port = options.port ? Number(options.port) : 3000
    await previewCommand(file, { port })
  })

cli
  .command("[file]", "Compile markdown to poster HTML (shorthand)")
  .option("-o, --output <path>", "Output file path")
  .option("-w, --watch", "Watch file for changes and recompile")
  .action(
    async (file?: string, options?: { output?: string; watch?: boolean }) => {
      if (!file) {
        cli.outputHelp()
        return
      }
      await buildCommand(file, options)
    },
  )

cli.help()
cli.version("0.0.0")

cli.parse()
