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

type PosterStyleFrontmatter = {
  width?: string | null
  height?: string | null
  primaryColor?: string | null
  secondaryColor?: string | null
}

type PosterFrontmatter = {
  title?: string | null
  author?: string | null
  authors?: string[] | null
  affiliation?: string | null
  affiliations?: string[] | null
  style?: PosterStyleFrontmatter | null
}

const DEFAULT_THEME_VARS = {
  width: "841mm",
  height: "1189mm",
  primaryColor: "#8fc231",
  secondaryColor: "#689f39",
}

function resolveThemeVars(frontmatter: PosterFrontmatter) {
  const style = frontmatter.style
  return {
    width: style?.width ?? DEFAULT_THEME_VARS.width,
    height: style?.height ?? DEFAULT_THEME_VARS.height,
    primaryColor: style?.primaryColor ?? DEFAULT_THEME_VARS.primaryColor,
    secondaryColor: style?.secondaryColor ?? DEFAULT_THEME_VARS.secondaryColor,
  }
}

function buildPosterStyle(frontmatter: PosterFrontmatter) {
  const theme = resolveThemeVars(frontmatter)
  return `:root {
  /* Size */
  --width: ${theme.width};
  --height: ${theme.height};

  /* Color */
  --primary-color: ${theme.primaryColor};
  --secondary-color: ${theme.secondaryColor};

  /* Fonts */
  --font-sans: "Noto Sans", "Noto Sans JP", "Noto Sans Emoji", "Noto Sans Math", ui-sans-serif, sans-serif;
  --font-serif: "Noto Serif", "Noto Serif JP", ui-serif, serif;
  --font-mono: "Noto Mono", ui-monospace, monospace;

  --title-font-size: 96px;
  --author-font-size: 54px;
  --affiliation-font-size: 54px;
  --section-title-font-size: 64px;
  --subsection-title-font-size: 36px;
  --content-font-size: 24px;

  --frame-padding: 64px 96px;
  --title-padding: 48px;
  --author-affiliation-gap: 24px;
  --content-gap: 64px;
  --section-title-padding: 36px 48px;
  --section-content-padding: 24px 48px;
  --title-content-gap: 48px;
  --list-padding: 0 0 8px 0;

  --num-columns: 2;
}

body {
  font-family: var(--font-sans);

  width: var(--width);
  height: var(--height);

  margin: 0;
  padding: var(--frame-padding);
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  gap: var(--title-content-gap);
}

header#poster-header {
  background-color: var(--primary-color);
  color: white;
  padding: var(--title-padding);
  flex: 0 0 auto;
}

header#poster-header h1#poster-title {
  text-align: center;
  font-size: var(--title-font-size);
  margin: 0;
  margin-bottom: var(--title-padding);
}

header#poster-header #poster-author {
  display: flex;
  justify-content: center;
  gap: var(--author-affiliation-gap);
}

header#poster-header #poster-author p {
  margin: 0;
  font-size: var(--author-font-size);
}

header#poster-header #poster-affiliation {
  display: flex;
  justify-content: center;
  gap: var(--author-affiliation-gap);
}

header#poster-header #poster-affiliation p {
  margin: 0;
  font-size: var(--affiliation-font-size);
}

main#poster-main {
  flex: 1 1 auto;
  min-height: 0;

  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  gap: var(--content-gap);
}

main#poster-main .poster-section {
  width: calc((100% - (var(--num-columns) - 1) * var(--content-gap)) / var(--num-columns));
}

main#poster-main .poster-section h2 {
  color: white;
  background-color: var(--primary-color);
  padding: var(--section-title-padding);
  font-size: var(--section-title-font-size);
  margin: 0;
}

main#poster-main .poster-section .poster-content {
  padding: var(--section-content-padding);
}

main#poster-main .poster-section .poster-content p {
  margin: 0;
  text-align: justify;
  font-size: var(--content-font-size);
}

main#poster-main .poster-section .poster-content p strong {
  color: var(--secondary-color);
}

main#poster-main .poster-section .poster-content h3 {
  color: var(--secondary-color);
  font-size: var(--subsection-title-font-size);
  font-weight:bold;
}

main#poster-main .poster-section .poster-content > h3:first-child {
  margin-top: 0;
}

main#poster-main .poster-section .poster-content table {
  width: 100%;
  margin: 24px 0;
  border: 2px solid black;
  border-width: 2px 0;
  border-collapse: collapse;
}

main#poster-main .poster-section .poster-content table th {
  border-bottom: 1px solid black;
}

main#poster-main .poster-section .poster-content table th,
main#poster-main .poster-section .poster-content table td {
  font-size: var(--content-font-size);
  text-align: center;
}

main#poster-main .poster-section .poster-content li {
  font-size: var(--content-font-size);
  padding: var(--list-padding);
}

main#poster-main .poster-section .poster-content li::marker {
  color: var(--secondary-color);
}

main#poster-main .poster-section .poster-content .poster-content-row {
  display: flex;
  gap: var(--content-gap);
}

main#poster-main .poster-section .poster-content .poster-content-column {
  display: block;
}`
}

/**
 * Parse YAML frontmatter and expose it at `file.data.matter`.
 */
export default function remarkHandlingYamlMatter() {
  return (_: Node, file: VFile) => {
    matter(file)
  }
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

    const authors = (matter.author ? [matter.author] : []).concat(
      matter.authors ?? [],
    )
    const affiliations = (
      matter.affiliation ? [matter.affiliation] : []
    ).concat(matter.affiliations ?? [])

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
            children: [{ type: "text", value: author }],
          })),
        },
        {
          type: "element",
          tagName: "div",
          properties: { id: "poster-affiliation" },
          children: affiliations.map((affiliation) => ({
            type: "element",
            tagName: "p",
            children: [{ type: "text", value: affiliation }],
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
      { type: "text", value: buildPosterStyle(frontmatter) },
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
        // 新しいセクションの開始
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
        // セクション内のコンテンツ
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
          // セクション外のコンテンツはそのまま
          newChildren.push(node)
        }
      }
    }

    // 最後のセクションを追加
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
          ;(node as Node & { alt?: string }).alt = alt
            .replace(widthMatch[0], "")
            .trim()
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

const titleProcessor = remark()
  .use(remarkFrontmatter)
  .use(remarkHandlingYamlMatter)

export async function getTitle(markdown: string) {
  const file = await titleProcessor.process(markdown)
  const matter: PosterFrontmatter = file.data.matter || {}
  const title = matter?.title ? String(matter.title) : null
  return title
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
    style: buildPosterStyle({}),
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
  return String(file)
}
