import { h } from "hastscript"
import type { Node } from "unist"
import { visit } from "unist-util-visit"

const nodeNameToClassName: Record<string, string> = {
  row: "poster-content-row",
  column: "poster-content-column",
}

export function remarkDirectiveDiv() {
  return (tree: Node) => {
    visit(
      tree,
      (
        node: Node & {
          data?: { hName?: string; hProperties?: Record<string, unknown> }
          name?: string
        },
      ) => {
        if (node.type === "containerDirective") {
          node.data = node.data || {}
          const data = node.data
          const hast = h("div", {
            class:
              node.name && nodeNameToClassName[node.name]
                ? nodeNameToClassName[node.name]
                : "",
          })
          data.hName = hast.tagName
          data.hProperties = hast.properties
        }
      },
    )
  }
}
