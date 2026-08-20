import type { Node } from "unist"
import type { VFile } from "vfile"
import type {
  PosterFrontmatter,
  PosterFrontmatterAuthors,
} from "./../types/poster-frontmatter"

function resolveAuthorsFromFrontmatter(
  frontmatterAuthors?: PosterFrontmatterAuthors | null,
) {
  if (!frontmatterAuthors) {
    return { authors: [], affiliations: [] }
  }

  const authors: { name: string; affiliationNumbers: number[] }[] = []
  const affiliationMap: Map<string, number> = new Map()
  const affiliations: { name: string; number: number }[] = [] // 1-indexed sorted affiliation list

  frontmatterAuthors.forEach((authorsBlock) => {
    Object.entries(
      typeof authorsBlock === "string"
        ? { [authorsBlock]: null }
        : authorsBlock,
    ).forEach(([frontmatterAuthor, frontmatterAffiliation]) => {
      const affiliationNames = (
        Array.isArray(frontmatterAffiliation)
          ? frontmatterAffiliation
          : [frontmatterAffiliation]
      )
        .filter((aff) => aff !== null)
        .map((aff) => aff.trim())
      const authorName = frontmatterAuthor.trim()

      const affiliationNumbers = affiliationNames
        .map((affiliationName) => {
          if (!affiliationMap.has(affiliationName)) {
            const affiliationNumber = affiliationMap.size + 1
            affiliationMap.set(affiliationName, affiliationNumber)
            affiliations.push({
              name: affiliationName,
              number: affiliationNumber,
            })
          }
          const affiliationNumber = affiliationMap.get(affiliationName)
          if (!affiliationNumber) {
            // This code block should never be reached!
            console.warn(
              `Affiliation "${affiliationName}" not found in affiliationMap.`,
            )
            return null
          }
          return affiliationNumber
        })
        .filter((num) => num !== null)
      authors.push({
        name: authorName,
        affiliationNumbers,
      })
    })
  })

  return { authors, affiliations }
}

export function rehypeWrapMainWithHeader() {
  return (tree: Node, file: VFile) => {
    const matter: PosterFrontmatter = file.data.matter || {}
    const title = matter.title || ""
    const titleChildren = title
      .replace(/\r\n/g, "\n")
      .split("\n")
      .flatMap((line, i) =>
        i === 0
          ? [{ type: "text", value: line }]
          : [
              { type: "element", tagName: "br", properties: {}, children: [] },
              { type: "text", value: line },
            ],
      )

    const { authors, affiliations } = resolveAuthorsFromFrontmatter(
      (matter.author ? [matter.author] : []).concat(matter.authors ?? []),
    )

    if (!("children" in tree) || !Array.isArray(tree.children)) {
      return
    }

    const html = tree.children.find(
      (node) => node.type === "element" && node.tagName === "html",
    )

    if (!html || !("children" in html) || !Array.isArray(html.children)) {
      return
    }

    const body = html.children.find(
      (node: Node & { tagName: string }) =>
        node.type === "element" && node.tagName === "body",
    )

    if (!body || !("children" in body) || !Array.isArray(body.children)) {
      return
    }

    const header = {
      type: "element",
      tagName: "header",
      properties: { id: "poster-header" },
      children: [
        {
          type: "element",
          tagName: "h1",
          properties: { id: "poster-title" },
          children: titleChildren,
        },
        {
          type: "element",
          tagName: "div",
          properties: { id: "poster-author" },
          children: authors.map((author) => ({
            type: "element",
            tagName: "p",
            children: [
              { type: "text", value: author.name },
              ...author.affiliationNumbers.map((affiliationNumber) => ({
                type: "element",
                tagName: "sup",
                children: [{ type: "text", value: `${affiliationNumber}` }],
              })),
            ],
          })),
        },
        {
          type: "element",
          tagName: "ol",
          properties: { id: "poster-affiliation" },
          children: affiliations.map((affiliation) => ({
            type: "element",
            tagName: "li",
            children: [
              {
                type: "text",
                value: `${affiliation.name}`,
              },
            ],
          })),
        },
      ],
    }

    const main = {
      type: "element",
      tagName: "main",
      properties: { id: "poster-main" },
      children: body.children,
    }

    body.children = [header, main]
  }
}
