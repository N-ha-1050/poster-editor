import { editor, setImageDragAndDrop } from "./editor"
import { setPanzoom } from "./panzoom"
import { getHtml } from "./poster/markdown"
import { debounce, downloadFile } from "./utils"

const previewIframe = document.getElementById("preview")

async function update() {
  if (!(previewIframe instanceof HTMLIFrameElement)) return

  const value = editor.getValue()
  const { html } = await getHtml(value)
  previewIframe.srcdoc = html
}

const debouncedUpdate = debounce(update, 700)
editor.on("change", debouncedUpdate)

const params = new URLSearchParams(window.location.search)
const isSample = params.has("sample")

if (isSample) {
  const response = await fetch("sample.md")
  const content = await response.text()
  editor.setValue(content, -1)
}

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
    downloadFile(`${title || "poster"}.html`, html, "text/html")
  }
}

update()
setPanzoom()
setSaveButtons()
setImageDragAndDrop()
