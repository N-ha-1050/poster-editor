import rehypeFigure from "@microflash/rehype-figure"
import { h } from "hastscript"
import rehypeDocument from "rehype-document"
import rehypeHighlight from "rehype-highlight"
import rehypeKatex from "rehype-katex"
import rehypeSanitize, { defaultSchema } from "rehype-sanitize"
import rehypeStringify from "rehype-stringify"
import { remark } from "remark"
import remarkDirective from "remark-directive"
import remarkFrontmatter from "remark-frontmatter"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import remarkRehype from "remark-rehype"
import type { Data, Node } from "unist"
import { visit } from "unist-util-visit"
import type { VFile } from "vfile"
import { matter } from "vfile-matter"
import { buildPosterStyle, type PosterFrontmatterStyle } from "./style"

type PosterFrontmatterAuthor =
  | { [key: string]: string | string[] | null }
  | string
type PosterFrontmatterAuthors = PosterFrontmatterAuthor[]

type PosterFrontmatter = {
  title?: string | null
  author?: PosterFrontmatterAuthor | null
  authors?: PosterFrontmatterAuthors | null
  style?: PosterFrontmatterStyle | null
}

/**
 * Parse YAML frontmatter and expose it at `file.data.matter`.
 */
function remarkHandlingYamlMatter() {
  return (_: Node, file: VFile) => {
    matter(file)
  }
}

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

function rehypeWrapMainWithHeader() {
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

function rehypeApplyStyleFromMatter() {
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

function rehypeWrapSections() {
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

function remarkImageAttributes() {
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
        const widthMatch = attributeString.match(/width\s*=\s*(\S+)/)
        const heightMatch = attributeString.match(/height\s*=\s*(\S+)/)

        if (widthMatch || heightMatch) {
          node.data = node.data || {}
          node.data.hProperties = node.data.hProperties || {}

          if (widthMatch) {
            node.data.hProperties.width = widthMatch[1]
          }
          if (heightMatch) {
            node.data.hProperties.height = heightMatch[1]
          }
          return
        }
      }

      const alt = "alt" in node && node.alt ? String(node.alt) : ""
      const widthMatch = alt.match(/width\s*:\s*(\S+)/)
      const heightMatch = alt.match(/height\s*:\s*(\S+)/)

      if (widthMatch || heightMatch) {
        node.data = node.data || {}
        node.data.hProperties = node.data.hProperties || {}

        if (widthMatch) {
          node.data.hProperties.width = widthMatch[1]
          node.alt = alt.replace(widthMatch[0], "").trim()
        }
        if (heightMatch) {
          node.data.hProperties.height = heightMatch[1]
          node.alt = alt.replace(heightMatch[0], "").trim()
        }
      }
    })
  }
}

const nodeNameToClassName: Record<string, string> = {
  row: "poster-content-row",
  column: "poster-content-column",
}

function remarkDirectiveDiv() {
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

const processor = remark()
  .use(remarkFrontmatter)
  .use(remarkHandlingYamlMatter)
  .use(remarkDirective)
  .use(remarkDirectiveDiv)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkImageAttributes)
  .use(remarkRehype, { footnoteLabel: "脚注" })
  .use(rehypeWrapSections)
  .use(rehypeSanitize, {
    ...defaultSchema,
    attributes: {
      ...defaultSchema.attributes,
      // The `language-*` regex is allowed by default.
      code: [
        ...(defaultSchema.attributes?.code || []),
        ["className", /^language-./, "math-inline", "math-display"],
      ],
      div: [
        ...(defaultSchema.attributes?.div || []),
        [
          "className",
          "poster-section",
          "poster-content",
          "poster-content-row",
          "poster-content-column",
        ],
      ],
    },
    protocols: {
      ...defaultSchema.protocols,
      src: [...(defaultSchema.protocols?.src || []), "data"],
    },
  })
  .use(rehypeFigure)
  .use(rehypeKatex)
  .use(rehypeHighlight)
  .use(rehypeDocument, {
    language: "ja",
    style: buildPosterStyle(),
    css: [
      "https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css",
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.0/styles/github.min.css",
      "https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&family=Noto+Sans+JP:wght@100..900&family=Noto+Sans+Math&family=Noto+Sans+Mono:wght@100..900&family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap",
    ],
    link: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossorigin: true,
      },
    ],
  })
  .use(rehypeApplyStyleFromMatter)
  .use(rehypeWrapMainWithHeader)
  .use(rehypeStringify)

export async function getHtml(markdown: string) {
  const file = await processor.process(markdown)
  const matter: PosterFrontmatter = file.data.matter || {}
  return { html: String(file), matter }
}
