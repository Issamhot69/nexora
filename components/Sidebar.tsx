'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuGroups = [
  {
    label: '🤖 IA & Génération',
    items: [
      { href: '/', icon: '⚡', label: 'Générer' },
      { href: '/dna', icon: '🧬', label: 'Startup DNA' },
      { href: '/launch', icon: '🚀', label: 'Launch in 5min' },
      { href: '/cofounder', icon: '🤖', label: 'AI Co-Founder' },
      { href: '/matching', icon: '🤝', label: 'Co-Founder Match' },
      { href: '/revenue', icon: '💰', label: 'Revenue Predictor' },
      { href: '/financials', icon: '📊', label: 'Financials IA' },
      { href: '/competitor', icon: '🔮', label: 'Competitor Killer' },
    ]
  },
  {
    label: '🌐 Création de Sites',
    items: [
      { href: '/imagegen', icon: '🎨', label: 'Image Generator' },
      { href: '/logo', icon: '✨', label: 'Logo Generator' },
      { href: '/sitebuilder', icon: '🌐', label: 'Site Builder' },
      { href: '/siteeditor', icon: '✏️', label: 'Site Editor' },
      { href: '/styles', icon: '🎨', label: 'Style AI' },
      { href: '/animations', icon: '🎬', label: 'Animations' },
      { href: '/domains', icon: '🔗', label: 'Domain Manager' },
      { href: '/preview', icon: '🖥️', label: 'UI Builder' },
    ]
  },
  {
    label: '💻 Développement',
    items: [
      { href: '/codegen', icon: '💻', label: 'Code Generator' },
      { href: '/roadmap', icon: '🗺️', label: 'Roadmap' },
      { href: '/recruit', icon: '👥', label: 'Recrutement' },
    ]
  },
  {
    label: '📣 Marketing & SEO',
    items: [
      { href: '/email', icon: '📧', label: 'Email Marketing' },
      { href: '/seo', icon: '🔍', label: 'SEO Analyzer' },
      { href: '/multilang', icon: '🌍', label: 'Multi-langues' },
    ]
  },
  {
    label: '💼 Business',
    items: [
      { href: '/legal', icon: '⚖️', label: 'Juridique' },
      { href: '/factures', icon: '🧾', label: 'Factures' },
      { href: '/export', icon: '📄', label: 'Export PDF' },
      { href: '/pricing', icon: '💳', label: 'Pricing' },
      { href: '/whitelabel', icon: '🏷️', label: 'White Label' },
    ]
  },
  {
    label: '🌍 Réseau',
    items: [
      { href: '/marketplace', icon: '🌐', label: 'Marketplace' },
      { href: '/store', icon: '🏪', label: 'App Store' },
      { href: '/analytics', icon: '📊', label: 'Analytics' },
    ]
  },
  {
    label: '⚙️ Compte',
    items: [
      { href: '/studio', icon: '🎨', label: 'Studio' },
      { href: '/onboarding', icon: '🎯', label: 'Guide démarrage' },
      { href: '/auth', icon: '👤', label: 'Mon compte' },
    ]
  },
]

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const [openGroups, setOpenGroups] = useState<number[]>([0, 1, 2, 3, 4, 5, 6])
  const pathname = usePathname()

  const toggleGroup = (i: number) => {
    setOpenGroups(prev => prev.includes(i) ? prev.filter(g => g !== i) : [...prev, i])
  }

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">⚡ Nexoro</h1>
        <button onClick={() => setOpen(!open)} className="text-white text-2xl">
          {open ? '✕' : '☰'}
        </button>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setOpen(false)} />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gray-900 border-r border-gray-800 
        flex flex-col overflow-y-auto transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          <h1 className="text-2xl font-bold text-white">⚡ Nexoro</h1>
          <p className="text-gray-500 text-xs mt-1">AI Startup Factory</p>
        </div>

        <nav className="flex-1 p-2 overflow-y-auto">
          {menuGroups.map((group, i) => (
            <div key={i} className="mb-1">
              <button
                onClick={() => toggleGroup(i)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 hover:text-gray-300 transition-all uppercase tracking-wider">
                <span>{group.label}</span>
                <span className="text-gray-600">{openGroups.includes(i) ? '▼' : '▶'}</span>
              </button>

              {openGroups.includes(i) && (
                <div className="space-y-0.5 mb-2">
                  {group.items.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        pathname === item.href
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      }`}>
                      <span className="text-base">{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800 sticky bottom-0 bg-gray-900">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            Nexoro v10 — En ligne
          </div>
        </div>
      </aside>
    </>
  )
}
