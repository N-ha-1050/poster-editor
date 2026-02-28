import Panzoom from "@panzoom/panzoom"

const previewWrapperDiv = document.getElementById("preview-wrapper")
const viewerDiv = document.getElementById("viewer")
const previewIframe = document.getElementById("preview")

export function setPanzoom() {
  if (!(previewWrapperDiv instanceof HTMLDivElement)) return
  if (!(viewerDiv instanceof HTMLDivElement)) return
  if (!(previewIframe instanceof HTMLIFrameElement)) return

  const panzoom = Panzoom(previewWrapperDiv, {
    canvas: true,
    maxScale: 32,
    minScale: 1 / 32,
    step: 1 / 8,
  })
  viewerDiv.addEventListener("wheel", panzoom.zoomWithWheel)

  // iframeのコンテンツが読み込まれたら実行
  previewIframe.addEventListener("load", () => {
    const doc = previewIframe.contentWindow?.document

    if (!doc) return

    // 1. iframe内部のスクロールバーを非表示にする
    doc.documentElement.style.overflow = "hidden"
    doc.body.style.overflow = "hidden"

    // 2. 中身のHTMLの実際の幅と高さを取得する
    const contentWidth = Math.max(
      doc.body.scrollWidth,
      doc.documentElement.scrollWidth,
    )
    const contentHeight = Math.max(
      doc.body.scrollHeight,
      doc.documentElement.scrollHeight,
    )

    // 3. ラッパーと iframe を中身の巨大なサイズに拡張する
    previewWrapperDiv.style.width = `${contentWidth}px`
    previewWrapperDiv.style.height = `${contentHeight}px`
    previewIframe.style.width = `${contentWidth}px`
    previewIframe.style.height = `${contentHeight}px`
  })
}
