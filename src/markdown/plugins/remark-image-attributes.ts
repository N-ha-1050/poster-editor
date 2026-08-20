import type { Data, Node } from "unist"

export function remarkImageAttributes() {
  return (tree: Node) => {
    const visitWithParent = (
      node: Node,
      handler: (
        node: Node & {
          data?: Data & { hProperties?: Record<string, unknown> }
          alt?: string
        },
        parent: Node | null,
        index: number,
      ) => void,
    ) => {
      if (node.type === "image") handler(node, null, -1)
      if (
        node &&
        typeof node === "object" &&
        "children" in node &&
        Array.isArray(node.children)
      ) {
        node.children.forEach((child, index) => {
          if (child.type === "image") {
            handler(child, node, index)
          } else {
            visitWithParent(child, handler)
          }
        })
      }
    }

    visitWithParent(tree, (node, parent, index) => {
      let attributeString = null

      if (
        parent &&
        index >= 0 &&
        "children" in parent &&
        Array.isArray(parent.children)
      ) {
        const nextNode = parent.children[index + 1]
        if (nextNode && nextNode.type === "text") {
          const match = nextNode.value.match(/^\s*{([^}]+)}\s*/)
          if (match) {
            attributeString = match[1]
            nextNode.value = nextNode.value.slice(match[0].length)
            if (nextNode.value.length === 0) {
              parent.children.splice(index + 1, 1)
            }
          }
        }
      }

      if (attributeString) {
        const widthMatch = attributeString.match(/width\s*=\s*([^\s,]+)/)
        const heightMatch = attributeString.match(/height\s*=\s*([^\s,]+)/)

        const leftMatch = attributeString.match(/left\s*=\s*([^\s,]+)/)
        const topMatch = attributeString.match(/top\s*=\s*([^\s,]+)/)
        const rightMatch = attributeString.match(/right\s*=\s*([^\s,]+)/)
        const bottomMatch = attributeString.match(/bottom\s*=\s*([^\s,]+)/)

        if (widthMatch || heightMatch) {
          node.data = node.data || {}
          node.data.hProperties = node.data.hProperties || {}

          if (widthMatch) {
            node.data.hProperties.width = widthMatch[1]
          }
          if (heightMatch) {
            node.data.hProperties.height = heightMatch[1]
          }
        }

        if (leftMatch || topMatch || rightMatch || bottomMatch) {
          node.data = node.data || {}
          node.data.hProperties = node.data.hProperties || {}

          node.data.hProperties.style = node.data.hProperties.style || ""
          node.data.hProperties.style += "position: absolute;"

          node.alt = ""
          if (leftMatch) {
            node.data.hProperties.style += `left: ${leftMatch[1]};`
          }
          if (topMatch) {
            node.data.hProperties.style += `top: ${topMatch[1]};`
          }
          if (rightMatch) {
            node.data.hProperties.style += `right: ${rightMatch[1]};`
          }
          if (bottomMatch) {
            node.data.hProperties.style += `bottom: ${bottomMatch[1]};`
          }
        }

        return
      }

      const alt = "alt" in node && node.alt ? String(node.alt) : ""
      const widthMatch = alt.match(/width\s*:\s*([^\s,]+)/)
      const heightMatch = alt.match(/height\s*:\s*([^\s,]+)/)
      const leftMatch = alt.match(/left\s*:\s*([^\s,]+)/)
      const topMatch = alt.match(/top\s*:\s*([^\s,]+)/)
      const rightMatch = alt.match(/right\s*:\s*([^\s,]+)/)
      const bottomMatch = alt.match(/bottom\s*:\s*([^\s,]+)/)

      if (widthMatch || heightMatch) {
        node.data = node.data || {}
        node.data.hProperties = node.data.hProperties || {}

        if (widthMatch) {
          node.data.hProperties.width = widthMatch[1]
          node.alt = node.alt?.replace(widthMatch[0], "").trim()
        }
        if (heightMatch) {
          node.data.hProperties.height = heightMatch[1]
          node.alt = node.alt?.replace(heightMatch[0], "").trim()
        }
      }

      if (leftMatch || topMatch || rightMatch || bottomMatch) {
        node.data = node.data || {}
        node.data.hProperties = node.data.hProperties || {}

        node.data.hProperties.style = node.data.hProperties.style || ""
        node.data.hProperties.style += "position: absolute;"

        node.alt = ""
        node.data.hProperties.ariaHidden = true
        node.data.hProperties.role = "presentation"

        if (leftMatch) {
          node.data.hProperties.style += `left: ${leftMatch[1]};`
        }
        if (topMatch) {
          node.data.hProperties.style += `top: ${topMatch[1]};`
        }
        if (rightMatch) {
          node.data.hProperties.style += `right: ${rightMatch[1]};`
        }
        if (bottomMatch) {
          node.data.hProperties.style += `bottom: ${bottomMatch[1]};`
        }
      }
    })
  }
}
