import rehypeFigure from "@microflash/rehype-figure"
import rehypeDocument from "rehype-document"
import rehypeHighlight from "rehype-highlight"
import rehypeKatex from "rehype-katex"
import rehypeMermaid from "rehype-mermaid"
import rehypeSanitize, { defaultSchema } from "rehype-sanitize"
import rehypeStringify from "rehype-stringify"
import { remark } from "remark"
import remarkDirective from "remark-directive"
import remarkFrontmatter from "remark-frontmatter"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import remarkRehype from "remark-rehype"
import { rehypeApplyStyleFromMatter } from "./plugins/rehype-apply-style-from-matter"
import { rehypeWrapMainWithHeader } from "./plugins/rehype-wrap-main-with-header"
import { rehypeWrapSections } from "./plugins/rehype-wrap-sections"
import { remarkDirectiveDiv } from "./plugins/remark-directive-div"
import { remarkHandlingYamlMatter } from "./plugins/remark-handling-yaml-matter"
import { remarkImageAttributes } from "./plugins/remark-image-attributes"
import { buildPosterStyle } from "./style"
import type { PosterFrontmatter } from "./types/poster-frontmatter"

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
      img: [...(defaultSchema.attributes?.img || []), ["style"]],
    },
    protocols: {
      ...defaultSchema.protocols,
      src: [...(defaultSchema.protocols?.src || []), "data"],
    },
  })
  .use(rehypeFigure)
  .use(rehypeKatex)
  .use(rehypeMermaid)
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
