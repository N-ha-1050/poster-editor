export const truncateWithEllipsis = (text: string, maxLength = 100) => {
  return text.substring(0, maxLength) + (text.length > maxLength ? "..." : "")
}

export function debounce<T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number,
) {
  let timeoutId: number | undefined
  return (...args: T) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

export function downloadFile(
  filename: string,
  content: string,
  type = "text/plain",
) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * タグ名とIDを指定して要素を取得し、型を自動推論する関数
 */
export function getTypedElementById<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  id: string,
): HTMLElementTagNameMap[K] | null {
  const element = document.getElementById(id)
  if (!element) return null
  return element.tagName.toLowerCase() === tagName
    ? (element as HTMLElementTagNameMap[K])
    : null
}
