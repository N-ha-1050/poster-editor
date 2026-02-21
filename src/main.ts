import { editor, setImageDragAndDrop } from "./editor"
import { getHtml } from "./markdown"
import { debounce } from "./utils"

const viewerIframe = document.getElementById("preview")

async function update() {
  if (!(viewerIframe instanceof HTMLIFrameElement)) return

  const value = editor.getValue()
  const { html } = await getHtml(value)
  viewerIframe.srcdoc = html
}

const debouncedUpdate = debounce(update, 700)
editor.on("change", debouncedUpdate)

const zoomInButton = document.getElementById("zoom-in")
const zoomOutButton = document.getElementById("zoom-out")

function setZoomButtons() {
  if (!(zoomInButton instanceof HTMLButtonElement)) return
  if (!(zoomOutButton instanceof HTMLButtonElement)) return

  if (!(viewerIframe instanceof HTMLIFrameElement)) return

  const applyZoom = (factor: number) => {
    const currentTransform = viewerIframe.style.transform
    const match = currentTransform.match(/scale\(([\d.]+)\)/)
    const currentScale = match ? parseFloat(match[1]) : 1
    const newScale = currentScale * factor
    viewerIframe.style.transform = `scale(${newScale})`
    viewerIframe.style.width = `${100 / newScale}%`
    viewerIframe.style.height = `${100 / newScale}%`
  }

  zoomInButton.onclick = () => applyZoom(1.2)
  zoomOutButton.onclick = () => applyZoom(1 / 1.2)

  viewerIframe.style.transformOrigin = "top left"
  viewerIframe.style.transform = "scale(1)"
  viewerIframe.style.width = "100%"
  viewerIframe.style.height = "100%"
}

const printButton = document.getElementById("print")
const downloadButton = document.getElementById("download")

function setSaveButtons() {
  if (!(printButton instanceof HTMLButtonElement)) return
  if (!(downloadButton instanceof HTMLButtonElement)) return

  printButton.onclick = () => {
    if (!(viewerIframe instanceof HTMLIFrameElement)) return
    viewerIframe.contentWindow?.print()
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
