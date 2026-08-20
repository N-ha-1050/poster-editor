import type { PosterFrontmatterStyle } from "./../style"

type PosterFrontmatterAuthor =
  | { [key: string]: string | string[] | null }
  | string
export type PosterFrontmatterAuthors = PosterFrontmatterAuthor[]

export type PosterFrontmatter = {
  title?: string | null
  author?: PosterFrontmatterAuthor | null
  authors?: PosterFrontmatterAuthors | null
  style?: PosterFrontmatterStyle | null
}
