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
  // color
  colorCommonBackground?: string | null // ページ全体の背景（無彩色想定）
  colorCommonText?: string | null // 本文の基本文字色（無彩色想定）
  colorCommonBorder?: string | null // 本文の基本枠線色（無彩色想定）
  colorKeyBackground?: string | null // 見出しボックスの背景色
  colorOnKeyBackground?: string | null // colorKeyBackground 上の文字色
  colorKeyPrimary?: string | null // 主色

  // font-size
  fontSizeTitle?: string | null
  fontSizeAuthor?: string | null
  fontSizeAffiliation?: string | null
  fontSizeSectionTitle?: string | null
  fontSizeSubsectionTitle?: string | null
  fontSizeContent?: string | null
  fontSizeCaption?: string | null
  fontSizeSmall?: string | null

  // spacing
  paddingFrame?: string | null
  paddingTitle?: string | null
  paddingSectionTitle?: string | null
  paddingSectionContent?: string | null
  paddingList?: string | null
  marginSubsectionTitle?: string | null
  gapAuthorAffiliation?: string | null
  gapContent?: string | null
  gapTitleContent?: string | null

  // layout
  sizeWidth?: string | null
  sizeHeight?: string | null
  layoutColumns?: number | null
  size?: Size | null

  // deprecated
  width?: string | null
  height?: string | null
  primaryColor?: string | null
  secondaryColor?: string | null
  backgroundColor?: string | null
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
  // color
  colorCommonBackground: "white",
  colorCommonText: "black",
  colorCommonBorder: "black",
  colorKeyBackground: "#8fc231",
  colorOnKeyBackground: "white",
  colorKeyPrimary: "#689f39",

  // font-size
  fontSizeTitle: "96px",
  fontSizeAuthor: "54px",
  fontSizeAffiliation: "54px",
  fontSizeSectionTitle: "64px",
  fontSizeSubsectionTitle: "36px",
  fontSizeContent: "24px",
  fontSizeCaption: "16px",
  fontSizeSmall: "12px",

  // spacing
  paddingFrame: "64px 96px",
  paddingTitle: "48px",
  paddingSectionTitle: "36px 48px",
  paddingSectionContent: "24px 48px",
  paddingList: "0 0 8px 0",
  marginSubsectionTitle: "36px 0",
  gapAuthorAffiliation: "24px",
  gapContent: "64px",
  gapTitleContent: "48px",

  // layout
  sizeWidth: "841mm",
  sizeHeight: "1189mm",
  layoutColumns: 2,
} satisfies PosterFrontmatterStyle

