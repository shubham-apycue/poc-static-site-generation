function toKebab(key: string): string {
  return key.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`)
}

interface ResponsiveValue { mobile?: string; tablet?: string; desktop?: string }
type ResponsiveRecord = Record<string, ResponsiveValue>

interface FullTheme {
  colors: Record<string, string>
  typography: {
    fontSans?: string
    fontSerif?: string
    fontMono?: string
    fontWeightRegular?: number
    fontWeightMedium?: number
    fontWeightSemibold?: number
    fontWeightBold?: number
    fontSize?: ResponsiveRecord
    fontWeight?: Record<string, Record<string, number>>
    fontFamily?: Record<string, ResponsiveValue>
    lineHeight?: ResponsiveRecord
  }
  icons?: Record<string, unknown>
  radius?: Record<string, Record<string, string>>
  padding?: Record<string, ResponsiveValue>
  shadows?: Record<string, string>
}

export type ThemeInput = FullTheme

const ELEMENTS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body', 'subtext', 'caption'] as const
const BREAKPOINTS = ['mobile', 'tablet', 'desktop'] as const
const RADIUS_KEYS: Record<string, string> = {
  button: 'button', card: 'card', cardInner: 'card-inner',
  image: 'image', tab: 'tab', iconBg: 'icon-bg', thumbnail: 'thumbnail', input: 'input',
}

export function generateThemeCSS(theme: ThemeInput): string {
  const lines: string[] = [':root {']

  // Colors — raw OKLCH values (production pattern: --primary, --background, etc.)
  for (const [key, value] of Object.entries(theme.colors)) {
    if (!value) continue
    const kebabKey = toKebab(key)
    lines.push(`  --${kebabKey}: ${value};`)

    // Compatibility aliases to match `apycue-repo` token naming.
    // Example: `layoutHeaderBg` becomes both `--layout-header-bg` and `--layout-header`.
    if (key.endsWith('Bg')) {
      const aliasKey = toKebab(key.slice(0, -2))
      lines.push(`  --${aliasKey}: ${value};`)
    }

    // `bgOverlay` is used as `--overlay` in `apycue-repo`.
    if (key === 'bgOverlay') {
      lines.push(`  --overlay: ${value};`)
    }
  }

  const t = theme.typography

  // Base font stacks
  if (t.fontSans) lines.push(`  --font-sans: ${t.fontSans};`)
  if (t.fontSerif) lines.push(`  --font-serif: ${t.fontSerif};`)
  if (t.fontMono) lines.push(`  --font-mono: ${t.fontMono};`)

  // Font weight constants
  if (t.fontWeightRegular) lines.push(`  --font-weight-regular: ${t.fontWeightRegular};`)
  if (t.fontWeightMedium) lines.push(`  --font-weight-medium: ${t.fontWeightMedium};`)
  if (t.fontWeightSemibold) lines.push(`  --font-weight-semibold: ${t.fontWeightSemibold};`)
  if (t.fontWeightBold) lines.push(`  --font-weight-bold: ${t.fontWeightBold};`)

  // Responsive font sizes, families, weights, line-heights
  for (const el of ELEMENTS) {
    for (const bp of BREAKPOINTS) {
      const size = t.fontSize?.[el]?.[bp]
      const family = t.fontFamily?.[el]?.[bp]
      const weight = t.fontWeight?.[el]?.[bp]
      const lh = t.lineHeight?.[el]?.[bp]
      if (size) lines.push(`  --font-size-${el}-${bp}: ${size};`)
      if (family) lines.push(`  --font-family-${el}-${bp}: ${family};`)
      if (weight) lines.push(`  --font-weight-${el}-${bp}: ${weight};`)
      if (lh) lines.push(`  --line-height-${el}-${bp}: ${lh};`)
    }
  }

  // Border radius
  if (theme.radius) {
    for (const [key, cssKey] of Object.entries(RADIUS_KEYS)) {
      const val = theme.radius[key]
      if (val) {
        for (const bp of BREAKPOINTS) {
          if (val[bp]) lines.push(`  --radius-${cssKey}-${bp}: ${val[bp]};`)
        }
      }
    }
  }

  // Responsive padding (layout spacing)
  if (theme.padding) {
    const p = theme.padding
    const sides: Array<[keyof typeof p, string]> = [
      ['left', 'left'],
      ['right', 'right'],
      ['top', 'top'],
      ['bottom', 'bottom'],
    ]

    for (const [key, cssKey] of sides) {
      const val = p[key]
      if (!val) continue
      for (const bp of BREAKPOINTS) {
        const v = val[bp]
        if (v) lines.push(`  --padding-${cssKey}-${bp}: ${v};`)
      }
    }
  }

  // Shadows
  if (theme.shadows) {
    const s = theme.shadows
    if (s.shadowSm) lines.push(`  --shadow-sm: ${s.shadowSm};`)
    if (s.shadowMd) lines.push(`  --shadow-md: ${s.shadowMd};`)
    if (s.shadowLg) lines.push(`  --shadow-lg: ${s.shadowLg};`)
    if (s.shadowXl) lines.push(`  --shadow-xl: ${s.shadowXl};`)
  }

  // Icon tokens
  if (theme.icons) {
    const ic = theme.icons
    if (ic.xl) lines.push(`  --icon-xl: ${ic.xl};`)
    if (ic.md) lines.push(`  --icon-md: ${ic.md};`)
    if (ic.sm) lines.push(`  --icon-sm: ${ic.sm};`)
    if (ic.wght !== undefined) lines.push(`  --icon-wght: ${ic.wght};`)
    if (ic.variant !== undefined) lines.push(`  --icon-variant: ${ic.variant};`)
  }

  lines.push('}')
  return lines.join('\n')
}
