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