function resolveThemeVars(style?: PosterFrontmatterStyle | null) {
  const theme = {
    // color
    colorCommonBackground:
      style?.colorCommonBackground ??
      // deprecated
      style?.backgroundColor ??
      DEFAULT_THEME_VARS.colorCommonBackground,
    colorCommonText:
      style?.colorCommonText ?? DEFAULT_THEME_VARS.colorCommonText,
    colorCommonBorder:
      style?.colorCommonBorder ?? DEFAULT_THEME_VARS.colorCommonBorder,
    colorKeyBackground:
      style?.colorKeyBackground ??
      // deprecated
      style?.primaryColor ??
      DEFAULT_THEME_VARS.colorKeyBackground,
    colorOnKeyBackground:
      style?.colorOnKeyBackground ?? DEFAULT_THEME_VARS.colorOnKeyBackground,
    colorKeyPrimary:
      style?.colorKeyPrimary ??
      // deprecated
      style?.secondaryColor ??
      DEFAULT_THEME_VARS.colorKeyPrimary,

    // font-size
    fontSizeTitle:
      style?.fontSizeTitle ??
      // deprecated
      style?.titleFontSize ??
      DEFAULT_THEME_VARS.fontSizeTitle,
    fontSizeAuthor:
      style?.fontSizeAuthor ??
      // deprecated
      style?.authorFontSize ??
      DEFAULT_THEME_VARS.fontSizeAuthor,
    fontSizeAffiliation:
      style?.fontSizeAffiliation ??
      // deprecated
      style?.affiliationFontSize ??
      DEFAULT_THEME_VARS.fontSizeAffiliation,
    fontSizeSectionTitle:
      style?.fontSizeSectionTitle ??
      // deprecated
      style?.sectionTitleFontSize ??
      DEFAULT_THEME_VARS.fontSizeSectionTitle,
    fontSizeSubsectionTitle:
      style?.fontSizeSubsectionTitle ??
      // deprecated
      style?.subsectionTitleFontSize ??
      DEFAULT_THEME_VARS.fontSizeSubsectionTitle,
    fontSizeContent:
      style?.fontSizeContent ??
      // deprecated
      style?.contentFontSize ??
      DEFAULT_THEME_VARS.fontSizeContent,
    fontSizeCaption:
      style?.fontSizeCaption ?? DEFAULT_THEME_VARS.fontSizeCaption,
    fontSizeSmall: style?.fontSizeSmall ?? DEFAULT_THEME_VARS.fontSizeSmall,

    // spacing
    paddingFrame:
      style?.paddingFrame ??
      // deprecated
      style?.framePadding ??
      DEFAULT_THEME_VARS.paddingFrame,
    paddingTitle:
      style?.paddingTitle ??
      // deprecated
      style?.titlePadding ??
      DEFAULT_THEME_VARS.paddingTitle,
    paddingSectionTitle:
      style?.paddingSectionTitle ??
      // deprecated
      style?.sectionTitlePadding ??
      DEFAULT_THEME_VARS.paddingSectionTitle,
    paddingSectionContent:
      style?.paddingSectionContent ??
      // deprecated
      style?.sectionContentPadding ??
      DEFAULT_THEME_VARS.paddingSectionContent,
    paddingList:
      style?.paddingList ??
      // deprecated
      style?.listPadding ??
      DEFAULT_THEME_VARS.paddingList,
    marginSubsectionTitle:
      style?.marginSubsectionTitle ?? DEFAULT_THEME_VARS.marginSubsectionTitle,
    gapAuthorAffiliation:
      style?.gapAuthorAffiliation ??
      // deprecated
      style?.authorAffiliationGap ??
      DEFAULT_THEME_VARS.gapAuthorAffiliation,
    gapContent:
      style?.gapContent ??
      // deprecated
      style?.contentGap ??
      DEFAULT_THEME_VARS.gapContent,
    gapTitleContent:
      style?.gapTitleContent ??
      // deprecated
      style?.titleContentGap ??
      DEFAULT_THEME_VARS.gapTitleContent,

    // layout
    sizeWidth:
      style?.sizeWidth ??
      // deprecated
      style?.width ??
      DEFAULT_THEME_VARS.sizeWidth,
    sizeHeight:
      style?.sizeHeight ??
      // deprecated
      style?.height ??
      DEFAULT_THEME_VARS.sizeHeight,
    layoutColumns:
      style?.layoutColumns ??
      // deprecated
      style?.numColumns ??
      DEFAULT_THEME_VARS.layoutColumns,
  }
  if (style?.size && style.size in posterStyleSizes) {
    const size = style.size
    const sizeTheme = posterStyleSizes[size]
    theme.sizeWidth = sizeTheme.width
    theme.sizeHeight = sizeTheme.height
  }
  return theme
}

