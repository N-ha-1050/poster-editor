import type { Node } from "unist"
import type { VFile } from "vfile"
import { matter } from "vfile-matter"

/**
 * Parse YAML frontmatter and expose it at `file.data.matter`.
 */
export function remarkHandlingYamlMatter() {
  return (_: Node, file: VFile) => {
    matter(file)
  }
}
