import * as monaco from "monaco-editor"
import { getHtml } from "./../markdown"
import { downloadFile, truncateWithEllipsis } from "./../utils"

export const commands = [
  {
    id: "saveLocalstorage",
    label: "ローカルストレージに保存",
    keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
    handler: (editor: monaco.editor.IStandaloneCodeEditor) => {
      const content = localStorage.getItem("content")
      const currentContent = editor.getValue()
      if (currentContent === content) return
      if (content !== null) {
        const confirmResult = confirm(
          "ローカルストレージに内容を保存しようとしています。現在のローカルストレージの内容は上書きされますが続行しますか？\n\n現在のローカルストレージの内容:\n" +
            truncateWithEllipsis(content),
        )
        if (!confirmResult) {
          return
        }
      }
      localStorage.setItem("content", currentContent)
      alert("内容をローカルストレージに保存しました。")
    },
  },
  {
    id: "loadLocalstorage",
    label: "ローカルストレージから読み込み",
    keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyO,
    handler: (editor: monaco.editor.IStandaloneCodeEditor) => {
      const content = localStorage.getItem("content")
      if (content === null) {
        alert("ローカルストレージに保存された内容が見つかりません。")
        return
      }
      const currentContent = editor.getValue()
      if (currentContent !== "" && currentContent !== content) {
        const confirmResult = confirm(
          "ローカルストレージから内容を読み込もうとしています。現在の内容は失われますが続行しますか？\n\n現在のローカルストレージの内容:\n" +
            truncateWithEllipsis(content),
        )
        if (!confirmResult) {
          return
        }
      }
      editor.setValue(content)
      alert("ローカルストレージから内容を読み込みました。")
    },
  },
  {
    id: "clearLocalstorage",
    label: "ローカルストレージをクリア",
    keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyE,
    handler: (_: monaco.editor.IStandaloneCodeEditor) => {
      const content = localStorage.getItem("content")
      if (content === null) {
        alert("ローカルストレージに保存された内容が見つかりません。")
        return
      }
      const confirmResult = confirm(
        "ローカルストレージの内容を削除しようとしています。続行しますか？\n\n現在のローカルストレージの内容:\n" +
          truncateWithEllipsis(content),
      )
      if (confirmResult) {
        localStorage.removeItem("content")
        alert("ローカルストレージの内容を削除しました。")
      }
    },
  },
  {
    id: "newFile",
    label: "新規ファイル",
    keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyM,
    handler: (editor: monaco.editor.IStandaloneCodeEditor) => {
      const currentContent = editor.getValue()
      if (currentContent !== "") {
        const confirmResult = confirm(
          "エディターの内容をリセットしようとしています。現在の内容は失われますが続行しますか？",
        )
        if (!confirmResult) {
          return
        }
      }
      editor.setValue("")
    },
  },
  {
    id: "saveFile",
    label: "ファイルを保存",
    keybinding:
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyS,
    handler: async (editor: monaco.editor.IStandaloneCodeEditor) => {
      const content = editor.getValue()
      const {
        matter: { title },
      } = await getHtml(content)
      downloadFile(`${title || "poster"}.md`, content, "text/markdown")
    },
  },
  {
    id: "loadFile",
    label: "ファイルを読み込み",
    keybinding:
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyO,
    handler: (editor: monaco.editor.IStandaloneCodeEditor) => {
      const input = document.createElement("input")
      input.type = "file"
      input.accept = ".md, .markdown, text/markdown, text/plain"
      input.onchange = (e) => {
        if (
          !e.target ||
          !(e.target instanceof HTMLInputElement) ||
          !e.target.files ||
          e.target.files.length === 0
        )
          return
        const file = e.target.files[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (e) => {
            if (!e.target) return
            const content = e.target.result
            if (!(typeof content === "string")) return
            editor.setValue(content)
          }
          reader.readAsText(file)
        }
      }
      input.click()
    },
  },
] as const satisfies readonly {
  id: string
  label: string
  keybinding: number
  handler: (editor: monaco.editor.IStandaloneCodeEditor) => void
}[]
