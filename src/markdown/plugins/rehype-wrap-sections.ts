import type { Node } from "unist"

export function rehypeWrapSections() {
  return (tree: Node) => {
    let currentSection = null
    const newChildren = []

    if (!("children" in tree) || !Array.isArray(tree.children)) {
      return
    }

    for (const node of tree.children) {
      if (node.type === "element" && node.tagName === "h2") {
        // Start of a new section
        if (currentSection) {
          newChildren.push(currentSection)
        }
        currentSection = {
          type: "element",
          tagName: "div",
          properties: { className: ["poster-section"] },
          children: [node],
        }
      } else {
        // Content within section
        if (currentSection) {
          let contentDiv = currentSection.children.find(
            (child) =>
              child.tagName === "div" &&
              child.properties.className.includes("poster-content"),
          )
          if (!contentDiv) {
            contentDiv = {
              type: "element",
              tagName: "div",
              properties: { className: ["poster-content"] },
              children: [],
            }
            currentSection.children.push(contentDiv)
          }
          contentDiv.children.push(node)
        } else {
          // Content outside sections remains as-is
          newChildren.push(node)
        }
      }
    }

    // Add the last section
    if (currentSection) {
      newChildren.push(currentSection)
    }

    tree.children = newChildren
  }
}
