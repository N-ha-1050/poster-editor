import * as monaco from "monaco-editor"
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"
import { commands } from "./commands"

self.MonacoEnvironment = { getWorker: () => new editorWorker() }

export const createMonacoEditor = (editorDiv: HTMLDivElement) => {
  const editor = monaco.editor.create(editorDiv, {
    language: "markdown",
    automaticLayout: true,
  })

  // コマンドの登録
  commands.forEach(({ id, label, keybinding, handler }) => {
    editor.addAction({
      id,
      label,
      keybindings: [keybinding],
      run: () => handler(editor),
    })
  })

  return editor
}

export const getEditorTheme = (mediaMatches: boolean) =>
  mediaMatches ? "vs-dark" : "vs-light"

function editorInsertText(
  editor: monaco.editor.IStandaloneCodeEditor,
  text: string,
) {
  const cursorPosition = editor.getPosition()
  if (!cursorPosition) return

  const model = editor.getModel()
  if (!model) return

  const range = new monaco.Range(
    cursorPosition.lineNumber,
    cursorPosition.column,
    cursorPosition.lineNumber,
    cursorPosition.column,
  )

  const editOperation = {
    range: range,
    text: text,
    forceMoveMarkers: true,
  }

  editor.pushUndoStop()
  editor.executeEdits("insert-text", [editOperation])
  editor.pushUndoStop()
}

export function setImageDragAndDrop(
  editor: monaco.editor.IStandaloneCodeEditor,
  editorDiv: HTMLDivElement,
) {
  const dragAndDropEventNames = ["dragover", "drop"] as const
  dragAndDropEventNames.forEach((eventName) => {
    editorDiv.addEventListener(
      eventName,
      (e) => {
        e.preventDefault()
        e.stopPropagation()
      },
      false,
    )
  })

  editorDiv.addEventListener(
    "drop",
    (e) => {
      const files = e.dataTransfer?.files
      if (!files) return

      Array.from(files).forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader()
          reader.onload = (event) => {
            const result = event.target?.result
            if (typeof result !== "string") return
            const imageMarkdown = `\n![${file.name}](${result})\n`
            editorInsertText(editor, imageMarkdown)
          }
          reader.readAsDataURL(file) // ファイルを Base64 文字列として読み込み
        } else if (file.type.startsWith("text/")) {
          const reader = new FileReader()
          reader.onload = (event) => {
            const result = event.target?.result
            if (typeof result !== "string") return
            editorInsertText(editor, `${result}\n`)
          }
          reader.readAsText(file) // テキストファイルを読み込み
        }
      })
    },
    false,
  )
}
