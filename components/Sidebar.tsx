'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  { href: '/', icon: '⚡', label: 'Générer' },
  { href: '/launch', icon: '🚀', label: 'Launch in 5min' },
  { href: '/cofounder', icon: '🤖', label: 'AI Co-Founder' },
  { href: '/codegen', icon: '💻', label: 'Code Generator' },
  { href: '/preview', icon: '🖥️', label: 'UI Builder' },
  { href: '/roadmap', icon: '🗺️', label: 'Roadmap' },
  { href: '/recruit', icon: '👥', label: 'Recrutement' },
  { href: '/legal', icon: '⚖️', label: 'Juridique' },
  { href: '/multilang', icon: '🌍', label: 'Multi-langues' },
  { href: '/store', icon: '🏪', label: 'App Store' },
  { href: '/marketplace', icon: '🌐', label: 'Marketplace' },
  { href: '/studio', icon: '🎨', label: 'Studio' },
  { href: '/export', icon: '📄', label: 'Export PDF' },
  { href: '/factures', icon: '🧾', label: 'Factures' },
  { href: '/analytics', icon: '📊', label: 'Analytics' },
  { href: '/whitelabel', icon: '🏷️', label: 'White Label' },
  { href: '/pricing', icon: '💳', label: 'Pricing' },
  { href: '/auth', icon: '👤', label: 'Mon compte' },
]

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">⚡ Nexoro</h1>
        <button onClick={() => setOpen(!open)} className="text-white text-2xl">
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gray-900 border-r border-gray-800 
        flex flex-col overflow-y-auto transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-2xl font-bold text-white">⚡ Nexoro</h1>
          <p className="text-gray-500 text-xs mt-1">AI Startup Factory</p>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                pathname === item.href
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            Nexoro v3 — En ligne
          </div>
        </div>
      </aside>
    </>
  )
}
