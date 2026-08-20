import type { Node } from "unist"
import type { VFile } from "vfile"
import { buildPosterStyle } from "./../style"
import type { PosterFrontmatter } from "./../types/poster-frontmatter"

export function rehypeApplyStyleFromMatter() {
  return (tree: Node, file: VFile) => {
    if (!("children" in tree) || !Array.isArray(tree.children)) {
      return
    }

    const html = tree.children.find(
      (node: Node & { tagName?: string }) =>
        node.type === "element" && node.tagName === "html",
    )

    if (!html || !("children" in html) || !Array.isArray(html.children)) {
      return
    }

    const head = html.children.find(
      (node: Node & { tagName?: string }) =>
        node.type === "element" && node.tagName === "head",
    )

    if (!head || !("children" in head) || !Array.isArray(head.children)) {
      return
    }

    const styleNode = head.children.find(
      (node: Node & { tagName?: string }) =>
        node.type === "element" && node.tagName === "style",
    )

    if (!styleNode || !("children" in styleNode)) {
      return
    }

    const frontmatter: PosterFrontmatter = file.data.matter || {}
    styleNode.children = [
      { type: "text", value: buildPosterStyle(frontmatter.style) },
    ]
  }
}
