import { type ServerOptions, startPreviewServer } from "../server"

export interface PreviewOptions extends ServerOptions {}

export async function previewCommand(
  inputPath: string,
  options: PreviewOptions = {},
) {
  startPreviewServer(inputPath, options)
}
