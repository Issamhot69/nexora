'use client'
import { useState } from 'react'

const goals = [
  { id: 'welcome', icon: '👋', label: 'Bienvenue nouveaux users' },
  { id: 'launch', icon: '🚀', label: 'Lancement produit' },
  { id: 'sales', icon: '💰', label: 'Séquence de vente' },
  { id: 'reengagement', icon: '🔄', label: 'Réengagement inactifs' },
  { id: 'upsell', icon: '⬆️', label: 'Upsell / Cross-sell' },
  { id: 'referral', icon: '🤝', label: 'Programme referral' },
]

export default function EmailMarketing() {
  const [startup, setStartup] = useState('')
  const [goal, setGoal] = useState('welcome')
  const [audience, setAudience] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    if (!startup) return
    setLoading(true)
    setResult('')
    try {
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startup, goal, audience })
      })
      const data = await res.json()
      setResult(data.result)
    } catch {}
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">📧 Email Marketing IA</h1>
          <p className="text-gray-500 mt-1">Génère des séquences emails automatiques professionnelles</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-medium text-gray-400 mb-4">Objectif de la séquence</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {goals.map(g => (
              <button key={g.id} onClick={() => setGoal(g.id)}
                className={`flex items-center gap-2 p-3 rounded-xl transition-all text-left ${goal === g.id ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                <span className="text-xl">{g.icon}</span>
                <span className="text-sm font-medium">{g.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <input value={startup} onChange={e => setStartup(e.target.value)}
            placeholder="Nom de ta startup — Ex: FastFoodGenie"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
          <textarea value={audience} onChange={e => setAudience(e.target.value)}
            placeholder="Audience cible — Ex: restaurateurs, PME, freelances..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 resize-none h-20 focus:outline-none focus:border-indigo-500" />
          <button onClick={generate} disabled={loading || !startup}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all">
            {loading ? '📧 Génération...' : '📧 Générer la séquence email'}
          </button>
        </div>

        {result && (
          <div className="bg-gray-900 border border-blue-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-blue-400">📧 Séquence de 5 emails générée</span>
              <button onClick={() => navigator.clipboard.writeText(result)}
                className="bg-gray-800 hover:bg-gray-700 text-white text-sm py-1 px-4 rounded-xl">📋 Copier</button>
            </div>
            <div className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">{result}</div>
          </div>
        )}
      </div>
    </main>
  )
}
