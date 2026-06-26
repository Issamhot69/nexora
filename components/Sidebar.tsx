'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuGroups = [
  {
    label: '🚀 Créer mon site',
    items: [
      { href: '/create', icon: '✨', label: 'Nouveau Site', badge: 'START' },
      { href: '/sitebuilder', icon: '🌐', label: 'Site Builder' },
      { href: '/siteeditor', icon: '✏️', label: 'Éditeur de site' },
      { href: '/preview', icon: '👁️', label: 'Preview & Mobile' },
    ]
  },
  {
    label: '🎨 Design & Visuels',
    items: [
      { href: '/styles', icon: '🎨', label: 'Style AI' },
      { href: '/imagegen', icon: '🖼️', label: 'Images IA' },
      { href: '/logo', icon: '✨', label: 'Logo Generator' },
      { href: '/animations', icon: '🎬', label: 'Animations' },
      { href: '/foodanim', icon: '🍽️', label: 'Food Animations' },
    ]
  },
  {
    label: '📝 Contenu du site',
    items: [
      { href: '/content', icon: '📝', label: 'Content Generator' },
      { href: '/multilang', icon: '🌍', label: 'Multi-langues' },
      { href: '/legal', icon: '⚖️', label: 'Pages légales' },
    ]
  },
  {
    label: '🌐 Publier mon site',
    items: [
      { href: '/domains', icon: '🔗', label: 'Domain Manager' },
      { href: '/seo', icon: '🔍', label: 'SEO Optimizer' },
      { href: '/analytics', icon: '📊', label: 'Analytics' },
    ]
  },
  {
    label: '💼 Business',
    items: [
      { href: '/pricing', icon: '💳', label: 'Plans & Tarifs' },
      { href: '/marketplace', icon: '🌐', label: 'Marketplace Sites' },
      { href: '/whitelabel', icon: '🏷️', label: 'White Label' },
    ]
  },
  {
    label: '⚙️ Mon compte',
    items: [
      { href: '/studio', icon: '🎨', label: 'Mon Studio' },
      { href: '/auth', icon: '👤', label: 'Connexion' },
      { href: '/consultant', icon: '🤖', label: 'Consultant IA' },
      { href: '/onboarding', icon: '🎯', label: 'Guide démarrage' },
    ]
  },
]

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const [openGroups, setOpenGroups] = useState<number[]>([0, 1, 2, 3, 4, 5])
  const pathname = usePathname()

  const toggleGroup = (i: number) => {
    setOpenGroups(prev => prev.includes(i) ? prev.filter(g => g !== i) : [...prev, i])
  }

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">⚡ Nexoro</h1>
        <button onClick={() => setOpen(!open)} className="text-white text-2xl">{open ? '✕' : '☰'}</button>
      </div>

      {open && <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setOpen(false)} />}

      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gray-900 border-r border-gray-800 flex flex-col overflow-y-auto transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          <h1 className="text-2xl font-bold text-white">⚡ Nexoro</h1>
          <p className="text-gray-500 text-xs mt-1">Website Builder IA</p>
        </div>

        {/* CTA Principal */}
        <div className="p-3">
          <Link href="/create"
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl transition-all text-sm">
            ✨ Créer mon site web
          </Link>
        </div>

        <nav className="flex-1 p-2 overflow-y-auto">
          {menuGroups.map((group, i) => (
            <div key={i} className="mb-1">
              <button onClick={() => toggleGroup(i)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 hover:text-gray-300 transition-all uppercase tracking-wider">
                <span>{group.label}</span>
                <span className="text-gray-600">{openGroups.includes(i) ? '▼' : '▶'}</span>
              </button>

              {openGroups.includes(i) && (
                <div className="space-y-0.5 mb-2">
                  {group.items.map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${pathname === item.href ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                      <span className="text-base">{item.icon}</span>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && <span className="text-xs bg-indigo-500 text-white px-2 py-0.5 rounded-full">{item.badge}</span>}
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
            Nexoro v13 — En ligne
          </div>
        </div>
      </aside>
    </>
  )
}
