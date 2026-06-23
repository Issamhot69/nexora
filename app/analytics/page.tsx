'use client'
import { useState, useEffect } from 'react'

export default function Analytics() {
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('nexoro_projects')
    if (saved) setProjects(JSON.parse(saved))
  }, [])

  const moduleStats = [
    'idea', 'brand', 'market', 'ui', 'business', 'marketing', 'pitch', 'logo'
  ].map(m => ({
    module: m,
    count: projects.filter(p => p.module === m).length
  })).sort((a, b) => b.count - a.count)

  const moduleIcons: Record<string, string> = {
    idea: '💡', brand: '🎨', market: '📊', ui: '🖥️',
    business: '💼', marketing: '📣', pitch: '🚀', logo: '✏️'
  }

  const moduleNames: Record<string, string> = {
    idea: 'Idea Generator', brand: 'Brand Kit', market: 'Market Analyzer',
    ui: 'UI Builder', business: 'Business Model', marketing: 'Marketing',
    pitch: 'Pitch Deck', logo: 'Logo Generator'
  }

  const stats = [
    { label: 'Projets totaux', value: projects.length, icon: '📁', color: 'text-indigo-400' },
    { label: 'Ce mois', value: projects.filter(p => p.date === new Date().toLocaleDateString('fr-FR')).length, icon: '📅', color: 'text-blue-400' },
    { label: 'Module favori', value: moduleStats[0]?.module ? moduleIcons[moduleStats[0].module] : '—', icon: '⭐', color: 'text-yellow-400' },
    { label: 'IAs utilisées', value: 1, icon: '🤖', color: 'text-green-400' },
  ]

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">📊 Analytics</h1>
          <p className="text-gray-500 mt-1">Statistiques de ton utilisation Nexoro</p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-gray-500 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Module usage */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-6">Utilisation par module</h2>
          <div className="space-y-4">
            {moduleStats.map(({ module, count }) => (
              <div key={module} className="flex items-center gap-4">
                <span className="text-xl w-8">{moduleIcons[module]}</span>
                <span className="text-sm text-gray-300 w-36">{moduleNames[module]}</span>
                <div className="flex-1 bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full transition-all"
                    style={{ width: projects.length > 0 ? `${(count / projects.length) * 100}%` : '0%' }}
                  />
                </div>
                <span className="text-sm text-gray-400 w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent projects */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Projets récents</h2>
          {projects.length === 0 ? (
            <p className="text-gray-500 text-sm">Aucun projet encore — génère ta première startup !</p>
          ) : (
            <div className="space-y-3">
              {projects.slice(0, 5).map((p, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-800 rounded-xl">
                  <span className="text-xl">{moduleIcons[p.module]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate">{p.prompt}</p>
                    <p className="text-xs text-gray-500">{moduleNames[p.module]} • {p.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
