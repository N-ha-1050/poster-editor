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
