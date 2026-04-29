export interface ThemeInput {
  colors: Record<string, string>
  typography: { fontFamily: Record<string, unknown> }
}

export function generateThemeCSS(theme: ThemeInput): string {
  const lines: string[] = [':root {']
  for (const [key, value] of Object.entries(theme.colors)) {
    lines.push(`  --color-${key}: oklch(${value});`)
  }
  lines.push('}')
  return lines.join('\n')
}
