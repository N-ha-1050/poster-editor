const posterStyleSizes = {
  /** ISO A */
  A0: { width: "841mm", height: "1189mm" },
  A1: { width: "594mm", height: "841mm" },
  A2: { width: "420mm", height: "594mm" },
  A3: { width: "297mm", height: "420mm" },
  A4: { width: "210mm", height: "297mm" },
  A5: { width: "148mm", height: "210mm" },
  A6: { width: "105mm", height: "148mm" },
  A7: { width: "74mm", height: "105mm" },
  A8: { width: "52mm", height: "74mm" },
  A9: { width: "37mm", height: "52mm" },
  A10: { width: "26mm", height: "37mm" },

  /** ISO B */
  B0: { width: "1000mm", height: "1414mm" },
  B1: { width: "707mm", height: "1000mm" },
  B2: { width: "500mm", height: "707mm" },
  B3: { width: "353mm", height: "500mm" },
  B4: { width: "250mm", height: "353mm" },
  B5: { width: "176mm", height: "250mm" },
  B6: { width: "125mm", height: "176mm" },
  B7: { width: "88mm", height: "125mm" },
  B8: { width: "62mm", height: "88mm" },
  B9: { width: "44mm", height: "62mm" },
  B10: { width: "31mm", height: "44mm" },

  /** JIS B */
  "JIS-B0": { width: "1030mm", height: "1456mm" },
  "JIS-B1": { width: "728mm", height: "1030mm" },
  "JIS-B2": { width: "515mm", height: "728mm" },
  "JIS-B3": { width: "364mm", height: "515mm" },
  "JIS-B4": { width: "257mm", height: "364mm" },
  "JIS-B5": { width: "182mm", height: "257mm" },
  "JIS-B6": { width: "128mm", height: "182mm" },
  "JIS-B7": { width: "91mm", height: "128mm" },
  "JIS-B8": { width: "64mm", height: "91mm" },
  "JIS-B9": { width: "45mm", height: "64mm" },
  "JIS-B10": { width: "32mm", height: "45mm" },

  /** North American */
  letter: { width: "8.5in", height: "11in" },
  legal: { width: "8.5in", height: "14in" },
  ledger: { width: "11in", height: "17in" },
}

type Size = keyof typeof posterStyleSizes

export type PosterFrontmatterStyle = {
  width?: string | null
  height?: string | null
  primaryColor?: string | null
  secondaryColor?: string | null
  size?: Size | null
  titleFontSize?: string | null
  authorFontSize?: string | null
  affiliationFontSize?: string | null
  sectionTitleFontSize?: string | null
  subsectionTitleFontSize?: string | null
  contentFontSize?: string | null
  framePadding?: string | null
  titlePadding?: string | null
  authorAffiliationGap?: string | null
  contentGap?: string | null
  sectionTitlePadding?: string | null
  sectionContentPadding?: string | null
  titleContentGap?: string | null
  listPadding?: string | null
  numColumns?: number | null
}

const DEFAULT_THEME_VARS = {
  width: "841mm",
  height: "1189mm",
  primaryColor: "#8fc231",
  secondaryColor: "#689f39",
  titleFontSize: "96px",
  authorFontSize: "54px",
  affiliationFontSize: "54px",
  sectionTitleFontSize: "64px",
  subsectionTitleFontSize: "36px",
  contentFontSize: "24px",
  framePadding: "64px 96px",
  titlePadding: "48px",
  authorAffiliationGap: "24px",
  contentGap: "64px",
  sectionTitlePadding: "36px 48px",
  sectionContentPadding: "24px 48px",
  titleContentGap: "48px",
  listPadding: "0 0 8px 0",
  numColumns: 2,
}

function resolveThemeVars(style?: PosterFrontmatterStyle | null) {
  const theme = {
    width: style?.width ?? DEFAULT_THEME_VARS.width,
    height: style?.height ?? DEFAULT_THEME_VARS.height,
    primaryColor: style?.primaryColor ?? DEFAULT_THEME_VARS.primaryColor,
    secondaryColor: style?.secondaryColor ?? DEFAULT_THEME_VARS.secondaryColor,
    titleFontSize: style?.titleFontSize ?? DEFAULT_THEME_VARS.titleFontSize,
    authorFontSize: style?.authorFontSize ?? DEFAULT_THEME_VARS.authorFontSize,
    affiliationFontSize:
      style?.affiliationFontSize ?? DEFAULT_THEME_VARS.affiliationFontSize,
    sectionTitleFontSize:
      style?.sectionTitleFontSize ?? DEFAULT_THEME_VARS.sectionTitleFontSize,
    subsectionTitleFontSize:
      style?.subsectionTitleFontSize ??
      DEFAULT_THEME_VARS.subsectionTitleFontSize,
    contentFontSize:
      style?.contentFontSize ?? DEFAULT_THEME_VARS.contentFontSize,
    framePadding: style?.framePadding ?? DEFAULT_THEME_VARS.framePadding,
    titlePadding: style?.titlePadding ?? DEFAULT_THEME_VARS.titlePadding,
    authorAffiliationGap:
      style?.authorAffiliationGap ?? DEFAULT_THEME_VARS.authorAffiliationGap,
    contentGap: style?.contentGap ?? DEFAULT_THEME_VARS.contentGap,
    sectionTitlePadding:
      style?.sectionTitlePadding ?? DEFAULT_THEME_VARS.sectionTitlePadding,
    sectionContentPadding:
      style?.sectionContentPadding ?? DEFAULT_THEME_VARS.sectionContentPadding,
    titleContentGap:
      style?.titleContentGap ?? DEFAULT_THEME_VARS.titleContentGap,
    listPadding: style?.listPadding ?? DEFAULT_THEME_VARS.listPadding,
    numColumns: style?.numColumns ?? DEFAULT_THEME_VARS.numColumns,
  }
  if (style?.size) {
    const size = style.size
    const sizeTheme = posterStyleSizes[size]
    theme.width = sizeTheme.width
    theme.height = sizeTheme.height
  }
  return theme
}

export function buildPosterStyle(style?: PosterFrontmatterStyle | null) {
  const theme = resolveThemeVars(style)
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

  --title-font-size: ${theme.titleFontSize};
  --author-font-size: ${theme.authorFontSize};
  --affiliation-font-size: ${theme.affiliationFontSize};
  --section-title-font-size: ${theme.sectionTitleFontSize};
  --subsection-title-font-size: ${theme.subsectionTitleFontSize};
  --content-font-size: ${theme.contentFontSize};

  --frame-padding: ${theme.framePadding};
  --title-padding: ${theme.titlePadding};
  --author-affiliation-gap: ${theme.authorAffiliationGap};
  --content-gap: ${theme.contentGap};
  --section-title-padding: ${theme.sectionTitlePadding};
  --section-content-padding: ${theme.sectionContentPadding};
  --title-content-gap: ${theme.titleContentGap};
  --list-padding: ${theme.listPadding};

  --num-columns: ${theme.numColumns};
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

header#poster-header div#poster-author {
  display: flex;
  justify-content: center;
  gap: var(--author-affiliation-gap);
}

header#poster-header div#poster-author p {
  margin: 0;
  font-size: var(--author-font-size);
}

header#poster-header ol#poster-affiliation {
  display: flex;
  justify-content: center;
  gap: var(--author-affiliation-gap);
  list-style-position: inside;
}

header#poster-header ol#poster-affiliation li {
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
  font-weight: bold;
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
