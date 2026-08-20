import "monaco-editor/esm/vs/nls/lang/ja.js"
import * as monaco from "monaco-editor"
import {
  createMonacoEditor,
  getEditorTheme,
  setImageDragAndDrop,
} from "./editor"
import { getHtml } from "./markdown"
import { setPanzoom } from "./panzoom"
import { debounce, downloadFile, getTypedElementById } from "./utils"

async function update(
  editor: monaco.editor.IStandaloneCodeEditor,
  previewIframe: HTMLIFrameElement,
) {
  const value = editor.getValue()
  const { html } = await getHtml(value)
  previewIframe.srcdoc = html
}

async function setSampleContent(editor: monaco.editor.IStandaloneCodeEditor) {
  const response = await fetch("sample.md")
  const content = await response.text()
  editor.setValue(content)
}

function setTheme(media: MediaQueryList) {
  const applyTheme = (mediaMatches: boolean) => {
    monaco.editor.setTheme(getEditorTheme(mediaMatches))
  }
  applyTheme(media.matches)
  const handleMediaChange = (ev: MediaQueryListEvent) => applyTheme(ev.matches)
  media.addEventListener("change", handleMediaChange)
  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      media.removeEventListener("change", handleMediaChange)
    })
  }
}

function main() {
  const editorDiv = getTypedElementById("div", "editor")
  if (!editorDiv) return

  const previewIframe = getTypedElementById("iframe", "preview")
  if (!previewIframe) return

  const printButton = getTypedElementById("button", "print")
  if (!printButton) return

  const downloadButton = getTypedElementById("button", "download")
  if (!downloadButton) return

  const previewWrapperDiv = getTypedElementById("div", "preview-wrapper")
  if (!previewWrapperDiv) return

  const viewerDiv = getTypedElementById("div", "viewer")
  if (!viewerDiv) return

  const editor = createMonacoEditor(editorDiv)

  const params = new URLSearchParams(window.location.search)
  const isSample = params.has("sample")
  if (isSample) {
    setSampleContent(editor)
  }

  printButton.addEventListener("click", () => {
    previewIframe.contentWindow?.print()
  })
  downloadButton.addEventListener("click", async () => {
    const value = editor.getValue()
    const {
      html,
      matter: { title },
    } = await getHtml(value)
    downloadFile(`${title || "poster"}.html`, html, "text/html")
  })

  const media = window.matchMedia("(prefers-color-scheme: dark)")

  setTheme(media)
  setPanzoom(previewWrapperDiv, viewerDiv, previewIframe)
  setImageDragAndDrop(editor, editorDiv)

  const render = () => update(editor, previewIframe)
  const debouncedRender = debounce(render, 700)
  editor.onDidChangeModelContent(debouncedRender)
  render()
}

main()
