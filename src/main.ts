import { editor, setImageDragAndDrop } from "./editor"
import { setPanzoom } from "./panzoom"
import { getHtml } from "./poster/markdown"
import { debounce } from "./utils"

const previewIframe = document.getElementById("preview")

async function update() {
  if (!(previewIframe instanceof HTMLIFrameElement)) return

  const value = editor.getValue()
  const { html } = await getHtml(value)
  previewIframe.srcdoc = html
}

const debouncedUpdate = debounce(update, 700)
editor.on("change", debouncedUpdate)

const printButton = document.getElementById("print")
const downloadButton = document.getElementById("download")

function setSaveButtons() {
  if (!(printButton instanceof HTMLButtonElement)) return
  if (!(downloadButton instanceof HTMLButtonElement)) return

  printButton.onclick = () => {
    if (!(previewIframe instanceof HTMLIFrameElement)) return
    previewIframe.contentWindow?.print()
  }

  downloadButton.onclick = async () => {
    const value = editor.getValue()
    const {
      html,
      matter: { title },
    } = await getHtml(value)
    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title || "poster"}.html`
    a.click()
    URL.revokeObjectURL(url)
  }
}

update()
setPanzoom()
setSaveButtons()
setImageDragAndDrop()
