import { editor, setImageDragAndDrop } from "./editor"
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

const zoomInButton = document.getElementById("zoom-in")
const zoomOutButton = document.getElementById("zoom-out")

function setZoomButtons() {
  if (!(zoomInButton instanceof HTMLButtonElement)) return
  if (!(zoomOutButton instanceof HTMLButtonElement)) return

  if (!(previewIframe instanceof HTMLIFrameElement)) return

  const applyZoom = (factor: number) => {
    const currentTransform = previewIframe.style.transform
    const match = currentTransform.match(/scale\(([\d.]+)\)/)
    const currentScale = match ? parseFloat(match[1]) : 1
    const newScale = currentScale * factor
    previewIframe.style.transform = `scale(${newScale})`
    previewIframe.style.width = `${100 / newScale}%`
    previewIframe.style.height = `${100 / newScale}%`
  }

  zoomInButton.onclick = () => applyZoom(1.2)
  zoomOutButton.onclick = () => applyZoom(1 / 1.2)

  previewIframe.style.transformOrigin = "top left"
  previewIframe.style.transform = "scale(1)"
  previewIframe.style.width = "100%"
  previewIframe.style.height = "100%"
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
setZoomButtons()
setSaveButtons()
setImageDragAndDrop()
