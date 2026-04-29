interface Props {
  children: React.ReactNode
  backGroundVariant?: string
  className?: string
}

const bgMap: Record<string, string> = {
  default: 'bg-white',
  muted: 'bg-gray-50',
  dark: 'bg-gray-900 text-white',
  accent: 'bg-yellow-50',
  primary: 'bg-purple-900 text-white',
}

export default function SectionWrapper({ children, backGroundVariant = 'default', className = '' }: Props) {
  const bg = bgMap[backGroundVariant] ?? bgMap.default
  return (
    <section className={`padding-top padding-bottom padding-left padding-right ${bg} ${className}`}>
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  )
}