export function buildPosterStyle(style?: PosterFrontmatterStyle | null) {
  const theme = resolveThemeVars(style)
  return `:root {
  /* Color */
  --color-common-background: ${theme.colorCommonBackground};
  --color-common-text: ${theme.colorCommonText};
  --color-common-border: ${theme.colorCommonBorder};
  --color-key-background: ${theme.colorKeyBackground};
  --color-on-key-background: ${theme.colorOnKeyBackground};
  --color-key-primary: ${theme.colorKeyPrimary};

  /* Fonts */
  --font-sans: "Noto Sans", "Noto Sans JP", "Noto Color Emoji", "Noto Sans Math", ui-sans-serif, sans-serif;
  --font-mono: "Noto Sans Mono", "Noto Sans JP", ui-monospace, monospace;

  /* Font size */
  --font-size-title: ${theme.fontSizeTitle};
  --font-size-author: ${theme.fontSizeAuthor};
  --font-size-affiliation: ${theme.fontSizeAffiliation};
  --font-size-section-title: ${theme.fontSizeSectionTitle};
  --font-size-subsection-title: ${theme.fontSizeSubsectionTitle};
  --font-size-content: ${theme.fontSizeContent};
  --font-size-caption: ${theme.fontSizeCaption};
  --font-size-small: ${theme.fontSizeSmall};

  /* Spacing */
  --padding-frame: ${theme.paddingFrame};
  --padding-title: ${theme.paddingTitle};
  --padding-section-title: ${theme.paddingSectionTitle};
  --padding-section-content: ${theme.paddingSectionContent};
  --padding-list: ${theme.paddingList};
  --margin-subsection-title: ${theme.marginSubsectionTitle};
  --gap-author-affiliation: ${theme.gapAuthorAffiliation};
  --gap-content: ${theme.gapContent};
  --gap-title-content: ${theme.gapTitleContent};

  /* Layout */
  --size-width: ${theme.sizeWidth};
  --size-height: ${theme.sizeHeight};
  --layout-columns: ${theme.layoutColumns};
}

html {
  width: var(--size-width);
  height: var(--size-height);
}

body {
  background-color: var(--color-common-background);
  color: var(--color-common-text);
  font-family: var(--font-sans);

  width: var(--size-width);
  height: var(--size-height);

  margin: 0;
  padding: var(--padding-frame);
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  gap: var(--gap-title-content);

  position: relative;
}

code,
pre,
kbd,
samp {
  font-family: var(--font-mono);
}

header#poster-header {
  background-color: var(--color-key-background);
  color: var(--color-on-key-background);
  padding: var(--padding-title);
  flex: 0 0 auto;
}

header#poster-header h1#poster-title {
  text-align: center;
  font-size: var(--font-size-title);
  margin: 0;
  margin-bottom: var(--padding-title);
}

header#poster-header div#poster-author {
  display: flex;
  justify-content: center;
  gap: var(--gap-author-affiliation);
}

header#poster-header div#poster-author p {
  margin: 0;
  font-size: var(--font-size-author);
}

header#poster-header ol#poster-affiliation {
  display: flex;
  justify-content: center;
  gap: var(--gap-author-affiliation);
  list-style-position: inside;
  margin: 0;
  padding: 0;
}

header#poster-header ol#poster-affiliation li {
  margin: 0;
  font-size: var(--font-size-affiliation);
}

main#poster-main {
  flex: 1 1 auto;
  min-height: 0;

  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  gap: var(--gap-content);
}

main#poster-main .poster-section {
  width: calc((100% - (var(--layout-columns) - 1) * var(--gap-content)) / var(--layout-columns));
}

main#poster-main .poster-section h2 {
  color: var(--color-on-key-background);
  background-color: var(--color-key-background);
  padding: var(--padding-section-title);
  font-size: var(--font-size-section-title);
  margin: 0;
}

main#poster-main .poster-section .poster-content {
  padding: var(--padding-section-content);
  font-size: var(--font-size-content);
}

main#poster-main .poster-section .poster-content p {
  margin: 0;
  text-align: justify;
}

main#poster-main .poster-section .poster-content strong {
  color: var(--color-key-primary);
}

main#poster-main .poster-section .poster-content h3 {
  color: var(--color-key-primary);
  font-size: var(--font-size-subsection-title);
  font-weight: bold;
  margin: var(--margin-subsection-title);
}

main#poster-main .poster-section .poster-content > h3:first-child {
  margin-top: 0;
}

main#poster-main .poster-section .poster-content table {
  width: 100%;
  margin: 24px 0;
  border: 2px solid var(--color-common-border);
  border-width: 2px 0;
  border-collapse: collapse;
}

main#poster-main .poster-section .poster-content table th {
  border-bottom: 1px solid var(--color-common-border);
}

main#poster-main .poster-section .poster-content li {
  padding: var(--padding-list);
}

main#poster-main .poster-section .poster-content li::marker {
  color: var(--color-key-primary);
}

main#poster-main .poster-section .poster-content blockquote {
  margin: 24px 0;
  border-left: 8px solid var(--color-common-border);
  padding: 8px 16px 8px 24px;
}

main#poster-main .poster-section .poster-content blockquote > :first-child {
  margin-top: 0;
}

main#poster-main .poster-section .poster-content blockquote > :last-child {
  margin-bottom: 0;
}

main#poster-main .poster-section .poster-content figure figcaption {
  font-size: var(--font-size-caption);
}

main#poster-main .poster-section .poster-content .poster-content-row {
  display: flex;
  gap: var(--gap-content);
}

main#poster-main .poster-section .poster-content .poster-content-column {
  display: block;
}

main#poster-main .poster-section .poster-content .poster-content-small {
  font-size: var(--font-size-small);
}`
}
