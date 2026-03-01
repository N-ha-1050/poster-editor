import ace, { type Editor } from "ace-builds"
import { downloadFile, truncateWithEllipsis } from "./utils"
import "ace-builds/src-noconflict/mode-markdown"
import "ace-builds/src-noconflict/theme-github"
import "ace-builds/src-noconflict/keybinding-vscode"
import { getHtml } from "./poster/markdown"

export const editor = ace.edit("editor", {
  mode: "ace/mode/markdown",
  useSoftTabs: true,
})

editor.setTheme("ace/theme/github")
editor.setKeyboardHandler("ace/keyboard/vscode")

editor.commands.addCommand({
  name: "saveLocalstorage",
  bindKey: { win: "Ctrl-S", mac: "Command-S" },
  exec: (editor: Editor) => {
    const content = localStorage.getItem("content")
    const currentContent = editor.getValue()
    if (currentContent !== content) {
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
    }
  },
  readOnly: true,
})
editor.commands.addCommand({
  name: "loadLocalstorage",
  bindKey: { win: "Ctrl-O", mac: "Command-O" },
  exec: (editor: Editor) => {
    const content = localStorage.getItem("content")
    if (content !== null) {
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
      editor.setValue(content, -1)
      alert("ローカルストレージから内容を読み込みました。")
    } else {
      alert("ローカルストレージに保存された内容が見つかりません。")
    }
  },
  readOnly: false,
})
editor.commands.addCommand({
  name: "clearLocalstorage",
  bindKey: { win: "Ctrl-E", mac: "Command-E" },
  exec: () => {
    const content = localStorage.getItem("content")
    if (content !== null) {
      const confirmResult = confirm(
        "ローカルストレージの内容を削除しようとしています。続行しますか？\n\n現在のローカルストレージの内容:\n" +
          truncateWithEllipsis(content),
      )
      if (confirmResult) {
        localStorage.removeItem("content")
        alert("ローカルストレージの内容を削除しました。")
      }
    } else {
      alert("ローカルストレージに保存された内容が見つかりません。")
    }
  },
  readOnly: true,
})
editor.commands.addCommand({
  name: "newFile",
  bindKey: { win: "Ctrl-M", mac: "Command-M" },
  exec: (editor: Editor) => {
    const currentContent = editor.getValue()
    if (currentContent !== "") {
      const confirmResult = confirm(
        "エディターの内容をリセットしようとしています。現在の内容は失われますが続行しますか？",
      )
      if (!confirmResult) {
        return
      }
    }
    editor.setValue("", -1)
  },
  readOnly: false,
})
editor.commands.addCommand({
  name: "saveFile",
  bindKey: { win: "Ctrl-Shift-S", mac: "Command-Shift-S" },
  exec: async (editor: Editor) => {
    const content = editor.getValue()
    const {
      matter: { title },
    } = await getHtml(content)
    downloadFile(`${title || "poster"}.md`, content, "text/markdown")
  },
  readOnly: false,
})
editor.commands.addCommand({
  name: "loadFile",
  bindKey: { win: "Ctrl-Shift-O", mac: "Command-Shift-O" },
  exec: (editor: Editor) => {
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
          editor.setValue(content, -1)
        }
        reader.readAsText(file)
      }
    }
    input.click()
  },
})

const editorDiv = document.getElementById("editor")
const dragAndDropEventNames = ["dragover", "drop"]

export function setImageDragAndDrop() {
  if (!editorDiv) return

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
      const dt = e.dataTransfer

      if (dt?.files && dt.files.length > 0) {
        Array.from(dt.files).forEach((file) => {
          if (file.type.startsWith("image/")) {
            const reader = new FileReader()
            reader.onload = (event) => {
              if (!event.target) return
              const base64Data = event.target.result
              const imageMarkdown = `\n![${file.name}](${base64Data})\n`

              const cursor = editor.getCursorPosition()
              editor.session.insert(cursor, imageMarkdown)
            }
            reader.readAsDataURL(file) // ファイルを Base64 文字列として読み込み
          } else if (file.type.startsWith("text/")) {
            const reader = new FileReader()
            reader.onload = (event) => {
              if (!event.target) return
              const textData = event.target.result
              const cursor = editor.getCursorPosition()
              editor.session.insert(cursor, `${textData}\n`)
            }
            reader.readAsText(file) // テキストファイルを読み込み
          }
        })
      }
    },
    false,
  )
}
